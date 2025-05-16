import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // me sirve más usar este puerto, el normal lo tengo ocupado con otro proyecto jeje
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3002);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();