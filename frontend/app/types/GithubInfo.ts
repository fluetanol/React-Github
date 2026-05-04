/**
 * GitHub 사용자 정보를 나타내는 인터페이스입니다.
 * 
 * id : GitHub 사용자 고유 ID
 * login : GitHub 사용자 이름
 * avatar_url : GitHub 사용자 아바타 이미지 URL
 * html_url : GitHub 사용자 프로필 URL
 * name : GitHub 사용자 이름 (실명)
 * company : GitHub 사용자 회사 정보 (null 가능)
 * blog : GitHub 사용자 블로그 URL (null 가능)
 * location : GitHub 사용자 위치 정보 (null 가능)
 * email : GitHub 사용자 이메일 (null 가능)
 * bio : GitHub 사용자 소개 (null 가능)
 * 
 * 이 인터페이스는 GitHub API에서 반환되는 사용자 정보를 기반으로 정의되었습니다.
 * GitHub API 문서 : https://docs.github.com/en/rest/users/users#get-the-authenticated-user
 * 
 */
interface GithubUser{
    id : number;
    login : string;
    avatar_url : string;
    html_url : string;
    name : string;
    company : string | null;
    blog : string | null;
    location : string | null;
    email : string | null;
    bio : string | null;
    followers : number;
    following : number;
}