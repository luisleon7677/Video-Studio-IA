export class Sale {
  constructor(
    public readonly id: number | null,
    public seller: string,
    public codeSeller: number,
    public dateSeller: Date,
    public company: string,
    options?: { skipValidation?: boolean },
  ) {
    if (!options?.skipValidation) {
      this.validate();
    }
  }

  static fromPersistence(row: {
    id: number;
    seller: string | null;
    code_seller: number | null;
    date_seller: Date | null;
    company: string | null;
  }): Sale {
    return new Sale(
      row.id,
      row.seller ?? '',
      row.code_seller ?? 0,
      row.date_seller ?? new Date(),
      row.company ?? '',
      { skipValidation: true },
    );
  }

  get channel(): string {
    return this.company.trim();
  }

  private validate(): void {
    if (!this.seller || this.seller.trim().length < 2) {
      throw new Error('Nombre de vendedor inválido');
    }

    if (!Number.isInteger(this.codeSeller) || this.codeSeller < 1000 || this.codeSeller > 9999) {
      throw new Error('El código de vendedor debe tener 4 dígitos');
    }

    if (!this.company || this.company.trim().length < 2) {
      throw new Error('La empresa es obligatoria');
    }
  }
}
