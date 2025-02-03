import { Controller } from '@nestjs/common';
import { TrelloService } from './trello.service';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  // @Get('list')
  // async getTrelloList(): Promise<Array<ITrelloList>> {
  //   return this.trelloService.getTrelloList(`${process.env.TRELLO_BOARD_ID}`);
  // }

  // @Get('listCards/:id')
  // async getTrelloCardsFromList(
  //   @Param('id') id: string,
  // ): Promise<Array<ITrelloCard>> {
  //   return this.trelloService.getTrelloCardsFromList(`${id}`);
  // }

  // @Get('card/:id')
  // async getTrelloCard(@Param('id') id: string): Promise<ITrelloCard> {
  //   return this.trelloService.getTrelloCard(id);
  // }
}
