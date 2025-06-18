import { Module } from '@nestjs/common';
import { SessionRepo } from './repositories/session.repo';
import { UserRepo } from './repositories/user.repo';
import { PrismaService } from './prisma.service';
import { RoleRepo } from './repositories/role.repo';

@Module({
  providers: [UserRepo, SessionRepo, PrismaService, RoleRepo],
  exports: [UserRepo, SessionRepo, RoleRepo],
})
export class DbModule {}
