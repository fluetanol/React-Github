


export default function MovingStrip() {


    return(
        
          <div className ="absolute top-1/2 left-1/2 flex flex-col gap-64 h-full w-full text-2xl z-15 text-gray-800 opacity-30 dark:text-white">
            <div className ="flex flex-row gap-64 w-full h-10 -translate-x-1/2 -translate-y-1/2 rotate-45">
              <div className ="absolute flex flex-row items-center gap-64 loop-anim">
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
              </div>
             <div className ="absolute flex flex-row items-center gap-64 loop-copy-anim">
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
                <div className="bg-github-light w-48 h-8 rounded-lg"></div>
              </div>
            </div>
          </div>
    )
}