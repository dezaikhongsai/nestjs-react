import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiResponse } from 'src/common/configs';

@Controller('otp')
export class OtpController {
    constructor(private otpService : OtpService) {}

    @Post('resend')
    async resendOtp (@Body() data : {email: string}) {
        const newOtp = await this.otpService.resendOtp(data.email);
        return {
            status : 'success',
            message : 'Gửi lại Otp thành công !',
            data : newOtp
        } as ApiResponse<typeof newOtp>
    }
}