import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions } from 'src/common/configs';
import { JwtAuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtStrategy } from './strategies/auth.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    OtpModule,
    MailModule,
    JwtModule.register({
      secret: jwtOptions.accessSecret,
      signOptions: { expiresIn: jwtOptions.accessExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RefreshTokenGuard, JwtStrategy],
  exports: [AuthService, JwtAuthGuard, RefreshTokenGuard],
})
export class AuthModule {}
