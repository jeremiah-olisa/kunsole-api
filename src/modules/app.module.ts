import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KunsoleModule } from './kunsole.module';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KunsoleModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
