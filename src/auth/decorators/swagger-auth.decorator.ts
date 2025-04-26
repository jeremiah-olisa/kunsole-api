import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

/**
 * A decorator function that applies Swagger API security schemes for API-Key and API-Secret.
 * 
 * This decorator is used to annotate endpoints that require authentication
 * via API-Key and API-Secret headers. It references the security schemes
 * defined in the Swagger documentation.
 * 
 * @returns A set of decorators that specify the required security schemes.
 */
export const SwaggerApiKey = () =>
  applyDecorators(
    ApiSecurity('API-Key', ['header']), // This will reference the security scheme you defined earlier
    ApiSecurity('API-Secret', ['header']) // Same for API-Secret
  );

/**
 * A decorator that applies Swagger documentation metadata for authenticated endpoints.
 * 
 * This decorator combines multiple Swagger-related decorators to indicate that the
 * endpoint requires authentication. It includes:
 * 
 * - `ApiBearerAuth`: Specifies that the endpoint uses JWT authentication, as per the Swagger configuration.
 * - `SwaggerApiKey`: Adds API Key and API Secret fields to the Swagger documentation for the endpoint.
 * 
 * @returns A function that applies the necessary Swagger decorators for authentication.
 */
export const SwaggerAuthenticated = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'), // JWT authentication (as per your Swagger config)
    SwaggerApiKey() // This will add both API Key and API Secret to the documentation
  );
