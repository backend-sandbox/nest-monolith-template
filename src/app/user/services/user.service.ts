import { ApiCode, ApiException } from '@common/exceptions';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto, UserDto, UserWithPasswordDto } from '../dtos';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserDto> {
    const existingUser = await this.userRepository.getUserById(id);

    if (!existingUser) {
      throw new ApiException(ApiCode.NOT_FOUND, `User with id ${id} not found`);
    }

    return existingUser;
  }

  async getFirstUser(args: Prisma.UserWhereInput): Promise<UserDto | null> {
    return await this.userRepository.findFirstUser(args);
  }

  async getUserOrThrow(args: Prisma.UserWhereInput): Promise<UserDto> {
    const existingUser = await this.getFirstUser(args);

    if (!existingUser) {
      throw new ApiException(ApiCode.NOT_FOUND, `User with provided credentials not found`);
    }

    return existingUser;
  }

  async getFirstUserWithPassword(email: string): Promise<UserWithPasswordDto> {
    const user = await this.userRepository.getFirstUserWithPassword(email);

    if (!user || !user.password) {
      throw new ApiException(ApiCode.USER_INVALID_CREDENTIALS);
    }

    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    const existingByUsername = await this.userRepository.findFirstUser({
      username: {
        equals: data.username,
        mode: 'insensitive',
      },
    });

    if (existingByUsername) {
      throw new ApiException(ApiCode.CONFLICT, `User with username ${data.username} already exists`);
    }

    const existingByEmail = await this.userRepository.findFirstUser({
      email: {
        equals: data.email,
        mode: 'insensitive',
      },
    });

    if (existingByEmail) {
      throw new ApiException(ApiCode.CONFLICT, `User with email ${data.email} already exists`);
    }

    return await this.userRepository.createUser(data);
  }
}
