import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { API_PREFIX, corsOptions, validationOptions } from './common/configs';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( new ValidationPipe(validationOptions));
  app.enableCors(corsOptions);
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(process.env.PORT ?? 3000 , '0.0.0.0');

  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 8081}`);
}
bootstrap();
