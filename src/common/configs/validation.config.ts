import { ValidationPipeOptions } from "@nestjs/common";

export const validationOptions : ValidationPipeOptions = {
    whitelist : true,
    forbidNonWhitelisted : true,
    transform : true,
};