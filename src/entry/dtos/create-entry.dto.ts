import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsDate,
} from 'class-validator';
import { EntryType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateEntryDto {
  @ApiProperty({
    description: 'The type of the entry (e.g., "email", "sms", "terminal")',
    enum: EntryType,
    example: EntryType.EMAIL,
  })
  @IsEnum(EntryType)
  type: EntryType;

  @ApiProperty({
    description:
      'The content or body of the entry. This can be a message, a text, or a reference to a file.',
    example: 'This is a new entry content.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description:
      'Optional metadata related to the entry. This can include additional context like source or priority.',
    required: false,
    type: Object,
    example: { source: 'mobile', priority: 'high' },
  })
  @IsObject()
  @IsOptional()
  metadata?: any;

  // @ApiProperty({
  //   description: 'The ID of the application this entry belongs to.',
  //   example: 'app123',
  // })
  // @IsString()
  // @IsNotEmpty()
  // appId: string;

  @ApiProperty({
    description:
      'Timestamp when the entry was logged or recorded. Defaults to the current time if not provided.',
    example: '2023-04-15T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  loggedAt: Date = new Date();
}
