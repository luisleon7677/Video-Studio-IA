import { User } from '../entities/user.entity';

export interface RegisterAdminData {
  name: string;
  email: string;
  passwordHash: string;
  inviteCode: string;
}

export abstract class UserRepository {
  abstract registerAdmin(data: RegisterAdminData): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
