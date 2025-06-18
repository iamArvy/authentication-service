import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as argon from 'argon2';

@Injectable()
export class SecretService {
  private logger = new Logger(SecretService.name);

  async compare(hash: string, secret: string): Promise<boolean> {
    try {
      const valid = await argon.verify(hash, secret);
      if (!valid) throw new UnauthorizedException('Invalid credentials');
      return true;
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }

  create(input: string) {
    return argon.hash(input);
  }
}
