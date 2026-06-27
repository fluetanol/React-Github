
export interface SideProfileComponentProps{
    userDataState : {
        avatar_url : string,
        login : string,
        name: string | null,
        bio: string | null,
        html_url: string,
        followers: number,
        following: number,
        company: string | null,
        location: string | null,
        email: string | null,
        blog: string | null
    }
}



export default function SideProfile({ userDataState }: SideProfileComponentProps){
    const profileDetails = [
        { label: "Company", value: userDataState.company },
        { label: "Location", value: userDataState.location },
        { label: "Email", value: userDataState.email },
    ].filter((item) => item.value);

    return(
        <aside className="flex min-h-135 flex-col rounded-4xl bg-gray-950 p-7 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] lg:sticky lg:top-28">
            <div className="flex flex-col gap-7">
                <div className="flex items-center gap-5 lg:flex-col lg:items-start">
                    <img
                        src={userDataState.avatar_url}
                        alt="avatar"
                        className="h-24 w-24 rounded-3xl object-cover shadow-2xl shadow-black/30 lg:h-40 lg:w-40"
                    />

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                            Profile
                        </p>
                        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                            {userDataState.name ?? userDataState.login}
                        </h1>
                        <p className="mt-2 text-base text-gray-400">@{userDataState.login}</p>
                    </div>
                </div>

                {userDataState.bio && (
                    <p className="max-w-sm text-sm leading-7 text-gray-300">{userDataState.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl bg-white/8 p-4">
                        <p className="text-2xl font-semibold">{userDataState.followers}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Followers</p>
                    </div>
                    <div className="rounded-3xl bg-white/8 p-4">
                        <p className="text-2xl font-semibold">{userDataState.following}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">Following</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-5">
                {(profileDetails.length > 0 || userDataState.blog) && (
                    <div className="space-y-4 rounded-3xl bg-white/6 p-5">
                        {profileDetails.map((item) => (
                            <div key={item.label}>
                                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
                                <p className="mt-1 truncate text-sm text-gray-200">{item.value}</p>
                            </div>
                        ))}
                        {userDataState.blog && (
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Blog</p>
                                <a
                                    href={userDataState.blog}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block truncate text-sm text-sky-300 transition-colors hover:text-sky-200"
                                >
                                    {userDataState.blog}
                                </a>
                            </div>
                        )}
                    </div>
                )}

                <a
                    href={userDataState.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-gray-950 shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                    View GitHub Profile
                </a>
            </div>
        </aside>

    )
}
