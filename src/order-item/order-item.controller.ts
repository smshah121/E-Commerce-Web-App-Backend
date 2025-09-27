import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderItemService } from './order-item.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/user-role.enum';


@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/buyers/:productId')

@Roles(UserRole.ADMIN)
getBuyers(@Param('productId') productId: number) {
  return this.orderItemService.getBuyersByProduct(+productId);
}


}
