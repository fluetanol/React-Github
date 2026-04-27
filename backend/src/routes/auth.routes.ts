import Routes from 'express';

const auth_router = Routes();

//http:localhost:3030/api/auth/github
auth_router.post('/github', async (req, res)=>{
    res.json({ message: 'GitHub authentication endpoint' });
     
    const { code }  = req.body;
    
    try{
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
            const userResponse = await fetch('https://api.github.com/user',
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`,
                    }
                }
            )

            const userData = await userResponse.json();

            res.json({
                success :true,
                user : userData,
                token : accessToken
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