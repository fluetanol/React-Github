import { useEffect, useRef, useState } from "react";
import { useGlobalLoadingMap } from "./useRegistLoading";

/**
 * 렌더링 시간을 측정해주는 커스텀 훅입니다.
 * 
 * @param label 타이머 라벨로, 콘솔에 출력될 때 어떤 타이머인지 식별할 수 있도록 도와줍니다.
 * @param isLoading 데이터 로딩 상태를 나타내는 상태 값이며, 이 값이 false로 변경될 때 렌더링 시간을 측정하여 콘솔에 출력합니다.
 */
export default function useRenderingTimer(label : string, resetTrigger?: boolean, setResetTrigger?: React.Dispatch<React.SetStateAction<boolean>>) : number{

    const loadingMap = useGlobalLoadingMap();
    const isExistLoading = Object.keys(loadingMap).length > 0;
    const isAnyLoading = Object.values(loadingMap).some(Boolean);
    const startTime = useRef(performance.now());
    const [duration, setDuration] = useState<number>(0);
    
    useEffect(()=>{
        if(!isExistLoading) return;
        if(isAnyLoading) return;

        const endTime = performance.now();
        const result = endTime - startTime.current;
        setDuration(result);

        console.log(
            `%c[Timer: ${label}] %c${result.toFixed(2)}ms`,
            "color: #2ecc71; font-weight: bold;", // 초록색 라벨
            "color: #f1c40f; font-weight: bold;"  // 노란색 결과값
        );

    }, [isAnyLoading, label]);

    useEffect(()=>{
        if(resetTrigger){
            startTime.current = performance.now();
            setDuration(0);
            console.log(`useRenderingTimer - Timer reset for ${label}`);
            if (setResetTrigger) setResetTrigger(false);
        }
    },[resetTrigger])

    //console.log(`useRenderingTimer - startTime = ${startTime.current.toFixed(2)}ms, duration = ${duration.toFixed(2)}ms`);

    return duration;
}