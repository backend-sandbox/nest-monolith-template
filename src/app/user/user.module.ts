import { Global, Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
