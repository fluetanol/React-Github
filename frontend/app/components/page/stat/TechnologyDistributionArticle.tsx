import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import { calculateLanguageStats } from "~/utils/statpage";
import EmptyState from "./EmptyState";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { dench, HTTPCredentials } from "dench-fetch";
import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common/common";
import type { GithubLanguageRepositoryNode, GithubRepoCommonResponse } from "~/types/page/statpage";


function LoadingSkelton(){
    return(
        <div>
            <div className="mb-2 flex items-center justify-between">
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            
            </div>
        </div>
    )
}


export default function TechnologyDistributionArticle(){

    const [percents, setPercents] = useState<number[]>([]);

    const[denchInstance] = useState(()=>dench("http://localhost:3000/api", "technologyDistributionArticleDench"));
    
    const { data, isLoading, isError} = useQuery({
        queryKey : ["technologyDistributionArticleData"],
        queryFn : async()=>{
            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>
            const res = await denchInstance.get<CommonResponseType<GithubLanguageRepositoryNode>>("repos/languages")
                            .credentials(HTTPCredentials.INCLUDE)
                            .toJson();
            return res.data;
        },
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    })

    const languages = useMemo(() => calculateLanguageStats(data!), [data]);

    useEffect(()=>{
        if(!isLoading){
            const maps = languages.map((language)=>language.percent ?? 0);
            setPercents(maps);
        }
    },[isLoading, languages]);



    if(isLoading){
        const skeletons : ReturnType<typeof LoadingSkelton>[] = [];
        for(let i=0; i<6; ++i){
            skeletons.push(<LoadingSkelton key={i} />)
        }

        return (
        <article className={`${surfaceClass} p-7 md:p-8`}>
            <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
            <div className="mt-8 space-y-7">
                {skeletons}
            </div>
        </article>
        )
    }




    return(
    <article className={`${surfaceClass} p-7 md:p-8`}>
        <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
        <div className="mt-8 space-y-6">
            {languages.map((language, index) => (
                <div key={language.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-gray-400">{language.percent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div  className={`h-full rounded-full ${language.color} transition-all duration-300 ease-out w-0`} style={{ width: `${percents[index]}%` }} />
                    </div>
                </div>
            ))}
            {!isLoading && languages.length === 0 && <EmptyState text="No language data available" />}
        </div>
    </article>
    )
}