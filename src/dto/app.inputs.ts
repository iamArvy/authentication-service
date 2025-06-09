export class AuthInput<T> {
  data: T;
  userAgent: string;
  ipAddress: string;
}
export class LoginData {
  email: string;
  password: string;
}

export class RegisterData extends LoginData {
  userId: string;
}

export class UpdateEmailInput {
  email: string;
}

export class UserInput<T> {
  id: string;
  data: T;
}

export class UpdatePasswordData {
  newPassword: string;
  oldPassword: string;
}

export class UpdateEmailData {
  email: string;
}

export class TokenInput {
  token: string;
}

export class LogoutInput {
  id: string;
}

export class IdInput {
  id: string;
}
