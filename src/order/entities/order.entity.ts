import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { OrderStatus } from '../dto/update-order.dto';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  orderedAt: Date;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  // Shipping Address Details
  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  // Price Details
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  // Relationships
  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  customer: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
