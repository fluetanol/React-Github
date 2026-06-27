import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import { calculateCommitStats, formatHour } from "~/utils/statpage";
import { useEffect, useMemo, useState } from "react";
import { dench, HTTPCredentials } from "dench-fetch";
import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common/common";
import type { GithubCommitTimeRepositoryNode, GithubRepoCommonResponse } from "~/types/page/statpage";



function Skeleton(){
    return(
        <div className=" h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
    )
}



export default function PreferredCommitTimeArticle(){

    const [denchInstance] = useState(()=>dench("http://localhost:3000/api", "preferredCommitTimeArticleDench"));
    const [percents, setPercents] = useState<number[]>([]);

    const { data, isLoading, isError } = useQuery({
        queryKey : ["preferredCommitTimeArticleData"],
        queryFn : async()=>{
            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>

            const res = await denchInstance.get<CommonResponseType<GithubCommitTimeRepositoryNode>>("repos/commitTime")
                            .credentials(HTTPCredentials.INCLUDE)
                            .toJson();  

            return res.data;    
        },
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    })

    const commits  = useMemo(()=> calculateCommitStats(data!), [data]);       

    useEffect(()=>{
        if(!isLoading){
            const new_percents =commits.timeBuckets.map((time)=>time.percent ?? 0);
            setPercents(new_percents);
        }

    }, [isLoading, commits])


    if(isLoading){
        const skeletons : ReturnType<typeof Skeleton>[] = [];
        for(let i=0; i<5; ++i){
            skeletons.push(<Skeleton key={i} />)
        }

        return(
            <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Work pattern" title="Preferred commit time" detail="Activity by time of day" />
                <div className="flex-1 mt-8 space-y-5">
                    {skeletons}
                </div>

                <div className="flex flex-col min-h-44 mt-8 rounded-3xl bg-[#eef4ff] p-5 dark:bg-gray-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Strongest window</p>

                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 rounded-full 
                        bg-[conic-gradient(from_0deg,rgba(0,0,0,0),var(--color-blue-300))] 
                        [mask:radial-gradient(circle,transparent_50%,black_50%)]"></div>            
                    </div>
                    
                </div>
            </article>
        )
    }//테일윈드에서 띄어쓰기 표현은 _로 하는 듯 (transparent_50%, black_50%)


    const strongestTime = commits.total > 0
        ? commits.timeBuckets.reduce(
            (strongest, current) => current.count > strongest.count ? current : strongest,
            commits.timeBuckets[0],
        )
        : undefined;


    return(
    <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
        <SectionHeading eyebrow="Work pattern" title="Preferred commit time" detail="Activity by time of day" />
        <div className="flex-1 mt-8 space-y-5">
            {commits.timeBuckets.map((time, idx) => (
                <div key={time.label} className="grid grid-cols-[90px_1fr_52px] items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{time.label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full rounded-full bg-gray-950 dark:bg-white w-0 transition-all duration-300" style={{ width: `${percents[idx]}%` }} />
                    </div>
                    <span className="text-right text-xs font-semibold text-gray-400">{time.percent}%</span>
                </div>
            ))}
        </div>
        <div className="mt-8 rounded-3xl min-h-44 bg-[#eef4ff] p-5 dark:bg-gray-800">
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