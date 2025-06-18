import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthInput,
  LoginData,
  RegisterData,
  TokenInput,
} from 'src/dto/app.inputs';
import { AuthService } from 'src/service/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('AuthService')
  register(data: AuthInput<RegisterData>) {
    return this.service.signup(data.data, data.userAgent, data.ipAddress);
  }

  @GrpcMethod('AuthService')
  login(data: AuthInput<LoginData>) {
    return this.service.login(data.data, data.userAgent, data.ipAddress);
  }

  @GrpcMethod('AuthService')
  refreshToken({ token }: TokenInput) {
    return this.service.refreshToken(token);
  }

  @GrpcMethod('AuthService')
  logout({ token }: TokenInput) {
    return this.service.logout(token);
  }
}
