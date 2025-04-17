import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAppRepository } from '../../domain/interfaces/app.repository.interface';
import { App } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AppWithPlanEntries } from '../../domain/entities/app.entity';

@Injectable()
export class AppRepository implements IAppRepository {
  constructor(private readonly prisma: PrismaService) { }

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

  async createApp(name: string, planId: string): Promise<App> {
    return this.prisma.app.create({
      data: {
        name,
        apiKey: `app_${uuidv4()}`,
        planId,
      },
    });
  }

  async findById(id: string): Promise<App | null> {
    return this.prisma.app.findUnique({
      where: { id },
      include: { plan: true },
    });
  }
}
