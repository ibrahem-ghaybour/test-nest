// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verifyAsync(token, { secret });

      const user = await this.usersService.findOne(decoded.id);
      if (!user) throw new UnauthorizedException('User not found');
      const { password, ...rest } = user;
      request.user = rest;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
          refreshRequired: true,
        });
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        });
      }

      throw new UnauthorizedException('Not authorized, token failed');
    }
  }
}
