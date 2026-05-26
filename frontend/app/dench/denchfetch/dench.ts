import type { DenchConfig, DenchCreateBuilder, DenchGetBuilder, DenchInterface, DenchRunner } from "~/dench/types/dench";
import type { HTTPCredentials, HTTPMode } from "~/dench/types/denchEnum";

import { 
    credentialsConfig, abortConfig, authConfig, 
    timeoutConfig, sendJsonConfig, 
    sendFormConfig, sendBlobConfig, 
    modeConfig, 
    errorConfig } from "./denchConfigModule"
import { runfetch, toFormData, toJson, toObject } from "./denchRunner";



const createGetBuilder = <T>(config: DenchConfig): DenchGetBuilder<T> => ({
    config: config,
    toResponse: () => runfetch<T>(config),
    toJson: () => toJson(config),
    toObject: () => toObject(config),
    toFormData: () => toFormData(config),
    error: (callback: (error: unknown) => void) => {
        errorConfig(config, callback);
        return createGetBuilder<T>(config);
    },
    credentials: (credentials: HTTPCredentials) => createGetBuilder<T>(credentialsConfig(config, credentials)),
    abort: (controller: AbortController) => createGetBuilder<T>(abortConfig(config, controller)),
    auth: (token: string) => createGetBuilder<T>(authConfig(config, token)),
    timeout: (ms: number) => createGetBuilder<T>(timeoutConfig(config, ms)),
    autoEdit: () => createGetBuilder<T>(config)
})


const createPostBuilder = <T>(config: DenchConfig): DenchCreateBuilder<T> => ({
    config: config,
    toResponse: () => runfetch<T>(config),
    toJson: () => toJson(config),
    toObject: () => toObject(config),
    toFormData: () => toFormData(config),
    sendJson: () => createPostBuilder<T>(sendJsonConfig(config)),
    sendForm: () => createPostBuilder<T>(sendFormConfig(config)),
    sendBlob: () => createPostBuilder<T>(sendBlobConfig(config)),
    error: (callback: (error: unknown) => void) => {
        errorConfig(config, callback);
        return createPostBuilder<T>(config);
    },
    credentials: (credentials: HTTPCredentials) => createPostBuilder<T>(credentialsConfig(config, credentials)),
    abort: (controller: AbortController) => createPostBuilder<T>(abortConfig(config, controller)),
    auth: (token: string) => createPostBuilder<T>(authConfig(config, token)),
    mode: (mode: HTTPMode) => {
        const newConfig = modeConfig(config, mode);
        return createPostBuilder<T>(newConfig);
    },
    autoEdit: () => createPostBuilder<T>(config),
    timeout: (ms: number) => {
        const newConfig = timeoutConfig(config, ms);
        return createPostBuilder<T>(newConfig);
    }
})




/**
 * Dench 빌더 함수
 * 
 * @param baseURL baseURL 
 * @param label 빌더 레이블
 * @returns 
 */
export function dench(baseURL:string, label? :string) : DenchInterface{

    const get = <T>(api :string) : DenchGetBuilder<T> => {

        const config : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'GET',
            }
        }
        return createGetBuilder<T>(config); 
    }


    const post = <T>(api:string, data?: any) : DenchCreateBuilder<T>=>{

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'POST',
                body : data
            }
        }
        return createPostBuilder<T>(baseConfig);
    }


    const put = <T>(api: string, data?: any): DenchCreateBuilder<T> => {

        const baseConfig: DenchConfig = {
            baseURL,
            api,
            options: {
                method: 'PUT',
                body: data
            }
        }
        return createPostBuilder<T>(baseConfig);
    }


    const del = <T>(api:string) : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'DELETE',
            }
        }
        return createGetBuilder<T>(baseConfig);
    }

    return {
        baseURL,
        get : get,
        post : post,
        put : put,
        delete : del
    }
}
