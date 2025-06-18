import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { TokenService } from './token/token.service';
import { SecretService } from './secret/secret.service';
import { RoleService } from './role/role.service';
import { DbModule } from 'src/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SessionService } from './session/session.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
    }),
    DbModule,
  ],
  providers: [
    AuthService,
    UserService,
    TokenService,
    SecretService,
    RoleService,
    SessionService,
  ],
  exports: [AuthService, UserService, RoleService, SessionService],
})
export class ServiceModule {}
