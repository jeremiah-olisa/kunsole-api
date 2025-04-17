// src/auth/guards/app-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AppService } from '../../application/services/app.service';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(private readonly appService: AppService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const publicKey = request.headers['x-public-key'];
    const secretKey = request.headers['authorization']?.replace('Bearer ', '');

    if (!publicKey || !secretKey) return false;

    try {
      request.app = await this.appService.validateApp(publicKey, secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}