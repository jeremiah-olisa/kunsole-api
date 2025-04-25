import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

export const SwaggerAuthenticated = () =>
  applyDecorators(ApiBearerAuth(), ApiSecurity('apiKey', ['header', 'query']));
