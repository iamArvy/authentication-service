import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { RoleController } from './role/role.controller';
import { SessionController } from './session/session.controller';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [
    AuthController,
    UserController,
    RoleController,
    SessionController,
  ],
})
export class ControllerModule {}
