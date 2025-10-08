import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from './user.constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.save(createUserDto);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      const result = users.map((user) => {
        const { password, ...result } = user;
        return result;
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    try {
      return this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
