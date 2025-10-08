import { IsEmail, IsString, Matches } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    email: string;
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)
    password: string;
}   