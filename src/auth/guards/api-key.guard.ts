import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AppService } from 'src/app/app.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const publicKey = request.headers['x-api-key'] as string;
    const secretKey = request.headers['x-api-secret'] as string;

    console.log({ publicKey, secretKey });

    if (!publicKey || !secretKey) return false;


    const app = await this.authService.validateApiKey(publicKey, secretKey);
    if (!app) return false;

    // Attach the app to the request for use in the controller
    // request['app'] = await this.appService.getAppByPublicKey(publicKey) as any;
    return true;
  }
}
