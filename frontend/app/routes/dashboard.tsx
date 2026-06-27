import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import DashboardSection from "~/components/page/dashboard/DashboardSection";
import useErrorCallback from "~/hooks/useErrorCallback";
import { useQuery } from "@tanstack/react-query";
import { dench } from "dench-fetch";
import { useRef } from "react";
import { HTTPCredentials } from "dench-fetch";
import type { GithubUser } from "~/types/GithubInfo";
import type { CommonResponse } from "~/types/common/common";



function OnSetFetchMode(e : React.MouseEvent<HTMLButtonElement>, setFetchMode : React.Dispatch<React.SetStateAction<1|2|3>>){
    const val = e.currentTarget.value
    setFetchMode(Number(val) as 1|2|3);
}


export default function Dashboard(){
    const navigate = useNavigate();
    const denchInstance = useRef(dench("http://localhost:3000/api", "dashboardDench"));
    
    const { data, error, isLoading, isError} = useQuery<GithubUser>({
        queryKey: ["githubUserData"],
        queryFn : async()=>{
            const res = await denchInstance.current.get<CommonResponse<GithubUser>>(
                "users"
            )
            .credentials(HTTPCredentials.INCLUDE)
            .boundaryNormalize()
            .error((err)=>{
                console.error("Failed to fetch user data:", err);
            })
            .toJson();
            return res.data;
        },
        staleTime : 1 * 60 * 1000, //1분
        gcTime : 5 * 60 * 1000, //5분
        retry : (failureCount, error)=>{
            if(error.message.includes("401")){
                // Handle unauthorized error
                return false;
            }
            return failureCount < 3;
        }
    })


    useErrorCallback(isError, ()=>{
        navigate("/");
    })
    
    if(isLoading){
        return(
            <Loading/>
        )
    }
    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">
            <DashboardSection userDataState={data!} loading={isLoading} />
        </div>
    );
}
