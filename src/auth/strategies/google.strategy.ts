import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { IGoogleOauthResponse } from '../interfaces/auth.interface';
import { AuthProvider } from '@prisma/client';

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
    profile: IGoogleOauthResponse,
  ): Promise<any> {
    const {
      emails = [],
      photos = [],
      name: { familyName = '', givenName = '' },
      id = '',
    } = profile;

    const user = {
      email: emails[0]?.value,
      fullName: `${givenName} ${familyName}`.trim(),
      providerId: id,
      profileImage: photos?.[0]?.value,
    };

    return this.authService.validateOAuthUser(user, AuthProvider.GOOGLE);
  }
}
