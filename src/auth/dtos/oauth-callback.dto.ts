import { ApiProperty } from '@nestjs/swagger';



export class OAuthCallbackDto {
    @ApiProperty({
        example: 'abc123',
        description: 'Authorization code from OAuth provider',
    })
    code: string;

    @ApiProperty({
        example: 'state123',
        description: 'State parameter for CSRF protection',
        required: false,
    })
    state?: string;
}
