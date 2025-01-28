import { Injectable } from '@nestjs/common';
import { BmcService } from 'src/bmc/bmc.service';
import { TrelloService } from 'src/trello/trello.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly bmcService: BmcService,
    private readonly trelloService: TrelloService,
  ) {}
  sync(body: any) {
    const cardDetails = this.trelloService.getTrelloCard(
      body.action.data.card.id,
    );

    console.log('cardDetails: ', cardDetails);
  }
}
