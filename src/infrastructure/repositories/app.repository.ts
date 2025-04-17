import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AppWithPlan, IAppRepository } from '../../domain/interfaces/app.repository.interface';
import { App, Plan } from './../../infrastructure/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AppWithPlanEntries } from '../../domain/entities/app.entity';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class AppRepository implements IAppRepository {
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly prisma: PrismaService) { }
  async rotateKeys(appId: string): Promise<{ publicKey: string; secretKey: string }> {
    // Generate new key pair
    const keyPair = {
      publicKey: crypto.randomBytes(32).toString('hex'),
      secretKey: crypto.randomBytes(64).toString('hex')
    };

    // Hash the new secret key
    const hashedSecretKey = await bcrypt.hash(keyPair.secretKey, this.SALT_ROUNDS);

    // Update the app with new keys
    await this.prisma.app.update({
      where: { id: appId },
      data: {
        publicKey: keyPair.publicKey,
        secretKey: hashedSecretKey,
        updatedAt: new Date()
      }
    });

    // Return new keys (must be securely stored by caller)
    return keyPair;
  }

  async deactivateApp(appId: string): Promise<App> {
    return this.prisma.app.update({
      where: { id: appId },
      data: {
        isActive: false,
        updatedAt: new Date(),
        // Optional: Add deactivation reason or timestamp
        // deactivatedAt: new Date()
      },
      include: { plan: true } // Return full app with plan info
    });
  }

  async activateApp(appId: string): Promise<App> {
    return this.prisma.app.update({
      where: { id: appId },
      data: {
        isActive: true,
        updatedAt: new Date(),
        // Optional: Clear deactivation timestamp
        // deactivatedAt: null
      },
      include: { plan: true } // Return full app with plan info
    });
  }

  async countActiveApps(): Promise<number> {
    return this.prisma.app.count({
      where: {
        isActive: true
        // Optional: Add additional filters
        // createdAt: { gte: startOfMonth }
      }
    });
  }

  async findByPublicKey(publicKey: string): Promise<AppWithPlan | null> {
    return this.prisma.app.findUnique({
      where: { publicKey },
      include: { plan: true },
    });
  }

  async update(appId: string, data: Partial<App>): Promise<App> {
    if (data.secretKey) {
      data.secretKey = await this.hashSecretKey(data.secretKey);
    }
    return this.prisma.app.update({
      where: { id: appId },
      data,
    });
  }

  async validateAppCredentials(publicKey: string, secretKey: string): Promise<AppWithPlan | null> {
    const app = await this.prisma.app.findUnique({
      where: { publicKey },
      include: { plan: true },
    });

    if (!app) return null;

    const isValid = await bcrypt.compare(secretKey, app.secretKey);
    return isValid ? app : null;
  }

  async validateAppCredentialsOrThrow(publicKey: string, secretKey: string): Promise<AppWithPlan> {
    const app = await this.prisma.app.findUniqueOrThrow({
      where: { publicKey },
      include: { plan: true },
    });

    const isValid = await bcrypt.compare(secretKey, app.secretKey);
    if (!isValid) throw new Error('Invalid credentials');

    return app;
  }

  async areCredentialsValid(publicKey: string, secretKey: string): Promise<boolean> {
    const app = await this.prisma.app.findUnique({
      where: { publicKey },
    });

    return app ? bcrypt.compare(secretKey, app.secretKey) : false;
  }

  async createApp(data: {
    name: string;
    planId: string;
  }): Promise<{ app: App; secretKey: string }> {
    const keyPair = await this.generateKeyPair();
    const hashedSecretKey = await this.hashSecretKey(keyPair.secretKey);

    const app = await this.prisma.app.create({
      data: {
        name: data.name,
        planId: data.planId,
        publicKey: keyPair.publicKey,
        secretKey: hashedSecretKey,
      },
    });

    return {
      app,
      secretKey: keyPair.secretKey, // Only returned once!
    };
  }

  async findById(id: string): Promise<AppWithPlan | null> {
    return this.prisma.app.findUnique({
      where: { id },
      include: { plan: true },
    });
  }

  private async generateKeyPair(): Promise<{
    publicKey: string;
    secretKey: string;
  }> {
    return {
      publicKey: crypto.randomBytes(32).toString('hex'),
      secretKey: crypto.randomBytes(64).toString('hex'),
    };
  }

  private async hashSecretKey(secretKey: string): Promise<string> {
    return bcrypt.hash(secretKey, this.SALT_ROUNDS);
  }
}