import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express';

import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { LocalAuthGuard } from './guards/local-guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public-decorators';


@Controller('auth')
export class AuthController {
  constructor
  (
    private authService: AuthService,


  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }


   @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth2 login
  }

  // Google callback
  @Get('google/callback')
@Public()
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req, @Res() res: Response) {

    const tokenData = await this.authService.googleLogin(req.user);

return res.redirect(
  `https://pricetag-tech.netlify.app/oauth-success?token=${tokenData.access_token}&role=${tokenData.role}&id=${tokenData.id}`,
);
}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
