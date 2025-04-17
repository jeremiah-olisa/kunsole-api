import { Module } from '@nestjs/common';
import { PlanRepository } from './repositories/plan.repository';
import { PrismaService } from 'nestjs-prisma';

@Module({
    providers: [PlanRepository, PrismaService],
    exports: [PlanRepository],
})
export class PlanModule { }
