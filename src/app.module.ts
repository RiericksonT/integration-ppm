import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrelloModule } from './trello/trello.module';
import { BmcModule } from './bmc/bmc.module';
import { IntegrationModule } from './integration/integration.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { Applogger } from './logger/logger.service';

@Module({
  imports: [
    TrelloModule,
    BmcModule,
    IntegrationModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, Applogger],
  exports: [Applogger],
})
export class AppModule {}
