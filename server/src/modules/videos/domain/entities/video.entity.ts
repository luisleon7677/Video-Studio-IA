export class Video {
  constructor(
    public readonly id: number | null,
    public name: string,
    public url: string,
    public readonly idAdmin: number | null = null,
    public readonly idTemplate: number | null = null,
    public readonly type: number | null = null,
    public readonly status: number | null = null,
    public readonly idSeller: number | null = null,
  ) {
    this.validate();
  }

  static fromPersistence(row: {
    id: number;
    name: string;
    url: string;
    id_admin: number | null;
    id_template: number | null;
    type: number | null;
    status: number | null;
    id_seller: number | null;
  }): Video {
    return new Video(
      row.id,
      row.name,
      row.url,
      row.id_admin,
      row.id_template,
      row.type,
      row.status,
      row.id_seller,
    );
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new Error('Title is required');
    }

    if (!this.url || this.url.trim().length < 3) {
      throw new Error('Url is required');
    }

    if (this.idSeller !== null && this.type !== 2) {
      throw new Error('Los videos vinculados a vendedores deben ser tipo 2');
    }
  }
}
