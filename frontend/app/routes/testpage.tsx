import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react"
import { HTTPCredentials } from "~/dench/types/denchEnum";
import { DenchDefaultPresets } from "~/types/utils/simpleFetcher/denchPresetEnum";
import { dench } from "~/dench/main/dench";
import { createDenchPresets, denchPresetRunner } from "~/dench/preset/denchPreset";





export default function TestPage(){

    const denchInstance = useRef(dench("http://localhost:3000/api/", "3000 test"));
    const denchPreset = createDenchPresets(DenchDefaultPresets.GET_COOKIES_JSON,"http://localhost:3000/api/", 
            { api: "testing/health" }
        );


    useEffect(()=>{
        const fetchTest = async () =>{
            const dench = denchInstance.current;
            try{
                const responses = await Promise.all([
                    dench.post("testing/health", { message: "Hello, server!" })
                    .sendJson()
                    .toResponse(),
                    dench.post("testing/authhealth", { message: "Hello, authenticated server!" })
                    .sendJson()
                    .credentials(HTTPCredentials.INCLUDE)
                    .toResponse(),
                    denchPresetRunner(denchPreset).toResponse()
                ])

                console.log("Response from /api/testing/health:", responses[0]);
                console.log("Response from /api/testing/authhealth:", responses[1]);
                console.log("Response from preset /api/testing/health:", responses[2]);


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