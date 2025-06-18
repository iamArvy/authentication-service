import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class RoleRepo {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findById(id: string) {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }
  async findByIdOrThrow(id: string) {
    return await this.prisma.role.findUniqueOrThrow({
      where: { id },
    });
  }

  async findRoleByName(name: string) {
    return await this.prisma.role.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return await this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
