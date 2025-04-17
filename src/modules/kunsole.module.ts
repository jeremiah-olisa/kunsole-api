import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { EntriesController } from '../presentation/controllers/entries.controller';
import { KunsoleService } from '../application/services/kunsole.service';
import { EntryRepository } from '../infrastructure/repositories/entry.repository';
import { AppRepository } from '../infrastructure/repositories/app.repository';
import { AppController } from '../presentation/controllers/api-key.controller';
import { AppService } from '../application/services/app.service';
import { SubscriptionController } from '../presentation/controllers/subscription.controller';
import { PlanService } from '../application/services/plan.service';
import { SubscriptionService } from '../application/services/subscription.service';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription.repository';
import { PlanRepository } from '../infrastructure/repositories/plan.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Module({
  imports: [],
  controllers: [
    EntriesController,
    AppController,
    SubscriptionController,
    // TODO: PlanController,
    // TODO: UserController
  ],
  providers: [
    AppService,
    PrismaService,

    // Services
    PlanService,
    KunsoleService,
    SubscriptionService,
    // TODO: UserService,

    // Repositories
    EntryRepository,
    AppRepository,
    SubscriptionRepository,
    PlanRepository,
    UserRepository,

    // Repository Interfaces (for DI)
    {
      provide: 'IEntryRepository',
      useClass: EntryRepository,
    },
    {
      provide: 'IAppRepository',
      useClass: AppRepository,
    },
    {
      provide: 'IPlanRepository',
      useClass: PlanRepository,
    },
    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    AppService,
    KunsoleService,
    PlanService,
    SubscriptionService,
    // UserService,

    // Export repositories if needed by other modules
    'IEntryRepository',
    'IAppRepository',
    'IPlanRepository',
    'ISubscriptionRepository',
    'IUserRepository',
  ],
})
export class KunsoleModule { }
