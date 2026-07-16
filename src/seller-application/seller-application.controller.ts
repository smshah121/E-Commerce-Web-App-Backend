/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { SellerApplicationService } from './seller-application.service';
import { CreateSellerApplicationDto } from './dto/create-seller-application.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('seller-applications')
export class SellerApplicationController {
  constructor(
    private readonly sellerApplicationService: SellerApplicationService,
  ) {}

  // Customer submits seller application
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post()
  create(
    @Body() dto: CreateSellerApplicationDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.sellerApplicationService.createApplication(dto, user.sub);
  }

  // Admin views all applications
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.sellerApplicationService.findAllApplications();
  }

  // Admin approves application
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sellerApplicationService.approveApplication(id);
  }

  // Admin rejects application
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sellerApplicationService.rejectApplication(id);
  }
}