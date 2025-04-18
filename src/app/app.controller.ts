import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserEntity } from '../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { IPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { KeysetPaginationParams, PaginatedResult } from 'src/common/entities/pagination.entity';
import { CreateAppDto } from './dtos/create-app.dto/create-app.dto';
import { AppEntity, PaginatedAppResult } from './entities/app.entity/app.entity';
import { UpdateAppDto } from './dtos/update-app.dto/update-app.dto';
import { SwaggerAuthenticated } from 'src/auth/decorators/swagger-auth.decorator';

@ApiTags('Apps Management')
@Controller('apps')
@SwaggerAuthenticated()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new application',
    description: 'Creates a new application and assigns the creator as OWNER. Returns the app with API keys (keys are only shown once).',
  })
  @ApiBody({ type: CreateAppDto })
  @ApiCreatedResponse({
    type: AppEntity,
    description: 'Application created successfully',
  })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(
    @Body() createAppDto: CreateAppDto,
    @Req() req: Request,
  ): Promise<AppEntity> {
    const user = req.user as UserEntity;
    return this.appService.createApp(createAppDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'List user applications',
    description: 'Returns paginated list of applications the user has access to',
  })
  @ApiQuery({
    name: 'KeysetPaginationParams',
    type: KeysetPaginationParams,
    required: false,
    description: 'Keyset pagination query params',
  })
  @ApiOkResponse({
    type: PaginatedAppResult,
    description: 'List of applications',
  })
  async findAll(
    @Req() req: Request,
    @Query() query: KeysetPaginationParams,
  ): Promise<IPaginatedResult<AppEntity>> {
    const user = req.user as UserEntity;
    return this.appService.getUserApps(user.id, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get application details',
    description: 'Returns application details if user has access',
  })
  @ApiParam({
    name: 'id',
    description: 'Application ID',
  })
  @ApiOkResponse({ type: AppEntity, description: 'Application details' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiForbiddenResponse({ description: 'No access to this application' })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AppEntity> {
    const user = req.user as UserEntity;
    return this.appService.getAppById(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update application',
    description: 'Updates application details (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Application ID',
  })
  @ApiBody({ type: UpdateAppDto })
  @ApiOkResponse({ type: AppEntity, description: 'Updated application' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateAppDto: UpdateAppDto,
    @Req() req: Request,
  ): Promise<AppEntity> {
    const user = req.user as UserEntity;
    return this.appService.updateApp(id, updateAppDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete application',
    description: 'Deletes an application (requires OWNER role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Application ID',
  })
  @ApiOkResponse({ description: 'Application deleted successfully' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as UserEntity;
    return this.appService.deleteApp(id, user.id);
  }

  @Post(':id/rotate-keys')
  @ApiOperation({
    summary: 'Rotate API keys',
    description: 'Generates new API keys for the application (requires OWNER role). Returns new keys (only shown once).',
  })
  @ApiParam({
    name: 'id',
    description: 'Application ID',
  })
  @ApiOkResponse({
    type: AppEntity,
    description: 'Application with new API keys',
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async rotateKeys(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AppEntity> {
    const user = req.user as UserEntity;
    return this.appService.rotateApiKeys(id, user.id);
  }

  @Post(':id/toggle-status')
  @ApiOperation({
    summary: 'Toggle application status',
    description: 'Activates/deactivates an application (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Application ID',
  })
  @ApiOkResponse({
    type: AppEntity,
    description: 'Application with updated status',
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async toggleStatus(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AppEntity> {
    const user = req.user as UserEntity;
    return this.appService.toggleAppStatus(id, user.id);
  }
}