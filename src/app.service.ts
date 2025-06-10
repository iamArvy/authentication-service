import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginData,
  RegisterData,
  UpdateEmailData,
  UpdatePasswordData,
} from './dto/app.inputs';
import * as argon from 'argon2';
import { AuthResponse, Status } from './dto/app.response';
import { AuthRepo } from './auth/auth.repo';
import { SessionRepo } from './session/session.repo';
import { TokenService } from './token.service';

@Injectable()
export class AppService {
  constructor(
    private authRepo: AuthRepo,
    private sessionRepo: SessionRepo,
    private tokenService: TokenService,
  ) {}

  private logger = new Logger('AuthService');

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  private async authenticateUser(
    id: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 days = 604800
    const accessTokenExpiresIn = 60 * 15; // 15 minutes = 900

    const session = await this.sessionRepo.create({
      userId: id,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + refreshTokenExpiresIn * 1000),
    });
    const accessToken = await this.tokenService.generateAccessToken(id);
    const refreshToken = await this.tokenService.generateRefreshToken(
      session.id as string,
    );
    const hashedRefreshToken = await argon.hash(refreshToken);
    session.hashedRefreshToken = hashedRefreshToken;
    await session.save();
    return {
      access: { token: accessToken, expiresIn: accessTokenExpiresIn * 1000 },
      refresh: { token: refreshToken, expiresIn: refreshTokenExpiresIn * 1000 },
    };
  }

  async signup(
    data: RegisterData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    if (!data) throw new UnauthorizedException('Invalid credentials');
    const exists = await this.authRepo.findByEmail(data.email);
    if (exists) throw new UnauthorizedException('User already exists');
    const userExist = await this.authRepo.findByUserId(data.userId);
    if (userExist)
      throw new UnauthorizedException(
        'User already exists with a different email',
      );
    const hash = await argon.hash(data.password);
    const user = await this.authRepo.create({
      userId: data.userId,
      email: data.email,
      passwordHash: hash,
    });
    if (!user) throw new UnauthorizedException('User creation failed');
    return this.authenticateUser(user.userId, userAgent, ipAddress);
  }

  async login(
    data: LoginData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    const user = await this.authRepo.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.emailVerified)
      throw new UnauthorizedException('Email not verified');
    await this.compareSecrets(user.passwordHash, data.password);
    return this.authenticateUser(user.userId, userAgent, ipAddress);
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<{ token: string; expiresIn: number }> {
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
    // Compare the hashed refresh token with the provided refresh token
    await this.compareSecrets(session.hashedRefreshToken, refresh_token);

    const user = await this.authRepo.findByUserId(session.userId);
    if (!user) throw new NotFoundException('User not found');
    // Generate new tokens
    const accessToken = await this.tokenService.generateAccessToken(
      user.userId,
    );
    return { token: accessToken, expiresIn: 60 * 15 * 1000 };
  }

  async logout(token: string): Promise<Status> {
    const { sub } = await this.tokenService.verifyRefreshToken(token);
    const session = await this.sessionRepo.findById(sub);
    if (!session) throw new NotFoundException('Session not found');
    if (session.revokedAt) {
      throw new UnauthorizedException('Session already revoked');
    }
    // Mark the session as revoked
    session.hashedRefreshToken = null; // Clear the hashed refresh token
    session.expiresAt = new Date(); // Set the expiration to now
    session.revokedAt = new Date();
    await session.save();
    return { success: true };
  }

  async updatePassword(id: string, data: UpdatePasswordData): Promise<Status> {
    const user = await this.authRepo.findByUserId(id);
    if (!user) throw new NotFoundException('User not found');

    await this.compareSecrets(user.passwordHash, data.oldPassword);

    const hash = await argon.hash(data.newPassword);

    user.passwordHash = hash;
    await user.save();
    return { success: true };
  }

  async updateEmail(id: string, data: UpdateEmailData): Promise<Status> {
    const user = await this.authRepo.findByUserId(id);
    if (!user) throw new UnauthorizedException('User not Found');
    user.email = data.email;
    user.emailVerified = false;
    await user.save();
    return { success: true };
  }

  async requestEmailVerification(id: string): Promise<Status> {
    const user = await this.authRepo.findByUserId(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.emailVerified)
      throw new UnauthorizedException('Email already verified');
    const token = await this.tokenService.generateEmailVerificationToken(
      user.userId,
      user.email,
    );

    console.log(token);

    // Here you would typically send a verification email with a link
    // containing a token or code to verify the email.
    return { success: true };
  }

  async verifyEmail(token: string): Promise<Status> {
    const { sub, email }: { sub: string; email: string } =
      await this.tokenService.verifyEmailToken(token);
    const user = await this.authRepo.findByUserId(sub);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new BadRequestException(
        'Email from token does not match user email',
      );
    user.emailVerified = true;
    await user.save();
    return { success: true };
  }

  async requestPasswordResetToken(
    userId: string,
    email: string,
  ): Promise<Status> {
    const user = await this.authRepo.findByUserId(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new UnauthorizedException('User Email mismatched');
    const token = await this.tokenService.generatePasswordResetToken(
      user.userId,
      user.email,
    );
    console.log(token);
    return { success: true };
  }

  async resetPassword(token: string, password: string): Promise<Status> {
    const { sub, email }: { sub: string; email: string } =
      await this.tokenService.verifyEmailToken(token);
    const user = await this.authRepo.findByUserId(sub);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new UnauthorizedException('User Email mismatched');
    const hash = await argon.hash(password);
    user.passwordHash = hash;
    await user.save();
    return { success: true };
  }
}
