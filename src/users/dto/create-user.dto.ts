import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsString()
    role?: string;
    @IsBoolean()
    is_active?: boolean;
    @IsString()
    avatar?: string;
    @IsNumber()
    age?: number;
    @IsString()
    gender?: 'male' | "female";
}
