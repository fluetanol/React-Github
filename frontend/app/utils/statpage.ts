import type {
    DevelopStatsNode,
    GithubCommitTimeRepositoryNode,
    GithubLanguageRepositoryNode,
    GithubProjectTopicsNode,
    GithubRepoCommonResponse,
    ProjectLiveRateNode,
} from "~/types/page/statpage";

const languageColors: Record<string, string> = {
    TypeScript: "bg-[#3178c6]",
    JavaScript: "bg-[#e5c743]",
    Python: "bg-[#4f8f65]",
    "C#": "bg-[#8b5cf6]",
    Java: "bg-[#dc6b35]",
    CSS: "bg-[#7952b3]",
    HTML: "bg-[#e34c26]",
    Other: "bg-gray-400",
};

const projectCategoryKeywords = {
    Frontend: ["frontend", "front-end", "react", "vue", "angular", "svelte", "ui", "css", "web"],
    Backend: ["backend", "back-end", "api", "server", "express", "nestjs", "spring", "django", "fastapi"],
    Game: ["game", "unity", "unreal", "godot"],
    AI: ["ai", "ml", "machine-learning", "deep-learning", "llm", "openai"],
    DevOps: ["devops", "docker", "kubernetes", "k8s", "terraform", "cloud", "ci-cd"],
} as const;

const developerLanguageWeights: Record<string, Record<string, number>> = {
    TypeScript: { Frontend: 2, Backend: 1 },
    JavaScript: { Frontend: 2, Backend: 1 },
    CSS: { Frontend: 3 },
    HTML: { Frontend: 3 },
    Vue: { Frontend: 3 },
    Python: { Backend: 1, AI: 2 },
    Java: { Backend: 3 },
    Kotlin: { Backend: 2 },
    Go: { Backend: 2, DevOps: 1 },
    Rust: { Backend: 2 },
    "C#": { Backend: 1, Game: 2 },
    "C++": { Game: 2 },
    HCL: { DevOps: 3 },
    Dockerfile: { DevOps: 3 },
};

export interface LanguageStat {
    name: string;
    percent: number;
    size: number;
    color: string;
}

export interface CommitTimeStat {
    label: string;
    count: number;
    percent: number;
}

export interface WeekdayStat {
    label: string;
    count: number;
    heightPercent: number;
}

export interface CategoryStat {
    name: string;
    count: number;
    percent: number;
}

export interface DeveloperProfileStat {
    name: string;
    percent: number;
}

export interface DeveloperTrait {
    title: string;
    detail: string;
}

export type ProjectStatus = "Active" | "Idle" | "Dormant" | "Archived";

export interface ProjectHealthItem extends ProjectLiveRateNode {
    status: ProjectStatus;
    daysSincePush: number;
    updatedLabel: string;
}

export interface ProjectHealthStats {
    total: number;
    active: number;
    idle: number;
    dormant: number;
    archived: number;
    forks: number;
    projects: ProjectHealthItem[];
}

const getNodes = <T>(response?: GithubRepoCommonResponse<T>) =>
    response?.user?.repositories?.nodes ?? [];

const roundPercent = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 1000) / 10 : 0;

export function calculateLanguageStats(response?: GithubRepoCommonResponse<GithubLanguageRepositoryNode>): LanguageStat[] {
    const sizes = new Map<string, number>();

    getNodes(response).forEach((repository) => {
        repository.languages.edges.forEach(({ node, size }) => {
            sizes.set(node.name, (sizes.get(node.name) ?? 0) + size);
        });
    });

    const sorted = [...sizes.entries()].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((sum, [, size]) => sum + size, 0);
    const top = sorted.slice(0, 5);
    const otherSize = sorted.slice(5).reduce((sum, [, size]) => sum + size, 0);
    const entries = otherSize > 0 ? [...top, ["Other", otherSize] as [string, number]] : top;

    return entries.map(([name, size]) => ({
        name,
        size,
        percent: roundPercent(size, total),
        color: languageColors[name] ?? "bg-github-light",
    }));
}

export function calculateCommitStats(response?: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode>) {
    const dates = getNodes(response).flatMap((repository) =>
        repository.defaultBranchRef?.target.history.nodes
            .map(({ committedDate }) => new Date(committedDate))
            .filter((date) => !Number.isNaN(date.getTime())) ?? []
    );

    const timeBuckets = [
        { label: "Dawn", count: 0 },
        { label: "Morning", count: 0 },
        { label: "Afternoon", count: 0 },
        { label: "Night", count: 0 },
    ];
    const weekdays = [
        { label: "Mon", count: 0 },
        { label: "Tue", count: 0 },
        { label: "Wed", count: 0 },
        { label: "Thu", count: 0 },
        { label: "Fri", count: 0 },
        { label: "Sat", count: 0 },
        { label: "Sun", count: 0 },
    ];
    const hours = Array.from({ length: 24 }, () => 0);

    dates.forEach((date) => {
        const hour = date.getHours();
        const day = date.getDay();
        hours[hour] += 1;
        timeBuckets[hour < 6 ? 0 : hour < 12 ? 1 : hour < 18 ? 2 : 3].count += 1;
        weekdays[day === 0 ? 6 : day - 1].count += 1;
    });

    const peakHour = hours.reduce((best, count, hour) => count > hours[best] ? hour : best, 0);
    const maxWeekday = Math.max(...weekdays.map(({ count }) => count), 1);

    return {
        total: dates.length,
        peakHour,
        weekendPercent: roundPercent(weekdays[5].count + weekdays[6].count, dates.length),
        timeBuckets: timeBuckets.map(({ label, count }) => ({
            label,
            count,
            percent: roundPercent(count, dates.length),
        })),
        weekdays: weekdays.map(({ label, count }) => ({
            label,
            count,
            heightPercent: Math.max(5, Math.round((count / maxWeekday) * 100)),
        })),
    };
}




function findProjectCategory(values: string[]) {
    const normalized = values.map((value) => value.toLowerCase());

    for (const [category, keywords] of Object.entries(projectCategoryKeywords)) {
        if (keywords.some((keyword) => normalized.some((value) => value.includes(keyword)))) {
            return category;
        }
    }

    return "Other";
}

export function calculateProjectCategories(response?: GithubRepoCommonResponse<GithubProjectTopicsNode>): CategoryStat[] {
    const counts = new Map<string, number>();
    const repositories = getNodes(response);

    repositories.forEach((repository) => {
        const topics = repository.repositoryTopics.nodes.map(({ topic }) => topic.name);
        const category = findProjectCategory([repository.name, ...topics]);
        counts.set(category, (counts.get(category) ?? 0) + 1);
    });

    return [...counts.entries()]
        .map(([name, count]) => ({ name, count, percent: roundPercent(count, repositories.length) }))
        .sort((a, b) => b.count - a.count);
}

export function calculateDeveloperProfile(response?: GithubRepoCommonResponse<DevelopStatsNode>) {
    const repositories = getNodes(response);
    const scores = new Map<string, number>();
    const commitDates: Date[] = [];

    repositories.forEach((repository) => {
        const languages = repository.languages.edges.map(({ node }) => node.name);
        const topics = repository.repositoryTopics.nodes.map(({ topic }) => topic.name);

        languages.forEach((language) => {
            Object.entries(developerLanguageWeights[language] ?? {}).forEach(([profile, weight]) => {
                scores.set(profile, (scores.get(profile) ?? 0) + weight);
            });
        });

        const topicCategory = findProjectCategory(topics);
        if (topicCategory !== "Other") {
            scores.set(topicCategory, (scores.get(topicCategory) ?? 0) + 3);
        }

        repository.defaultBranchRef?.target.history.nodes.forEach(({ committedDate }) => {
            const date = new Date(committedDate);
            if (!Number.isNaN(date.getTime())) commitDates.push(date);
        });
    });

    const totalScore = [...scores.values()].reduce((sum, score) => sum + score, 0);
    const profiles: DeveloperProfileStat[] = [...scores.entries()]
        .map(([name, score]) => ({ name: `${name} Engineer`, percent: roundPercent(score, totalScore) }))
        .sort((a, b) => b.percent - a.percent);

    if (commitDates.length === 0) {
        return { profiles, traits: [] };
    }

    const commitStats = calculateCommitStatsFromDates(commitDates);
    const traits: DeveloperTrait[] = [];

    if (commitStats.nightPercent >= 35) {
        traits.push({ title: "Night Owl Developer", detail: `Most active around ${formatHour(commitStats.peakHour)}` });
    } else if (commitStats.morningPercent >= 35) {
        traits.push({ title: "Early Builder", detail: `Most active around ${formatHour(commitStats.peakHour)}` });
    } else {
        traits.push({ title: "Balanced Builder", detail: `Peak activity around ${formatHour(commitStats.peakHour)}` });
    }

    traits.push(
        commitStats.weekendPercent >= 30
            ? { title: "Weekend Builder", detail: `${commitStats.weekendPercent}% of commits occur on weekends` }
            : { title: "Weekday Focused", detail: `${100 - commitStats.weekendPercent}% of commits occur on weekdays` }
    );

    return { profiles, traits };
}

function calculateCommitStatsFromDates(dates: Date[]) {
    let night = 0;
    let morning = 0;
    let weekend = 0;
    const hours = Array.from({ length: 24 }, () => 0);

    dates.forEach((date) => {
        const hour = date.getHours();
        hours[hour] += 1;
        if (hour >= 18 || hour < 6) night += 1;
        if (hour >= 6 && hour < 12) morning += 1;
        if (date.getDay() === 0 || date.getDay() === 6) weekend += 1;
    });

    return {
        peakHour: hours.reduce((best, count, hour) => count > hours[best] ? hour : best, 0),
        nightPercent: roundPercent(night, dates.length),
        morningPercent: roundPercent(morning, dates.length),
        weekendPercent: roundPercent(weekend, dates.length),
    };
}

export function calculateProjectHealth(
    response?: GithubRepoCommonResponse<ProjectLiveRateNode>,
    now = new Date(),
): ProjectHealthStats {
    const projects = getNodes(response)
        .map((project): ProjectHealthItem => {
            const lastActivity = new Date(project.pushedAt ?? project.updatedAt);
            const daysSincePush = Math.max(0, Math.floor((now.getTime() - lastActivity.getTime()) / 86_400_000));
            const status: ProjectStatus = project.isArchived
                ? "Archived"
                : daysSincePush <= 30
                    ? "Active"
                    : daysSincePush > 180
                        ? "Dormant"
                        : "Idle";

            return {
                ...project,
                status,
                daysSincePush,
                updatedLabel: formatRelativeDays(daysSincePush),
            };
        })
        .sort((a, b) => a.daysSincePush - b.daysSincePush);

    return {
        total: projects.length,
        active: projects.filter(({ status }) => status === "Active").length,
        idle: projects.filter(({ status }) => status === "Idle").length,
        dormant: projects.filter(({ status }) => status === "Dormant").length,
        archived: projects.filter(({ status }) => status === "Archived").length,
        forks: projects.filter(({ isFork }) => isFork).length,
        projects,
    };
}

export function formatHour(hour: number) {
    return `${String(hour).padStart(2, "0")}:00`;
}

function formatRelativeDays(days: number) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}
