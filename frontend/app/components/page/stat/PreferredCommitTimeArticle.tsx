import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import { formatHour, type calculateCommitStats } from "~/utils/statpage";


export interface PreferredCommitTimeProps{
    commits : ReturnType<typeof calculateCommitStats>,

}




export default function PreferredCommitTimeArticle({ commits }: PreferredCommitTimeProps){

    const strongestTime = commits.total > 0
        ? commits.timeBuckets.reduce(
            (strongest, current) => current.count > strongest.count ? current : strongest,
            commits.timeBuckets[0],
        )
        : undefined;


    return(
    <article className={`${surfaceClass} p-7 md:p-8`}>
        <SectionHeading eyebrow="Work pattern" title="Preferred commit time" detail="Activity by time of day" />
        <div className="mt-8 space-y-5">
            {commits.timeBuckets.map((time) => (
                <div key={time.label} className="grid grid-cols-[90px_1fr_52px] items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{time.label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full rounded-full bg-gray-950 dark:bg-white" style={{ width: `${time.percent}%` }} />
                    </div>
                    <span className="text-right text-xs font-semibold text-gray-400">{time.percent}%</span>
                </div>
            ))}
        </div>
        <div className="mt-8 rounded-3xl bg-[#eef4ff] p-5 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Strongest window</p>
            <p className="mt-2 text-lg font-semibold">{strongestTime ? `${strongestTime.label} focus` : "No commit data"}</p>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {strongestTime
                    ? `Peak activity is around ${formatHour(commits.peakHour)} in your local timezone.`
                    : "Commit time analysis will appear after data is available."}
            </p>
        </div>
    </article>

    )
}