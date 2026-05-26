import type { DenchConfig, DenchCreateBuilder, DenchGetBuilder, DenchInterface, DenchRunner } from "~/dench/types/dench";
import type { HTTPCredentials, HTTPMode } from "~/dench/types/denchEnum";

import { 
    credentialsConfig, abortConfig, authConfig, 
    timeoutConfig, sendJsonConfig, 
    sendFormConfig, sendBlobConfig, 
    modeConfig, 
    errorConfig } from "./denchConfigModule"
import { runfetch, toFormData, toJson, toObject } from "./denchRunner";


/**
 * Dench 빌더 함수
 * 
 * @param baseURL baseURL 
 * @param label 빌더 레이블
 * @returns 
 */
export function dench(baseURL:string, label? :string) : DenchInterface{

    const get = <T>(api :string) : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'GET',
            }
        }

        const createBuilder = <T>(config: DenchConfig): DenchGetBuilder<T> => ({
            config : baseConfig,
            toResponse : () => runfetch<T>(config),
            toJson :  () => toJson(config),
            toObject : () => toObject(config),
            toFormData : () => toFormData(config),
            error : (callback: (error: unknown) => void) => {
                errorConfig(config, callback);
                 return createBuilder<T>(config);
            },
            credentials : (credentials: HTTPCredentials)=> createBuilder<T>(credentialsConfig(config, credentials)),
            abort : (controller : AbortController) => createBuilder<T>(abortConfig(config, controller)),
            auth : (token:string)=> createBuilder<T>(authConfig(config, token)),
            timeout : (ms : number) => createBuilder<T>(timeoutConfig(config, ms))
            
        })

        return{
            ...createBuilder<T>(baseConfig)
        }      
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

        const createBuilder = <T>(config : DenchConfig) : DenchCreateBuilder<T> => ({
            config : config,
            toResponse : () => runfetch<T>(config),
            toJson :  () => toJson(config),
            toObject : ()=> toObject(config),
            toFormData : ()=>toFormData(config),
            sendJson: () =>  createBuilder<T>(sendJsonConfig(config)),
            sendForm: () => createBuilder<T>(sendFormConfig(config)),
            sendBlob: () => createBuilder<T>(sendBlobConfig(config)),
            error : (callback: (error: unknown) => void) => {
                errorConfig(config, callback);
                return createBuilder<T>(config);
            },
            credentials: (credentials: HTTPCredentials) => createBuilder<T>(credentialsConfig(config, credentials)),
            abort: (controller: AbortController) => createBuilder<T>(abortConfig(config, controller)),
            auth: (token: string) => createBuilder<T>(authConfig(config, token)),
            mode : (mode : HTTPMode) => {
                const newConfig = modeConfig(config, mode);
                return createBuilder<T>(newConfig);
            },
            timeout : (ms : number) => {
                const newConfig = timeoutConfig(config, ms);
                return createBuilder<T>(newConfig); 
                }
            })

        return createBuilder<T>(baseConfig);
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

        const createBuilder = <T>(config: DenchConfig): DenchCreateBuilder<T> => ({
            config: config,
            toResponse: () => runfetch<T>(config),
            toJson: () => toJson(config),
            toObject: () => toObject(config),
            toFormData: () => toFormData(config),
            sendJson: () => createBuilder<T>(sendJsonConfig(config)),
            sendForm: () => createBuilder<T>(sendFormConfig(config)),
            sendBlob: () => createBuilder<T>(sendBlobConfig(config)),
            error: (callback: (error: unknown) => void) => {
                errorConfig(config, callback);
                return createBuilder<T>(config);
            },
            credentials: (credentials: HTTPCredentials) => createBuilder<T>(credentialsConfig(config, credentials)),
            abort: (controller: AbortController) => createBuilder<T>(abortConfig(config, controller)),
            auth: (token: string) => createBuilder<T>(authConfig(config, token)),
            mode: (mode: HTTPMode) => {
                const newConfig = modeConfig(config, mode);
                return createBuilder<T>(newConfig);
            },
            timeout: (ms: number) => {
                const newConfig = timeoutConfig(config, ms);
                return createBuilder<T>(newConfig);
            }
        })

        return createBuilder<T>(baseConfig);
    }


    const del = <T>(api:string) : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'DELETE',
            }
        }

        const createBuilder = <T>(config: DenchConfig): DenchGetBuilder<T> => ({
            config: baseConfig,
            toResponse: () => runfetch<T>(config),
            toJson: () => toJson(config),
            toObject: () => toObject(config),
            toFormData: () => toFormData(config),
            error: (callback: (error: unknown) => void) => {
                errorConfig(config, callback);
                return createBuilder<T>(config);
            },
            credentials: (credentials: HTTPCredentials) => createBuilder<T>(credentialsConfig(config, credentials)),
            abort: (controller: AbortController) => createBuilder<T>(abortConfig(config, controller)),
            auth: (token: string) => createBuilder<T>(authConfig(config, token)),
            timeout: (ms: number) => createBuilder<T>(timeoutConfig(config, ms))

        })

        return {
            ...createBuilder<T>(baseConfig)
        }     

    }






    return {
        baseURL,
        get : get,
        post : post,
        put : put,
        delete : del
    }
}
