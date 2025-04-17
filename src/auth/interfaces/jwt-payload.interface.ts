export interface JwtPayload {
    sub: string; // user ID
    email: string;
    role: string;
    iat?: number; // issued at
    exp?: number; // expiration time
}