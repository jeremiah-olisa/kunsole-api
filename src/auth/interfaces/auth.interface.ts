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