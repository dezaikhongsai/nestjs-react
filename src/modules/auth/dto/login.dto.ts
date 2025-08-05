import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message : "Tài khoản không được để trống !"})
    username : string;

    @MinLength(6, {message : "Mật khẩu phải có ít nhất 6 ký tự !"})
    @MaxLength(20, {message : "Mật khẩu không được vượt quá 20 ký tự !"})
    password : string
}