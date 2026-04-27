import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { configureSwagger } from './configs/swagger.config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const { endpoint } = configureSwagger(app);

  await app.listen(process.env.PORT ?? 4000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 4000}`);
    console.log(
      `Swagger docs available at http://localhost:${process.env.PORT ?? 4000}/${endpoint}`,
    );
  });
}
bootstrap();
