import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { BmcService } from 'src/bmc/bmc.service';
import { TrelloService } from 'src/trello/trello.service';

@Module({
  controllers: [IntegrationController],
  providers: [IntegrationService, BmcService, TrelloService],
})
export class IntegrationModule {}
