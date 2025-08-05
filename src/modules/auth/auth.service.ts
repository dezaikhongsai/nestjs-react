import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { ApiError } from 'src/common/configs';
import * as bcrypt from 'bcrypt'; 
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import {JwtService} from '@nestjs/jwt'
import { jwtOptions } from 'src/common/configs';
@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService, 
        private otpService : OtpService, 
        private mailService : MailService,
        private jwtService : JwtService
    ) {}

    // logic đăng ký user
    async register (data: RegisterDto ) {
        const {password , ...userData} = data ;
        const existingUser = await this.prisma.user.findUnique(
            {where : {username : userData.username}}
        )
        if(userData.email === existingUser?.email) throw new ApiError('Email đã tồn tại !' , HttpStatus.BAD_REQUEST);
        if(existingUser) throw new ApiError('Thông tin đăng ký đã tồn tại !' , HttpStatus.BAD_REQUEST);
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await this.prisma.user.create({
            data : {
                ...userData,
                password : hashedPassword
            },
            select : {
                id : true,
                email : true,
                username : true,
                name : true,
                role : true,
            }
        })
        const otp = await this.otpService.generateAndSaveOtp(newUser.email);
        if(!otp) throw new ApiError("Tạo OTP thất bại !" , HttpStatus.BAD_REQUEST);
        await this.mailService.sendOtpMail(newUser.email , otp);
        return newUser;
    }

    // Kích hoạt user
    async ativeUser (email : string , otpInput : string) {
        const isValidUser = await this.prisma.user.findUnique({where : {email}});
        if(!isValidUser) throw new ApiError("Người dùng không tồn tại" , HttpStatus.BAD_GATEWAY);
        const validOtp = await this.otpService.verifyOtp(email , otpInput);
        if(!validOtp) throw new ApiError("Mã Otp không hợp lệ !" , HttpStatus.BAD_REQUEST);
        const activateUser = await this.prisma.user.update(
            {
                where : {email : email},
                data : {isActive : true}
            }
        );
        const {password , hashRT , ...userRes} = activateUser;
        return userRes;
    }

    // Đăng nhập
    async login (data : LoginDto) {
        const validUser = await this.prisma.user.findUnique({where : {username : data.username}});
        if(!validUser) throw new ApiError("Thông tin đăng nhập không hợp lệ !");
        const isValidPassword = await bcrypt.compare(data.password , validUser.password);
        if(!isValidPassword) throw new ApiError("Thông tin đăng nhập không hợp lệ !");
        if(!validUser.isActive) throw new ApiError("Người dùng chưa được kích hoạt !" , HttpStatus.FORBIDDEN);
        const {password ,hashRT , ...userData} = validUser;
        const tokens = await this.generateTokens(userData.id , userData.username);
        await this.updateRefreshToken(userData.id , tokens.refreshToken);
        return {
            user : userData,
            tokens : tokens
        }
    }

    // Tạo tokens
    async generateTokens(userId : string , username : string) {
        const payload = {sub : userId , username};
        const accessToken = await this.jwtService.signAsync(payload , {
            secret : jwtOptions.accessSecret,
            expiresIn : jwtOptions.accessExpiresIn  
        });
        
        const refreshToken = await this.jwtService.signAsync(payload , {
            secret : jwtOptions.refreshSecret,
            expiresIn: jwtOptions.refreshExpiresIn
        })
        return {accessToken , refreshToken};
    }

    // hàm updateRefeshToken
    async updateRefreshToken(userId : string , rt : string) {
        const hashRT = await bcrypt.hash(rt , 10);
        await this.prisma.user.update({
            where : {id : userId},
            data  : {hashRT : hashRT}
        })
    }

    // kiểm tra refreshToken
    async validateRT (userId : string , rt : string) {
        const user = await this.prisma.user.findUnique({
            where : {id : userId}
        });
        if(!user || !user.hashRT ) return false;
        const isMatch = await bcrypt.compare(rt , user.hashRT);
        return isMatch;
    }

    // Đăng xuất
    async logout(userId: string) {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { hashRT: null },
            });
        } catch (error) {
            throw new ApiError('Lỗi khi đăng xuất', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refreshToken(userId: string, refreshToken: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new ApiError('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
            }
            if (!user.hashRT) {
                throw new ApiError('Refresh token không tồn tại', HttpStatus.UNAUTHORIZED);
            }
            const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashRT);
            
            if (!isRefreshTokenValid) {
                throw new ApiError('Refresh token không hợp lệ', HttpStatus.UNAUTHORIZED);
            }
            const tokens = await this.generateTokens(user.id, user.username);
            
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            const { password, hashRT, ...userData } = user;
            return {
                user: userData,
                tokens,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Lỗi xử lý refresh token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
