import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import RepositoryList from "~/components/RepositoryList";
import useFetchAll from "~/hooks/useFetchAll";
import { Github } from "~/icons/Github";
import type { GithubRepositoryResponse, GithubUserResponse } from "~/types/GithubInfo";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";


export default function Dashboard(){
    const {dataState, isLoading, isError} = useFetchAll<[GithubUserResponse, GithubRepositoryResponse]>({
        method : 'GET',
        credentials : 'include'
    }, "api/users", "api/users/repos") 
    const navigate = useNavigate();

    const render_time = useRenderingTimer("Dashboard", isLoading);
    
    
    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    }, [isError, navigate]);


    //console.log("Dashboard loading state:", isLoading, isError);
    if (isLoading) {
        return (
            <Loading/>
        );
    }

    const userDataState = dataState![0].user;
    const reposDataState = dataState![1];


    return (
        <div className="min-h-screen">

            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-gray-800 bg-github-light backdrop-blur-sm px-6 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="invert">
                            <Github width={28} height={28} />
                        </div>
                        <span className="text-white font-semibold">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <img
                            src={userDataState.avatar_url}
                            alt="avatar"
                            fetchPriority="high"
                            className="w-8 h-8 rounded-full ring-2 ring-gray-700"
                        />
                        <span className="text-sm text-gray-300">{userDataState.login}</span>
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

                {/* ── Left Sidebar : Profile ── */}
                <aside className="w-64 shrink-0 flex flex-col gap-5">

                    {/* Avatar */}
                    <img
                        src={userDataState.avatar_url}
                        alt="avatar"
                        className="w-full rounded-full ring-2 ring-gray-700"
                    />

                    {/* Name / Login */}
                    <div>
                        <h1 className="text-xl font-bold text-white leading-tight">
                            {userDataState.name ?? userDataState.login}
                        </h1>
                        <p className="text-gray-400 text-base">{userDataState.login}</p>
                    </div>

                    {/* Bio */}
                    {userDataState.bio && (
                        <p className="text-gray-300 text-sm leading-relaxed">{userDataState.bio}</p>
                    )}

                    {/* GitHub Profile 버튼 */}
                    <a
                        href={userDataState.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm py-1.5 px-4 rounded-md transition-colors"
                    >
                        View GitHub Profile
                    </a>

                    {/* Followers / Following */}
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>
                            <span className="font-semibold text-white">{userDataState.followers}</span>
                            {" "}followers
                        </span>
                        <span className="text-gray-600">·</span>
                        <span>
                            <span className="font-semibold text-white">{userDataState.following}</span>
                            {" "}following
                        </span>
                    </div>

                    {/* Detail Info */}
                    <div className="flex flex-col gap-2 text-sm text-gray-400 border-t border-gray-800 pt-4">
                        {userDataState.company && (
                            <div className="flex items-center gap-2">
                                <span>🏢</span>
                                <span className="truncate">{userDataState.company}</span>
                            </div>
                        )}
                        {userDataState.location && (
                            <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{userDataState.location}</span>
                            </div>
                        )}
                        {userDataState.email && (
                            <div className="flex items-center gap-2">
                                <span>✉️</span>
                                <span className="truncate">{userDataState.email}</span>
                            </div>
                        )}
                        {userDataState.blog && (
                            <div className="flex items-center gap-2">
                                <span>🔗</span>
                                <a
                                    href={userDataState.blog}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline truncate"
                                >
                                    {userDataState.blog}
                                </a>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── Right Main Content ── */}
                <main className="flex-1 flex flex-col gap-6 min-w-0">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Followers</p>
                            <p className="text-3xl font-bold text-white">{userDataState.followers}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Following</p>
                            <p className="text-3xl font-bold text-white">{userDataState.following}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Repositories</p>
                            <p className="text-3xl font-bold text-gray-600">—</p>
                        </div>
                    </div>
                    {/* Repository List */}
                    <RepositoryList githubDataState={reposDataState} isLoading={isLoading} isError={isError} />
                </main>
            </div>
        </div>
    );
}