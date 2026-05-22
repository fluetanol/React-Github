import SpinFloatEffect from "./SpinFloatEffect";


export interface NavFloatButtonProps{
    onButtonClick : () => void,
    onFetchClick : (e : React.MouseEvent<HTMLButtonElement>) => void,
    isOpen : boolean,
    render_time : number
}



export function NavFloatButton({ onButtonClick, onFetchClick, isOpen, render_time } : NavFloatButtonProps){
    return(
        <nav className = "fixed bottom-8 right-8 w-20 h-20 rounded-full shadow-md bg-white transition-all duration-200 hover:-translate-y-0.5  dark:bg-white"
                onClick = {() => {
                    onButtonClick();
                }}
            >
                <SpinFloatEffect isModalOpen={isOpen}/>
                {isOpen && (
                    <div className="absolute right-8 bottom-22 rounded-2xl w-100 h-150 shadow-md  bg-[#eef4ff]/60 border-white backdrop-blur-xs p-10 overflow-hidden">
                        <header className="flex flex-col gap-2 pb-2 mb-4 items-baseline">
                            <h1 className ="text-2xl font-bold">Fetch Config</h1>
                            <p>Rendering Time: {render_time.toFixed(3)} ms</p>
                            {/* 소수점 아래 3자리까지 표시 */}
                        </header>
                        <section className = "flex flex-col gap-4 h-fit">
                            <button className = "w-full h-24 bg-white shadow-md rounded-2xl hover:bg-gray-100" value = "1"
                                onClick={onFetchClick}
                            > useGithub </button>
                            <button className = "w-full h-24 bg-white shadow-md rounded-2xl hover:bg-gray-100" value = "2" onClick={onFetchClick}> useFetchAllHook </button>
                            <button className = "w-full h-24 bg-white shadow-md rounded-2xl hover:bg-gray-100" value = "3" onClick={onFetchClick}> Dench </button>
                        </section>
                    </div>
                )}
            </nav>
    )
}