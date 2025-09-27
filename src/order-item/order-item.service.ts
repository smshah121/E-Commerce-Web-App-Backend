import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>
  ) {}

  async getBuyersByProduct(productId: number) {
    const orderItems = await this.orderItemRepo
      .createQueryBuilder('orderItem')
      .innerJoinAndSelect('orderItem.order', 'order') // Changed to innerJoin
      .innerJoinAndSelect('order.customer', 'customer') // Changed to innerJoin
      .innerJoinAndSelect('orderItem.product', 'product')
      .where('orderItem.product = :productId', { productId })
      .getMany();

    const buyers = orderItems
      .map((item) => ({
        userId: item.order.customer.id,
        name: item.order.customer.name,
        email: item.order.customer.email,
        quantity: item.quantity,
        orderDate: item.order.orderedAt,
      }));

    return buyers;
  }
}
