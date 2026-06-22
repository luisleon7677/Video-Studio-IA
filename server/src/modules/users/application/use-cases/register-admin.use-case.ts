import { PasswordHasher } from '../ports/password-hasher.port';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface RegisterAdminInput {
  name: string;
  email: string;
  password: string;
  inviteCode: string;
}

export class RegisterAdminUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterAdminInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedCode = input.inviteCode.trim();

    const passwordHash = await this.passwordHasher.hash(input.password);

    new User(
      null,
      input.name.trim(),
      normalizedEmail,
      normalizedCode,
      passwordHash,
    );

    return this.userRepository.registerAdmin({
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      inviteCode: normalizedCode,
    });
  }
}
