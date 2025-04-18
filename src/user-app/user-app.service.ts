import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAppRepository } from './repositories/user-app.repository';
import { CreateUserAppDto } from './dtos/create-user-app.dto';
import { UpdateUserAppDto } from './dtos/update-user-app.dto';
import { UserAppResponseDto } from './dtos/user-app-response.dto';
import { IKeysetPaginationParams, IPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { PrismaClientTransaction } from 'src/common/types';

@Injectable()
export class UserAppService {
    constructor(private readonly userAppRepository: UserAppRepository) { }

    async create(createDto: CreateUserAppDto, tx?: PrismaClientTransaction): Promise<UserAppResponseDto> {
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
        const userApp = await this.userAppRepository.findByUserAndApp(appId, userId);

        if (!userApp) throw new NotFoundException('UserApp not found');

        return userApp
    }

    async userHasAccessToApp(appId: string, userId: string) {
        const userApp = await this.userAppRepository.userHasAccessToApp(appId, userId);
        return userApp
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