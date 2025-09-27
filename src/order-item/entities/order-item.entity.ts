import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderItems, { onDelete: 'CASCADE' })
  product: Product;
}
