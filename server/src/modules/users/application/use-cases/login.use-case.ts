import { PasswordHasher } from '../ports/password-hasher.port';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: LoginInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash ?? '',
    );

    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    return user;
  }
}
