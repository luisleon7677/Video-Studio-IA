export class Video {
  constructor(
    public readonly id: number | null,
    public name: string,
    public url: string,
    public readonly idAdmin: number | null = null,
    public readonly idSound: number | null = null,
    public readonly type: number | null = null,
    public readonly status: number | null = null,
    public readonly idSeller: number | null = null,
    public readonly config: Record<string, unknown> | null = null,
  ) {
    this.validate();
  }

  static fromPersistence(row: {
    id: number;
    name: string;
    url: string;
    id_admin: number | null;
    id_sound: number | null;
    type: number | null;
    status: number | null;
    id_seller: number | null;
    config: unknown;
  }): Video {
    return new Video(
      row.id,
      row.name,
      row.url,
      row.id_admin,
      row.id_sound,
      row.type,
      row.status,
      row.id_seller,
      Video.parseConfig(row.config),
    );
  }

  private static parseConfig(value: unknown): Record<string, unknown> | null {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }

    return null;
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
