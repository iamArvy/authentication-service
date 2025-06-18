import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleData, UpdateRoleInput } from 'src/dto/app.inputs';
import { RoleService } from 'src/service/role/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('RoleService')
  create(data: RoleData) {
    return this.service.createRole(data);
  }

  @GrpcMethod('RoleService')
  find({ id }: { id: string }) {
    return this.service.findRole(id);
  }

  @GrpcMethod('RoleService')
  update({ id, data }: UpdateRoleInput) {
    return this.service.updateRole(id, data);
  }

  @GrpcMethod('RoleService')
  list() {
    return this.service.findAllRoles();
  }

  @GrpcMethod('RoleService')
  delete({ id }: { id: string }) {
    return this.service.deleteRole(id);
  }
}
