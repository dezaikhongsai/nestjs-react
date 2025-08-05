import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post,Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  LoginDto, RegisterDto, UserPayload } from './dto';
import { ApiResponse } from 'src/common/configs';
import { JwtAuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async registerController(@Body() data : RegisterDto ) {

        const newUser = await this.authService.register(data);
        return {
            status : 'success',
            message : 'Đăng ký thành công !',
            data: newUser,
        } as ApiResponse<typeof newUser>;  
    }

    @Patch('active')
    async activeUserController(@Body() data : {email : string , otp : string}) {
        const activateUser = await this.authService.ativeUser(data.email , data.otp);
        return {
            status :'success',
            message : 'Kích hoạt người dùng thành công !',
            data : activateUser
        } as ApiResponse<typeof activateUser>
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginController (@Body() data : LoginDto) {
        const loginRes = await this.authService.login(data);
        return {
            status : 'success',
            message : 'Đăng nhập thành công !',
            data : loginRes
        } as ApiResponse<typeof loginRes>;
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@CurrentUser() user : UserPayload) {
        return {
            status : 'success',
            message : 'Thông tin cá nhân !',
            data : user
        } as ApiResponse<typeof user>
    }
    

    // Tạm thời sử dụng trên body , việc lưu token trên mobile và web sẽ khác nhau
    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    async refreshTokenController(@Request() req, @Body() data: RefreshTokenDto) {
        const user = req.user; // Lấy payload từ RefreshTokenGuard
        const res = await this.authService.refreshToken(user.sub, data.refreshToken);
        return {
            status: 'success',
            message: 'Refresh token thành công',
            data: res
        } as ApiResponse<typeof res>
    }

    @UseGuards(JwtAuthGuard)
    @Patch('logout')
    async logoutController(@CurrentUser() user: UserPayload) {
        await this.authService.logout(user.id);
        return {
            status: 'success',
            message: 'Đăng xuất thành công !',
            data: null
        } as ApiResponse<null>
    }
}
