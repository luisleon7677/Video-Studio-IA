import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class UpdateTemplateDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(3)
  @IsUrl()
  url: string;
}
