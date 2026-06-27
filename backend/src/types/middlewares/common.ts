/**
 * GitHub API에서 받아오는 사용자 정보의 타입을 정의하는 인터페이스입니다.
 * Github API상 모든 응답은 공통적으로 data 필드 안에 담깁니다
 * 
 */
export interface GithubCommonResponse<T> {
    data: T
}
