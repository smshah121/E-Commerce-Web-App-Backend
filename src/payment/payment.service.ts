// payment.service.ts
import { Injectable } from '@nestjs/common';
const Stripe = require('stripe');

@Injectable()
export class PaymentService {
  private stripe

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe secret key missing!');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async createCheckoutSession(orderId:number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Course' },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
      orderId: orderId.toString(),
    },
      success_url: 'https://e-commerce-web-app-backend-1s1s.onrender.com/payment-success',
      cancel_url: 'https://e-commerce-web-app-backend-1s1s.onrender.com/payment-cancel',
    });
    return session;
  }
}