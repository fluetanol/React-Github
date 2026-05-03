import Router from 'express';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const user_router = Router();


// api/user
user_router.get('/', async (req, res) => {

    const app_token = req.cookies.app_token;
    console.log("Received token from cookies:", req.cookies);

    if(!app_token){
        res.status(401).json({ error : '인증 토큰이 없습니다.' });
    }

    try{
        const decoded = jwt.verify(app_token, process.env.JWT_SECRET!);
        const { userId, githubId } = decoded as { userId : number, githubId : number };

        const user = await prisma.user.findUnique({
            where : { 
                id : userId
            }
        });

        if(!user){
            throw { status : 404, message : '사용자를 찾을 수 없습니다.' };
        }
      
        
        const accessToken = user.githubAccessToken;

        const github_response = await fetch('https://api.github.com/user', {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        }); 
        
        if(github_response.ok){
            const github_user = await github_response.json();

            res.status(200).json({
                user : github_user
            })

        }
        else{
            throw { status : github_response.status, message : 'GitHub API 요청 실패' };
        }



    }catch(err : unknown){
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

user_router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default user_router;