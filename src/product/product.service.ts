import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "src/product-image/entities/product-image.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateProductImageDto } from "src/product-image/dto/create-product-image.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import cloudinary from 'src/common/cloudinary/cloudinary.config';

import streamifier from 'streamifier';



@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductImage) private imageRepo: Repository<ProductImage>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async createProduct(dto: CreateProductDto, adminId: number) {
    const admin = await this.userRepo.findOneBy({ id: adminId });
    if (!admin) throw new NotFoundException('Admin not found');

    const product = this.productRepo.create({ ...dto, admin });
    return this.productRepo.save(product);
  }

  async addImage(productId: number, file: Express.Multer.File) {
  const product = await this.productRepo.findOneBy({ id: productId });
  if (!product) throw new NotFoundException('Product not found');

  return new Promise(async (resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        async (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) return reject(new Error('Cloudinary upload failed'));

          const image = this.imageRepo.create({
            image: result.secure_url,
            product,
          });
          const savedImage = await this.imageRepo.save(image);
          resolve(savedImage);
        }
      );

      // Convert buffer to readable stream and pipe to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } catch (err) {
      reject(err);
    }
  });
}

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    return this.productRepo.remove(product);
  }

  async deleteImage(imageId: number) {
    const image = await this.imageRepo.findOneBy({ id: imageId });
    if (!image) throw new NotFoundException('Image not found');

    return this.imageRepo.remove(image);
  }

  async findAll() {
    return this.productRepo.find({ relations: ['images'] });
  }

  async findOne(id: number) {
    return this.productRepo.findOne({ where: { id }, relations: ['images'] });
  }

  async findByAdmin(adminId: number) {
  console.log('Fetching products for admin ID:', adminId);
  const products = await this.productRepo.find({
    where: { admin: { id: adminId } },
    relations: ['images', 'admin'],
    order: { id: 'DESC' },
  });
  console.log('Products found:', products.length);
  return products;
}


}
