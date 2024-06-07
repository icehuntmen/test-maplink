import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from '@apps/app.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HelperService } from '@apps/helper/helper.service';
import {
  AppCreateDataDto,
  AppLinkDto,
  AppMessageDTO,
  BadRequestExceptionDto,
  NotFoundExceptionDto,
} from '@apps/dto/app.dto';

@ApiTags('Links')
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Создание одноразовой ссылки',
    description: HelperService.readDocsFile('create-link.md'),
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ссылка создана',
    type: AppLinkDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка при создании ссылки',
    type: BadRequestExceptionDto,
  })
  async createLinks(@Body() data: AppCreateDataDto) {
    return this.appService.generateUniqueLink(data);
  }

  @Get('/:linkId')
  @ApiOperation({
    summary: 'Получение данных из одноразовой ссылки',
    description: HelperService.readDocsFile('get-data.md'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные из одноразовой ссылки',
    type: AppMessageDTO,
  })
  @ApiNotFoundResponse({
    description: 'Сообщение об ошибке',
    type: NotFoundExceptionDto,
  })
  async getLinks(@Param('linkId') link: string): Promise<AppMessageDTO> {
    return this.appService.getMessageByLink(link);
  }
}
