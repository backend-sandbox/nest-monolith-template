import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { AuthRepository } from './repositories';
import { AuthService } from './services';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AuthModule {}
