// src/auth/strategies/github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const { username, photos, emails } = profile;

        return this.authService.validateOAuthUser({
            email: emails?.[0]?.value || `${username}@github.com`,
            username,
            picture: photos?.[0]?.value,
            refreshToken,
            provider: 'GITHUB',
            firstName: username,
        });
    }
}