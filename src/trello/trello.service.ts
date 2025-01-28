import { Injectable } from '@nestjs/common';
import { BmcService } from './../bmc/bmc.service';

@Injectable()
export class TrelloService {
  constructor(private bmcService: BmcService) {}

  async getTrelloCard(idCard: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await fetch(
      `${process.env.TRELLO_URL}/boards/${idCard}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(text);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
