import { redirect, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


const handleOAuthLogin = (ID: string, URL: string) => {
  // 비 권장
  // window.location.href =`https://github.com/login/oauth/authorize
  // ?client_id=${ID}
  // &redirect_uri=${URL}&scope=user`;
  // console.log("Redirecting to GitHub for authentication...");

  // base url과 query parameter를 명확하게 분리하여 URL을 구성하는 걸 권장
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
  const [loginCheckState, setLoginCheckState] = useState(false);
  const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
  const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
  const navigate = useNavigate();
  console.log("ID, URL " ,ID, URL);


  useEffect(()=>{
    const checkLogin = async ()=>{
      try{
         const res = await fetch('http://localhost:3000/api/auth/check',{
            method : 'GET',
            credentials : 'include' // 쿠키를 포함하여 요청을 보냄
         })

         if(res.ok){
            const data : CommonResponse = await res.json();
            console.log("Login check response:", data);
            if('success' in data && data.success){
              navigate('/dashboard');
            }
         }
         else{
              throw new Error("Unauthorized");
         }
      }
      catch(error : unknown){
        console.error("Error : Token verification error", error);
        setLoginCheckState(true);
      }
    } 

    checkLogin();

  }, [])
 


  return <>
    {loginCheckState ? (
      <div className = "flex flex-col items-center justify-center h-screen gap-4">
        <span className = "text-4xl font-semibold">GitHub dashBoard</span>
        <button 
          className = {`border p-1 rounded-full 
            hover:cursor-pointer hover:bg-gray-300 
            transition-colors duration-150`}
          onClick={()=>{
            handleOAuthLogin(ID, URL);
        }}>
          <Github 
            width={50}
            height={50}
          />
        </button>
      </div>
    ): 
      <div className = "flex justify-center items-center h-screen">
        <h1>로딩 중...</h1>
      </div>
    }


    </>;
}
