import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common';
import { KunsoleService } from '../../application/services/kunsole.service';
import { Entry } from '../../domain/entities/entry.entity';
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { AppService } from 'src/application/services/app.service';

@ApiTags('Entries')
@UseGuards(ApiKeyGuard)
@Controller('entries')
export class EntriesController {
  constructor(
    private readonly kunsoleService: KunsoleService,
    private readonly appService: AppService,
  ) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new entry (email, sms, or terminal log)' })
  // @ApiHeader({ name: 'x-api-key', description: 'API Key' })
  // @ApiResponse({ status: 201, description: 'Entry created', type: Entry })
  // async createEntry(
  //   @Headers('x-api-key') apiKey: string,
  //   @Body()
  //   body: {
  //     type: 'EMAIL' | 'SMS' | 'TERMINAL';
  //     content: string;
  //     userId: string;
  //     metadata?: any;
  //   },
  // ): Promise<Entry> {
  //   const validKey = await this.appService.validateAppKey(apiKey);

  //   return this.kunsoleService.logEntry({
  //     type: body.type,
  //     content: body.content,
  //     metadata: body.metadata,
  //     userId: body.userId,
  //     appId: validKey.id,
  //   });
  // }

  // @Get('/user/:userId')
  // @ApiOperation({ summary: 'Get entries for a user' })
  // @ApiHeader({ name: 'x-api-key', description: 'API Key' })
  // @ApiQuery({
  //   name: 'type',
  //   required: false,
  //   enum: ['EMAIL', 'SMS', 'TERMINAL'],
  // })
  // @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  // @ApiResponse({ status: 200, description: 'List of entries', type: [Entry] })
  // async getUserEntries(
  //   @Headers('x-api-key') apiKey: string,
  //   @Param('userId') userId: string,
  //   @Query('type') type?: 'EMAIL' | 'SMS' | 'TERMINAL',
  //   @Query('isRead') isRead?: boolean,
  // ): Promise<Entry[]> {
  //   await this.appService.validateAppKey(apiKey);
  //   return this.kunsoleService.getEntriesForUser(userId, { type, isRead });
  // }

  // @Post('/:entryId/read')
  // @ApiOperation({ summary: 'Mark an entry as read' })
  // @ApiHeader({ name: 'x-api-key', description: 'API Key' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Entry marked as read',
  //   type: Entry,
  // })
  // async markAsRead(
  //   @Headers('x-api-key') apiKey: string,
  //   @Param('entryId') entryId: string,
  // ): Promise<Entry> {
  //   await this.appService.validateAppKey(apiKey);
  //   return this.kunsoleService.markEntryAsRead(entryId);
  // }
}
