export enum HTTPHeaders {
    CONTENT_TYPE = "Content-Type",
    AUTHORIZATION = "Authorization",
    ACCEPT = "Accept",
    CACHE_CONTROL = "Cache-Control",
    X_API_KEY = " X-Api-Key"
};

export enum HTTPContentType {
    BASIC = "application/octet-stream",
    JSON = "application/json",
    TEXT = "text/plain",
    HTML = "text/html",
    FORM = "application/x-www-form-urlencoded",
    MULTIPART = "multipart/form-data",
    JPEG = "image/jpeg",
    PNG = "image/png",
    GIF = "image/gif",
    MP4 = "video/mp4",
    PDF = "application/pdf"
}


export enum HTTPCredentials {
    INCLUDE = "include",
    SAME_ORIGIN = "same-origin",
    OMIT = "omit"
}

export enum HTTPCache {
    NO_CACHE = "no-cache",
    NO_STORE = "no-store",
    RELOAD = "reload",
    FORCE_CACHE = "force-cache",
    ONLY_IF_CACHED = "only-if-cached",
    DEFAULT = "default"
}

/**referrerPolicy:
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url" */
export enum HTTPReferrerPolicy {
    NO_REFERRER = "no-referrer",
    NO_REFERRER_WHEN_DOWNGRADE = "no-referrer-when-downgrade",
    ORIGIN = "origin",
    ORIGIN_WHEN_CROSS_ORIGIN = "origin-when-cross-origin",
    SAME_ORIGIN = "same-origin",
    STRICT_ORIGIN = "strict-origin",
    STRICT_ORIGIN_WHEN_CROSS_ORIGIN = "strict-origin-when-cross-origin",
    UNSAFE_URL = "unsafe-url"
}

export enum HTTPRedirect {
    FOLLOW = "follow",
    ERROR = "error",
    MANUAL = "manual"
}

export enum HTTPMode{
    CORS = "cors",
    NO_CORS = "no-cors",
    SAME_ORIGIN = "same-origin",
}