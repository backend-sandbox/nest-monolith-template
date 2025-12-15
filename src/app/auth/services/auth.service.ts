import { ApiCode, ApiException } from '@common/exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/services';
import { SignInDto, SignUpDto } from '../dtos';
import { comparePasswordsAsync, hashPasswordAsync } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto): Promise<{ accessToken: string }> {
    const existingUser = await this.userService.getFirstUser({
      OR: [
        { username: { equals: body.username, mode: 'insensitive' } },
        { email: { equals: body.email, mode: 'insensitive' } },
      ],
    });

    if (existingUser) {
      throw new ApiException(ApiCode.CONFLICT, `Username or email already taken`);
    }

    const passwordHash = await hashPasswordAsync(body.password);

    const newUser = await this.userService.createUser({
      ...body,
      password: passwordHash,
    });

    return {
      accessToken: await this.jwtService.signAsync({ sub: newUser.id, email: newUser.email }),
    };
  }

  async signIn(body: SignInDto): Promise<{ accessToken: string }> {
    const existingUser = await this.userService.getFirstUserWithPassword(body.email);

    if (!existingUser || !existingUser.password) {
      throw new ApiException(ApiCode.USER_INVALID_CREDENTIALS);
    }

    const passwordIsValid = await comparePasswordsAsync(body.password, existingUser.password);

    if (!passwordIsValid) {
      throw new ApiException(ApiCode.USER_INVALID_CREDENTIALS);
    }

    return {
      accessToken: await this.jwtService.signAsync({ sub: existingUser.id, email: existingUser.email }),
    };
  }

  async signOut() {}
}
