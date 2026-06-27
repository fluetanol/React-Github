import { surfaceClass } from "~/routes/statpage";
import type { calculateCommitStats, calculateDeveloperProfile, calculateLanguageStats, calculateProjectCategories, calculateProjectHealth } from "~/utils/statpage";



export interface OverviewSectionProps{
    analytics :{
        languages : ReturnType<typeof calculateLanguageStats>,
        commits : ReturnType<typeof calculateCommitStats>,
        categories : ReturnType<typeof calculateProjectCategories>,
        developer : ReturnType<typeof calculateDeveloperProfile>,
        health : ReturnType<typeof calculateProjectHealth>,
    },
    isLoading : boolean;
}


export default function OverviewSection({analytics, isLoading} : OverviewSectionProps){

    const overviewStats = [
        { label: "Analyzed repos", value: analytics.health.total, caption: `${analytics.health.forks} forks included` },
        { label: "Recent commits", value: analytics.commits.total, caption: "Fetched default branch history" },
        { label: "Active projects", value: analytics.health.active, caption: "Pushed within 30 days" },
        { label: "Primary stack", value: analytics.languages[0]?.name ?? "-", caption: "By total code size" },
    ];

        return(
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => (
                        <article key={stat.label} className={`${surfaceClass} p-6`}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                            <p className="mt-5 truncate text-3xl font-semibold tracking-tight">{isLoading ? "-" : stat.value}</p>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.caption}</p>
                        </article>
                    ))}
                </section>
        )

}