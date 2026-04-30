import Routes, { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

const auth_router = Routes();

auth_router.get('/',(req, res)=>{
    res.json({ message: 'Auth route is working' });
})


//http:localhost:3030/api/auth/github
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
            console.log("Github access token response:", data);

            // Github API를 사용하여 사용자 정보 요청
            const accessToken = data.access_token;
            const userResponse = await fetch('https://api.github.com/user',
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`,
                    }
                }
            )

            const userData = await userResponse.json();

            console.log("Github user data response:", userData);

            const jwtToken = process.env.JWT_SECRET;

            const appToken = jwt.sign(
                {                           //payload
                    userId : userData.id,
                    email:userData.email,
                },
                 jwtToken!,                 //secret key
                { expiresIn : '1h' }        //options
            );

            const cookieOptions : CookieOptions ={
                httpOnly : true,        //http only 활성화
                secure : false,         //https에서만 쿠키 전송, 다만 개발환경에서는 false로 설정
                sameSite : 'strict',    //CSRF 공격 방지
                maxAge : 3600000, //1시간
            }

            //sameSite 옵션
            // - 'strict' : 엄격한 sameSite 정책, 타 사이트에서 쿠키 전송 불가
            // - 'lax' : 타 사이트에서 쿠키 전송 허용, 단 GET 요청에 한함
            // - 'none' : 모든 상황에서 쿠키 전송 허용, 단 secure 옵션도 true로 설정해야 함 (브라우저 강제 사항)

            res.cookie('app_token', appToken, cookieOptions);

            res.json({
                success :true,
                user : userData,
            })
        }

    }
    catch(error){
         res.status(500).json({error : '인증 실패'});   
    }
} )


auth_router.use((req, res) =>{
    res.status(404).json({ error: 'Not Found' });
})

export default auth_router;