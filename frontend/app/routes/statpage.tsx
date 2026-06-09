import { useQuery } from "@tanstack/react-query";
import { dench, HTTPCredentials } from "dench-fetch";
import { useMemo, useState } from "react"
import EmptyState from "~/components/page/stat/EmptyState";
import OverviewSection from "~/components/page/stat/OverviewSection";
import SectionHeading from "~/components/page/stat/SectionHeading";
import StatTitleSection from "~/components/page/stat/StatTitleSection";
import TechnologyDistribution from "~/components/page/stat/TechnologyDistribution";
import WeekActivity from "~/components/page/stat/WeekActivity";
import type { CommonResponse } from "~/types/common/common";
import type { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "~/types/page/statpage";
import {
    calculateCommitStats,
    calculateDeveloperProfile,
    calculateLanguageStats,
    calculateProjectCategories,
    calculateProjectHealth,
    formatHour,
    type ProjectStatus,
} from "~/utils/statpage";


export const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";

export default function StatPage(){

    const denchInstance = useState(()=>dench("http://localhost:3000/api", "statPageDench"))[0];

    const { data, isLoading, isError } = useQuery({
        queryKey : ["statPageData"],
        queryFn : async()=>{
            const commonAPI = denchInstance.get("")
            .error((err)=>{
                console.error("Failed to fetch data:", err);
            })
            .credentials(HTTPCredentials.INCLUDE)

            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>

            const languagesAPI = commonAPI.copy().api<CommonResponseType<GithubLanguageRepositoryNode>>("repos/languages").toJson();
            const commitTimeAPI = commonAPI.copy().api<CommonResponseType<GithubCommitTimeRepositoryNode>>("repos/commitTime").toJson();
            const projectTopicAPI = commonAPI.copy().api<CommonResponseType<GithubProjectTopicsNode>>("repos/projectTopics").toJson();
            const developStatsAPI = commonAPI.copy().api<CommonResponseType<DevelopStatsNode>>("repos/developStats").toJson();
            const projectLiveRateAPI = commonAPI.copy().api<CommonResponseType<ProjectLiveRateNode>>("repos/projectLiveRate").toJson();

            const res = await Promise.all([
                languagesAPI,
                commitTimeAPI,
                projectTopicAPI,
                developStatsAPI,
                projectLiveRateAPI,
            ])
         
            return [ res[0].data, res[1].data, res[2].data, res[3].data, res[4].data ] as const;
        },
        staleTime : 5 * 60 * 1000,
    })

    const analytics = useMemo(() => ({
        languages: calculateLanguageStats(data?.[0]),
        commits: calculateCommitStats(data?.[1]),
        categories: calculateProjectCategories(data?.[2]),
        developer: calculateDeveloperProfile(data?.[3]),
        health: calculateProjectHealth(data?.[4]),
    }), [data]);

    const overviewStats = [
        { label: "Analyzed repos", value: analytics.health.total, caption: `${analytics.health.forks} forks included` },
        { label: "Recent commits", value: analytics.commits.total, caption: "Fetched default branch history" },
        { label: "Active projects", value: analytics.health.active, caption: "Pushed within 30 days" },
        { label: "Primary stack", value: analytics.languages[0]?.name ?? "-", caption: "By total code size" },
    ];

    const strongestTime = analytics.commits.total > 0
        ? analytics.commits.timeBuckets.reduce(
            (strongest, current) => current.count > strongest.count ? current : strongest,
            analytics.commits.timeBuckets[0],
        )
        : undefined;


    return(
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <StatTitleSection title="Development statistics" isLoading={isLoading} isError={isError} />

                <OverviewSection analytics={analytics} isLoading={isLoading} />

                <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <TechnologyDistribution languages={analytics.languages} isLoading={isLoading} />
                    <WeekActivity commits={analytics.commits} isLoading={isLoading} />
                </section>

                <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Work pattern" title="Preferred commit time" detail="Activity by time of day" />
                        <div className="mt-8 space-y-5">
                            {analytics.commits.timeBuckets.map((time) => (
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
                                    ? `Peak activity is around ${formatHour(analytics.commits.peakHour)} in your local timezone.`
                                    : "Commit time analysis will appear after data is available."}
                            </p>
                        </div>
                    </article>

                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Development profile" title="Working style" detail="Inferred from time, stack, and topics" />
                        <div className="mt-8 space-y-5">
                            {analytics.developer.profiles.slice(0, 5).map((profile) => (
                                <div key={profile.name}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium">{profile.name}</span>
                                        <span className="text-gray-400">{profile.percent}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div className="h-full rounded-full bg-gray-950 dark:bg-white" style={{ width: `${profile.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {analytics.developer.traits.map((trait) => (
                                <div key={trait.title} className="rounded-3xl bg-gray-100 p-4 dark:bg-gray-800">
                                    <p className="text-sm font-semibold">{trait.title}</p>
                                    <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{trait.detail}</p>
                                </div>
                            ))}
                        </div>
                        {!isLoading && analytics.developer.profiles.length === 0 && <EmptyState text="No developer profile data available" />}
                    </article>

                    <article className={`${surfaceClass} p-7 md:p-8 lg:col-span-2 xl:col-span-1`}>
                        <SectionHeading eyebrow="Project types" title="Repository categories" detail="Inferred from names and topics" />
                        <div className="mt-8 space-y-4">
                            {analytics.categories.map((category, index) => (
                                <div
                                    key={category.name}
                                    className="flex items-center justify-between rounded-3xl bg-gray-100 px-5 py-4 dark:bg-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-github-light" : "bg-gray-400"}`} />
                                        <span className="text-sm font-semibold">{category.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{category.count} repos · {category.percent}%</span>
                                </div>
                            ))}
                        </div>
                        {!isLoading && analytics.categories.length === 0 && <EmptyState text="No project topic data available" />}
                    </article>
                </section>

                <section className={`${surfaceClass} p-7 md:p-8`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <SectionHeading eyebrow="Project health" title="Repository activity" detail="Recency, archive state, and ownership" />
                        <div className="flex gap-5 text-sm text-gray-500 dark:text-gray-400">
                            <span><strong className="text-gray-950 dark:text-white">{analytics.health.active}</strong> active</span>
                            <span><strong className="text-gray-950 dark:text-white">{analytics.health.dormant}</strong> dormant</span>
                            <span><strong className="text-gray-950 dark:text-white">{analytics.health.archived}</strong> archived</span>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-3">
                        {analytics.health.projects.slice(0, 8).map((project) => (
                            <div key={project.name} className="grid gap-4 rounded-3xl bg-gray-100 px-5 py-4 sm:grid-cols-[1fr_110px_140px_90px] sm:items-center dark:bg-gray-800">
                                <p className="truncate font-semibold">{project.name}</p>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(project.status)}`}>
                                    {project.status}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.updatedLabel}</p>
                                <p className="text-sm text-gray-400">{project.isFork ? "Fork" : "Original"}</p>
                            </div>
                        ))}
                        {!isLoading && analytics.health.projects.length === 0 && <EmptyState text="No project activity data available" />}
                    </div>
                </section>
            </main>
        </div>
    )
}

function getStatusClass(status: ProjectStatus){
    if(status === "Active") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    if(status === "Dormant") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    if(status === "Archived") return "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300";
    return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
}


