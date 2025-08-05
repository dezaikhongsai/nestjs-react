import { HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApiError } from 'src/common/configs';

@Injectable()
export class MailService {
private transporter ;
    constructor () {
        this.transporter = nodemailer.createTransport({
            host : process.env.SMTP_HOST || 'smtp.example.com',
            port : Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOtpMail (to : string , otp : string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject : 'Mã OTP của bạn !',
                 html: `
                    <div>
                        <h3>Mã OTP của bạn là:</h3>
                        <p style="font-size: 24px; font-weight: bold;">${otp}</p>
                        <p>Mã có hiệu lực trong 5 phút.</p>
                    </div>
                    `,
            })
        } catch (error) {
            throw new ApiError('Gửi email thất bại, vui lòng thử lại sau !', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
