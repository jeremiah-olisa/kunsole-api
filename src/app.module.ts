import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppModule as KunsoleApp } from './app/app.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    KunsoleApp,
    PlanModule,
  ],
  providers: [],
})
export class AppModule { }
