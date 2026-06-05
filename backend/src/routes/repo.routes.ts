import Router from "express";
import { authToken, authUser } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/middlewares/auth";
import { GithubCommonResponse } from "../types/middlewares/common";

const repo_router = Router();

// api/repos/health
repo_router.get('/health', (req, res)=>{
    res.json({ message: 'Repo route is working!' });
});


//언어 사용량 
repo_router.get('/languages', authToken, authUser, async(req : AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    
    const query = `
        query GetRepoLanguages($login:String!){
            user(login:$login){
                repositories(first:100, ownerAffiliations:OWNER){
                    nodes{
                        name
                        languages(first:20){
                            totalSize
                            edges{
                                size
                                node{
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `

    try{
        const variables = {
            login : req.user.githubId       
         };

        const github_response = await fetch('https://api.github.com/graphql', {   
            method : 'POST',
            headers : {
                'Authorization' : `token ${req.user.githubAccessToken}`,
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                query,
                variables
            })
        });

        if(github_response.ok){
            const githubData = await github_response.json();

            console.log("GitHub API Response for Repo Languages:", githubData);

            const userData =githubData.data.user;

            res.status(200).json({
                data : userData
            });
        }



    }catch(err){
        console.error("Failed to fetch repository languages:", err);
        res.status(500).json({ error : '레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.' });
    }


});



export default repo_router;