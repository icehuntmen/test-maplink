import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from '@apps/app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/')
  async createLinks(@Query('name') name: string) {
    return this.appService.generateUniqueLink(name);
  }

  @Get('/')
  async getLinks(@Query('link') link: string) {
    return this.appService.getMessageByLink(link);
  }
}
