import { ApiProperty } from '@nestjs/swagger';
import { EntryType } from '@prisma/client';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class EntryResponseDto {
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
      'The main content or body of the entry, which could be a message, notification, or file reference',
    example: 'This is a sample content for the entry.',
  })
  content: string;

  @ApiProperty({
    description:
      'Optional metadata related to the entry, such as additional context like source or priority. Can be any object',
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
      'Timestamp when the entry was read (if applicable). Can be null if not yet read.',
    required: false,
    example: '2023-04-15T11:00:00Z',
  })
  readAt: Date | null;
}

export class PaginatedResultEntryResponseDto extends PaginatedResult<EntryResponseDto> {
  @ApiProperty({
    description: 'A list of entry response objects',
    type: [EntryResponseDto], // Specifies that this is an array of EntryResponseDto objects
    example: [
      {
        id: 'a1b2c3d4-5678-90ab-cdef-ghijklmno123',
        type: 'EMAIL',
        content: 'Sample content for the entry.',
        metadata: { source: 'mobile', priority: 'high' },
        userId: 'user123',
        appId: 'app456',
        createdAt: '2023-04-15T10:00:00Z',
        updatedAt: '2023-04-16T12:00:00Z',
        loggedAt: '2023-04-15T10:00:00Z',
        readAt: '2023-04-15T11:00:00Z',
      },
      {
        id: 'a1b2c3d4-5678-90ab-cdef-ghijklmno124',
        type: 'SMS',
        content: 'Sample content for an SMS entry.',
        metadata: { source: 'web', priority: 'low' },
        userId: 'user124',
        appId: 'app457',
        createdAt: '2023-04-16T10:00:00Z',
        updatedAt: '2023-04-17T12:00:00Z',
        loggedAt: '2023-04-16T10:00:00Z',
        readAt: null,
      },
    ], // Example data, use appropriate entries for your case
  })
  declare data: EntryResponseDto[];
}
