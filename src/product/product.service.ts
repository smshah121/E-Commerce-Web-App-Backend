import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "src/product-image/entities/product-image.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateProductImageDto } from "src/product-image/dto/create-product-image.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

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

  async addImage(productId: number, dto: CreateProductImageDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

    const image = this.imageRepo.create({ ...dto, product });
    return this.imageRepo.save(image);
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
