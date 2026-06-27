import { useQuery } from "@tanstack/react-query";
import { dench, HTTPCredentials } from "dench-fetch";
import { useMemo, useState } from "react"
import OverviewSection from "~/components/page/stat/OverviewSection";
import PreferredCommitTimeArticle from "~/components/page/stat/PreferredCommitTimeArticle";
import RepositoryActivitySection from "~/components/page/stat/RepositoryActivitySection";
import RepositoryCategoriesArticle from "~/components/page/stat/RepositoryCategoriesArticle";
import StatTitleSection from "~/components/page/stat/StatTitleSection";
import TechnologyDistributionArticle from "~/components/page/stat/TechnologyDistributionArticle";
import WeekActivityArticle from "~/components/page/stat/WeekActivityArticle";
import WorkingStyleArticle from "~/components/page/stat/WorkingStyleArticle";
import type { CommonResponse } from "~/types/common/common";
import type { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "~/types/page/statpage";
import {
    calculateCommitStats,
    calculateDeveloperProfile,
    calculateLanguageStats,
    calculateProjectCategories,
    calculateProjectHealth,
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
        gcTime : 10 * 60 * 1000,
    })

    const analytics = useMemo(() => ({
        languages: calculateLanguageStats(data?.[0]),
        commits: calculateCommitStats(data?.[1]),
        categories: calculateProjectCategories(data?.[2]),
        developer: calculateDeveloperProfile(data?.[3]),
        health: calculateProjectHealth(data?.[4]),
    }), [data]);


    return(
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <StatTitleSection title="Development statistics" isLoading={isLoading} isError={isError} />
                <OverviewSection analytics={analytics} isLoading={isLoading} />

                <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <TechnologyDistributionArticle />
                    <WeekActivityArticle />
                </section>

                <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <PreferredCommitTimeArticle />
                    <WorkingStyleArticle />
                    <RepositoryCategoriesArticle />     
                </section>

                <RepositoryActivitySection />
            </main>
        </div>
    )
}
