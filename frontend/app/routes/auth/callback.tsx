import  {useEffect} from 'react'
import {useSearchParams, useNavigate} from 'react-router';

export default function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Github OAuth가 리다이렉트 될 때는 URL "code"쿼리 파라미터로 
    // 인증 코드가 전달됨
    const code = searchParams.get('code');
    console.log("Received code:", code);

    useEffect(()=>{
        const authenticate = async()=>{
            // error
            if(!code){
                console.error("code가 URL에 없음");
                navigate('/');
                return;
            }

            try{
                // 백엔드에 인증 코드 보내서 서버 액세스 토큰 받아오기
                // 참고로 http:// 로 //를 다 써줘야 절대 경로로 인식됨
                const response = await fetch('http://localhost:3000/api/auth/github', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({code})
                })

                if(response.ok){
                    const data = await response.json();
                    //access token을 httponly 쿠키로 전환할 예정
                    // const { token } = data;
                    // localStorage.setItem('github_token', token);
                    console.log("인증 성공", data);
                    navigate('/dashboard');
                }
                else{
                    console.error("인증 실패", response.statusText);
                    alert("로그인에 실패했습니다.");
                    navigate('/');
                }
            }
            catch(error){
                console.error("인증 실패", error);
                alert("로그인에 실패했습니다.");
                navigate('/');
            }
        }

        authenticate();

    })

}