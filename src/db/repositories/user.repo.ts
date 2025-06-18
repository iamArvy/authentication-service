import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateEmailVerified(id: string, status: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: status },
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async updateEmail(id: string, email: string) {
    return this.prisma.user.update({
      where: { id },
      data: { email },
    });
  }

  async addRole(id: string, roleId: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role: {
          create: {
            roleId,
          },
        },
      },
    });
  }
}
