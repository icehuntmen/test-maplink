import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import swaggerInit from './app.swagger';

const logger = new Logger('NestApplication');

async function bootstrap(logger: Logger) {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);

  // Start app
  const APP_ROUTE_PREFIX = 'api';
  app
    .enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
    .setGlobalPrefix(APP_ROUTE_PREFIX);

  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  await swaggerInit(app);

  app.enableCors({
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Signature, Authorization',
    origin: true,
    credentials: true,
  });

  await app.listen(configService.get('app.port'), () => {
    logger.log(`API application on port: ${configService.get('app.port')}`);
    logger.log(
      `API application 'version:' ${configService.get('app.version')} started!`,
    );
    logger.verbose(
      `🚀: http://localhost:${configService.get('app.port')}/swagger`,
    );
  });

  return app;
}

/**
 * Shutdown the application.
 */
bootstrap(logger).catch((error: unknown) => {
  logger.error(`API bootstrapping application failed! ${error}`);
});
