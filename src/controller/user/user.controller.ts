import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  EmailData,
  RequestPasswordResetMessage,
  ResetPasswordMessage,
  TokenInput,
  UpdatePasswordData,
  UserInput,
} from 'src/dto/app.inputs';
import { UserService } from 'src/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @GrpcMethod('UserService')
  health() {
    return { success: true };
  }

  @GrpcMethod('UserService')
  changePassword({ id, data }: UserInput<UpdatePasswordData>) {
    return this.service.updatePassword(id, data);
  }

  @GrpcMethod('UserService')
  changeEmail({ id, data }: UserInput<EmailData>) {
    return this.service.updateEmail(id, data.email);
  }

  @GrpcMethod('UserService')
  requestPasswordResetToken({ id, email }: RequestPasswordResetMessage) {
    return this.service.requestPasswordResetToken(id, email);
  }

  @GrpcMethod('UserService')
  resetPassword({ token, password }: ResetPasswordMessage) {
    return this.service.resetPassword(token, password);
  }

  @GrpcMethod('UserService')
  requestEmailVerification({ email }: EmailData) {
    return this.service.requestEmailVerification(email);
  }

  @GrpcMethod('UserService')
  verifyEmail({ token }: TokenInput) {
    return this.service.verifyEmail(token);
  }
}
