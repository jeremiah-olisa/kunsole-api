import { ApiProperty } from '@nestjs/swagger';
import { Entry as PrismaEntry, EntryType } from '@prisma/client';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class EntryEntity implements PrismaEntry {
  @ApiProperty({
    description: 'Unique identifier for the entry',
    example: 'a1b2c3d4-5678-90ab-cdef-ghijklmno123',
  })
  id: string;

  @ApiProperty({
    description: 'The type of the entry (e.g., "email", "sms", "terminal")',
    enum: EntryType,
    example: EntryType.EMAIL,
  })
  type: EntryType;

  @ApiProperty({
    description:
      'The main content or body of the entry, typically a message or file reference',
    example: 'This is a sample text entry',
  })
  content: string;

  @ApiProperty({
    description:
      'Metadata related to the entry, such as additional info or settings. Can be any object',
    required: false,
    type: Object,
    example: { source: 'mobile', priority: 'high' },
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    description: 'The ID of the user who created the entry',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The ID of the application that the entry belongs to',
    example: 'app456',
  })
  appId: string;

  @ApiProperty({
    description: 'Timestamp when the entry was created',
    example: '2023-04-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the entry was last updated',
    example: '2023-04-16T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description:
      'Timestamp when the entry was logged or recorded in the system',
    example: '2023-04-15T10:00:00Z',
  })
  loggedAt: Date;

  @ApiProperty({
    description:
      'Timestamp when the entry was read by the user (if applicable)',
    required: false,
    example: '2023-04-15T11:00:00Z',
  })
  readAt: Date | null;

  constructor(partial: Partial<EntryEntity>) {
    Object.assign(this, partial);
  }
}

export class PaginatedResultEntryEntity extends PaginatedResult<EntryEntity> {
  @ApiProperty({
    type: [EntryEntity],
    description: 'Entry array',
    required: true,
  })
  declare data: EntryEntity[];
}
