import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HelperService } from '@apps/helper/helper.service';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export default async function swaggerInit(app: INestApplication) {
  const configService = app.get(ConfigService);
  const fileDocumentSecondary: string =
    HelperService.readDocsFile('description.md');

  const description: string = [fileDocumentSecondary]
    .filter((el) => el)
    .join('\n\n');

  const documentBuild = new DocumentBuilder()
    .setTitle(`Map Links API`)
    .setDescription(description)
    .setVersion(`v${configService.get('app.version')}`)
    .setContact('Alexander Hunter', null, 'icehuntmen@gmail.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    deepScanRoutes: true,
    extraModels: [],
  });

  const theme = new SwaggerTheme();
  const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.FLATTOP),
    customSiteTitle: 'Map Links',
  };
  SwaggerModule.setup('swagger', app, document, options);
}
