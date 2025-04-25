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
    const { emails, photos, displayName, id } = profile;
    const user = {
      email: emails?.[0]?.value || `${id}@github.com`,
      fullName: displayName || profile.username,
      providerId: id,
      profileImage: photos?.[0]?.value,
    };
    return this.authService.validateOAuthUser(user, 'GITHUB');
  }
}
