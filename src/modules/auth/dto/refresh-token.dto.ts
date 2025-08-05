// src/auth/dto/refresh-token.dto.ts
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({message : "Token không hợp lệ !"})
  refreshToken: string;
}
