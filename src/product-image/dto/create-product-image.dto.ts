import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductImageDto {
  @IsNotEmpty()
  images: string[];

  @IsOptional()
  @IsString()
  altText?: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
