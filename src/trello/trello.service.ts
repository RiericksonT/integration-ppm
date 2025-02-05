import { Injectable } from '@nestjs/common';
import { TrelloCardDto } from './interface/ICard';
import { TrelloActionDto } from './interface/ICommentsResponse';

@Injectable()
export class TrelloService {
  private readonly trelloBaseUrl = process.env.TRELLO_URL;
  private readonly trelloKey = process.env.TRELLO_API_KEY;
  private readonly trelloToken = process.env.TRELLO_API_TOKEN;

  constructor() {}

  private getAuthParams(): string {
    return `key=${this.trelloKey}&token=${this.trelloToken}`;
  }

  async getTrelloCard(idCard: string): Promise<TrelloCardDto> {
    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${idCard}?${this.getAuthParams()}&customFieldItems=true`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching card: ${response.status} - ${response.statusText}`,
        );
      }

      return (await response.json()) as TrelloCardDto;
    } catch (error) {
      console.error('Error getting Trello card:', error);
      throw new Error('Failed to fetch Trello card');
    }
  }

  async commentOnCard(id: string, text: string): Promise<TrelloActionDto> {
    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${id}/actions/comments?text=${encodeURIComponent(text)}&${this.getAuthParams()}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error commenting on card: ${response.status} - ${response.statusText}`,
        );
      }

      return (await response.json()) as TrelloActionDto;
    } catch (error) {
      console.error('Error commenting on Trello card:', error);
      throw new Error('Failed to post comment on Trello card');
    }
  }

  async getCommentsOnCard(id: string): Promise<TrelloActionDto[]> {
    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${id}/actions?filter=commentCard&${this.getAuthParams()}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching comments: ${response.status} - ${response.statusText}`,
        );
      }

      return (await response.json()) as TrelloActionDto[];
    } catch (error) {
      console.error('Error fetching comments from Trello card:', error);
      throw new Error('Failed to retrieve comments');
    }
  }
}
