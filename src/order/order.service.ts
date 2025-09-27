// src/order/order.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const { items, address, subtotal, shipping, tax, total } = dto;

    const order = this.orderRepo.create({
      customer: user,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      subtotal,
      shipping,
      tax,
      total,
      status: OrderStatus.PENDING,
      orderedAt: new Date(),
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const product = await this.productRepo.findOneBy({ id: item.productId });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const orderItem = this.itemRepo.create({
        product,
        order: savedOrder,
        quantity: item.quantity,
      });
      orderItems.push(orderItem);
    }

    await this.itemRepo.save(orderItems);

    return this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'customer'],
    });
  }
  async findOrdersByAdmin(adminId: number) {
  return this.orderRepo
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.customer', 'customer')
    .leftJoinAndSelect('order.items', 'orderItem')

    .leftJoinAndSelect('orderItem.product', 'product')
    .where('product.adminId = :adminId', { adminId })
    .getMany();
}


  async findAllForCustomer(userId: number) {
    return this.orderRepo.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product'],
      order: { orderedAt: 'DESC' },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id, customer: { id: userId } },
      relations: ['items', 'items.product', 'customer'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found for this user.`);
    }
    return order;
  }

  // Admin-only method to find all orders
  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['items', 'items.product', 'customer'],
      order: { orderedAt: 'DESC' },
    });
  }
}
