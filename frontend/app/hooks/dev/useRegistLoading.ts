import { useEffect,  useSyncExternalStore } from "react";

type LoadingStore = Record<string, boolean>;

let loadingStore: LoadingStore = {};
const listeners = new Set<() => void>();

// 로딩 상태를 업데이트하고 구독자에게 알리는 함수들
function emit() {
    listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return loadingStore;
}

function setLoading(label: string, isLoading: boolean) {
    if(loadingStore[label] === isLoading){
        return;
    }

    loadingStore = {
        ...loadingStore,
        [label]: isLoading,
    };
    emit();
}

function removeLoading(label: string) {
    if (!(label in loadingStore)) return;

    const { [label]: _, ...rest } = loadingStore;
    loadingStore = rest;

    emit();
}


/**
 * 로딩 상태를 전역적으로 관리하는 커스텀 훅입니다. 
 * 각 컴포넌트에서 로딩 상태를 등록하고 해제할 수 있으며, 등록된 로딩 상태는 전역적으로 관리됩니다.
 * 
 * @param label 로딩 상태를 식별하기 위한 라벨입니다. 각 컴포넌트에서 고유한 라벨을 사용하여 로딩 상태를 등록해야 합니다.
 * @param isLoading 현재 컴포넌트의 로딩 상태입니다. 이 값이 변경될 때마다 전역 로딩 상태가 업데이트됩니다.
 */
export default function useRegistLoading(label : string,isLoading : boolean){
    useEffect(() => {
        setLoading(label, isLoading);

        return () => {
            removeLoading(label);
        };
    }, [label, isLoading]);
}


export function useGlobalLoadingMap() {
    return useSyncExternalStore(
        subscribe,
        getSnapshot,
        getSnapshot
    );

    /*
        useSyncExternalStore는 다음과 같이 사용한다
        const globalLoadingMap = useSyncExternalStore(
            subscribe, // 구독 함수
            getSnapshot, // 현재 상태를 반환하는 함수
            getSnapshot // 서버 사이드 렌더링을 위한 함수 (클라이언트와 동일한 상태 반환)
        );
    */
}