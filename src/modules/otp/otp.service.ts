import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from 'src/common/configs';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OtpService {
    constructor(private redisService: RedisService , private mailService : MailService) {}

    async generateAndSaveOtp(email : string , ttlSeconds = 60000) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.setOtp(email , otp , ttlSeconds);
        return otp;
    }

    async verifyOtp(email : string , otp : string) {
        const savedOtp = await this.redisService.getOtp(email);
        if(!savedOtp || otp !== savedOtp) throw new ApiError('OTP không hợp lệ hoặc đã hết hạn', HttpStatus.BAD_REQUEST);
        await this.redisService.deleteOtp(email);
        return true;
    }
    
    async resendOtp (email : string , ttlSeconds = 60000) {
        const otp = await this.generateAndSaveOtp(email, ttlSeconds);
        await this.mailService.sendOtpMail(email , otp);
        return otp;
    }   
}
