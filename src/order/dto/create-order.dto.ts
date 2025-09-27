// src/order/dto/create-order.dto.ts
import { IsArray, IsNotEmpty, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// This remains the same, defining what an item looks like in the input
export class OrderItemInput {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

// New DTO for the Address part of the order
export class AddressInput {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

// The main CreateOrderDto, now including address and financial details
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @ValidateNested()
  @Type(() => AddressInput)
  @IsNotEmpty()
  address: AddressInput; // Nested address object

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  // Status and orderedAt are handled by the entity's defaults/CreateDateColumn
  // customerId is derived from the authenticated user, not part of the DTO payload
}
