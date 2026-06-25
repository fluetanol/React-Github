import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";
import { calculateProjectCategories } from "~/utils/statpage";
import { useMemo, useState } from "react";
import { dench, HTTPCredentials } from "dench-fetch";
import type { GithubProjectTopicsNode, GithubRepoCommonResponse } from "~/types/page/statpage";
import type { CommonResponse } from "~/types/common/common";
import { useQuery } from "@tanstack/react-query";


function Skeleton(){
    return(
        <div className="flex items-center justify-between rounded-3xl bg-gray-100 px-5 py-4 dark:bg-gray-800 animate-pulse">
            <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full`} />
                <span className="text-sm font-semibold"></span>
            </div>
            <span className="text-sm text-gray-400"></span>
        </div>
    )
}

export default function RepositoryCategoriesArticle(){

    const [denchInstance] = useState(()=>dench("http://localhost:3000/api", "repositoryCategoriesArticleDench"));

    const { data, isLoading, isError } = useQuery({
        queryKey : ["repositoryCategoriesArticleData"],
        queryFn : async()=>{
            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>

            const res = await denchInstance.get<CommonResponseType<GithubProjectTopicsNode>>("repos/projectTopics")
                            .credentials(HTTPCredentials.INCLUDE)
                            .toJson();

            return res.data;
        },
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    })

    const categories = useMemo(()=> calculateProjectCategories(data),[data])

    
    if(isLoading){

        const skeletons : ReturnType<typeof Skeleton>[] = [];
        for(let i=0; i<6; ++i){
            skeletons.push(<Skeleton key={i} />)
        }

        return (
             <article className={`${surfaceClass} p-7 md:p-8 lg:col-span-2 xl:col-span-1`}>
                <SectionHeading eyebrow="Project types" title="Repository categories" detail="Inferred from names and topics" />
                <div className="mt-8 space-y-4">
                    {skeletons}
                </div>
            </article> 
        )
    }



    return(
        <article className={`${surfaceClass} p-7 md:p-8 lg:col-span-2 xl:col-span-1`}>
                <SectionHeading eyebrow="Project types" title="Repository categories" detail="Inferred from names and topics" />
                <div className="mt-8 space-y-4">
                    {categories.map((category, index) => (
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
                {!isLoading && categories.length === 0 && <EmptyState text="No project topic data available" />}
            </article>         
    )
}