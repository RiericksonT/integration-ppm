/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { TrelloCardDto } from './interface/ICard';
import { TrelloActionsDto } from './interface/ICommentsResponse';

@Injectable()
export class TrelloService {
  constructor() {}

  //Function to get a card from id
  async getTrelloCard(idCard: string): Promise<TrelloCardDto> {
    try {
      const response = await fetch(
        `${process.env.TRELLO_URL}/cards/${idCard}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}&customFieldItems=true`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        // Tratar erro de resposta não OK
        console.error(`Error fetching card: ${response.statusText}`);
        throw new Error();
      }

      const text = await response.text();
      const data = JSON.parse(text) as TrelloCardDto;

      return data; // Garantir que a resposta seja do tipo esperado
    } catch (error) {
      console.error('Error:', error);
      throw new Error(); // Retornar undefined caso ocorra erro
    }
  }

  async commentOnCard(id: string, text: string) {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${id}/actions/comments?text=${text}&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error(`Error commenting card: ${response.statusText}`);
        throw new Error();
      }
      const res = await response.text();
      const data = JSON.parse(res);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error: to comment in card');
    }
  }

  async getCommentsOnCard(id: string): Promise<TrelloActionsDto> {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${id}/actions??filter=commentCard&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error(`Error getting comments on card: ${response.statusText}`);
        throw new Error();
      }

      const res = await response.text();
      const data = JSON.parse(res);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error: to get comments in card');
    }
  }

  // async getTrelloCardsFromList(idList: string): Promise<Array<ITrelloCard>> {
  //   return await fetch(
  //     `${process.env.TRELLO_URL}/lists/${idList}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     },
  //   )
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((text) => {
  //       return JSON.parse(text);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // async getTrelloList(idBoard: string): Promise<Array<ITrelloList>> {
  //   return await fetch(
  //     `${process.env.TRELLO_URL}/boards/${idBoard}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     },
  //   )
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((text) => {
  //       return JSON.parse(text) as Array<ITrelloList>;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return [];
  //     });
  // }

  // async getTrelloBoard(idBoard: string) {
  //   return await fetch(
  //     `${process.env.TRELLO_URL}/boards/${idBoard}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     },
  //   )
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((text) => {
  //       return JSON.parse(text);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
}
