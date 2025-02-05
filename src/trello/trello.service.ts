/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { TrelloCardDto } from './interface/ICard';
import { TrelloActionDto } from './interface/ICommentsResponse';
import { Applogger } from 'src/logger/logger.service';

@Injectable()
export class TrelloService {
  private readonly trelloBaseUrl = process.env.TRELLO_URL;
  private readonly trelloKey = process.env.TRELLO_API_KEY;
  private readonly trelloToken = process.env.TRELLO_API_TOKEN;

  constructor(private logger: Applogger) {
    this.logger.setContext('Trello Service');
  }

  private getAuthParams(): string {
    return `key=${this.trelloKey}&token=${this.trelloToken}`;
  }

  async getTrelloCard(idCard: string): Promise<TrelloCardDto> {
    this.logger.log(`Buscando informações do card com ID: ${idCard}`);

    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${idCard}?${this.getAuthParams()}&customFieldItems=true`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Falha ao buscar card (ID: ${idCard}): ${response.status} - ${response.statusText}`,
        );
        throw new Error(
          `Error fetching card: ${response.status} - ${response.statusText}`,
        );
      }

      const card = await response.json();
      this.logger.log(`Card obtido com sucesso: ${JSON.stringify(card)}`);
      return card as TrelloCardDto;
    } catch (error) {
      this.logger.error('Erro ao buscar o card do Trello:', error.message);
      throw new Error('Falha ao buscar o card no Trello');
    }
  }

  async commentOnCard(id: string, text: string): Promise<TrelloActionDto> {
    this.logger.log(`Adicionando comentário ao card ID: ${id}`);

    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${id}/actions/comments?text=${encodeURIComponent(text)}&${this.getAuthParams()}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Falha ao comentar no card (ID: ${id}): ${response.status} - ${response.statusText}`,
        );
        throw new Error(
          `Error commenting on card: ${response.status} - ${response.statusText}`,
        );
      }

      const comment = await response.json();
      this.logger.log(
        `Comentário adicionado com sucesso ao card ${id}: ${JSON.stringify(comment)}`,
      );
      return comment as TrelloActionDto;
    } catch (error) {
      this.logger.error(
        'Erro ao adicionar comentário ao card do Trello:',
        error.message,
      );
      throw new Error('Falha ao postar comentário no card do Trello');
    }
  }

  async getCommentsOnCard(id: string): Promise<TrelloActionDto[]> {
    this.logger.log(`Buscando comentários do card com ID: ${id}`);

    try {
      const response = await fetch(
        `${this.trelloBaseUrl}/cards/${id}/actions?filter=commentCard&${this.getAuthParams()}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Falha ao buscar comentários (ID: ${id}): ${response.status} - ${response.statusText}`,
        );
        throw new Error(
          `Error fetching comments: ${response.status} - ${response.statusText}`,
        );
      }

      const comments = await response.json();
      this.logger.log(
        `Comentários obtidos com sucesso para o card ${id}: ${JSON.stringify(comments)}`,
      );
      return comments as TrelloActionDto[];
    } catch (error) {
      this.logger.error(
        'Erro ao buscar comentários do card Trello:',
        error.message,
      );
      throw new Error('Falha ao buscar comentários no card do Trello');
    }
  }
}
