import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export class AppMessageDTO {
  @ApiProperty({ description: 'Данные из одноразовой ссылки' })
  message: string;
}

export class AppCreateDataDto {
  @ApiProperty({ description: 'Сообщение', example: 'тестовое сообщение' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class AppLinkDto {
  @ApiProperty({
    description: 'Сообщение',
    example:
      'https://localhost:4000/api/v1/244bd0e0-018f-4da7-8dc7-b1ad4b9b3ce2',
  })
  url: string;
}

export class AppGetLinksDTO {
  @ApiProperty({
    description: 'Сообщение',
  })
  linkId: string;
}

export class BadRequestExceptionDto {
  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: ['message must be a string'],
  })
  message: string | string[];

  @ApiProperty({ description: 'Тип ошибки', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Статус', example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export class NotFoundExceptionDto {
  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Ссылка не найдена или уже использована',
  })
  message: string;

  @ApiProperty({ description: 'Статус', example: HttpStatus.NOT_FOUND })
  statusCode: number;
}
