import { surfaceClass } from "~/routes/statpage";
import { calculateCommitStats } from "~/utils/statpage";
import EmptyState from "./EmptyState";
import SectionHeading from "./SectionHeading";
import { useEffect, useMemo, useState } from "react";
import { dench, HTTPCredentials } from "dench-fetch";
import { useQuery } from "@tanstack/react-query";
import type { GithubCommitTimeRepositoryNode, GithubRepoCommonResponse } from "~/types/page/statpage";
import type { CommonResponse } from "~/types/common/common";


function Skeleton(){
    return(
        <div  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
            <span className="text-xs font-semibold text-gray-400"></span>
                <div className="flex h-full w-full items-end rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800 animate-pulse">
            </div>
            <span className="text-xs font-medium text-gray-400"></span>
        </div>
    )
}



export default function WeekActivityArticle(){
    
    const [denchInstance] = useState(()=>dench("http://localhost:3000/api", "weekActivityArticleDench"));

    const [percents, setPercents] = useState<number[]>([]);

    const  { data, isLoading, isError}  = useQuery({
        queryKey : ["weekActivityArticleData"],
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

    useEffect(()=>{
        if(!isLoading){
            const commits = calculateCommitStats(data!);
            const maps = commits.weekdays.map((day)=>day.heightPercent ?? 0);
            setPercents(maps);
        }
    }, [isLoading, data]);



    const commits = useMemo(()=> calculateCommitStats(data!), [data]);

    
    if(isLoading){
        const skeletons : ReturnType<typeof Skeleton>[] = [];
        for(let i=0; i<8; ++i){
            skeletons.push(<Skeleton key={i} />)
        }

        return(
            <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
                <div className="mt-8 flex h-64 items-end gap-3">
                    {skeletons}
                </div>
            </article>
        )
    }

    return(
        <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
            <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
            <div className="mt-8 flex h-64 items-end gap-3">
                {commits.weekdays.map((day, idx) => (
                    <div key={day.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
                        <span className="text-xs font-semibold text-gray-400">{day.count}</span>
                        <div className="flex h-full w-full items-end rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800">
                            <div
                                className="w-full h-0 rounded-xl bg-github-light shadow-[0_8px_20px_rgba(65,131,196,0.22)] transition-all duration-300"
                                style={{ height: `${percents[idx]}%` }}
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