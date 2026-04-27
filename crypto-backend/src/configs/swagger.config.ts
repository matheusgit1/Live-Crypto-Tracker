import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = {
  title: 'Crypto Tracker API',
  description: 'API documentation for the Crypto Tracker application',
  version: '1.0',
  // tag: 'crypto',
  endpoint: 'crypto-docs',
};

export const configureSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    // .addTag(swaggerConfig.tag)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConfig.endpoint, app, documentFactory);
  return swaggerConfig;
};
