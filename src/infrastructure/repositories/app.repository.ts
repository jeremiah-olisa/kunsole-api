import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAppRepository } from '../../domain/interfaces/app.repository.interface';
import { App } from './../../infrastructure/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AppWithPlanEntries } from '../../domain/entities/app.entity';
import { Prisma } from '../prisma/client';

@Injectable()
export class AppRepository implements IAppRepository {
  constructor(private readonly prisma: PrismaService) { }
  findByPublicKey(publicKey: string): Promise<App> {
    throw new Error('Method not implemented.');
  }
  update(appId: string, data: Partial<App>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async validateAppApiKey(key: string): Promise<AppWithPlanEntries | null> {
    const app = await this.prisma.app.findFirst({
      where: { apiKey: key, isActive: true },
      select: {
        id: true,
        name: true,
        plan: { select: { maxEntries: true } },
      },
    });

    return app;
  }

  async validateAppApiKeyOrThrow(key: string): Promise<AppWithPlanEntries> {
    return await this.prisma.app.findFirstOrThrow({
      where: { apiKey: key, isActive: true },
      select: {
        id: true,
        name: true,
        plan: { select: { maxEntries: true } },
      },
    });
  }

  async isApiKeyValid(key: string): Promise<boolean> {
    const app = await this.prisma.app.count({
      where: { apiKey: key, isActive: true },
    });

    return app > 0;
  }

  async createApp(data: Prisma.XOR<Prisma.AppCreateInput, Prisma.AppUncheckedCreateInput>): Promise<App> {
    return this.prisma.app.create({
      data
    });
  }

  async findById(id: string): Promise<App | null> {
    return this.prisma.app.findUnique({
      where: { id },
      include: { plan: true },
    });
  }
}
