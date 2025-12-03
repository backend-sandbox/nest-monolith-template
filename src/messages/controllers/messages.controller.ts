import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages API')
@Controller('messages')
export class MessagesController {
  @ApiOperation({ summary: 'Get all messages' })
  @Get('messages')
  async getMessages() {}

  @ApiOperation({ summary: 'Get message by id' })
  @Get('messages/:messageId')
  async getMessageById() {}

  @ApiOperation({ summary: 'Create a new message' })
  @Post('messages')
  async createMessage() {}
}
