import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true, nullable: true })
  images: string[];

  @Column({ nullable: true })
  altText: string;

  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product: Product;
}
