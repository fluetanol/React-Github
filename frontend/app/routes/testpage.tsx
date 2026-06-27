
import { useEffect } from "react";
import { useOutletContext } from "react-router";
import type { FloatState } from "~/components/layout/DashboardLayout";
import DenchComponent from "~/components/page/testpage/DenchComponent";
import GraphQLComponent from "~/components/page/testpage/GraphQLComponent";
import TanstackComponent from "~/components/page/testpage/TanstackComponent";

export interface TestResponse{
        message : string,
        name : string,
        timestamp : string,
        description : string
    }


export default function TestPage(){
    
    const floatMode  = useOutletContext<FloatState>();

    useEffect(()=>{
        console.log("Current Fetch Mode in TestPage:", floatMode);
    },[floatMode])


    return(
        <>
            <h1>Test Page</h1>
            {floatMode == "1" && <DenchComponent/>}
            {floatMode == "2" && <TanstackComponent/>}
            {floatMode == "3" && <GraphQLComponent/>}
        </>
    )
}