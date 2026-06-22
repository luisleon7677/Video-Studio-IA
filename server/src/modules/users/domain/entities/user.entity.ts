export class User {
  constructor(
    public readonly id: number | null,
    public name: string,
    public email: string,
    public code: string,
    public passwordHash: string | null,
    options?: { skipValidation?: boolean },
  ) {
    if (!options?.skipValidation) {
      this.validate();
    }
  }

  static fromPersistence(row: {
    id: number;
    name: string | null;
    email: string | null;
    code: string | null;
    password: string | null;
  }): User {
    return new User(
      row.id,
      row.name ?? '',
      row.email ?? '',
      row.code ?? '',
      row.password,
      { skipValidation: true },
    );
  }

  get isRegistered(): boolean {
    return Boolean(this.passwordHash && this.email);
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      throw new Error('El correo electrónico no es válido');
    }

    if (!this.passwordHash || this.passwordHash.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
  }
}
