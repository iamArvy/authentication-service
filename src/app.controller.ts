import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AuthInput,
  IdInput,
  LoginData,
  RegisterData,
  RequestPasswordResetMessage,
  ResetPasswordMessage,
  TokenInput,
  UpdateEmailData,
  UpdatePasswordData,
  UserInput,
} from './dto/app.inputs';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('AuthService')
  register(data: AuthInput<RegisterData>) {
    return this.service.signup(data.data, data.userAgent, data.ipAddress);
  }

  @GrpcMethod('AuthService')
  changePassword({ id, data }: UserInput<UpdatePasswordData>) {
    return this.service.updatePassword(id, data);
  }

  @GrpcMethod('AuthService')
  changeEmail({ id, data }: UserInput<UpdateEmailData>) {
    return this.service.updateEmail(id, data);
  }

  @GrpcMethod('AuthService')
  requestPasswordResetToken({ id, email }: RequestPasswordResetMessage) {
    return this.service.requestPasswordResetToken(id, email);
  }

  @GrpcMethod('AuthService')
  resetPassword({ token, password }: ResetPasswordMessage) {
    return this.service.resetPassword(token, password);
  }

  @GrpcMethod()
  requestEmailVerification({ id }: IdInput) {
    return this.service.requestEmailVerification(id);
  }

  @GrpcMethod()
  verifyEmail({ token }: TokenInput) {
    return this.service.verifyEmail(token);
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
