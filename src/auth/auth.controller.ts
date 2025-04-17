import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { Request } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User successfully registered', type: UserEntity })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
        return new UserEntity(await this.authService.register(registerDto));
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful', type: TokenDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }

    @Post('google')
    @ApiOperation({ summary: 'Login with Google' })
    @ApiResponse({ status: 200, description: 'Google login successful', type: TokenDto })
    async googleAuth(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.googleLogin(req);
    }

    @Post('github')
    @ApiOperation({ summary: 'Login with GitHub' })
    @ApiResponse({ status: 200, description: 'GitHub login successful', type: TokenDto })
    async githubAuth(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.githubLogin(req);
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
    async refreshToken(@Body('refreshToken') refreshToken: string): Promise<TokenDto> {
        return await this.authService.refreshToken(refreshToken);
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth2 callback' })
    @ApiResponse({ status: 200, description: 'Google login successful', type: TokenDto })
    async googleAuthCallback(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }

    @Get('github/callback')
    @UseGuards(GithubAuthGuard)
    @ApiOperation({ summary: 'GitHub OAuth2 callback' })
    @ApiResponse({ status: 200, description: 'GitHub login successful', type: TokenDto })
    async githubAuthCallback(@Req() req: Request): Promise<TokenDto> {
        return await this.authService.login(req.user);
    }
}
