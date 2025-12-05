import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  @MinLength(2)
  @MaxLength(500)
  content: string;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  user: User;
}
