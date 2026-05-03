import express from  'express';
import type {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user_router from './routes/user.routes';
import auth_router from './routes/auth.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin : 'http://localhost:5173', //프론트엔드 주소
  credentials : true, //쿠키를 포함하여 요청을 보냄
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

// 기본 라우트, 서버를 헬스 체크 합니다.
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript 서버 실행 중');
});

app.use('/api/users', user_router);
app.use('/api/auth', auth_router);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});