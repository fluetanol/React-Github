import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import { calculateDeveloperProfile } from "~/utils/statpage";
import EmptyState from "./EmptyState";
import { useEffect, useMemo, useRef, useState } from "react";
import { dench, HTTPCredentials } from "dench-fetch";
import type { CommonResponse } from "~/types/common/common";
import { useQuery } from "@tanstack/react-query";
import type { DevelopStatsNode, GithubRepoCommonResponse } from "~/types/page/statpage";
import React from "react";


export default React.memo(WorkingStyleArticle);


function ListSkeleton(){
    return(
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="h-2 w-16 bg-gray-400 animate-pulse"></span>
                <span className="h-2 w-8 bg-gray-400 animate-pulse"></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse">
            </div>
        </div>
    )
}


function BottomSkeleton(){
    return(
        <div className="rounded-3xl bg-gray-100 p-4 dark:bg-gray-800 animate-pulse"></div>
    )
}


function WorkingStyleArticle(){
    
    const denchInstance = useState(() => dench("http://localhost:3000/api", "workingStyleArticleDench"))[0];
    const count = useRef(0);

    const [percents, setPercents] = useState<number[]>([]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["workingStyleArticleData"],
        queryFn: async () => {
            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>;
            const res = await denchInstance.get<CommonResponseType<DevelopStatsNode>>("repos/developStats").credentials(HTTPCredentials.INCLUDE).toJson();
            return res.data;
        },
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    });

    const developer = useMemo(()=> calculateDeveloperProfile(data!), [data]);


    useEffect(()=>{
        if(!isLoading){
            const arr = developer.profiles.map((profile)=>{
                return profile.percent ?? 0;
            })
            setPercents(arr);
        }
    }, [isLoading, developer.profiles]);



    if(isLoading){
        const skeletons : ReturnType<typeof ListSkeleton>[] = [];
        for(let i=0; i<5; ++i){
            skeletons.push(<ListSkeleton key={i}/>)
        }
        const bottomSkeletons : ReturnType<typeof BottomSkeleton>[] = [];
        for(let i=0; i<2; ++i){
            bottomSkeletons.push(<BottomSkeleton key={i}/>)
        }

        return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Development profile" title="Working style" detail="Inferred from time, stack, and topics" />
                    <div className="mt-8 space-y-5">
                        {skeletons}
                    </div>
                    <div className="mt-8 h-32 grid gap-3 sm:grid-cols-2">
                        {bottomSkeletons}
                    </div>
            </article>
        )
    }

    console.log("렌더링 ", count.current++);

    return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Development profile" title="Working style" detail="Inferred from time, stack, and topics" />
                <div className="mt-8 space-y-5">
                    {developer.profiles.slice(0, 5).map((profile, idx) => (
                        <div key={profile.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-medium">{profile.name}</span>
                                <span className="text-gray-400">{profile.percent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-gray-950 dark:bg-white w-0 transition-all duration-300" style={{ width: `${percents[idx]}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {developer.traits.map((trait) => (
                        <div key={trait.title} className="rounded-3xl bg-gray-100 p-4 dark:bg-gray-800">
                            <p className="text-sm font-semibold">{trait.title}</p>
                            <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{trait.detail}</p>
                        </div>
                    ))}
                </div>
                {!isLoading && developer.profiles.length === 0 && <EmptyState text="No developer profile data available" />}
            </article>
    )
}