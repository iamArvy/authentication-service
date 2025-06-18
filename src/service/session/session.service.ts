import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SessionRepo } from 'src/db/repositories/session.repo';

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionRepo) {}
  private logger: Logger = new Logger(SessionService.name);
  async getUserActiveSessions(id: string) {
    try {
      const sessions = await this.repo.findUserActiveSessions(id);
      return { sessions };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }

  async logoutOtherUserSessions(id: string) {
    try {
      await this.repo.endAllUserSessions(id);
      return { success: true };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }
}
