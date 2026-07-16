/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
 
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApplicationStatus } from 'src/common/enums/application-status.enum';

@Entity()
export class SellerApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @Column({
    length: 100,
  })
  storeName!: string;

  @Column({
    type: 'text',
  })
  storeDescription!: string;

  @Column({
    length: 20,
  })
  phone!: string;

  @Column({
    type: 'text',
  })
  address!: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @CreateDateColumn()
  createdAt!: Date;


}