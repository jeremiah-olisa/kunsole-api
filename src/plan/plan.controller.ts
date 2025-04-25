import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import {
  PaginatedResultPlanResponseDto,
  PlanResponseDto,
} from './dtos/plan-response.dto';
import { PaginatedResult } from 'src/common/entities/pagination.entity';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import { PlanType } from '@prisma/client';

@ApiTags('Plans')
@ApiBearerAuth()
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiBody({ type: CreatePlanDto })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.planService.createPlan(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all plans' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of plans',
    type: PaginatedResultPlanResponseDto,
  })
  async findAll(
    @Query() pagination: any,
  ): Promise<PaginatedResult<PlanResponseDto>> {
    return this.planService.getAllPlans(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan details' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan details',
    type: PlanResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.planService.getPlanById(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get plan by type' })
  @ApiParam({ name: 'type', enum: PlanType })
  @ApiResponse({
    status: 200,
    description: 'Plan details',
    type: [PlanEntity],
  })
  async findByType(@Param('type') type: string): Promise<PlanEntity[]> {
    return this.planService.getPlanByType(type);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.planService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.planService.deletePlan(id);
  }
}
