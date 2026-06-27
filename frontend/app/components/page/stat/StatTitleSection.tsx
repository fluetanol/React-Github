import { surfaceClass } from "~/routes/statpage";

export interface StatTitleSectionProps{
    title : string;
    isLoading : boolean;
    isError : boolean;
}



export default function StatTitleSection({title, isLoading, isError} : StatTitleSectionProps){
    return(
            <section className={`${surfaceClass} overflow-hidden p-8 md:p-10`}>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Account analytics</p>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Development statistics</h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 dark:text-gray-400">
                            Repository activity, technology usage, and project health in one workspace.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-3xl bg-[#eef4ff] px-5 py-4 shadow-inner dark:bg-gray-800">
                        <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? "animate-pulse bg-amber-400" : isError ? "bg-rose-500" : "bg-emerald-500"}`} />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Data sources</p>
                            <p className="mt-1 text-sm font-semibold">{isLoading ? "Syncing APIs" : isError ? "Sync failed" : "5 sources ready"}</p>
                        </div>
                    </div>
                </div>
            </section>
    )
}