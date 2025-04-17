import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './../../application/services/app.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: AppService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    try {
      const isValid = await this.apiKeyService.isApiKeyValid(apiKey);
      if (!isValid) throw new Error();

      return isValid;
    } catch (error) {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
