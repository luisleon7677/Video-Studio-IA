import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface UploadVideoFileInput {
  buffer: Buffer;
  originalName: string;
  contentType?: string;
  sellerId: number;
}

export interface UploadAnimationVideoFileInput {
  buffer: Buffer;
  originalName: string;
  contentType?: string;
  templateId?: string;
}

export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly capcutPath: string;
  private readonly animationPath: string;

  constructor() {
    this.region = process.env.AWS_REGION ?? 'us-east-1';
    this.bucket =
      process.env.AWS_CAPCUT_VIDEOS_BUCKET_NAME ??
      process.env.AWS_BUCKET_NAME ??
      '';
    this.capcutPath =
      process.env.AWS_CAPCUT_VIDEOS_BUCKET_PATH ??
      this.joinPath(process.env.AWS_S3_BUCKET_PATH ?? '', 'capcut_videos');
    this.animationPath =
      process.env.AWS_ANIMATION_VIDEOS_BUCKET_PATH ??
      this.joinPath(process.env.AWS_S3_BUCKET_PATH ?? '', 'animation_videos');

    this.client = new S3Client({
      region: this.region,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }

  async uploadCapcutVideo(input: UploadVideoFileInput): Promise<string> {
    if (!this.bucket) {
      throw new Error('AWS bucket no configurado');
    }

    const key = this.buildCapcutVideoKey(input.sellerId, input.originalName);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.contentType ?? 'video/mp4',
      }),
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async uploadAnimationVideo(
    input: UploadAnimationVideoFileInput,
  ): Promise<string> {
    if (!this.bucket) {
      throw new Error('AWS bucket no configurado');
    }

    const key = this.buildAnimationVideoKey(
      input.templateId,
      input.originalName,
    );

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.contentType ?? 'video/mp4',
      }),
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private buildCapcutVideoKey(sellerId: number, originalName: string): string {
    const extension = this.getExtension(originalName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = this.sanitizeFileName(originalName.replace(/\.[^.]+$/, ''));
    const filename = `${timestamp}-${safeName || 'video'}${extension}`;

    return this.joinPath(this.capcutPath, `seller-${sellerId}`, filename);
  }

  private buildAnimationVideoKey(
    templateId: string | undefined,
    originalName: string,
  ): string {
    const extension = this.getExtension(originalName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = this.sanitizeFileName(originalName.replace(/\.[^.]+$/, ''));
    const safeTemplate = this.sanitizeFileName(templateId ?? 'template');
    const filename = `${timestamp}-${safeName || 'video'}${extension}`;

    return this.joinPath(this.animationPath, safeTemplate, filename);
  }

  private getExtension(fileName: string): string {
    const extension = fileName.match(/\.[a-zA-Z0-9]+$/)?.[0];
    return extension ? extension.toLowerCase() : '.mp4';
  }

  private sanitizeFileName(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .toLowerCase();
  }

  private joinPath(...parts: string[]): string {
    return parts
      .map((part) => part.trim().replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');
  }
}
