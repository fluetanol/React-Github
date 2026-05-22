import { useEffect, useRef } from "react"
import { HTTPCredentials } from "~/types/utils/simpleFetcher/simpleFetcher";
import { dench } from "~/utils/dench";





export default function TestPage(){

    const denchInstance = useRef(dench("http://localhost:3000/api/", "3000 test"));


    useEffect(()=>{
        const fetchTest = async () =>{
            const dench = denchInstance.current;
            try{


                const responses = await Promise.all([
                    //dench.get("testing/health").toResponse(),
                    //dench.get("testing/authhealth").credentials(HTTPCredentials.INCLUDE).toResponse(),
                    dench.post("testing/health", { message: "Hello, server!" })
                    .sendJson()
                    .toResponse(),
                    dench.post("testing/authhealth", { message: "Hello, authenticated server!" })
                    .sendJson()
                    .credentials(HTTPCredentials.INCLUDE)
                    .toResponse()
                ])

                console.log("Response from /api/testing/health:", responses[0]);
                console.log("Response from /api/testing/authhealth:", responses[1]);


            }catch(error){
                console.error("Error fetching /api/testing/health:", error);
             

            }
        }
        fetchTest();
    }, [])


    return(
        <>
            
        </>
    )
}