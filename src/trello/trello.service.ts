/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ITrelloList } from './interface/Ilist';
import { ITrelloCard } from './interface/ICard';

@Injectable()
export class TrelloService {
  constructor() {}

  async getTrelloCard(idCard: string): Promise<ITrelloCard> {
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
      const data = JSON.parse(text) as ITrelloCard;

      return data; // Garantir que a resposta seja do tipo esperado
    } catch (error) {
      console.error('Error:', error);
      throw new Error(); // Retornar undefined caso ocorra erro
    }
  }

  async getTrelloCardsFromList(idList: string): Promise<Array<ITrelloCard>> {
    return await fetch(
      `${process.env.TRELLO_URL}/lists/${idList}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
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
        return JSON.parse(text);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getTrelloList(idBoard: string): Promise<Array<ITrelloList>> {
    return await fetch(
      `${process.env.TRELLO_URL}/boards/${idBoard}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
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
        return JSON.parse(text) as Array<ITrelloList>;
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  async getTrelloBoard(idBoard: string) {
    return await fetch(
      `${process.env.TRELLO_URL}/boards/${idBoard}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`,
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
        return JSON.parse(text);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
