import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
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
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dtos/create-entry.dto';
import {
  EntryResponseDto,
  PaginatedResultEntryResponseDto,
} from './dtos/entry-response.dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ListEntriesDto, ListEntriesQuery } from './dtos/list-entries.dto';

@ApiTags('Entries')
@Controller('entries')
@SwaggerAuthenticated()
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new log entry' })
  @ApiBody({ type: CreateEntryDto })
  @ApiResponse({
    status: 201,
    description: 'Entry created successfully',
    type: EntryResponseDto,
  })
  async create(
    @Body() createEntryDto: CreateEntryDto,
    @Req() req: Request,
  ): Promise<EntryResponseDto> {
    const user = new UserEntity(req.user);

    return this.entryService.createEntry(createEntryDto, user.getUserId());
  }

  @Get()
  @ApiOperation({ summary: 'List entries with filters' })
  @ApiQuery({ type: ListEntriesQuery })
  @ApiResponse({
    status: 200,
    description: 'List of entries',
    type: PaginatedResultEntryResponseDto,
  })
  async findAll(
    @Query() query: ListEntriesQuery,
    @Req() req: Request,
  ): Promise<PaginatedResultEntryResponseDto> {
    const user = new UserEntity(req.user);
    return this.entryService.listEntries(
      { ...query.getFilters(), userId: user.getUserId() },
      query.getPagination(),
    );
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark an entry as read' })
  @ApiParam({ name: 'id', description: 'Entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Entry marked as read',
    type: EntryResponseDto,
  })
  async markAsRead(@Param('id') id: string): Promise<EntryResponseDto> {
    return this.entryService.markAsRead(id);
  }
}
