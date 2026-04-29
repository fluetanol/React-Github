import Routes from 'express';

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
            const accessToken = data.access_token;

            // Github API를 사용하여 사용자 정보 요청
            const userResponse = await fetch('https://api.github.com/user',
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`,
                    }
                }
            )

            const userData = await userResponse.json();

            const appToken = 'dummy-app-token';
            /*
            const myAppToken = jwt.sign(
            { userId: userResponse.data.id, email: userResponse.data.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );*/

            res.json({
                success :true,
                user : userData,
                token : appToken
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