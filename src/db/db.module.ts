import { Module } from '@nestjs/common';
import { SessionRepo } from './repositories/session.repo';
import { UserRepo } from './repositories/user.repo';
import { PrismaService } from './prisma.service';

@Module({
  providers: [UserRepo, SessionRepo, PrismaService],
  exports: [UserRepo, SessionRepo],
})
export class DbModule {}
