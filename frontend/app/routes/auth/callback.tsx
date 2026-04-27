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
                const response = await fetch('http:localhost:3030/api/auth/github', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({code})
                })

                if(response.ok){
                    const data = await response.json();
                    const { token } = data;
                    localStorage.setItem('github_token', token);
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