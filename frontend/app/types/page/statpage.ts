
export interface GithubLanguageNode {
    size: number,
    node: { name: string }
}

export interface GithubLanguageRepositoryNode {
    name: string,
    languages: {
        totalSize: number,
        edges: Array<GithubLanguageNode>
    }
}

export interface GihhubCommitTimeHistoryNode {
    committedDate: string
}

export interface GithubCommitTimeRepositoryNode {
    name: string,
    defaultBranchRef: {
        target: {
            history: {
                nodes: Array<GihhubCommitTimeHistoryNode>
            }
        }
    } | null
}

export interface GithubProjectTopicsNode {
    name: string,
    repositoryTopics: {
        nodes: Array<{
            topic: {
                name: string
            }
        }>
    }
}

export interface DevelopStatsNode {
    defaultBranchRef: {
        target: {
            history: {
                nodes: Array<{ committedDate: string }>
            }
        }
    } | null,
    languages: {
        edges: Array<{
            node: { name: string }
        }>
    },
    repositoryTopics: {
        nodes: Array<{
            topic: { name: string }
        }>
    }
}

export interface ProjectLiveRateNode {
    name: string,
    createdAt: string,
    pushedAt: string | null,
    updatedAt: string,
    isArchived: boolean,
    isFork: boolean
}

export interface GithubRepoCommonResponse<T> {
    user: {
        repositories: {
            nodes: Array<T>
        }
    }
}
