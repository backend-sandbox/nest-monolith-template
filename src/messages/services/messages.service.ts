import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dtos';
import { Message } from '../entities';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    return await this.messagesRepository.find();
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.messagesRepository.findOneBy({ id: messageId });

    if (!message) throw new Error('Message not found');

    return message;
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMessage = await this.messagesRepository.create({
      content: data.content,
    });

    return await this.messagesRepository.save(newMessage);
  }
}
