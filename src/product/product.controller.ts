import { Controller, Post, Get, Param, Body, UseGuards, Req, Delete, Patch, UseInterceptors, UploadedFile, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { Express } from 'express'

import { CreateProductDto } from './dto/create-product.dto';

import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateProductImageDto } from 'src/product-image/dto/create-product-image.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { ProductsService } from './product.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: Request) {
    const user = req.user as any;
    return this.productsService.createProduct(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
   @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/product-images',
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = `/uploads/product-images/${file.filename}`;
    return this.productsService.addImage(id, {productId: id, images: [imagePath] });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('my')
getMyProducts(@Req() req: Request) {
  const user = req.user as any;
  console.log('Current admin ID from token:', user.sub);
  return this.productsService.findByAdmin(user.sub);
}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id',  ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('images/:imageId')
  deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.productsService.deleteImage(imageId);
  }

  

}

