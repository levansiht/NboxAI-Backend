import { ConflictException, Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Prisma } from '@prisma/client';
import { ROLENAME } from 'src/shared/constants/role.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
  ) {}

  async register(body: any) {
    try {
      const userRole = await this.prisma.role.findFirstOrThrow({
        where: { name: ROLENAME.User },
      });

      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          phoneNumber: body.phoneNumber,
          roleId: userRole.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          avatar: true,
          status: true,
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target as string[];
        const field = target?.[0] || 'field';
        throw new ConflictException(`${field.charAt(0).toUpperCase() + field.slice(1)} already in use`);
      }
      throw error;
    }
  }
}
