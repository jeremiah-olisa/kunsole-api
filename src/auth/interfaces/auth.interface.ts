export interface OAuthUserPayload {
  email: string;
  fullName: string;
  providerId: string;
  profileImage?: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface IGoogleOauthResponse {
  id: string;
  displayName: string;
  name: IGoogleOauthName;
  emails: IGoogleOauthEmail[];
  photos: IGoogleOauthPhoto[];
  provider: string;
  _raw: string;
  _json: IGoogleOauthJson;
}

export interface IGoogleOauthName {
  familyName: string;
  givenName: string;
}

export interface IGoogleOauthEmail {
  value: string;
  verified: boolean;
}

export interface IGoogleOauthPhoto {
  value: string;
}

export interface IGoogleOauthJson {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface IGithubOAuthResponse {
  id: string;
  nodeId: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: IGithubOAuthPhoto[];
  provider: string;
  _raw: string;
  _json: IGithubOAuthUserJson;
  emails: IGithubOAuthEmail[];
}

export interface IGithubOAuthPhoto {
  value: string;
}
export interface IGithubOAuthEmail {
  value: string;
}
export interface IGithubOAuthUserJson {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  notification_email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
