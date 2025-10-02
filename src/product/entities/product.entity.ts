import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  stock: number;

  @ManyToOne(() => User, user => user.products, { onDelete: 'SET NULL', eager: true })
  admin: User;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true , eager: true })
  images: ProductImage[];

  @OneToMany(() => OrderItem, item => item.product)
  orderItems: OrderItem[];
}
