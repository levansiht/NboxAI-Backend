import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, HashingService],
})
export class AuthModule {}
