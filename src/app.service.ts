import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { AppCreateDataDto, AppLinkDto, AppMessageDTO } from '@apps/dto/app.dto';
import { AppStoreService } from '@apps/app-store.service';

@Injectable()
export class AppService {
  constructor(
    private config: ConfigService,
    private localStore: AppStoreService,
  ) {}

  /**
   * @memberof AppService
   * СОЗДАНИЕ ССЫЛКИ
   * @param {String} id - Уникальный идентификатор ссылки на основе UUID v4
   */
  composeUrl(id: string): string {
    return `${this.config.get('app.uri')}:${this.config.get('app.port')}/api/v1/${id}`;
  }

  /**
   * @memberof AppService
   * ГЕНЕРАЦИЯ УНИАЛЬНОЙ ССЫЛКИ
   * @param {String} dataInsert
   */
  async generateUniqueLink(dataInsert: AppCreateDataDto): Promise<AppLinkDto> {
    const storedData = (await this.localStore.getData()) || {};
    const existingLink = Object.keys(storedData).find(
      (key) =>
        storedData[key].dataInsert === dataInsert && storedData[key].active,
    );

    if (existingLink) {
      return storedData[existingLink].link;
    }

    let link = uuidv4();

    const url = this.composeUrl(link);
    storedData[link] = { dataInsert, link: url, active: true };
    await this.localStore.setData(storedData);
    return { url };
  }

  /**
   * @memberof AppService
   * ПОЛУЧЕНИЕ УНИАКАЛЬНОЙ ССЫЛКИ
   * @param {String} linkId
   */
  async getMessageByLink(
    linkId: string,
  ): Promise<AppMessageDTO | NotFoundException> {
    const storedData = await this.localStore.getData();
    if (storedData && storedData[linkId] && storedData[linkId].active) {
      storedData[linkId].active = false;
      await this.localStore.deleteData(linkId);
      return storedData[linkId].dataInsert;
    } else {
      throw new HttpException(
        'Ссылка не найдена или уже использована',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
