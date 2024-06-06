import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalConfig } from '@apps/interfaces/app.interface';
import { AppController } from '@apps/app.controller';
import { AppService } from '@apps/app.service';

@Module({
  imports: [ConfigModule.forRoot(GlobalConfig)],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
