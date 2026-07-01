export class Template {
  constructor(
    public readonly id: number | null,
    public name: string,
    public url: string,
    public id_admin: number | null,
    public createdAt: Date | null = null,
    public updatedAt: Date | null = null,
    options?: { skipValidation?: boolean },
  ) {
    if (!options?.skipValidation) {
      this.validate();
    }
  }

  static fromPersistence(row: {
    id: number;
    name: string | null;
    url: string | null;
    id_admin: number | null;
    create_at: Date | null;
    update_at: Date | null;
  }): Template {
    return new Template(
      row.id,
      row.name ?? '',
      row.url ?? '',
      row.id_admin,
      row.create_at,
      row.update_at,
      { skipValidation: true },
    );
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    if (!this.url || this.url.trim().length < 3) {
      throw new Error('La URL del audio es obligatoria');
    }
  }
}
