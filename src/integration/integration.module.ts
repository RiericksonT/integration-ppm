import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { BmcService } from 'src/bmc/bmc.service';
import { TrelloService } from 'src/trello/trello.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Applogger } from 'src/logger/logger.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [IntegrationController],
  providers: [IntegrationService, BmcService, TrelloService, Applogger],
})
export class IntegrationModule {}
