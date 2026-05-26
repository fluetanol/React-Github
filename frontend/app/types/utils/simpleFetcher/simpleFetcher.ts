import type { HTTPCredentials } from "../../../dench/types/denchEnum";

export interface FetchFactoryConfig {
    baseURL: string,
    headers?: Record<string, string>,
    credentials?: HTTPCredentials,
    timeout?: number,

    get: <T>(api: string) => Promise<T|null>,
    post: <T>(api: string, data: any) => Promise<T|null>,
    put: <T>(api: string, data: any) => Promise<T|null>,
    delete: <T>(api: string) => Promise<T|null>,
}
