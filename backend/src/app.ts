import express from  'express';
import type {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import user_router from './routes/user.routes';
import auth_router from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

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