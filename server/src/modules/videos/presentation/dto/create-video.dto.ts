import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(3)
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idAdmin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idTemplate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  type?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idSeller?: number;
}

export class CreateCapcutVideoDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  url: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idSeller: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idAdmin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  status?: number;
}

export class UploadCapcutVideoDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idSeller: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idAdmin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  status?: number;
}

export class UploadAnimationVideoDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  templateId?: string;
}

export class RenderAnimationVideoDto {
  @IsNotEmpty()
  @IsString()
  compositionId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsObject()
  inputProps?: Record<string, unknown>;
}
