import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloController } from './trello.controller';
import { Applogger } from 'src/logger/logger.service';

@Module({
  controllers: [TrelloController],
  providers: [TrelloService, Applogger],
  exports: [TrelloService], // Garante que TrelloService pode ser usado por outros módulos
})
export class TrelloModule {}
