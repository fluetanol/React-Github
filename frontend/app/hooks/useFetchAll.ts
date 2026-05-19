import { useEffect, useState } from "react";
import useFetchStore from "~/stores/fetchStore";



/**
 * 여러 API 엔드포인트에서 데이터를 가져오는 커스텀 훅입니다.
 * 
 * @param config   fetch 요청에 사용할 설정 객체입니다. (예: method, headers, body 등)
 * @param staleTime   데이터가 신선한 상태로 간주되는 시간(밀리초)입니다. 이 시간이 지나면 데이터는 오래된 것으로 간주되어 다음 호출 시 새로 가져옵니다. 기본값은 0으로, 항상 새 데이터를 가져옵니다.
 * @param api_url   가져올 API 엔드포인트의 URL입니다. 여러 개의 URL을 전달할 수 있습니다.
 * @returns 
 */
export default function useFetchAll<T extends any[]>( config? : RequestInit, staleTime? : number, ...api_url : string[]) : 
{ dataState : T | null, isLoading : boolean, isError : boolean}{

    const [dataState, setDataState] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const {fetchMap, setFetchMap, hashydrate} = useFetchStore();

    useEffect(()=>{

        const cachedData = api_url.map((url)=>{
            const cached = fetchMap[url];

            if(!cached) return null;
            else if(cached.lastFetched + cached.staleTime < Date.now()){
                console.log(`Data for ${url} is stale. Refetching...`);
                return null;
            }

            return cached.data;
        })

        const fetchData = async()=>{
            try{
                const req = api_url.map(async(url)=>{
                    const res = await fetch(`http://localhost:3000/${url}`,
                        config ? config : {}
                    )   
                    
                    if(!res.ok){
                        throw new Error(`API request failed for ${url}: ${res.status} ${res.statusText}`);
                    }

                    return res.json();
                })

                const data = await Promise.all(req);
                 data.forEach((item, index)=>{
                     setFetchMap(api_url[index], item, staleTime ?? 0); 
                     //staleTime이 undefined인 경우, 즉 캐싱을 원하지 않는 경우에는 0으로 설정하여 
                     //항상 새로 데이터를 가져오도록 함.
                 })
 
                console.log("Fetched data:", data);

                setDataState(data as T);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsError(true);
            } 
        }

        if (!hashydrate && !fetchMap) return;
        const hasEveryData = cachedData.every(data => data !== null);

        if(hasEveryData){
            console.log("Using cached data:", cachedData);
            setDataState(cachedData as T);
            setIsLoading(false);
            return;
        }
        else{
            fetchData();
        }

    }, [hashydrate]);



    return { dataState, isLoading, isError };
}

