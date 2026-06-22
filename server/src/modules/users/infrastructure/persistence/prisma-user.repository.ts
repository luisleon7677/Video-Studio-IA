import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import {
  RegisterAdminData,
  UserRepository,
} from '../../domain/repositories/user.repository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async registerAdmin(data: RegisterAdminData): Promise<User> {
    const pending = await this.prisma.user.findFirst({
      where: {
        code: data.inviteCode,
        password: null,
      },
    });

    if (!pending) {
      const alreadyUsed = await this.prisma.user.findFirst({
        where: {
          code: data.inviteCode,
          password: { not: null },
        },
      });

      if (alreadyUsed) {
        throw new Error('Este código de invitación ya fue utilizado');
      }

      throw new Error('Código de invitación inválido');
    }

    const emailTaken = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: pending.id },
      },
    });

    if (emailTaken) {
      throw new Error('Ya existe una cuenta con este correo');
    }

    const updated = await this.prisma.user.update({
      where: { id: pending.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
    });

    return User.fromPersistence(updated);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: {
        email,
        password: { not: null },
      },
    });

    return row ? User.fromPersistence(row) : null;
  }
}
