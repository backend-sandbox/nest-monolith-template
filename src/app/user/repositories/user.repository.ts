import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { UserDto, UserWithPasswordDto } from '../dtos';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: string): Promise<UserDto | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: UserDto.prismaSelect(),
    });
  }

  async findFirstUser(args: Prisma.UserWhereInput): Promise<UserDto | null> {
    return await this.prismaService.user.findFirst({
      where: args,
      select: UserDto.prismaSelect(),
    });
  }

  async getFirstUserWithPassword(email: string): Promise<UserWithPasswordDto | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        password: { not: null },
      },
      select: UserWithPasswordDto.prismaSelect(),
    });

    if (!user || !user.password) return null;

    return user as UserWithPasswordDto; // ! I don't like this solution, solve it later
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserDto> {
    return await this.prismaService.user.create({
      data,
      select: UserDto.prismaSelect(),
    });
  }
}
