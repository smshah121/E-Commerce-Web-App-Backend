import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerApplicationDto } from './create-seller-application.dto';

export class UpdateSellerApplicationDto extends PartialType(CreateSellerApplicationDto) {}
