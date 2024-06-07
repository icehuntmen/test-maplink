import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

export class HelperService {
  static readDocsFile(mdFileName: string, folder?: string[]): string {
    const baseDir = [process.cwd(), 'docs'];
    const fullPath = folder
      ? join(...baseDir, ...folder, mdFileName)
      : join(...baseDir, mdFileName);
    return fs.readFileSync(fullPath, 'utf8').toString();
  }

  static readFile(storeFileName: string, folder?: string[]): string {
    const baseDir = [process.cwd()];
    const fullPath = folder
      ? join(...baseDir, ...folder, storeFileName)
      : join(...baseDir, storeFileName);
    return fs.readFileSync(fullPath, 'utf8').toString();
  }
  static writeFile(storeFileName: string, data: any, folder?: string[]) {
    const baseDir = [process.cwd()];
    const fullPath = folder
      ? join(...baseDir, storeFileName)
      : join(...baseDir, storeFileName);
    fs.writeFileSync(fullPath, data, 'utf8');
  }
}
