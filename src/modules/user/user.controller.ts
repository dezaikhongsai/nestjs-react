import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from 'src/common/configs';
import { Roles } from 'src/common/decorators/auth.decorator';
import { ROLES } from 'src/common/constants';

@Controller('user')
export class UserController {
    constructor(private userService : UserService){}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @Roles(ROLES.USER)
    async findAllController() {
        const listUsers = await this.userService.findAll();
        return {
            status :'success',
            message : 'Lấy danh sách thành công !',
            data : listUsers
        } as ApiResponse<typeof listUsers>
    }

}
