import { useEffect, useState } from "react";



export default function useFetchAll<T extends any[]>( config? : RequestInit, ...api_url : string[]) : 
{ dataState : T | null, isLoading : boolean, isError : boolean}{

    const [dataState, setDataState] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const responses = await Promise.all(api_url.map(url => 
                    fetch(`http://localhost:3000/${url}`,
                        config ? config : {}
                    )   
                ));

                const data = await Promise.all(responses.map(res => res.json()));
                setDataState(data as T);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsError(true);
                setIsLoading(false);
            } 
        }

        fetchData();
    }, []);



    return { dataState, isLoading: isLoading, isError: isError };
}

