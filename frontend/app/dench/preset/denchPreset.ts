import type { DenchConfig, DenchRunner } from "~/dench/types/dench";
import { HTTPCredentials } from "~/dench/types/denchEnum";
import type { DenchPresetsOptionalParams } from "~/dench/types/denchPreset";
import { runfetch, toFormData, toJson, toObject } from "../main/denchRunner";

function deepFreezeConfig(config : DenchConfig) : DenchConfig{

    const frozenOptions = Object.freeze({
        ...config.options,
        headers : config.options.headers ? Object.freeze(config.options.headers) : undefined
    });

    return Object.freeze({
        ...config,
        options : frozenOptions
    });
}


export const createDenchPresets = (type : string, baseURL : string, optionParmas?: DenchPresetsOptionalParams) : Readonly<DenchConfig> => {

    const { api, token, data } = optionParmas || {};

    const commonConfig : Omit<DenchConfig, "options">={
        baseURL,
        api : api || ""
    }

    interface createConfigParams{
        method : string,
        auth? : string,
        acceptType? : string,
        contentType ? :string,
        credentials? : HTTPCredentials
        data? : BodyInit
    }


    const createConfig = (params : createConfigParams) :DenchConfig => {
        const { method, auth, acceptType, contentType, credentials, data } = params;
        return {
            ...commonConfig,
            options : {
                method,
                headers : {
                    //스프레드 조건문 구문을 사용하면 조건적 레코드 설정이 가능합니다.
                    ...(acceptType ? { Accept: acceptType } : {}),
                    ...(contentType ? { "Content-Type": contentType } : {}),
                    ...(auth ? { Authorization: `Bearer ${auth}` } : {})
                },
                ...(credentials ? { credentials : credentials } : {}),
                ...(data ? { body : data } : {})
            }
        }
    }



    const presets : Record<string, DenchConfig> ={
        getJson : {
            ...createConfig({ method: "GET", acceptType: "application/json" })
        },
        getAuthJson:{
            ...createConfig({ method: "GET", auth: token, acceptType: "application/json" })
        },
        getCookiesJson:{
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json" })
        },
        getFormData : {
            ...createConfig({ method: "GET", acceptType: "multipart/form-data" })
        },
        getAuthFormData : {
            ...createConfig({ method: "GET", auth: token, acceptType: "multipart/form-data" })
        },
        getCookiesFormData : {
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "multipart/form-data" })
        },
        getBlob : {
            ...createConfig({ method: "GET", acceptType: "application/octet-stream" })
         },
        getAuthBlob : {
            ...createConfig({ method: "GET", auth: token, acceptType: "application/octet-stream" })
        },
        getCookiesBlob : {
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "application/octet-stream" })
        },
        postData : {
            ...createConfig({ method: "POST", data })
        },
        postAuthData : {
            ...createConfig({ method: "POST", auth: token, data })
        },
        postCookiesData : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, data })
        },
        postJson : {
            ...createConfig({ method: "POST", contentType: "application/json", data })
        },
        postAuthJson : {
            ...createConfig({ method: "POST", auth: token, contentType: "application/json", data })
        },
        postCookiesJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, contentType: "application/json", data })
        },
        postFormData : {
            ...createConfig({ method: "POST", contentType: "multipart/form-data", data })
        },
        postAuthFormData : {
            ...createConfig({ method: "POST", auth: token, contentType: "multipart/form-data", data })
        },
        postCookiesFormData : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, contentType: "multipart/form-data", data })
        },
        postBlob : {
            ...createConfig({ method: "POST", contentType: "application/octet-stream", data })
        },
        postAuthBlob : {
            ...createConfig({ method: "POST", auth: token, contentType: "application/octet-stream", data })
        },
        postCookiesBlob : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, contentType: "application/octet-stream", data })
        },
        postDataToJson : {
            ...createConfig({ method: "POST", data, acceptType: "application/json", contentType: "application/json" })
        },
        postAuthDataToJson : {
            ...createConfig({ method: "POST", auth: token, data, acceptType: "application/json", contentType: "application/json" })
        },
        postCookiesDataToJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, data, acceptType: "application/json", contentType: "application/json" })
        },
        postJsonToJson : {
            ...createConfig({ method: "POST", acceptType: "application/json", contentType: "application/json", data })
        },
        postAuthJsonToJson : {
            ...createConfig({ method: "POST", auth: token, acceptType: "application/json", contentType: "application/json", data })
        },
        postCookiesJsonToJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json", contentType: "application/json", data })
        },
        postFormDataToJson : {
            ...createConfig({ method: "POST", acceptType: "application/json", contentType: "multipart/form-data", data })
        },
        postAuthFormDataToJson : {
            ...createConfig({ method: "POST", auth: token, acceptType: "application/json", contentType: "multipart/form-data", data })
        },
        postCookiesFormDataToJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json", contentType: "multipart/form-data", data })
        },
        postBlobToJson : {
            ...createConfig({ method: "POST", acceptType: "application/json", contentType: "application/octet-stream", data })
        },
        postAuthBlobToJson : {
            ...createConfig({ method: "POST", auth: token, acceptType: "application/json", contentType: "application/octet-stream", data })
        },
        postCookiesBlobToJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json", contentType: "application/octet-stream", data })
        },
        deleteJson : {
            ...createConfig({ method: "DELETE", acceptType: "application/json" })
        },
        deleteAuthJson : {
            ...createConfig({ method: "DELETE", auth: token, acceptType: "application/json" })
        },
        deleteCookiesJson : {
            ...createConfig({ method: "DELETE", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json" })
        },
        deleteFormData : {
            ...createConfig({ method: "DELETE", acceptType: "multipart/form-data" })
        },
        deleteAuthFormData : {
            ...createConfig({ method: "DELETE", auth: token, acceptType: "multipart/form-data" })
        },
        deleteCookiesFormData : {
            ...createConfig({ method: "DELETE", credentials: HTTPCredentials.INCLUDE, acceptType: "multipart/form-data" })
        },
        deleteBlob : {
            ...createConfig({ method: "DELETE", acceptType: "application/octet-stream" })
         },
        deleteAuthBlob : {
            ...createConfig({ method: "DELETE", auth: token, acceptType: "application/octet-stream" })
        },
        deleteCookiesBlob : {
            ...createConfig({ method: "DELETE", credentials: HTTPCredentials.INCLUDE, acceptType: "application/octet-stream" })
        },
    }

    const preset = presets[type];


    return deepFreezeConfig(preset);
}


export function denchPresetRunner<T>(config : DenchConfig) : DenchRunner<T>{
    return {
        toResponse : () => runfetch<T>(config),
        toJson : () => toJson<T>(config),
        toObject : () => toObject<T>(config),
        toFormData : () => toFormData<T>(config)
     }
}
