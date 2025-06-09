import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private logger = new Logger('TokenService');

  private async generateToken<T extends object>(
    payload: T,
    secretKey: string,
    expiresIn: string,
  ): Promise<string> {
    // const payload = { sub, email };
    const secret: string = this.config.get<string>(secretKey) || '';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret: secret,
    });
    return token;
  }

  async generateAccessToken(id: string): Promise<string> {
    return await this.generateToken(
      { sub: id, type: 'access' },
      'JWT_SECRET',
      '15m',
    );
  }
  async generateRefreshToken(id: string, session_id: string): Promise<string> {
    return await this.generateToken(
      { sub: id, type: 'refresh', session_id },
      'REFRESH_SECRET',
      '7d',
    );
  }

  async generateEmailVerificationToken(
    id: string,
    email: string,
  ): Promise<string> {
    return await this.generateToken(
      { sub: id, email, type: 'email_verification' },
      'EMAIL_VERIFICATION_SECRET',
      '15m',
    );
  }

  async verifyToken<T extends object>(
    token: string,
    secretKey: string,
  ): Promise<T> {
    const secret: string = this.config.get<string>(secretKey) || '';
    try {
      return this.jwtService.verifyAsync<T>(token, { secret });
    } catch (error: any) {
      this.logger.error(`Token verification failed: ${error as string}`);
      return Promise.reject(new Error(`Token verification failed`));
    }
  }

  async verifyEmailToken(token: string) {
    return await this.verifyToken<{
      sub: string;
      email: string;
    }>(token, 'EMAIL_VERIFICATION_SECRET');
  }
}
