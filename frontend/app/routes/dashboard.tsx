import {  useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import type { GithubRepositoryResponse, GithubUserResponse } from "~/types/GithubInfo";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";
import Header from "~/components/common/Header";
import DashboardSection from "~/components/dashboard/DashboardSection";
import useGithubUser from "~/hooks/useUser";


export default function Dashboard(){
    const navigate = useNavigate();
    const { userDataState, isLoading, isError} = useGithubUser();
    const render_time = useRenderingTimer("Dashboard", isLoading);


    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    }, [isError, navigate]);



    if(isLoading){
        return(
            <Loading/>
        )
    }


    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">

            <Header userDataState={userDataState!} />
            <DashboardSection userDataState={userDataState!} mode={0} />

            <nav className = "fixed bottom-8 right-8 w-16 h-16 border-2 rounded-4xl bg-white transition-all duration-200 hover:-translate-y-0.5 dark:bg-white"
                onClick = {() => {

                }}
            >
            </nav>

        </div>
    );
}
