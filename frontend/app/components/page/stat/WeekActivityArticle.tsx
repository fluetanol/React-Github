import { surfaceClass } from "~/routes/statpage";
import type { calculateCommitStats } from "~/utils/statpage";
import EmptyState from "./EmptyState";
import SectionHeading from "./SectionHeading";


interface WeekActivityProps{
    commits : ReturnType<typeof calculateCommitStats>
    isLoading : boolean
}



export default function WeekActivityArticle({commits, isLoading }: WeekActivityProps){
        return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
                <div className="mt-8 flex h-64 items-end gap-3">
                    {commits.weekdays.map((day) => (
                        <div key={day.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
                            <span className="text-xs font-semibold text-gray-400">{day.count}</span>
                            <div className="flex h-full w-full items-end rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800">
                                <div
                                    className="w-full rounded-xl bg-github-light shadow-[0_8px_20px_rgba(65,131,196,0.22)]"
                                    style={{ height: `${day.heightPercent}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-400">{day.label}</span>
                        </div>
                    ))}
                </div>
                {!isLoading && commits.total === 0 && <EmptyState text="No commit history available" />}
            </article>
        )
}