import { ApiProperty } from '@nestjs/swagger';

export class AppMessageDTO {
  @ApiProperty({ description: 'Сообщение из одноразовой ссылки' })
  message: string;
}
