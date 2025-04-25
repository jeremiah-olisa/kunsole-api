import { Module } from '@nestjs/common';
import { PlanRepository } from './repositories/plan.repository';
import { PrismaService } from 'nestjs-prisma';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService, PlanRepository, PrismaService],
  exports: [PlanService],
})
export class PlanModule {}
