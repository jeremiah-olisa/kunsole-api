import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { UserAppService } from 'src/user-app/user-app.service';
import { PrismaService } from 'nestjs-prisma';
import { EntryRepository } from './repositories/entry.repository';

@Module({
  imports: [UserAppService],
  controllers: [EntryController],
  providers: [PrismaService, EntryRepository, EntryService]
})
export class EntryModule { }
