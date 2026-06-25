export class Seller {
  constructor(
    public readonly id: number | null,
    public name: string,
    public company: string,
    public code: string,
    public readonly idAdmin: number | null,
    options?: { skipValidation?: boolean },
  ) {
    if (!options?.skipValidation) {
      this.validate();
    }
  }

  static fromPersistence(row: {
    id: number;
    name: string | null;
    company: string | null;
    code: string | null;
    id_admin: number | null;
  }): Seller {
    return new Seller(
      row.id,
      row.name ?? '',
      row.company ?? '',
      row.code ?? '',
      row.id_admin,
      { skipValidation: true },
    );
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Nombre de vendedor invalido');
    }

    if (!this.company || this.company.trim().length < 2) {
      throw new Error('La empresa es obligatoria');
    }

    if (!this.code || this.code.trim().length < 2) {
      throw new Error('El codigo de vendedor es obligatorio');
    }
  }
}
