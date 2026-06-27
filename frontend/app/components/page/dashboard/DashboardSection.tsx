import type { GithubRepositoryResponse, GithubUser } from "~/types/GithubInfo"
import RepositoryList from "./RepositoryList"
import SideProfile from "./SideProfile"
import StatCard from "./StatCard"
import useFetchAll from "~/hooks/useFetchAll"
import { Loading } from "../../common/Loading"
import { useNavigate } from "react-router"

export interface DashboardSectionProps { 
    userDataState : GithubUser,
    loading : boolean
}
        

export default function DashboardSection({ userDataState, loading }: DashboardSectionProps){

    const navigate = useNavigate();
    
    const { dataState, isLoading, isError} = useFetchAll<[GithubRepositoryResponse]>({
        method :'GET',
        credentials : 'include'
    }
    , 5 * 60 * 1000, "api/users/repos")
    

    // useErrorCallback(isError, ()=>{
    //     navigate("/");
    // })


    if (isLoading || userDataState === null) {
        return (
            <Loading/>
        );
    }

    const reposDataState = dataState![0];

    
    return(
            <section className="mx-auto grid max-w-380 gap-8 px-6 py-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
                     <SideProfile userDataState={userDataState} />
     
                     <main className="flex min-w-0 flex-col gap-8">
                         <aside className="rounded-[2.25rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] dark:bg-gray-900">
                             <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                                 <div className="max-w-2xl">
                                     <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                                         GitHub Overview
                                     </p>
                                     <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl">
                                         {userDataState.name ?? userDataState.login}'s workspace
                                     </h1>
                                     <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
                                         Profile activity, repository scale, and account signals are arranged with more breathing room for quick scanning.
                                     </p>
                                 </div>
                                 <div className="rounded-3xl bg-[#eef4ff] px-6 py-5 text-right shadow-inner dark:bg-gray-800">
                                     <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Account</p>
                                     <p className="mt-2 text-lg font-semibold text-gray-950 dark:text-white">@{userDataState.login}</p>
                                 </div>
                             </div>
                         </aside>
     
                         <section className="grid gap-5 md:grid-cols-3">
                             <StatCard label="Followers" value={userDataState.followers} caption="People watching your updates" />
                             <StatCard label="Following" value={userDataState.following} caption="Accounts in your network" />
                             <StatCard label="Repos" value={reposDataState.repos.length} caption="Repositories available here" />
                         </section>
     
                         <RepositoryList githubDataState={reposDataState} isLoading={isLoading} isError={isError} />
                     </main>
                 </section>
    )
}