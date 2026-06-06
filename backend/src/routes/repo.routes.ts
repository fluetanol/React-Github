import Router from "express";
import { authToken, authUser } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/middlewares/auth";
import { GithubCommonResponse } from "../types/middlewares/common";
import { dench, DenchAuthType } from "dench-fetch";
const repo_router = Router();

interface GithubLanguageNode{
    size : number,
    node : { name : string }
}



interface GithubRepositoryNode{
    name : string,
    languages : {
        totalSize : number,
        edges : Array<GithubLanguageNode>
    }
}



interface GithubLanguageResponse{
    user :{
        repositories :{
            nodes : Array<GithubRepositoryNode>

        }
    }
}


const denchInstance = dench("https://api.github.com/graphql", "projectTopicsDench");

// api/repos/health
repo_router.get('/health', (req, res)=>{
    res.json({ message: 'Repo route is working!' });
});


//언어 사용량 
//api/repos/languages
repo_router.get('/languages', authToken, authUser, async(req : AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    
    const query = `
        query GetRepoLanguages($login : String!){
            user(login : $login){
                repositories(first:20, ownerAffiliations:OWNER){
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
            login : req.user.githubUsername      
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


            const userData: GithubLanguageResponse = githubData.data;

            //console.log(userData.user.repositories.nodes);

            res.status(200).json({
                data : userData
            });
        }


    }catch(err){
        console.error("Failed to fetch repository languages:", err);
        res.status(500).json({ error : '레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.' });
    }
});


// 커밋 시간
//api/repos/commitTime
repo_router.get('/commitTime', authToken, authUser, async(req : AuthRequest, res)=>{
    
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query GetCommitTimes($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes{
                        name
                        defaultBranchRef{
                            target{
                                ... on Commit{
                                    history(first:50){
                                        nodes {
                                            committedDate
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
    `

    const variables = {
        login : req.user.githubUsername
    }

    try{
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
        })
        
        if(github_response.ok){
            const githubData = await  github_response.json();
            const userData = githubData.data;

           // console.log(userData);

            res.status(200).json({
                data : userData
            })

        }
        else{
            throw new Error(`GitHub API responded with status ${github_response.status}`);
        }


    }catch(err){
        console.error("Failed to fetch commit time data:", err);
        res.status(500).json({ error : '커밋 시간 정보를 가져오는 데 실패했습니다.' });
    }
    
})



repo_router.get('/projectTopics', authToken, authUser, async(req : AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    //graphql query에서 String! 이라 되어있는건 String 만 가능하다는 것
    //!를 제거하면 String | null 이므로 null 도 허용된다
    const query = `
        query GetProjectTopics($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes {
                        name
                        repositoryTopics(first : 20){
                            nodes {
                                topic {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `
    
    const variables ={
        login : req.user.githubUsername
    }

    console.log("Fetching project topics with variables:", variables);
    
    const config = denchInstance.post<GithubCommonResponse<any>>("", {
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch project topics data:", err);
        res.status(500).json({ error : '프로젝트 토픽 정보를 가져오는 데 실패했습니다.' });
    })
    
    const github_response = await config.toJson();

    if(github_response){
        const userData = github_response.data;
        console.log("Fetched project topics data:", userData);
        res.status(200).json({
            data : userData
        })
    }
    
    
})


repo_router.get('/developStats', authToken, authUser, async(req: AuthRequest, res)=>{
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query GetDevelopTime($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes {
                        defaultBranchRef{
                            target{
                                ... on Commit{
                                    history(first : 30){
                                        nodes{
                                            committedDate    
                                        }
                                    }
                                }
                            }
                        }
                        languages(first : 20){
                            edges{
                                node{
                                    name
                                }
                            }
                        }
                        repositoryTopics(first : 20){
                            nodes{
                                topic{
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `

    const variables ={
        login : req.user.githubUsername
    }

    const github_response = await denchInstance.post<GithubCommonResponse<any>>("",{
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch development stats data:", err);
        res.status(500).json({ error : '개발 통계 정보를 가져오는 데 실패했습니다.' });
    })
    .toJson();

    if(github_response){
        const userData = github_response.data;
        console.log("Fetched development stats data:", userData);
        res.status(200).json({
            data : userData
        })
    }
    else{
        res.status(500).json({ error : '개발 통계 정보를 가져오는 데 실패했습니다.' });
    }
})


repo_router.get('/projectLiveRate', authToken, authUser, async(req: AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query getProjectLiveRate($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes{
                        createdAt
                        updatedAt
                        pushedAt
                        isArchived
                        isFork
                        name
                    }   
                }
            }
        }
    `

    const variables = {
        login : req.user.githubUsername
    }

    const github_response = await denchInstance.post<GithubCommonResponse<any>>("",{
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch project live rate data:", err);
        res.status(500).json({ error : '프로젝트 활동률 정보를 가져오는 데 실패했습니다.' });
    })
    .toJson();


    if(github_response){
        const userData = github_response.data;
        console.log("Fetched project live rate data:", userData);
        res.status(200).json({
            data : userData
        })
    }   
    else{
        res.status(500).json({ error : '프로젝트 활동률 정보를 가져오는 데 실패했습니다.' });
    }
})




export default repo_router;