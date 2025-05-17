import { AuthResponse } from './app.response';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginInput, RegisterInput } from './app.inputs';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @ApiOkResponse({ description: 'Status of the API', type: String })
  @Get('health')
  health() {
    return 'OK';
  }

  @ApiOkResponse({ description: 'Authentication Tokens', type: AuthResponse })
  @Post('register')
  register(@Body() data: RegisterInput) {
    return this.service.signup(data);
  }

  @ApiOkResponse({ description: 'Authentication Tokens', type: AuthResponse })
  @Post('login')
  login(@Body() data: LoginInput) {
    return this.service.login(data);
  }

  @ApiOkResponse({ description: 'Authentication Tokens', type: AuthResponse })
  @Post('refresh-token')
  refreshToken(@Body() data: { refresh_token: string }) {
    return this.service.refreshToken(data.refresh_token);
  }

  @ApiOkResponse({ description: 'True or False Response', type: Boolean })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: { user: string }) {
    await this.service.logout(req.user);
    return true;
  }
}
