/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';

export class CreateSellerApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  storeName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  storeDescription!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;
}