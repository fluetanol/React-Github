import Routes, { CookieOptions, Router } from 'express';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const auth_router = Router();

// api/auth
auth_router.get('/', (req, res)=>{
    res.json({ message: 'Auth route is working!' });
})



//  api/auth/check
auth_router.get('/check', async(req, res)=>{
    
    console.log("Received request to check authentication status");

    const token = req.cookies.app_token;
    console.log("Received token from cookies:", req.cookies);

    if(!token){
        return res.status(401).json({ error : '인증 토큰이 없습니다.' });
    }

    try{
        //토큰 디코딩
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        //디코딩된 토큰에서 사용자 정보 추출
        const { userId, githubId } = decoded as { userId : number, githubId : number };
        //DB에서 사용자 정보 조회
        const user = await prisma.user.findUnique({
            where : {
                id : userId,
                githubId : githubId,
            }
        });

        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
       
        res.status(200).json({
            success : true
        })

    }catch(error){
        console.error("Error : Token verification error", error);
        return res.status(401).json({ error : '유효하지 않은 토큰입니다.' });
    }
})

// api/auth/github
auth_router.post('/github', async (req, res)=>{
    //Express는 응답을 한번만 보낼 수 있음. 조심하셈
    //res.json({ message: 'GitHub authentication endpoint' });
     
    const { code }  = req.body;

    try{
        // Github에 엑세스 토큰 요청
        const response = await fetch('https://github.com/login/oauth/access_token',
            {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    client_id : process.env.GITHUB_CLIENT_ID,
                    client_secret : process.env.GITHUB_CLIENT_SECRET,
                    code : code
                })
            }
        );

        if(response.ok){
            const data =await response.json();
        
            console.log("Success : Github access token response:", data);

            // Github API를 사용하여 사용자 정보 요청
            const accessToken = data.access_token;
            const githubUserResponse = await fetch('https://api.github.com/user',
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`,
                    }
                }
            )

            // 깃허브 사용자 정보
            const githubUserData = await githubUserResponse.json();
            console.log("Success : Github user data response:", githubUserData);

            const githubId = githubUserData.id;
            const githubUsername = githubUserData.login;
            const githubAccessToken = accessToken;

            //테이블 명이 User라면 prisma 멤버에서 카멜케이스로 찾을 수 있음 
            //upsert는 update + insert인 메서드로, 열이 존재하면 update, 존재하지 않으면 insert를 수행
            const user = await prisma.user.upsert({
                //github Id를 기준으로 검색 where githubId = githubId
                where : {
                    githubId : githubId,    
                },
                // 열 정보가 존재할 때 업데이트 할 내용, 쿼리로 치면 
                // update User set githubUsername = githubUsername, githubAccessToken = githubAccessToken where githubId = githubId
                update : {
                    githubUsername : githubUsername,
                    githubAccessToken : githubAccessToken,
                },
                // 열 정보가 존재하지 않을 때 생성할 내용, 쿼리로 치면
                // insert into User (githubId, githubUsername, githubAccessToken) values (githubId, githubUsername, githubAccessToken)
                create : {
                    githubId : githubId,
                    githubUsername : githubUsername,
                    githubAccessToken : githubAccessToken,
                }
            });

            console.log("Success : Update and Insert user data To DB", user);
     
            // model User{
            //     id Int @id @default(autoincrement())
            //     githubId Int @unique()
            //     githubUsername String
            //     githubAccessToken String
            // }

            const jwtToken = process.env.JWT_SECRET;
            const appToken = jwt.sign(
                {                           //payload
                    userId : user.id,
                    githubId : user.githubId,
                },
                 jwtToken!,                 //secret key
                { expiresIn : '1h' }        //options
            );

            //sameSite 옵션
            // - 'strict' : 엄격한 sameSite 정책, 타 사이트에서 쿠키 전송 불가
            // - 'lax' : 타 사이트에서 쿠키 전송 허용, 단 GET 요청에 한함
            // - 'none' : 모든 상황에서 쿠키 전송 허용, 단 secure 옵션도 true로 설정해야 함 (브라우저 강제 사항)

            const cookieOptions : CookieOptions ={
                httpOnly : true,        //http only 활성화
                secure : false,         //https에서만 쿠키 전송, 다만 개발환경에서는 false로 설정
                sameSite : 'strict',    //CSRF 공격 방지
                maxAge : 3600000, //1시간
            }
            res.cookie('app_token', appToken, cookieOptions);
    
            console.log("Success : Set cookie with JWT token", { appToken, cookieOptions });

            res.json({
                success :true,
                user : githubUserData,
            })
        }

    }
    catch(error){
        console.log("Error : Github authentication error", error);
        res.status(500).json({error : '인증 실패'});   
    }
} )


auth_router.use((req, res) =>{
    res.status(404).json({ error: 'Not Found zzz' });
})

export default auth_router;