import { useEffect, useState } from "react";
import type { useGithubResult } from "~/types/hooks/useGithub";


/**
 * 
 * github api를 호출해 get 요청을 보내고, T 타입에 맞는 데이터를 반환받는 커스텀 훅
 * 
 * @param api_url 
 * 
 * @returns userDataState : T 타입의 데이터 또는 null, isLoading : 데이터 로딩 상태
 * 
 * 사용 예시 :
 */

export default function useGithub<T>(api_url: string) : useGithubResult<T>{
    const [githubDataState, setGithubDataState] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(()=>{
            const fetchUserData = async()=>{
                try{
                    const res = await fetch(`http://localhost:3000${api_url}`,
                        {
                            method : 'GET',
                            credentials : 'include'
                        }
                    )
                    if(res.ok){
                        const data = await res.json();
                        console.log("User data response:", data);
                        setGithubDataState(data);
                        setIsLoading(false);
                    }
                    else{
                        throw new Error("Failed to fetch user data");
                    }
                }catch(error){
                    console.error("Error : Fetch user data error", error);
                    setIsLoading(false);
                    setIsError(true);
                }
            }
            fetchUserData();
        }, []);

    return { githubDataState, isLoading, isError };
}