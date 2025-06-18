import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { RoleData } from 'src/dto/app.inputs';

@Injectable()
export class RoleService {
  constructor(private repo: RoleRepo) {}
  private logger: Logger = new Logger('RoleService');
  async createRole(data: RoleData) {
    try {
      const role = await this.repo.findRoleByName(data.name);
      if (role) throw new BadRequestException('Role already exists');
      return this.repo.create(data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as string);
    }
  }

  async findAllRoles() {
    try {
      return this.repo.findAll();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as string);
    }
  }

  async findRole(id: string) {
    try {
      const role = await this.repo.findById(id);
      if (!role) throw new NotFoundException('Role not found');
      return role;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as string);
    }
  }

  async updateRole(id: string, data: RoleData) {
    try {
      await this.repo.findByIdOrThrow(id);
      const exist = await this.repo.findRoleByName(data.name);
      if (exist) throw new BadRequestException('Role with name already exists');
      await this.repo.update(id, { name: data.name });
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as string);
    }
  }

  async deleteRole(id: string) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as string);
    }
  }
}
