import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    //index는 기본 라우트("/")로 사용될 컴포넌트를 지정할 때 사용
    index("routes/home.tsx"),
    // route("라우팅경로명", "라우팅할 실제 컴포넌트 파일 경로명"),
    route("dashboard", "routes/dashboard.tsx"),
    route("auth/github/callback", "routes/auth/callback.tsx"),

] satisfies RouteConfig;
