import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({message : 'Tài khoản không được để trống !'})
    username: string;

    @MinLength(6 , {message : 'Mật khẩu phải có ít nhất 6 ký tự !'})
    @MaxLength(20 , {message : 'Mật khẩu không được vượt quá 20 ký tự !'})
    password : string;

    @IsNotEmpty({message : 'Email không được để trống !'})
    @IsEmail({}, {message : 'Email không hợp lệ !'})
    @MaxLength(50 , {message : 'Email không được vượt quá 50 ký tự !'})
    email : string;

    @IsNotEmpty({message : 'Họ tên không được để trống !'})
    name : string;

    @IsOptional()
    @IsEnum(['USER', 'ADMIN'], {message : 'Vai trò không hợp lệ !'})
    role : string ;

    @IsOptional()
    isActive : boolean

}

export class RegisterBodyDto extends RegisterDto {
    @IsOptional()
    otpInput : string
}