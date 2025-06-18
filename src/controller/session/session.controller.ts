import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SessionService } from 'src/service/session/session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly service: SessionService) {}
  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('SessionService')
  getUserActiveSessions({ id }: { id: string }) {
    return this.service.getUserActiveSessions(id);
  }

  @GrpcMethod('SessionService')
  logoutOtherSessions({ id }: { id: string }) {
    return this.service.logoutOtherUserSessions(id);
  }
}
