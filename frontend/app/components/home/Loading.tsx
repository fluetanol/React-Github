import { Github } from "~/icons/Github"


export function Loading(){

    return(
               <div className="flex items-center justify-center min-h-screen bg-gray-950">
                        <div className="flex flex-col items-center gap-4">
                            <div className="invert">
                                <Github width={48} height={48} />
                            </div>
                        <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
                    </div>
                </div>   
    )

}