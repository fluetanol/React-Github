import express from  'express';
import type {Request, Response} from 'express';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import user_router from './routes/user.routes';
import auth_router from './routes/auth.routes';
import testing_router from './routes/testing.routes';
import { TestSchema, root } from './graphql/test';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정, localhost:5173에서 오는 요청을 허용하고, 쿠키를 포함하여 요청을 보낼 수 있도록 설정
app.use(cors({
  origin : 'http://localhost:5173', //프론트엔드 주소
  credentials : true, //쿠키를 포함하여 요청을 보냄
}));

app.use(express.json());

// URL-encoded 데이터 파싱을 위한 미들웨어, extended 옵션은 중첩된 객체를 허용할지 여부를 결정
app.use(express.urlencoded({extended : true}));

// 쿠키 파싱을 위한 미들웨어, 클라이언트에서 전송된 쿠키를 req.cookies 객체로 파싱하여 사용할 수 있도록 함
app.use(cookieParser());

// 기본 라우트, 서버를 헬스 체크 합니다.
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript 서버 실행 중');
});

app.use('/api/users', user_router);
app.use('/api/auth', auth_router);
app.use('/api/testing', testing_router);


app.use('/graphql', 
  graphqlHTTP({
    schema: TestSchema,
    rootValue : root,
    graphiql: true,

}));

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});