import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";
import MovingStrip from "~/components/home/MovingStrip";
import useAuthCheck from "~/hooks/useAuthCheck";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Dashboard" },
    { name: "description", content: "GitHub Dashboard login" },
  ];
}


const handleOAuthLogin = (ID: string, URL: string) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const githubOAuthParams : StrictGithubOAuthParams = {
    client_id : ID,
    redirect_uri : URL,
    scope : ["user", "repo"]
  };

  const params = new URLSearchParams( {
    ...githubOAuthParams,
    scope : githubOAuthParams.scope.join(' '), 
  } );
  window.location.href = `${baseURL}?${params.toString()}`;

};

type CommonResponse = { success : boolean;} | { error : string; }

export default function Home() {
  const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
  const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
  const navigate = useNavigate();
  
  const { loginCheckState } = useAuthCheck();

  useEffect(()=>{
    if(loginCheckState){
      navigate("/dashboard");
    }
  },[loginCheckState, navigate])
 


  return (

      <main className="home-ambient relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-gray-950 dark:text-white">
        
        <section className="relative flex w-full max-w-sm flex-col items-center gap-7 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            GitHub Dashboard
          </h1>

          {loginCheckState === false || loginCheckState === null ? (
            <button
              type="button"
              aria-label="Login with GitHub"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_22px_60px_rgba(15,23,42,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_72px_rgba(15,23,42,0.2)] dark:bg-white"
              onClick={()=>{
                handleOAuthLogin(ID, URL);
              }}
            >
              <Github width={64} height={64} />
            </button>
          ): 
            <div className="h-16 w-16 rounded-full bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.10)] dark:bg-white/10">
              <span className="block h-full w-full animate-pulse rounded-full bg-github-light" />
            </div>
          }
        </section>





        <MovingStrip/>

      </main>

  );
}
