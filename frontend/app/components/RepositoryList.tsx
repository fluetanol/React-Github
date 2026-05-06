import useGithub from "~/hooks/useGithub";
import type { GithubRepo } from "~/types/GithubInfo";
import type { useGithubResult } from "~/types/hooks/useGithub";


interface GithubRepositoryResponse{
    repos : GithubRepo[];
}


export default function RepositoryList(){
    const { githubDataState, isLoading, isError } = useGithub<GithubRepositoryResponse>("/api/users/repos") as useGithubResult<GithubRepositoryResponse>;

    if(isLoading){
        return <section>
            <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
              {[1,2,3,4].map(repo => {
                return(
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-3 text-gray-50">
                        <div rel="noopener noreferrer" className="text-lg font-bold hover:underline bg-gray-700 rounded animate-pulse w-3/4"> 
                           &nbsp;
                        </div>
                        <p className="text-gray-400 text-sm mt-1 bg-gray-700 rounded animate-pulse w-1/3">&nbsp; </p>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm bg-gray-700 rounded animate-pulse w-2/3">
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm bg-gray-700 rounded animate-pulse w-1/3">
                            &nbsp;
                        </div>
                    </div>
                )
            })}
        </section>
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
            {githubDataState?.repos.map(repo => {
                return(
                    <a key={repo.id} href={repo.html_url}  target="_blank" rel="noopener noreferrer" className="flex flex-col bg-gray-700 border border-gray-800 rounded-lg p-4 mb-3 text-gray-50 hover:scale-105 transition-transform">
                        <div className="text-lg font-bold hover:underline">
                            {repo.name}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{repo.description ? repo.description : "No description"}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            <span>⭐ {repo.watchers}</span>
                            <span>📝 {repo.language || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            {repo.fork ? <span>Forked</span> : <span>Original</span>}
                        </div>
                    </a>
                )
            })}
        </section>
    )
}