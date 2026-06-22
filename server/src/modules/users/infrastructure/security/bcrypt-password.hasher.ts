import { compare, hash } from 'bcryptjs';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return hash(password, SALT_ROUNDS);
  }

  async compare(password: string, hashValue: string): Promise<boolean> {
    return compare(password, hashValue);
  }
}
