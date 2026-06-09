import { surfaceClass } from "~/routes/statpage";
import EmptyState from "./EmptyState";
import SectionHeading from "./SectionHeading";
import type { calculateProjectHealth, ProjectStatus } from "~/utils/statpage";



export interface RepositoryActivitySectionProps{
    health : ReturnType<typeof calculateProjectHealth>,
    isLoading : boolean;

}

function getStatusClass(status: ProjectStatus){
    if(status === "Active") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    if(status === "Dormant") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    if(status === "Archived") return "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300";
    return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
}


export default function RepositoryActivitySection({ health, isLoading }: RepositoryActivitySectionProps){

        return(

        <section className={`${surfaceClass} p-7 md:p-8`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading eyebrow="Project health" title="Repository activity" detail="Recency, archive state, and ownership" />
                <div className="flex gap-5 text-sm text-gray-500 dark:text-gray-400">
                    <span><strong className="text-gray-950 dark:text-white">{health.active}</strong> active</span>
                    <span><strong className="text-gray-950 dark:text-white">{health.dormant}</strong> dormant</span>
                    <span><strong className="text-gray-950 dark:text-white">{health.archived}</strong> archived</span>
                </div>
            </div>
            <div className="mt-8 grid gap-3">
                {health.projects.slice(0, 8).map((project) => (
                    <div key={project.name} className="grid gap-4 rounded-3xl bg-gray-100 px-5 py-4 sm:grid-cols-[1fr_110px_140px_90px] sm:items-center dark:bg-gray-800">
                        <p className="truncate font-semibold">{project.name}</p>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(project.status)}`}>
                            {project.status}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{project.updatedLabel}</p>
                        <p className="text-sm text-gray-400">{project.isFork ? "Fork" : "Original"}</p>
                    </div>
                ))}
                {!isLoading && health.projects.length === 0 && <EmptyState text="No project activity data available" />}
            </div>
        </section>

        )

}