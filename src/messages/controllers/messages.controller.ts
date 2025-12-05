import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from '../dtos';
import { Message } from '../entities';
import { MessagesService } from '../services';

@ApiTags('Messages API')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({ status: 200, description: 'List of messages', type: [Message] })
  @Get('messages')
  async getAllMessages(): Promise<Message[]> {
    return await this.messagesService.getAllMessages();
  }

  @ApiOperation({ summary: 'Get message by id' })
  @ApiResponse({ status: 200, description: 'Message found', type: Message })
  @Get('messages/:messageId')
  async getMessageById(@Param('messageId') messageId: string): Promise<Message> {
    return await this.messagesService.getMessageById(messageId);
  }

  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created', type: Message })
  @Post('messages')
  async createMessage(@Body() body: CreateMessageDto): Promise<Message> {
    return await this.messagesService.createMessage(body);
  }
}
