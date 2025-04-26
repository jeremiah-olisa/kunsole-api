import { Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/common/entities/pagination.entity';
import { CreateEntryDto } from './dtos/create-entry.dto';
import { EntryResponseDto } from './dtos/entry-response.dto';
import { ListEntriesDto } from './dtos/list-entries.dto';
import { EntryRepository } from './repositories/entry.repository';
import { IKeysetPaginationParams } from 'src/common/interfaces/pagination.interface';
import { UserAppService } from 'src/user-app/user-app.service';

@Injectable()
export class EntryService {
  constructor(
    private readonly entryRepository: EntryRepository,
    private readonly userAppService: UserAppService,
  ) { }

  async createEntry(
    dto: CreateEntryDto,
    publicKey: string,
  ): Promise<EntryResponseDto> {
    const entry = await this.entryRepository.create({
      type: dto.type,
      content: dto.content,
      metadata: dto.metadata,
      loggedAt: dto.loggedAt,
      // user: { connect: { id: userId } },
      app: { connect: { publicKey } },
    });

    return this.toResponseDto(entry);
  }

  async listEntries(
    filters: ListEntriesDto,
    pagination: IKeysetPaginationParams,
    userId?: string,
    appId?: string,
  ): Promise<PaginatedResult<EntryResponseDto>> {
    const filterAppId = filters.appId ?? appId;
    const filterUserId = filters.userId ?? userId;

    if (filterAppId && userId)
      await this.userAppService.userHasAccessToApp(filterAppId, userId);

    const result = await this.entryRepository.findAll(
      {
        ...filters,
        appId: filterAppId,
        userId: filterUserId,
        fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
        toDate: filters.toDate ? new Date(filters.toDate) : undefined,
      },
      pagination,
    );

    return {
      ...result,
      data: result.data.map(this.toResponseDto),
    };
  }

  async markAsRead(id: string): Promise<EntryResponseDto> {
    const entry = await this.entryRepository.markAsRead(id);
    return this.toResponseDto(entry);
  }

  private toResponseDto(entry: any): EntryResponseDto {
    return {
      id: entry.id,
      type: entry.type,
      content: entry.content,
      metadata: entry.metadata,
      userId: entry.userId,
      appId: entry.appId,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      loggedAt: entry.loggedAt,
      readAt: entry.readAt,
      // user: entry.user,
      // app: entry.app,
    };
  }
}
