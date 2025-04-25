import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const publicKey = request.headers['x-api-key'] as string;
    const secretKey = request.headers['x-api-secret'] as string;

    if (!publicKey || !secretKey) return false;

    return this.authService.validateApiKey(publicKey, secretKey);
  }
}
