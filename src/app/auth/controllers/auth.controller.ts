import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SkipSerialization } from 'src/common/serialization';
import { SignInDto, SignUpDto } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'User Sign-Up',
    description: 'Endpoint for user registration',
  })
  @SkipSerialization()
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
  }

  @ApiOperation({
    summary: 'User Sign-In',
    description: 'Endpoint for user authentication',
  })
  @SkipSerialization()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    await this.authService.signIn(body);
  }
}
