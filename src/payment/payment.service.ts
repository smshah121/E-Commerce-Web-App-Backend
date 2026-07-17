// payment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
const Stripe = require('stripe');

@Injectable()
export class PaymentService {
  private stripe

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe secret key missing!');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
 async createCheckoutSession(orderId: number) {
  // 1️⃣ Fetch order with products + images
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: ['items', 'items.product', 'items.product.images'],
  });

  if (!order) throw new Error('Order not found');

  // 2️⃣ Convert to Stripe line items
  const line_items = order.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: item.product.images?.length
          ? [item.product.images[0].image]
          : [],
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  // 3️⃣ Create Stripe session
  const session = await this.stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',

    metadata: {
      orderId: orderId.toString(),
    },

    success_url: 'https://pricetag-tech.netlify.app/payment-success',
    cancel_url: 'https://pricetag-tech.netlify.app/payment-cancel',
  });
    return session;
  }
}