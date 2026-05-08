import { create } from 'zustand';
import {  createJSONStorage } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

export interface FetchState{
    data : any,
    lastFetched : number,
    staleTime : number,
}

export interface FetchStore{
    fetchMap : Record<string, FetchState>,
    setFetchMap : (key: string, data : any, staleTime : number) => void,
    hashydrate : boolean,
    setHashydrate : (value : boolean) => void,
}


//!! ()()구문은 커링 패턴으로, create 함수에 persist 함수를 
// 인자로 전달하여 새로운 함수를 생성하고, 
// 그 함수를 즉시 호출하여 Zustand 스토어를 생성하는 방식임.
const useFetchStore = create<FetchStore>()(
    persist( 
        (set) => ({
        hashydrate : false,
        fetchMap : {},
        setFetchMap : (key: string, data : any, staleTime : number)=>{
            set((state : { fetchMap: Record<string, FetchState> })=>{
                const newMap = {...state.fetchMap};
                newMap[key] = {
                    data,
                    lastFetched : Date.now(),
                    staleTime
                };
                return ({ fetchMap : newMap  });
            });
        },
        setHashydrate : (value : boolean)=>{
            set({ hashydrate : value });
        }
    }),
    {
        name : 'fetch-storage',
        storage : createJSONStorage(()=> sessionStorage),
        //createJSONStorage는 zustand의 persist 미들웨어에서 사용할 수 있는 
        //저장소 생성 함수로, 내부에서 자동으로 json.stringify와 json.parse를 하여
        //데이터를 저장하고 불러올 때 객체 형태로 다룰 수 있도록 해줌.

        onRehydrateStorage : (state)=>{
            //hydration 시작시 호출되는 로직


            //hydration이 완료된 후 호출되는 로직을 반환하는 함수
            //그러니까 하이드레이션이 완료되었음을 보장하고 싶으면, return 문에 함수를 작성해줘야 한다.
            return (state, error)=>{
                if(error){
                    console.error("Failed to rehydrate fetch store:", error);
                    return;
                }

                state?.setHashydrate(true);
            }
       
        }
    }
    )
);

export default useFetchStore;