// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, Res, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  async login(
    @Body() dto: LoginDto,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(dto);

    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: 3600, // Match your JWT expiration
      token_type: 'Bearer',
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    // Handle Google OAuth callback
    const token = await this.authService.login(req.user);
    res.redirect(`/auth/success?token=${token.access_token}`);
  }

  // Similar endpoints for GitHub
}