import { useEffect, useState } from "react";
import type { GithubUser } from "~/types/GithubInfo";


export default function useGithubUser() : { userDataState: GithubUser | null; isLoading: boolean, isError : boolean }{
    const [userDataState, setUserDataState] = useState<GithubUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

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
                        setUserDataState(data.user);
                        setIsLoading(false);
                    }
                    else{
                        throw new Error("Failed to fetch user data");
                    }
                }catch(error){
                    console.error("Error : Fetch user data error", error);
                    setIsError(true);
                }
            }
            fetchUserData();
        }, []);

    return { userDataState, isLoading, isError };
}