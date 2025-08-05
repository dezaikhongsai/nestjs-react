import { HttpException, HttpStatus } from "@nestjs/common";

export type ApiResponse<T> = {
    status : 'success' | 'error';
    message : string;
    data ? : T;
}


export class ApiError extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode,
        message,
      },
      statusCode,
    );
  }
}
export const API_PREFIX = '/api/v1';