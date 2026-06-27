import type { GithubRepositoryResponse } from "~/types/GithubInfo";
import RepositoryDashboardCard from "./DashboardRepositoryCard";


export default function RepositoryList({githubDataState, isLoading, isError: _isError} : {githubDataState : GithubRepositoryResponse, isLoading : boolean, isError : boolean}){
    if(isLoading){
        return <section className="rounded-4xl bg-white/70 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:bg-gray-900/70">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Repositories</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">Your Repositories</h2>
                </div>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {[1,2,3,4].map(repo => {
                return(
                    <div key={repo} className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] dark:bg-gray-900">
                        <div className="animate-pulse rounded bg-gray-200 text-lg font-bold dark:bg-gray-700"> 
                           &nbsp;
                        </div>
                        <p className="mt-5 w-1/3 animate-pulse rounded bg-gray-200 text-sm text-gray-400 dark:bg-gray-700">&nbsp; </p>
                        <div className="mt-3 flex w-2/3 animate-pulse items-center gap-4 rounded bg-gray-200 text-sm text-gray-500 dark:bg-gray-700">
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </div>
                        <div className="mt-8 flex w-1/3 animate-pulse items-center gap-4 rounded bg-gray-200 text-sm text-gray-500 dark:bg-gray-700">
                            &nbsp;
                        </div>
                    </div>
                )
            })}
            </div>
        </section>
    }

    return (
        <section className="rounded-4xl bg-white/70 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:bg-gray-900/70">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Repositories</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">Your Repositories</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {githubDataState?.repos.length ?? 0} projects synced from GitHub
                </p>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
            {githubDataState?.repos.map(repo => {
                return(
                    <RepositoryDashboardCard key={repo.id} repo={repo} />
                )
            })}
            </div>
        </section>
    )
}
