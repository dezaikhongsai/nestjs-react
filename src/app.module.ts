import { Module} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { MailModule } from './modules/mail/mail.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // fallback về `.env`
      
    }),
    AuthModule,
    RedisModule,
    OtpModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
