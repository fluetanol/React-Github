/**
 *  Github oauth 공식 규격 파라미터
 */
export interface GithubOAuthParams {
  client_id: string;
  redirect_uri: string;
  scope?: string[];
  state? : string;
}

/**
 * Github oauth scope 제한 파라미터
 * 프로젝트 내에선 GithubScope 타입으로 제한하여 사용하도록 권장합니다.
 */
export interface StrictGithubOAuthParams  extends Omit<GithubOAuthParams, 'state'> {
    scope : GitHubScope[]
}
// strict 타입이기 때문에 Record로 undefined가 불가능하게 강제시킴
// state는 CSRF 공격 방지용으로 사용되지만, 현재 구현에서는 생략시켰음. 
// 필요에 따라 추가할 수 있음


/** 
 * github oauth scope 타입
 */
export type GitHubScope = 'user' | 'repo' | 'gist' | 'read:org';