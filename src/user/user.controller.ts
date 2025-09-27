import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';




@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.findOne(id)
    if(!user) throw new NotFoundException("user not found")
      return user;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise <{message: string}> {
    const userUpdated = await this.userService.update(id, updateUserDto);
    if(!userUpdated) throw new NotFoundException("user not found")
      return {message: "user updated successfully"}
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User |{message: string, deletedId: number} > {
    const deleted = await this.userService.remove(id)
    if(!deleted) throw new NotFoundException("user not found")
      return {message: "id deleted successfully", deletedId: id}
  }
}
