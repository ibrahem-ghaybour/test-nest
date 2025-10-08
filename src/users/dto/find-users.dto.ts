import { IsOptional, IsInt, Min, IsString, IsIn, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class FindUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  search?: string = '';
}
