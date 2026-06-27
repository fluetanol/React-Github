import { useQuery } from "@tanstack/react-query"
import { useRef } from "react"
import { useNavigate } from "react-router"
import { dench, HTTPCredentials } from "dench-fetch"
import { Github } from "~/icons/Github"
import type { CommonResponse } from "~/types/common/common"
import useErrorCallback from "~/hooks/useErrorCallback"

interface UserDataState{
    login : string,
    avatarUrl : string
}


export default function Header(){

    const denchInstance = useRef(dench("http://localhost:3000/api//", "headerDench"));

    const { data, error, isLoading, isError} = useQuery<UserDataState, Error>(
        {
            queryKey: ["headerUserData"], 
            queryFn: async() =>{
                const res = await denchInstance.current.get<CommonResponse<UserDataState>>("users/userheader")
                .credentials(HTTPCredentials.INCLUDE)
                .error((err)=>{
                    console.error("Failed to fetch user header data:", err);
                })
                .toJson()
                return res.data;
            },
            staleTime : 5 * 60 * 1000, //5분,
            retry : (failureCount, error)=>{
                if(error.message.includes("401")){
                    // Handle unauthorized error
                    return false;
                }

                return failureCount < 3;
            }
        }
    );

    const navigate = useNavigate();

    useErrorCallback(isError, ()=>{
        navigate("/");
    })


    return(
        <header className="sticky top-0 z-10 bg-white/80 px-6 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-gray-950/70">
            <div className="mx-auto flex max-w-360 items-center justify-between">
                <div className="flex items-center gap-3 hover:cursor-pointer" onClick={()=>{
                    navigate("/dashboard")
                }}>
                    <div className="rounded-2xl bg-gray-950 p-2 shadow-lg shadow-gray-950/15 dark:bg-white">
                        <div className="invert dark:invert-0">
                            <Github width={28} height={28} />
                        </div>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Dashboard</span>
                </div>

                <div className="flex flex-row gap-3 text- font-medium tracking-[0.12em] text-gray-800 dark:text-gray-200">
                    <button className="hover:text-gray-400 hover:cursor-pointer dark:hover:text-gray-300"
                        onClick={()=>{
                            navigate("/statpage");
                        }}
                    >Statistics</button>
                    <button className="hover:text-gray-400 hover:cursor-pointer dark:hover:text-gray-300" 
                    onClick={()=>{
                        navigate("/testpage");
                    }}>Test</button>
                </div>

                <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
                    <img
                        src={data?.avatarUrl}
                        alt="avatar"
                        fetchPriority="high"
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{data?.login}</span>
                </div>
            </div>
        </header>
    )
}
//아바타 url, 로그인 명