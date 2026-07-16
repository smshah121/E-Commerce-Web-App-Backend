/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SellerApplication } from './entities/seller-application.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateSellerApplicationDto } from './dto/create-seller-application.dto';

import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class SellerApplicationService {
  constructor(
    @InjectRepository(SellerApplication)
    private readonly sellerApplicationRepo: Repository<SellerApplication>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Customer submits application
  async createApplication(
    dto: CreateSellerApplicationDto,
    userId: number,
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }


    

    const existingApplication =
      await this.sellerApplicationRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations: ['user'],
      });

    if (existingApplication) {
      throw new BadRequestException(
        'You have already submitted a seller application.',
      );
    }

    const application = this.sellerApplicationRepo.create({
      ...dto,
      user,
      status: ApplicationStatus.PENDING,
    });

    return this.sellerApplicationRepo.save(application);
  }

  // Admin gets all applications
  async findAllApplications() {
    return this.sellerApplicationRepo.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Admin approves application
  async approveApplication(id: number) {
    const application = await this.sellerApplicationRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Seller application not found');
    }

   
    if (application.status !== ApplicationStatus.PENDING) {
  throw new BadRequestException(
    'This application has already been processed.',
  );
}

    application.status = ApplicationStatus.APPROVED;

    application.user.role = UserRole.SELLER;

    await this.userRepo.save(application.user);

    await this.sellerApplicationRepo.save(application);

    return {
      message: 'Seller application approved successfully.',
      application,
    };
  }

  // Admin rejects application
  async rejectApplication(id: number) {
    const application = await this.sellerApplicationRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Seller application not found');
    }

   
    if (application.status !== ApplicationStatus.PENDING) {
  throw new BadRequestException(
    'This application has already been processed.',
  );
}

    application.status = ApplicationStatus.REJECTED;

    await this.sellerApplicationRepo.save(application);

    return {
      message: 'Seller application rejected successfully.',
      application,
    };
  }
}