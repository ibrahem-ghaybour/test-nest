import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // PUBLIC: تسجيل دخول -> لا تستخدم Guard هنا
  @Post('login')
  async signIn(@Body() body: LoginAuthDto) {
    return this.authService.signIn(body);
  }

  // PUBLIC: تسجيل حساب جديد
  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  // PROTECTED: مثال لمسار محمي؛ ضع Guards هنا
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user') // أو 'admin' بحسب ما تريده
  @Get('my')
  async profile(@CurrentUser() {id}: any) {
    return this.authService.profile(id);
  }
}
