




export default function SpinFloatEffect({ isModalOpen }: { isModalOpen: boolean }){
    return(
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                ${isModalOpen ? "rotate-0" : "rotate-90"}
                    transition-all duration-350 ease-in-out
                `}>
                <div className={`flex flex-row
                    ${isModalOpen ? "gap-0" : "gap-1.5"}
                `}>
                    <div className = {`
                    ${isModalOpen ? "rotate-45 translate-x-1.5 translate-y-1 w-8 h-1.5" : 
                        "rotate-0 translate-x-0 translate-y-0 w-2 h-2"}
                        rounded-full bg-github-light
                        transition-all duration-200 ease-in-out
                        `}/>
                    <div className = {`w-2 h-2 rounded-full bg-github-light
                        ${isModalOpen ? "absolute scale-0" : "scale-100"}
                        transition-all duration-200 ease-in-out
                        `}/>
                    <div className = {`
                        ${isModalOpen ? "-rotate-45 -translate-x-1.5 translate-y-1 w-8 h-1.5" : "rotate-0 translate-x-0 translate-y-0 w-2 h-2"}
                        rounded-full bg-github-light
                        transition-all duration-200 ease-in-out
                        `}
                        />
                </div>
            </div>

    )
}