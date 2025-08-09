import { Module} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { MailModule } from './modules/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { UserModule } from './modules/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // fallback về `.env`
      
    }),
    PassportModule,
    AuthModule,
    RedisModule,
    OtpModule,
    MailModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {provide : APP_GUARD , useClass : JwtAuthGuard},
    {provide : APP_GUARD , useClass : RolesGuard}
  ],
})
export class AppModule {}
