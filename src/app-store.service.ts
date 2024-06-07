import { BadRequestException, Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { HelperService } from '@apps/helper/helper.service';

/**
 * Сервис для работы с хранилищем данных.
 */
@Injectable()
export class AppStoreService {
  // Мьютекс для синхронизации доступа к файлу хранилища
  private mutex = new Mutex();
  // Файл хранилище
  private filePath = 'storage.json';

  constructor() {}

  /**
   * @memberof AppStoreService
   * ПОЛУЧЕНИЕ ДАННЫХ ИЗ ФАЙЛА
   * @async
   * @description
   * Асинхронно получает данные из хранилища.
   * Если данные не найдены, генерируется BadRequestException.
   * @returns ({Promise<any>})
   */
  async getData(): Promise<any> {
    const release = await this.mutex.acquire();
    try {
      const data = HelperService.readFile(this.filePath);
      return JSON.parse(data);
    } catch (error) {
      throw new BadRequestException('Данные не найдены');
    } finally {
      release();
    }
  }

  /**
   * @memberof AppStoreService
   * ЗАПИСЬ ДАННЫХ В ФАЙЛ
   * @async
   * @description
   * Асинхронно записывает новые данные в хранилище.
   * @param newData - Новые данные для записи.
   * @returns ({Promise<void>})
   */
  async setData(newData: any): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      const dataToWrite = JSON.stringify(newData, null, 2);
      HelperService.writeFile(this.filePath, dataToWrite);
    } finally {
      release();
    }
  }

  /**
   * @memberof AppStoreService
   * УДАЛЕНИЕ ДАННЫХ ИЗ ФАЙЛА
   * @async
   * @description
   * Асинхронно удаляет данные, связанные с указанным ключом, из хранилища.
   * Если происходит ошибка в процессе удаления данных, генерируется BadRequestException.
   * @param {String} key - Ключ, связанный с данными для удаления.
   * @returns ({Promise<void>})
   */

  async deleteData(key: string): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      const data = HelperService.readFile(this.filePath);
      const parsedData = JSON.parse(data);
      delete parsedData[key];
      const dataToWrite = JSON.stringify(parsedData, null, 2);
      HelperService.writeFile(this.filePath, dataToWrite);
    } catch (error) {
      throw new BadRequestException(error);
    } finally {
      release();
    }
  }
}
