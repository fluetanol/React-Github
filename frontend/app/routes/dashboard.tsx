import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";



export default function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [userDataState, setUserData] = useState<GithubUser>({} as GithubUser);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUserData = async()=>{
            try{
                const res = await fetch("http://localhost:3000/api/users",
                    {
                        method : 'GET',
                        credentials : 'include'
                    }
                )

                if(res.ok){
                    const data = await res.json();
                    console.log("User data response:", data);
                    setIsLoading(false);
                    setUserData(data.user);
                }
                else{
                    throw new Error("Failed to fetch user data");
                }
            }catch(error){
                console.error("Error : Fetch user data error", error);
                navigate('/'); //에러 발생 시 홈으로 리다이렉트
                
            }
        }

        fetchUserData();

    }, []);



    return (
        <div>
            <div className ="flex flex-col items-center justify-center min-h-screen">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="flex flex-col items-center gap-4">  

                        <h1 className="text-2xl font-bold">Welcome, {userDataState.login}!</h1>
                        <img src={userDataState.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full" />
                        <p>Name: {userDataState.name}</p>
                        <p>Company: {userDataState.company || 'N/A'}</p>
                        <p>Blog: {userDataState.blog || 'N/A'}</p>
                        <p>Location: {userDataState.location || 'N/A'}</p>
                        <p>Email: {userDataState.email || 'N/A'}</p>
                        <p>Bio: {userDataState.bio || 'N/A'}</p> 


                    </div>
                )}
            </div>
        </div>
    )

}