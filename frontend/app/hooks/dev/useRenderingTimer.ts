import { useEffect, useRef } from "react";

/**
 * 렌더링 시간을 측정해주는 커스텀 훅입니다.
 * 
 * @param label 타이머 라벨로, 콘솔에 출력될 때 어떤 타이머인지 식별할 수 있도록 도와줍니다.
 * @param isLoading 데이터 로딩 상태를 나타내는 상태 값이며, 이 값이 false로 변경될 때 렌더링 시간을 측정하여 콘솔에 출력합니다.
 */
export default function useRenderingTimer(label : string, isLoading : boolean) : number{
    const startTime = useRef(performance.now());
    const duration = useRef<number>(0);
    useEffect(()=>{
        if(!isLoading){
            const endTime = performance.now();

            duration.current = endTime - startTime.current;

            console.log(
                `%c[Timer: ${label}] %c${duration.current.toFixed(2)}ms`,
                "color: #2ecc71; font-weight: bold;", // 초록색 라벨
                "color: #f1c40f; font-weight: bold;"  // 노란색 결과값
            );
        }
    }, [isLoading]);

    if(!isLoading){
        return duration.current;
    }

    return -1;
}