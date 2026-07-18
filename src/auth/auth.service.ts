import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const users = await this.userService.findByEmail(email);
    if (users && (await bcrypt.compare(pass, users.password))) {
      const { password, ...result } = users;
      return result;
    }
    return null;
  }

  async validateUserbyId(id: number): Promise<User> {
    return this.userService.findById(id);
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      id: user.id,
      role: user.role,
    };
  }


  async googleLogin(googleUser: { email: string; name: string }): Promise<{ access_token: string; id: number, role: UserRole }> {
  // 1. Check if user exists
  let user = await this.userService.findByEmail(googleUser.email);

  // 2. If not, create user
  if (!user) {
    user = await this.userService.create({
      name: googleUser.name,
      email: googleUser.email,
      password: ''
    });
  } else if (!user.name) {
    // 3. If user exists but name is missing, update it
    user = await this.userService.update(user.id, { name: googleUser.name });
  }

  if (!user) throw new Error("Unable to create or find Google user");

  // 4. Generate JWT
  const payload = { username: user.email, sub: user.id, role:user.role };
  return {
    access_token: this.jwtService.sign(payload),
    id: user.id,
    role: user.role,
  };
}


  async getProfile(id: number): Promise<User> {
    const user = await this.userService.findById(id);
    return user;
  }
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string; id: number; role: string }> {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('email already in use');
    }

    const newUser = await this.userService.create(createUserDto);
    const payload = {
      sub: newUser.id,
      username: newUser.email,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      id: newUser.id,
      role: newUser.role,
    };
  }
}
