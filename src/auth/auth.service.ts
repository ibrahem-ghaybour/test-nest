import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { USER_REPOSITORY } from 'src/users/user.constants';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signIn(loginAuthDto: LoginAuthDto) {
        const { email, password } = loginAuthDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role', 'avatar', 'age', 'gender', 'createdAt', 'updatedAt']
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
        }
        const { password: _, ...rest } = user;
        return {
            ...rest,
            token: this.jwtService.sign({ id: user.id ,email:user.email,name:user.name})
        };
    }
    async register(registerAuthDto: RegisterAuthDto) {
        const { email, password } = registerAuthDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
        });
        return this.userRepository.save(newUser);
    }
    async profile(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const { password: _, ...rest } = user;
        return rest;
    }
}
