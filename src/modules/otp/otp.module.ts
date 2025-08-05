import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisService } from 'src/redis/redis.service';
import { OtpController } from './otp.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports : [MailModule],
  providers: [OtpService , RedisService ],
  exports: [OtpService],
  controllers: [OtpController], // Exporting OtpService to be used in other modules
})
export class OtpModule {}
