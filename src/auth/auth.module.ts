import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { ApiKeyGuard } from './guards/api-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { PrismaService } from 'nestjs-prisma';

@Module({
    imports: [
        // UserModule,
        PassportModule,
        Reflector,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        PrismaService,
        AuthService,
        AuthRepository,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        GithubStrategy,
        JwtAuthGuard,
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
        ApiKeyGuard,
    ],
    exports: [AuthService, ApiKeyGuard],
})
export class AuthModule { }