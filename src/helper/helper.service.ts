import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Mutex } from 'async-mutex';

@Injectable()
export class HelperService {
  private static mutex = new Mutex();
  private static filePath = 'storage.json';

  static readDocsFile(mdFileName: string, folder?: string[]): string {
    const baseDir = [process.cwd(), 'docs'];
    const fullPath = folder
      ? join(...baseDir, ...folder, mdFileName)
      : join(...baseDir, mdFileName);
    return fs.readFileSync(fullPath).toString();
  }

  static isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  static isEmptyArray(arr: any[]): boolean {
    return arr.length === 0;
  }

  static stringToBoolean(string) {
    return string === 'false' ||
      string === 'undefined' ||
      string === 'null' ||
      string === '0'
      ? false
      : !!string;
  }

  static isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  static mapToObject(map: any) {
    const obj = {};

    for (const [key, value] of map) {
      if (value instanceof Map) {
        obj[key] = this.mapToObject(value);
      } else if (Array.isArray(value)) {
        obj[key] = value.map((item) => {
          if (item instanceof Map) {
            return this.mapToObject(item);
          }
          return item;
        });
      } else {
        obj[key] = value;
      }
    }

    return obj;
  }

  static async getData(): Promise<any> {
    const release = await HelperService.mutex.acquire();
    try {
      const data = fs.readFileSync(HelperService.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new BadRequestException('Данные не найдены');
    } finally {
      release();
    }
  }

  static async setData(newData: any): Promise<void> {
    const release = await HelperService.mutex.acquire();
    try {
      const dataToWrite = JSON.stringify(newData, null, 2);
      fs.writeFileSync(HelperService.filePath, dataToWrite);
    } finally {
      release();
    }
  }

  static async deleteData(key: string): Promise<void> {
    const release = await HelperService.mutex.acquire();
    try {
      const data = fs.readFileSync(HelperService.filePath, 'utf8');
      const parsedData = JSON.parse(data);
      delete parsedData[key];
      const dataToWrite = JSON.stringify(parsedData, null, 2);
      fs.writeFileSync(HelperService.filePath, dataToWrite);
    } catch (error) {
      throw new BadRequestException(error);
    } finally {
      release();
    }
  }
}
