import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword
    })
    return this.userRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({id})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id})
    if(!user) return null
    if(updateUserDto.password){
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    else{
      delete updateUserDto.password
    }

    const updatedUser = await this.userRepository.merge(user, updateUserDto)
    return this.userRepository.save(updatedUser)

  }

  async remove(id: number): Promise<User | null> {
    const user  = await this.userRepository.findOneBy({id})
    if(!user) return null
    else{
      await this.userRepository.remove(user)
      return user

    }

  }

  async findByEmail(email: string): Promise<User | null>{
    return this.userRepository.findOne({where: {email}})
  }

  async findById(id: number): Promise<any>{
    return this.userRepository.findOne({where: {id}})
  }
}
