import { Injectable } from "@nestjs/common";
import { $Enums } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class PlanRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly DEFAULT_LIMIT = 20;
    private readonly MAX_LIMIT = 100;


    async findPlanByType(type: $Enums.PlanType) {
        return await this.prisma.plan.findFirst({
            where: { type }
        })
    }
}
