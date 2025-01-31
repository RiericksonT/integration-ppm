import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloController } from './trello.controller';

@Module({
  controllers: [TrelloController],
  providers: [TrelloService],
  exports: [TrelloService], // Garante que TrelloService pode ser usado por outros módulos
})
export class TrelloModule {}
