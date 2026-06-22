import { User } from '../../domain/entities/user.entity';

export function toAuthUserResponse(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
