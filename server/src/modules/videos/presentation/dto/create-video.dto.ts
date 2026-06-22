import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateVideoDto {
    @IsNotEmpty()
    @MinLength(3)
    name: string;
    @IsNotEmpty()
    @MinLength(3)
    url: string;
}