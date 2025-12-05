import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './controllers';
import { Message, User } from './entities/';
import { MessageRepository } from './repositories';
import { MessagesService } from './services';

/**
 * @description In this module I used TypeOrmModule with
 * Message and User entities just for testing purposes.
 *
 * Overall within this project you will find Prisma as ORM tool.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
})
export class MessagesModule {}
