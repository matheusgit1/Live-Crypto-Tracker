import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { configureSwagger } from './configs/swagger.config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import cors from 'cors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const { endpoint } = configureSwagger(app);

  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // app.use(
  //   cors({
  //     origin: 'http://localhost:3000',
  //   }),
  // );

  await app.listen(process.env.PORT ?? 4001, () => {
    logger.log(`Server is running on port ${process.env.PORT ?? 4001}`);
    logger.log(
      `WebSocket is running on: ws://localhost:${process.env.PORT ?? 4001}/prices`,
    );
    logger.log(
      `Swagger docs available at http://localhost:${process.env.PORT ?? 4001}/${endpoint}`,
    );
  });
}
bootstrap();
