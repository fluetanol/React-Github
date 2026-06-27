interface DashboardOverviewProps{
    userDataState : {
        name :string,
        avatar_url : string,
        login : string
    }
}




export default function DashboardOverview({ userDataState } : DashboardOverviewProps){
    


    return(
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
    )

}