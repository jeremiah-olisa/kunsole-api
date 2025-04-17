// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const { name, emails, photos } = profile;

        return this.authService.validateOAuthUser({
            email: emails[0].value,
            username: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
            provider: 'GOOGLE',
            refreshToken,
            firstName: name.givenName,
        });
    }
}