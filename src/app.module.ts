import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { Product } from './product/entities/product.entity';
import { ProductImage } from './product-image/entities/product-image.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order-item/entities/order-item.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes .env available everywhere
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Product, Order, ProductImage, OrderItem],
        synchronize: false,
        ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    UserModule,
    AuthModule,
    OrderModule,
    ProductModule,
    ProductImageModule,
    OrderItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

