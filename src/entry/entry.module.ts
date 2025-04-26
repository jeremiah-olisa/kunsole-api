import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { PrismaService } from 'nestjs-prisma';
import { EntryRepository } from './repositories/entry.repository';
import { UserAppModule } from 'src/user-app/user-app.module';

@Module({
  imports: [UserAppModule],
  controllers: [EntryController],
  providers: [PrismaService, EntryRepository, EntryService],
})
export class EntryModule {}
