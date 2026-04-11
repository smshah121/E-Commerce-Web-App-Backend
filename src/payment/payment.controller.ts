const Stripe = require('stripe');
import { Request } from 'express';
import { Controller, Post, Req, Headers, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { OrderStatus } from 'src/order/dto/update-order.dto';
import { OrdersService } from 'src/order/order.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrdersService
  ){}
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post('create-checkout-session')
async createCheckoutSession(@Body() body: any) {
  const { orderId } = body; // 👈 get from frontend

  const session = await this.paymentService.createCheckoutSession(orderId);

  return { url: session.url };
}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret!,
      );
    } catch (err: any) {
      console.log('Webhook Error:', err.message);
      return { status: 'failed' };
    }

    if (event.type === 'checkout.session.completed') {
      console.log('✅ Payment Successful');
      const session = event.data.object as any;

  const orderId = session.metadata?.orderId;

  console.log('Payment successful for order:', orderId);

  if (orderId) {
    await this.orderService.updateStatus(
      Number(orderId),
      OrderStatus.PAID,
    );
  }
      
    }

    return { received: true };
  }
}