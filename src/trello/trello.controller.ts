import { Controller, Get } from '@nestjs/common';
import { TrelloService } from './trello.service';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get()
  async getTrelloCard() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.trelloService.getTrelloCard('jWyaOLkL');
  }
}
