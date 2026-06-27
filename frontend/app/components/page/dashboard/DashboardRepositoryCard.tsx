
export interface RepositoryCardComponentProps{
    repo : {
        id : number,
        name  : string,
        description : string | null,
        html_url : string,
        watchers : number,
        language : string | null,
        fork : boolean
     }
}


export default function DashboardRepositoryCard({ repo } : RepositoryCardComponentProps){
    const language = repo.language || "Unknown";

    return(
        <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-52 flex-col justify-between rounded-[1.75rem] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)] dark:bg-gray-900"
        >
        <div>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                        {repo.fork ? "Forked" : "Original"}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-950 transition-colors group-hover:text-github-light dark:text-white">
                        {repo.name}
                    </h3>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {repo.watchers} watchers
                </span>
            </div>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {repo.description ? repo.description : "No description provided."}
            </p>
        </div>
        <div className="mt-8 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{language}</span>
            <span className="text-sm font-semibold text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200">
                Open
            </span>
        </div>
    </a>
    )
}
