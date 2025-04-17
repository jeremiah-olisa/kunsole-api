import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAppRepository } from 'src/domain/interfaces/app.repository.interface';
import { PlanService } from './plan.service';
import { AppWithPlanEntries } from 'src/domain/entities/app.entity';
import { IPlanRepository } from 'src/domain/interfaces/plan.repository.interface';
import { KeyPairService } from 'src/infrastructure/security/key-pair.service';
import { App } from 'src/infrastructure/prisma/client';

@Injectable()
export class AppService {
  constructor(
    @Inject('IAppRepository') private readonly appRepository: IAppRepository,
    @Inject('IPlanRepository') private readonly planRepository: IPlanRepository,
    private readonly keyPairService: KeyPairService,
  ) { }


  async createApp(name: string, planId: string) {
    const { publicKey, secretKey, hashedSecretKey } =
      await this.keyPairService.generateKeyPair();

    const app = await this.appRepository.createApp({
      name,
      publicKey,
      plan: { connect: { id: planId } },
      secretKey: hashedSecretKey,
    });

    return { app, secretKey };
  }

  async validateApp(
    publicKey: string,
    secretKey: string,
  ): Promise<App> {
    const app = await this.appRepository.findByPublicKey(publicKey);
    if (!app) throw new Error('App not found');

    const isValid = await this.keyPairService.validateSecretKey(
      secretKey,
      app.secretKey,
    );

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return app;
  }

  async validateAppKey(key: string) {
    const app = await this.appRepository.validateAppApiKey(key);
    if (!app)
      throw new UnauthorizedException('App not found or API Key is invalid');
    return app;
  }

  async rotateKeys(appId: string) {
    const { publicKey, secretKey, hashedSecretKey } =
      await this.keyPairService.generateKeyPair();

    await this.appRepository.update(appId, {
      publicKey,
      secretKey: hashedSecretKey,
    });

    return { secretKey }; // Return new secret key once
  }

  async isApiKeyValid(key: string) {
    return this.appRepository.isApiKeyValid(key);
  }

  async isApiKeyValidOrThrow(key: string) {
    const valid = this.appRepository.isApiKeyValid(key);

    if (!valid)
      throw new UnauthorizedException('App not found or API Key is invalid');

    return true;
  }


}
