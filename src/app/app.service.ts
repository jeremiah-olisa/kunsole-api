import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { $Enums, AppUserRole, Prisma } from '@prisma/client';
import {
  IKeysetPaginationParams,
  IPaginatedResult,
} from './../common/interfaces/pagination.interface';
import { AppRepository } from './repositories/app.repository';
import { AppEntity } from './entities/app.entity/app.entity';
import { CreateAppDto } from './dtos/create-app.dto/create-app.dto';
import { UpdateAppDto } from './dtos/update-app.dto/update-app.dto';
import { UserAppService } from 'src/user-app/user-app.service';
import { PlanService } from 'src/plan/plan.service';
import { PaymentFilters } from 'src/payment/interfaces';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaClientTransaction } from 'src/common/types';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly userAppService: UserAppService,
    private readonly paymentService: PaymentService,
  ) { }

  findAppById(appId: string) {
    return this.appRepository.findById(appId);
  }

  async createApp(
    createAppDto: CreateAppDto,
    userId: string,
    tx?: PrismaClientTransaction
  ): Promise<AppEntity> {
    const publicKey = this.generateKey(16, 'kunsole_pk');
    const secretKey = this.generateKey(32, 'kunsole_sk');
    const hashedSecretKey = await bcrypt.hash(secretKey, 10);

    const app = await this.appRepository.create({
      ...createAppDto,
      publicKey,
      secretKey: hashedSecretKey,
      userApp: {
        create: {
          userId,
          role: AppUserRole.OWNER
        }
      }
    }, tx);

    return new AppEntity({
      ...app,
      secretKey, // Only returned once during creation
    });
  }

  async getAppPayments(
    appId: string,
    userId: string,
    filter: PaymentFilters,
    pagination?: IKeysetPaginationParams,
  ) {
    // Verify user has access to the app
    const hasAccess = await this.userAppService.userHasAccessToApp(
      appId,
      userId,
    );

    if (!hasAccess) {
      throw new UnauthorizedException('User does not have access to this app');
    }

    return this.paymentService.getAppPayments(
      appId,
      {
        ...filter,
        appId,
      },
      pagination,
    );
  }

  async getAppById(id: string, userId: string): Promise<AppEntity> {
    const app = await this.appRepository.findById(id, true);
    if (!app) throw new NotFoundException('App not found');

    const userRole = await this.appRepository.findUserRole(id, userId);
    if (!userRole) throw new ForbiddenException('No access to this app');

    return new AppEntity(app);
  }

  async getUserApps(
    userId: string,
    pagination?: IKeysetPaginationParams,
  ): Promise<IPaginatedResult<AppEntity>> {
    const result = await this.appRepository.findAllByUser(userId, pagination);
    return {
      ...result,
      data: result.data.map((app) => new AppEntity(app)),
    };
  }

  async updateApp(
    id: string,
    updateAppDto: UpdateAppDto,
    userId: string,
  ): Promise<AppEntity> {
    await this.verifyUserAccess(id, userId, [
      AppUserRole.OWNER,
      AppUserRole.ADMIN,
    ]);

    const updatedApp = await this.appRepository.update(id, {
      ...updateAppDto,
      ...(updateAppDto.planId && {
        plan: { connect: { id: updateAppDto.planId } },
      }),
    });

    return new AppEntity(updatedApp);
  }

  async deleteApp(id: string, userId: string): Promise<void> {
    await this.verifyUserAccess(id, userId, [AppUserRole.OWNER]);
    await this.appRepository.delete(id);
  }

  async rotateApiKeys(id: string, userId: string): Promise<AppEntity> {
    await this.verifyUserAccess(id, userId, [AppUserRole.OWNER]);

    const publicKey = this.generateKey(16, 'kunsole_pk');
    const secretKey = this.generateKey(32, 'kunsole_sk');
    const hashedSecretKey = await bcrypt.hash(secretKey, 10);

    const updatedApp = await this.appRepository.update(id, {
      publicKey,
      secretKey: hashedSecretKey,
    });

    return new AppEntity({
      ...updatedApp,
      secretKey, // Only returned once during rotation
    });
  }

  async toggleAppStatus(id: string, userId: string): Promise<AppEntity> {
    await this.verifyUserAccess(id, userId, [
      AppUserRole.OWNER,
      AppUserRole.ADMIN,
    ]);

    const app = await this.appRepository.findById(id);
    if (!app) throw new NotFoundException('App not found');

    const updatedApp = await this.appRepository.updateStatus(id, !app.isActive);
    return new AppEntity(updatedApp);
  }

  private async verifyUserAccess(
    appId: string,
    userId: string,
    allowedRoles: AppUserRole[],
  ): Promise<void> {
    const userRole = await this.appRepository.findUserRole(appId, userId);
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  private generateKey(length: number, prefix: string = 'kunsole'): string {
    return `${prefix}_${crypto.randomBytes(length).toString('hex')}`;
  }
}
