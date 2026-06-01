import Router from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/middlewares/auth';
import { authToken, authUser } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const user_router = Router();


/**
 * GitHub API에서 받아오는 사용자 정보의 타입을 정의하는 인터페이스입니다.
 * Github API상 모든 응답은 공통적으로 data 필드 안에 담깁니다
 * 
 */
interface GithubCommonResponse<T>{
    data : T
}

/**
 * 
 * GitHub API에서 사용자 정보를 받아올 때 발생할 수 있는 에러의 타입을 정의하는 인터페이스입니다.
 * 
 */
interface GithubErrorResponse{
    message : string,
    documentation_url : string
}



interface GithubUserResponse{
    user : {
        login : string,
        avatarUrl : string,
    }
}



// api/users/health
user_router.get('/health', (req, res)=>{
    res.json({ message: 'User route is working!' });
})



// api/users
user_router.get('/', authToken, authUser, async (req: AuthRequest, res) => {

  const user = req.user!; //authUser 미들웨어에서 인증된 사용자 정보를 요청 객체에 추가했으므로 req.user는 항상 존재한다고 가정할 수 있음

  try{
        const accessToken = user.githubAccessToken;

        const github_response = await fetch('https://api.github.com/user', {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        }); 
        
        if(github_response.ok){
            const github_user = await github_response.json();
            
            res.status(200).json({
                data : github_user
            })
        }
        else{
            throw { status : github_response.status, message : 'GitHub API 요청 실패' };
        }
    }
    catch(err : unknown){
        //에러가 "객체" 형식임을 알려줘야 in 구문을 통해 속성이 존재하는 지를 확인하는 narrowing 이 가능함
        //추가로 null은 typeof를 찍어보면 object로 나오는... 자스의 이상한 버그 때문에 체크 해줘야 함
        if(typeof err === 'object' && err !== null && 'status' in err && 'message' in err){
            const { status, message } = err as { status : number, message : string };
            res.status(status).json({ error : message });
            return;
        }
        else{
            res.status(401).json({ error : '유효하지 않은 토큰입니다.' });
        }
    }

});


/**
 *     userDataState : {
        avatar_url : string,
        login : string
    }
    오직 헤더 컴포넌트만을 위해 가져오는 간단한 정보
 **/
// api/users/userheader
user_router.get('/userheader', authToken, authUser, async(req : AuthRequest, res)=>{
    const user = req.user!;

    const query = `
        query GetUser($login : String!){
            user(login : $login){
                login
                avatarUrl
            }
        }
    `

    const github_response = await fetch('https://api.github.com/graphql',{
        method : 'POST',
        headers :{
            'Authorization' : `Bearer ${user.githubAccessToken}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            query,
            variables : {
                login : user.githubUsername
            }
        })
    })

    const data  = await github_response.json();


    const userData = ChangeResponseType<GithubCommonResponse<GithubUserResponse>>(data).data.user;
    console.log("GitHub GraphQL API response:", data);

    if(github_response.ok){
        res.status(200).json({
            data : userData
        });
    }
    else{
        res.status(500).json({ error : 'GitHub API 요청 실패' });
    }

})


function ChangeResponseType <T>(data : unknown) : T{
    return data as T;
}


// api/users/repos
user_router.get('/repos', authToken, authUser, async(req : AuthRequest, res)=>{
    const user = req.user!;
    const username = user.githubUsername;
    const accessToken  = user.githubAccessToken;

    try{
        const github_response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        });

        console.log("GitHub API response status:", github_response.status);

        if(github_response.ok){
            const github_repos = await github_response.json();
            res.status(200).json({ repos : github_repos });
        }
        else{
            throw { status : github_response.status, message : 'GitHub API 요청 실패' };
        }
    }

    catch(error){
        //어떤 이유에 의한 에러인게 구체적으로 들어오면 항상 {status, message} 형태로 error가 옵니다.
        if(typeof error === 'object' && error !== null && 'status' in error && 'message' in error){
            const { status, message } = error as { status : number, message : string };
            res.status(status).json({ error : message });
            return;
        }
        else
            res.status(500).json({ error : '서버 에러' });
    }

})



user_router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default user_router;