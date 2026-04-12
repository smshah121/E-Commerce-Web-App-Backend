import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Order,
    Product,
    OrderItem,
    ProductImage
  ]),OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
