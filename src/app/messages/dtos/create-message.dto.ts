import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(2, { message: 'Content must be at least 2 characters long' })
  @MaxLength(500, { message: 'Content must be at most 500 characters long' })
  content: string;
}
