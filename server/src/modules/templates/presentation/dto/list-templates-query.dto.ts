import { IsOptional, IsString } from 'class-validator';

export class ListTemplatesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
