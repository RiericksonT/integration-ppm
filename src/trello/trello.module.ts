import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloController } from './trello.controller';
import { BmcService } from 'src/bmc/bmc.service';

@Module({
  controllers: [TrelloController],
  providers: [TrelloService, BmcService],
})
export class TrelloModule {}
