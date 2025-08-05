import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy , ExtractJwt} from 'passport-jwt'
import { ApiError, jwtOptions } from "src/common/configs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma : PrismaService) {
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtOptions.accessSecret 
        });
    }
    
    // Dữ liệu trả về khi gọi request.user
    async validate(payload : {sub: string , username : string}) {
        const user = await this.prisma.user.findUnique({
            where : {id : payload.sub}
        });
        if(!user) throw new ApiError('Lỗi xác thực người dùng');
        const {password , ...userRes} = user;
        return userRes;
    }
}