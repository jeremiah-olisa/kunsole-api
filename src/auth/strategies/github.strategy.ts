import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { IGithubOAuthResponse } from '../interfaces/auth.interface';
import { AuthProvider } from '@prisma/client';

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
    profile: IGithubOAuthResponse,
  ): Promise<any> {
    const {
      emails = [],
      photos = [],
      displayName = '',
      id = '',
      username,
      _json: { avatar_url },
    } = profile;
    const user = {
      email: emails?.[0]?.value || `${id}@github.com`,
      fullName: displayName || username,
      providerId: id,
      profileImage: photos?.[0]?.value ?? avatar_url,
    };

    return this.authService.validateOAuthUser(user, AuthProvider.GITHUB);
  }
}
