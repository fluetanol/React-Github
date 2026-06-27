// Mock values define the visual skeleton until statistics calculations are implemented.
export const mockOverviewStats = [
    { label: "Analyzed repos", value: "20", caption: "Owner repositories" },
    { label: "Recent commits", value: "486", caption: "Default branches" },
    { label: "Active projects", value: "14", caption: "Recently pushed" },
    { label: "Primary stack", value: "TypeScript", caption: "By code volume" },
];

export const mockLanguageStats = [
    { name: "TypeScript", percent: 42, color: "bg-[#3178c6]" },
    { name: "JavaScript", percent: 27, color: "bg-[#e5c743]" },
    { name: "CSS", percent: 16, color: "bg-[#8b5cf6]" },
    { name: "Python", percent: 9, color: "bg-[#4f8f65]" },
    { name: "Other", percent: 6, color: "bg-gray-400" },
];

export const mockCommitActivity = [
    { label: "Mon", value: 36 },
    { label: "Tue", value: 58 },
    { label: "Wed", value: 74 },
    { label: "Thu", value: 91 },
    { label: "Fri", value: 68 },
    { label: "Sat", value: 44 },
    { label: "Sun", value: 25 },
];

export const mockCommitTimes = [
    { label: "Morning", value: 38 },
    { label: "Afternoon", value: 76 },
    { label: "Evening", value: 94 },
    { label: "Late night", value: 52 },
];

export const mockTopics = [
    { name: "react", count: 12 },
    { name: "typescript", count: 10 },
    { name: "api", count: 8 },
    { name: "frontend", count: 7 },
    { name: "nodejs", count: 6 },
    { name: "graphql", count: 4 },
];

export const mockProjectHealth = [
    { name: "React-Github", status: "Active", updated: "2 days ago", type: "Original" },
    { name: "dench-fetch", status: "Active", updated: "5 days ago", type: "Original" },
    { name: "portfolio", status: "Steady", updated: "18 days ago", type: "Original" },
    { name: "study-notes", status: "Paused", updated: "2 months ago", type: "Fork" },
];