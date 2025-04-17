import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AppService } from '../../application/services/app.service';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';

@ApiTags('Apps')
@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new app' })
  @ApiResponse({ status: 201, description: 'App created' })
  async createApp(@Body() body: { name: string; planType: string }) {
    return this.appService.createApp(body.name, body.planType);
  }

  @Post('/validate')
  @ApiOperation({ summary: 'Validate an app key' })
  @ApiResponse({ status: 200, description: 'App is valid' })
  async validateApp(@Headers('x-app-key') key: string) {
    return this.appService.validateAppKey(key);
  }
}
