import { IsEmail, IsNumber, IsString } from "class-validator";

export class RegisterAuthDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsString()
    avatar?: string;
    @IsNumber()
    age?: number;
    @IsString()
    gender?: 'male' | "female";
}
