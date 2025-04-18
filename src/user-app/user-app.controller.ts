import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';
import { SwaggerAuthenticated } from 'src/auth/decorators/swagger-auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAppService } from './user-app.service';
import { CreateUserAppDto } from './dtos/create-user-app.dto';
import { UpdateUserAppDto } from './dtos/update-user-app.dto';
import { PaginatedUserAppResponseDto, UserAppResponseDto } from './dtos/user-app-response.dto';
import { IKeysetPaginationParams } from 'src/common/interfaces/pagination.interface';
import { KeysetPaginationParams, PaginatedResult } from 'src/common/entities/pagination.entity';
import { Request } from 'express';
import { UserEntity } from 'src/auth/entities/user.entity';

@ApiTags('User App Relationships')
@Controller('user-apps')
@SwaggerAuthenticated()
@UseGuards(JwtAuthGuard)
export class UserAppController {
    constructor(private readonly userAppService: UserAppService) { }

    @Post()
    @ApiOperation({ summary: 'Create user-app relationship' })
    @ApiBody({ type: CreateUserAppDto })
    @ApiResponse({
        status: 201,
        description: 'Relationship created',
        type: UserAppResponseDto,
    })
    async create(
        @Body() createDto: CreateUserAppDto,
    ): Promise<UserAppResponseDto> {
        return this.userAppService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'List user-app relationships' })
    @ApiQuery({
        name: 'KeysetPaginationParams',
        type: KeysetPaginationParams,
        required: false,
        description: 'Keyset pagination query params',
    })
    @ApiResponse({
        status: 200,
        description: 'List of relationships',
        type: PaginatedUserAppResponseDto,
    })
    async findAll(
        @Query() pagination: IKeysetPaginationParams,
        @Req() req: Request,
    ): Promise<PaginatedResult<UserAppResponseDto>> {
        const user = new UserEntity(req.user);

        return this.userAppService.findAllByUser(user.getUserId(), pagination);
    }

    @Patch(':appId/users/:userId')
    @ApiOperation({ summary: 'Update user role in app' })
    @ApiParam({ name: 'appId', description: 'Application ID' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiBody({ type: UpdateUserAppDto })
    @ApiResponse({
        status: 200,
        description: 'Role updated',
        type: UserAppResponseDto,
    })
    async updateRole(
        @Param('appId') appId: string,
        @Param('userId') userId: string,
        @Body() updateDto: UpdateUserAppDto,
    ): Promise<UserAppResponseDto> {
        return this.userAppService.updateRole(appId, userId, updateDto);
    }

    @Delete(':appId/users/:userId')
    @ApiOperation({ summary: 'Remove user from app' })
    @ApiParam({ name: 'appId', description: 'Application ID' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User removed from app' })
    async remove(
        @Param('appId') appId: string,
        @Param('userId') userId: string,
    ): Promise<void> {
        await this.userAppService.remove(appId, userId);
    }
}