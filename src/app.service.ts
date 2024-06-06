import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HelperService } from '@apps/helper/helper.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { AppMessageDTO } from '@apps/dto/app.dto';

@Injectable()
export class AppService {
  private uri: string = 'https://localhost';

  constructor(private config: ConfigService) {}

  getUrl() {
    return `${this.uri}:${this.config.get('app.port')}`;
  }
  async generateUniqueLink(dataInsert: string): Promise<string> {
    const storedData = (await HelperService.getData()) || {};
    const existingLink = Object.keys(storedData).find(
      (key) =>
        storedData[key].dataInsert === dataInsert && storedData[key].active,
    );

    if (existingLink) {
      return storedData[existingLink].link;
    }

    let link = uuidv4();

    const uri = `${this.getUrl()}/api/v1?link=${link}`;
    storedData[link] = { dataInsert, link: uri, active: true };
    HelperService.setData(storedData);
    return uri;
  }

  async getMessageByLink(link: string): Promise<AppMessageDTO | HttpException> {
    const storedData = await HelperService.getData();
    if (storedData && storedData[link] && storedData[link].active) {
      storedData[link].active = false;
      await HelperService.setData(storedData);
      const dataInsert = storedData[link].dataInsert;
      delete storedData[link]; // Удаляем данные по ссылке
      await HelperService.setData(storedData);
      return { message: dataInsert };
    } else {
      throw new HttpException(
        'Ссылка не найдена или уже использована',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
