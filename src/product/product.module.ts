import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,User, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductModule {}
