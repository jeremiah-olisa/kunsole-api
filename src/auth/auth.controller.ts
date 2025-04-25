import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Get,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { Request } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';
import { Public } from './decorators/public.decorator';
import { SwaggerAuthenticated } from './decorators/swagger-auth.decorator';

@ApiTags('Authentication')
@SwaggerAuthenticated()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @HttpCode(201)
    async register(@Body() registerDto: RegisterDto): Promise<void> {
        await this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful', type: TokenDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @HttpCode(200)
    async login(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('google')
    @ApiOperation({ summary: 'OAuth via Google' })
    @HttpCode(200)
    async googleAuth(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.googleLogin(req.user);
    }

    @Public()
    @Get('github')
    @UseGuards(GithubAuthGuard)
    @ApiOperation({ summary: 'OAuth via GitHub' })
    @HttpCode(200)
    async githubAuth(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.githubLogin(req.user);
    }

    @Public()
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth2 callback' })
    @ApiResponse({
        status: 200,
        description: 'Google login successful',
        type: TokenDto,
    })
    @HttpCode(200)
    async googleAuthCallback(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }

    @Public()
    @Get('github/callback')
    @UseGuards(GithubAuthGuard)
    @ApiOperation({ summary: 'GitHub OAuth2 callback' })
    @ApiResponse({
        status: 200,
        description: 'GitHub login successful',
        type: TokenDto,
    })
    @HttpCode(200)
    async githubAuthCallback(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                refreshToken: { type: 'string', example: 'your-refresh-token-here' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Token refreshed', type: TokenDto })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    @HttpCode(200)
    async refreshToken(
        @Body('refreshToken') refreshToken: string,
    ): Promise<TokenDto> {
        return await this.authService.refreshToken(refreshToken);
    }
}
