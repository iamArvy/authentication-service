import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { UserRepo } from 'src/db/repositories/user.repo';
import { AuthResponse, Status } from 'src/dto/app.response';
import { TokenService } from '../token/token.service';
import { SecretService } from '../secret/secret.service';
import { RpcException } from '@nestjs/microservices';
import { LoginData, RegisterData } from 'src/dto/app.inputs';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepo,
    private sessionRepo: SessionRepo,
    private tokenService: TokenService,
    private secret: SecretService,
  ) {}
  private logger = new Logger(AuthService.name);

  private async authenticateUser(
    id: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 days = 604800
    const accessTokenExpiresIn = 60 * 15; // 15 minutes = 900

    try {
      const session = await this.sessionRepo.create({
        user: { connect: { id } },
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + refreshTokenExpiresIn * 1000),
      });
      const accessToken = await this.tokenService.generateAccessToken(id);
      const refreshToken = await this.tokenService.generateRefreshToken(
        session.id,
      );
      const hashedRefreshToken = await this.secret.create(refreshToken);
      await this.sessionRepo.updateRefreshToken(session.id, hashedRefreshToken);
      return {
        access: { token: accessToken, expiresIn: accessTokenExpiresIn * 1000 },
        refresh: {
          token: refreshToken,
          expiresIn: refreshTokenExpiresIn * 1000,
        },
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }

  async signup(
    data: RegisterData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      if (!data) throw new UnauthorizedException('Invalid credentials');
      const exists = await this.userRepo.findByEmail(data.email);
      if (exists) throw new UnauthorizedException('User already exists');
      const hash = await this.secret.create(data.password);
      const user = await this.userRepo.create({
        email: data.email,
        passwordHash: hash,
      });
      if (!user) throw new UnauthorizedException('User creation failed');
      return this.authenticateUser(user.id, userAgent, ipAddress);
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }

  async login(
    data: LoginData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user) throw new UnauthorizedException('User not found');
      if (!user.emailVerified)
        throw new UnauthorizedException('Email not verified');
      await this.secret.compare(user.passwordHash, data.password);
      return this.authenticateUser(user.id, userAgent, ipAddress);
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<{ token: string; expiresIn: number }> {
    try {
      const { sub: id } = await this.tokenService.verifyToken<{
        sub: string;
      }>(refresh_token);
      const session = await this.sessionRepo.findById(id);
      if (!session || session.revokedAt) {
        throw new UnauthorizedException('Session not found or revoked');
      }
      if (session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      // Check if the session's hashed refresh token matches the provided refresh token
      if (!session.hashedRefreshToken)
        throw new UnauthorizedException('Session has no refresh token');

      await this.secret.compare(session.hashedRefreshToken, refresh_token);

      const user = await this.userRepo.findById(session.id);
      if (!user) throw new NotFoundException('User not found');
      // Generate new tokens
      const accessToken = await this.tokenService.generateAccessToken(user.id);
      return { token: accessToken, expiresIn: 60 * 15 * 1000 };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }

  async logout(token: string): Promise<Status> {
    try {
      const { sub } = await this.tokenService.verifyRefreshToken(token);
      const session = await this.sessionRepo.findById(sub);
      if (!session) throw new NotFoundException('Session not found');
      if (session.revokedAt) {
        throw new UnauthorizedException('Session already revoked');
      }
      await this.sessionRepo.update(session.id, {
        hashedRefreshToken: null,
        expiresAt: new Date(),
        revokedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error as string);
    }
  }
}
