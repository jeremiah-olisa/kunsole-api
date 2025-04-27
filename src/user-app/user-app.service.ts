import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { TokenGenerator } from 'src/common/utils/token-generator';
import { CacheService } from 'src/cache/services/cache.service';
import { MailService } from 'src/mail/services/mail.service';
import { IUserAppInvite } from './interfaces/user-app.interface';
import { UserService } from 'src/user/user.service';
import { AppService } from 'src/app/app.service';
import { UserAppInviteMailable } from './mails/mailable/user-app-invite.mailable';
import { UserAppInviteAcceptedMailable } from './mails/mailable/user-app-invite-accepted.mailable';

@Injectable()
export class UserAppService {
  private readonly INVITATION_PREFIX = 'user-invite:';
  private readonly INVITATION_EMAIL_PREFIX = 'user-invite-email:';
  private readonly INVITATION_TTL = 48 * 60 * 60; // 48 hours in seconds

  constructor(
    private readonly userAppRepository: UserAppRepository,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailService,
  ) { }

  private generateInvitationToken(): string {
    return TokenGenerator.generateToken();
  }

  private generateCacheKey(token: string): string {
    return `${this.INVITATION_PREFIX}${token}`;
  }

  private generateEmailSetKey(email: string): string {
    return `${this.INVITATION_EMAIL_PREFIX}${email.toLowerCase()}`;
  }

  async inviteUser(
    email: string,
    appId: string,
    role: AppUserRole,
    invitedByUserId: string,
  ): Promise<void> {
    // Check if user exists
    const existingUser = await this.userService.findUserByEmail(email);

    // Check if the invited user is the same as the inviter
    if (existingUser && (existingUser?.userKey.toLowerCase() == invitedByUserId.toLowerCase())) {
      throw new ConflictException('You cannot invite yourself');
    }


    if (existingUser) {
      // Check if user already has access
      const existingAccess = await this.userAppRepository.userHasAccessToApp(
        existingUser.id,
        appId
      );
      if (existingAccess) {
        throw new ConflictException('User already has access to this app');
      }
    }

    // Create invitation
    const token = this.generateInvitationToken();
    const expiresAt = new Date(Date.now() + this.INVITATION_TTL * 1000);

    // Store invitation in cache
    const invitation: IUserAppInvite = {
      appName: await this.appService.getAppNameById(appId),
      email,
      appId,
      invitedBy: await this.userService.getUserNameById(invitedByUserId),
      invitedByUserId,
      role,
      token,
      expiresAt,
    };

    const cacheKey = this.generateCacheKey(token);

    // Store the invitation and maintain email index
    await Promise.all([
      this.cacheService.set(cacheKey, invitation, this.INVITATION_TTL),
      this.addTokenToEmailIndex(email, token),
    ]);

    // Send invitation email
    await this.mailService.send(new UserAppInviteMailable(invitation));
  }

  private async addTokenToEmailIndex(email: string, token: string): Promise<void> {
    const emailSetKey = this.generateEmailSetKey(email);
    const existingTokens = await this.cacheService.get<string[]>(emailSetKey) || [];
    await this.cacheService.set(
      emailSetKey,
      [...new Set([...existingTokens, token])], // Ensure uniqueness
      this.INVITATION_TTL
    );
  }

  private async removeTokenFromEmailIndex(email: string, token: string): Promise<void> {
    const emailSetKey = this.generateEmailSetKey(email);
    const existingTokens = await this.cacheService.get<string[]>(emailSetKey) || [];
    const updatedTokens = existingTokens.filter(t => t !== token);

    if (updatedTokens.length > 0) {
      await this.cacheService.set(emailSetKey, updatedTokens, this.INVITATION_TTL);
    } else {
      await this.cacheService.del(emailSetKey);
    }
  }

  async acceptInvitation(token: string, userId: string): Promise<void> {
    const cacheKey = this.generateCacheKey(token);
    const invitation = await this.cacheService.get<IUserAppInvite>(cacheKey);

    if (!invitation) {
      throw new ForbiddenException('Invalid or expired invitation');
    }

    if (new Date() > invitation.expiresAt) {
      await this.cleanupInvitation(invitation.email, token);
      throw new ForbiddenException('Invitation has expired');
    }

    // Verify user matches invitation
    const user = await this.userService.findUserByUserKey(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ForbiddenException('This invitation is not for your account');
    }

    // Check for existing access
    const existingAccess = await this.userAppRepository.userHasAccessToApp(
      userId,
      invitation.appId
    );

    if (existingAccess) {
      await this.cleanupInvitation(invitation.email, token);
      throw new ConflictException('You already have access to this app');
    }

    // Create access
    await this.create({
      appId: invitation.appId,
      userId,
      role: invitation.role,
    });

    const inviter = await this.userService.findUserByUserKey(invitation.invitedBy);

    if (inviter)
      await this.mailService.send(new UserAppInviteAcceptedMailable(
        inviter.email,
        invitation.email,
        invitation.appName,
        invitation.role
      ));
    // Cleanup
    await this.cleanupInvitation(invitation.email, token);
  }

  async declineInvitation(token: string, userId: string): Promise<void> {
    const cacheKey = this.generateCacheKey(token);
    const invitation = await this.cacheService.get<IUserAppInvite>(cacheKey);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Verify user matches invitation
    const user = await this.userService.findUserByUserKey(userId);
    if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ForbiddenException('This invitation is not for your account');
    }

    await this.cleanupInvitation(invitation.email, token);
  }

  private async cleanupInvitation(email: string, token: string): Promise<void> {
    const cacheKey = this.generateCacheKey(token);
    await Promise.all([
      this.cacheService.del(cacheKey),
      this.removeTokenFromEmailIndex(email, token),
    ]);
  }

  async getPendingInvitations(email: string): Promise<IUserAppInvite[]> {
    const emailSetKey = this.generateEmailSetKey(email);
    const tokens = await this.cacheService.get<string[]>(emailSetKey) || [];

    const invitations = await Promise.all(
      tokens.map(async token => {
        const cacheKey = this.generateCacheKey(token);
        return this.cacheService.get<IUserAppInvite>(cacheKey);
      })
    );

    // Filter out invalid/expired invitations
    const validInvitations = invitations.filter(
      (inv): inv is IUserAppInvite =>
        inv !== null && new Date() < inv.expiresAt
    );

    // Clean up expired invitations if found
    if (validInvitations.length !== invitations.length) {
      await this.cleanupExpiredInvitations(email, tokens, validInvitations);
    }

    return validInvitations;
  }

  private async cleanupExpiredInvitations(
    email: string,
    allTokens: string[],
    validInvitations: IUserAppInvite[]
  ): Promise<void> {
    const validTokens = validInvitations.map(i => i.token);
    const expiredTokens = allTokens.filter(token => !validTokens.includes(token));

    // Clean up expired tokens from email index
    const emailSetKey = this.generateEmailSetKey(email);
    await this.cacheService.set(emailSetKey, validTokens, this.INVITATION_TTL);

    // Clean up expired invitation cache entries
    await Promise.all(
      expiredTokens.map(token =>
        this.cacheService.del(this.generateCacheKey(token))
      )
    );
  }

  async create(
    createDto: CreateUserAppDto,
    tx?: PrismaClientTransaction,
  ) {
    const userApp = await this.userAppRepository.createUserApp(createDto, tx);
  }

  async findAllByUser(
    userId: string,
    pagination?: IKeysetPaginationParams,
  ): Promise<IPaginatedResult<UserAppResponseDto>> {
    const { data, ...paginationObj } = await this.userAppRepository.getUserApps(userId, pagination);
    
    return {
      data: data.map(this.toResponseDto),
      ...paginationObj,
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
