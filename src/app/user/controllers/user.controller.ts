import { RequestExt } from '@common/types';
import { Controller, Get, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../dtos';
import { UserService } from '../services';

@ApiTags('User API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get Current User',
    description: 'Retrieve details for authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    type: UserDto,
  })
  @Get('me')
  async getMe(@Req() req: RequestExt) {
    return await this.userService.getUserById(req.user.id);
  }

  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Retrieve user details by user id',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserDto,
  })
  @Get(':userId')
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserDto> {
    return await this.userService.getUserById(userId);
  }
}
