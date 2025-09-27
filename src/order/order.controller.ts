// src/order/order.controller.ts
import { Controller, Get, Post, Body, Param, Req, UseGuards, ParseIntPipe, NotFoundException, Patch } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as any;
    return this.orderService.createOrder(createOrderDto, user.id);
  }
  @UseGuards(RolesGuard,JwtAuthGuard)
@Roles(UserRole.ADMIN)
@Get('admin')
getOrdersForAdmin(@Req() req: Request) {
  const user = req.user as any;
  return this.orderService.findOrdersByAdmin(user.sub); // sub = admin ID
}


  @Get('my')
  async findAllForCurrentUser(@Req() req: Request) {
    const user = req.user as any;
    return this.orderService.findAllForCustomer(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllOrders() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    const order = await this.orderService.findOne(id, user.id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found for this user.`);
    }
    return order;
  }

  @Patch('/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto.status);
  }
}
