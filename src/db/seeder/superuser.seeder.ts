import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepo } from '../repositories/user.repo';
import { RoleRepo } from '../repositories/role.repo';
import * as argon from 'argon2';

@Injectable()
export class SuperuserSeeder {
  private readonly logger = new Logger(SuperuserSeeder.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly user: UserRepo,
    private readonly role: RoleRepo,
  ) {}

  async seedSuperuser() {
    const email = this.configService.get<string>('SUPERUSER_EMAIL');
    if (!email) {
      this.logger.log('Superuser email not set');
      return;
    }
    const password = this.configService.get<string>('SUPERUSER_PASSWORD');
    if (!password) {
      this.logger.log('Superuser Password not set');
      return;
    }

    const existingUser = await this.user.findByEmail(email);

    if (existingUser) {
      this.logger.log('Superuser already exists');
      return;
    }

    let superuserRole = await this.role.findRoleByName('superuser');

    if (!superuserRole) {
      this.logger.log('Creating superuser role...');
      superuserRole = await this.role.create({
        name: 'superuser',
      });
      this.logger.log('Superuser role created successfully');
    }

    this.logger.log('Creating superuser account...');

    const passwordHash = await argon.hash(password);
    const user = await this.user.create({
      email,
      passwordHash,
    });

    await this.user.addRole(user.id, superuserRole.id);
    this.logger.log('Superuser created successfully');
  }
}
