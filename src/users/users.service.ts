import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from './user.constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FindUsersDto } from './dto/find-users.dto';
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(findUsersDto: FindUsersDto) {
    const { page = 1, limit = 10, order = 'DESC', role, is_active, search } = findUsersDto;
    let { sort = 'id' } = findUsersDto;
    
    const skip = (page - 1) * limit;
    const allowedSort = ['id', 'name', 'email', 'createdAt', "is_active", "role"];
    if (!allowedSort.includes(sort)) sort = 'id';

    const qb = this.userRepository.createQueryBuilder('user');

    if (role) qb.andWhere('user.role = :role', { role });
    if (typeof is_active !== 'undefined') qb.andWhere('user.is_active = :is_active', { is_active });

    if (search && search.trim().length) {
      qb.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `${search}%` }
      );
    }

    const [users, total] = await qb
      .orderBy(`user.${sort}`, order)
      .skip(skip)
      .take(Math.min(limit, 100)) 
      .getManyAndCount();

    return { data:users, total, totalPages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
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
