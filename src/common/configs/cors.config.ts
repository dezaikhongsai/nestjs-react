import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const CLIENT_ENDPOINT_DEV = [process.env.WEB_DEV as string , process.env.MOBILE_DEV as string];
const CLIENT_ENDPOINT_PROD = [process.env.WEB_DEV as string , process.env.MOBILE_DEV as string];
const isProd = process.env.NODE_ENV as string === 'production';
export const corsOptions : CorsOptions = {
    origin : isProd ? CLIENT_ENDPOINT_DEV : CLIENT_ENDPOINT_PROD,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials : true,
};