import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Validation } from './shared/interceptors/validation';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // *********** App Global Pipes ************ //
  app.useGlobalPipes(
    new Validation({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => new BadRequestException(errors),
    }),
  );
  const Options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('shop Restful Apis. Click on each item in the list to see its details')
    .addServer(`${process.env.SWAGGER_LOCALSERVER}${process.env.PORT}`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const Document = SwaggerModule.createDocument(app, Options);
  SwaggerModule.setup('doc', app, Document);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

}

bootstrap();