import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { ProductImage } from './product-image/entities/product-image.entity';
import { OrderItem } from './order-item/entities/order-item.entity';
import { Order } from './order/entities/order.entity';


dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Product, ProductImage, OrderItem, Order],
  migrations: ["src/migrations/*.ts"],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
});