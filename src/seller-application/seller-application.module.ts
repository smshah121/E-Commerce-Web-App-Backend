/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SellerApplicationService } from './seller-application.service';
import { SellerApplicationController } from './seller-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { SellerApplication } from './entities/seller-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SellerApplication])],
  controllers: [SellerApplicationController],
  providers: [SellerApplicationService],
  exports: [SellerApplicationService],
})
export class SellerApplicationModule {}
