import { User } from '../entities/User.entity';
import { UserDto } from '../dtos/user.dto';

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
} 