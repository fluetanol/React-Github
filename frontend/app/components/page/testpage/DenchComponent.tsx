import { Suspense, useEffect, useRef, useState } from "react";
import { dench } from "dench-fetch";
import { HTTPCredentials } from "dench-fetch";
import useRegistLoading from "~/hooks/dev/useRegistLoading";
import type { TestResponse } from "~/routes/testpage";



export default function DenchComponent(){
    
    const denchInstance = useRef(dench("http://localhost:3000/api/", "3000 test"));
    const [data, setData] = useState<TestResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useRegistLoading("DenchComponent", loading);

    useEffect(()=>{
        const fetchTest = async () =>{
            const dench = denchInstance.current;
            try{
                const response = await dench.get<TestResponse>("testing/authjson")
                .credentials(HTTPCredentials.INCLUDE)
                .toJson()

                if(response){
                    //console.log("Response from /api/testing/authjson:", response.message);
                    setData(response);
                    setLoading(false);
                }
                else{
                    throw new Error("No response received");
                }
                setLoading(false);

            }catch(error){
                console.error("Error fetching /api/testing/authjson:", error);
                setError("Failed to fetch data");
                setLoading(false);
            }
        }
        fetchTest();
    }, [])


    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {data && (
                <div>
                    <h2>Dench Component</h2>
                    <div> name : {data.name}</div>
                    <div> timestamp : {data.timestamp}</div>
                    <div> description : {data.description}</div>
                </div>
            )}
        </>
    )
}