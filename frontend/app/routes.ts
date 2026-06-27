import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    //index는 기본 라우트("/")로 사용될 컴포넌트를 지정할 때 사용
    index("routes/home.tsx"),
    
    layout("components/layout/DashboardLayout.tsx", [
        route("dashboard", "routes/dashboard.tsx"),
        route("testpage", "routes/testpage.tsx"),
        route("statpage", "routes/statpage.tsx")
    ]),
    //route("testpage", "routes/testpage.tsx"),

    route("auth/github/callback", "routes/auth/callback.tsx"),

] satisfies RouteConfig;
