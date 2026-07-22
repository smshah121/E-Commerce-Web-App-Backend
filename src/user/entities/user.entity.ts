import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { SellerApplication } from 'src/seller-application/entities/seller-application.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @OneToMany(() => Product, product => product.seller)
  products!: Product[];

  @OneToMany(() => Order, order => order.customer)
  orders!: Order[];

  @OneToOne(
    () => SellerApplication,
    sellerApplication => sellerApplication.user,
  )
  sellerApplication!: SellerApplication;

}
