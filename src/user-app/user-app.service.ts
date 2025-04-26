import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserAppRepository } from './repositories/user-app.repository';
import { CreateUserAppDto } from './dtos/create-user-app.dto';
import { UpdateUserAppDto } from './dtos/update-user-app.dto';
import { UserAppResponseDto } from './dtos/user-app-response.dto';
import {
  IKeysetPaginationParams,
  IPaginatedResult,
} from 'src/common/interfaces/pagination.interface';
import { PrismaClientTransaction } from 'src/common/types';
import { AppUserRole } from '@prisma/client';
import { UserRepository } from 'src/user/repositories/user.repository';
import { TokenGenerator } from 'src/common/utils/token-generator';
import { CacheService } from 'src/cache/services/cache.service';
import { MailService } from 'src/mail/services/mail.service';
import { IUserAppInvite } from './interfaces/user-app.interface';
import { AppRepository } from 'src/app/repositories/app.repository';
import { UserService } from 'src/user/user.service';
import { AppService } from 'src/app/app.service';

@Injectable()
export class UserAppService {
  private readonly INVITATION_PREFIX = 'user-invite:';
  private readonly INVITATION_TTL = 48 * 60 * 60; // 48 hours in seconds

  constructor(
    private readonly userAppRepository: UserAppRepository,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailService,
  ) { }

  // Send invitation to a user
  async inviteUser(
    email: string,
    appId: string,
    role: AppUserRole,
    invitedByUserId: string,
  ): Promise<void> {
    // Check if user already has access to the app
    const existingUserId = await this.userService.getUserIdByEmail(email);

    if (existingUserId == invitedByUserId)
      throw new ConflictException('You cannot invite yourself');

    const existingAccess = await this.userAppRepository.userHasAccessToApp(existingUserId, appId);
    
    if (existingAccess) {
      throw new ConflictException('User already has access to this app');
    }

    // Create invitation token and store in cache
    const token = TokenGenerator.generateToken();
    const expiresAt = new Date(Date.now() + this.INVITATION_TTL * 1000);

    const invitation: IUserAppInvite = {
      email,
      appId,
      role,
      invitedBy: invitedByUserId,
      expiresAt,
    };

    await this.cacheService.set(
      `${this.INVITATION_PREFIX}${token}`,
      invitation,
      this.INVITATION_TTL,
    );

    // Send invitation email
    const app = await this.appService.findAppById(appId);
    const inviter = await this.userService.getUserNameById(invitedByUserId);

    // {
    //   to: email,
    //   appName: app.name,
    //   inviterName: inviter.fullName,
    //   role,
    //   token,
    //   expiresAt,
    // }
    await this.mailService.send();

  }

  async create(
    createDto: CreateUserAppDto,
    tx?: PrismaClientTransaction,
  ): Promise<UserAppResponseDto> {
    const userApp = await this.userAppRepository.createUserApp(createDto, tx);
    return this.toResponseDto(userApp);
  }

  async findAllByUser(
    userId: string,
    pagination?: IKeysetPaginationParams,
  ): Promise<IPaginatedResult<UserAppResponseDto>> {
    const result = await this.userAppRepository.getUserApps(userId, pagination);
    return {
      data: result.data.map(this.toResponseDto),
      nextCursor: result.nextCursor,
      prevCursor: result.prevCursor,
      total: result.total,
    };
  }

  async updateRole(
    appId: string,
    userId: string,
    updateDto: UpdateUserAppDto,
  ): Promise<UserAppResponseDto> {
    const userApp = await this.userAppRepository.updateUserRole(
      appId,
      userId,
      updateDto.role,
    );
    return this.toResponseDto(userApp);
  }

  async remove(appId: string, userId: string): Promise<void> {
    await this.userAppRepository.removeUserFromApp(appId, userId);
  }

  async findByUserAndApp(appId: string, userId: string) {
    const userApp = await this.userAppRepository.findByUserAndApp(
      appId,
      userId,
    );

    if (!userApp) throw new NotFoundException('UserApp not found');

    return userApp;
  }

  async userHasAccessToApp(appId: string, userId: string) {
    const userApp = await this.userAppRepository.userHasAccessToApp(
      appId,
      userId,
    );
    return userApp;
  }

  private toResponseDto(userApp: any): UserAppResponseDto {
    return {
      id: userApp.id,
      appId: userApp.appId,
      userId: userApp.userId,
      role: userApp.role,
      createdAt: userApp.createdAt,
      updatedAt: userApp.updatedAt,
    };
  }
}
