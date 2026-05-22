import {  useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import type { GithubRepositoryResponse, GithubUserResponse } from "~/types/GithubInfo";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";
import Header from "~/components/common/Header";
import DashboardSection from "~/components/dashboard/DashboardSection";
import useGithubUser from "~/hooks/useUser";
import useErrorCallback from "~/hooks/useErrorCallback";
import useFetchErrorCallback from "~/hooks/useFetchErrorCallback";
import SpinFloatEffect from "~/components/common/SpinFloatEffect";
import { NavFloatButton } from "~/components/common/NavFloatButton";




function OnSetFetchMode(e : React.MouseEvent<HTMLButtonElement>, setFetchMode : React.Dispatch<React.SetStateAction<1|2|3>>){
    const val = e.currentTarget.value
    setFetchMode(Number(val) as 1|2|3);
}


export default function Dashboard(){
    const navigate = useNavigate();
    const { userDataState, isLoading, isError} = useGithubUser();
    const [isModalOpen, setModalOpen] = useState(false);
    const [ fetchMode, setFetchMode] = useState<1|2|3>(1);
    const render_time = useRenderingTimer("Dashboard", isLoading);


    useErrorCallback(isError, ()=>{
        navigate("/");
    })
    
    useEffect(()=>{
        console.log("Current Fetch Mode:", fetchMode);

    }, [fetchMode])

    
    if(isLoading){
        return(
            <Loading/>
        )
    }

    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">

            <Header userDataState={userDataState!} />
            <DashboardSection userDataState={userDataState!} mode={fetchMode} />
            <NavFloatButton 
                onButtonClick={()=>{setModalOpen(prev => !prev)}} 
                onFetchClick={(e)=>{OnSetFetchMode(e, setFetchMode)}} 
                isOpen={isModalOpen} 
                render_time={render_time}
            />

        </div>
    );
}
