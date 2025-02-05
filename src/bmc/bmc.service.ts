/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { TrelloService } from 'src/trello/trello.service';
import { ITicketINCDto } from './interface/ITicketINC';
import { IncidentResponseWrapperDto } from './interface/IIncidenteResponse';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UpdateTicketDto } from './interface/IUpdateTicket';

@Injectable()
export class BmcService {
  constructor(
    private readonly trelloService: TrelloService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Função para fazer login e obter o token BMC
  private async login(body: {
    username: string;
    password: string;
  }): Promise<string> {
    try {
      const res = await fetch(`${process.env.BMC_URL_QA}/jwt/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: body.username,
          password: body.password,
        }).toString(),
      });

      if (!res.ok) {
        throw new Error(
          `Falha ao fazer login: ${res.status} ${res.statusText}`,
        );
      }

      const token = await res.text();
      await this.cacheManager.set('token', token, 520000); // Cache com TTL para o token
      return token;
    } catch (error) {
      console.error('Erro ao fazer login no BMC:', error);
      throw error;
    }
  }

  // Função para criar um incidente no BMC
  async createIncident(
    body: ITicketINCDto,
  ): Promise<IncidentResponseWrapperDto> {
    try {
      const token = await this.getToken();
      const url = `${process.env.BMC_URL_QA}/arsys/v1/entry/HPD:IncidentInterface_Create?fields=values(Incident Number)`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `AR-JWT ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao criar incidente: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data: IncidentResponseWrapperDto = await response.json();
      console.log('Incidente criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      throw error;
    }
  }

  // Função para atualizar um incidente no BMC
  async updateIncident(body: UpdateTicketDto): Promise<void> {
    try {
      const token = await this.getToken();
      const response = await fetch(
        `${process.env.BMC_URL_QA}/com.bmc.dsm.itsm.itsm-rest-api/incident/${body.id}`,
        {
          method: 'PATCH',
          headers: {
            'X-Requested-By': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `AR-JWT ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Erro ao atualizar incidente: ${response.status} ${response.statusText}`,
        );
        console.error('Detalhes do erro:', errorText);
        return;
      }

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};
      console.log('Incidente atualizado com sucesso:', responseData);
    } catch (error) {
      console.error('Erro na requisição para atualizar incidente:', error);
      throw error; // Re-throw to propagate error to the caller
    }
  }

  // Função auxiliar para obter o token do cache ou realizar login
  private async getToken(): Promise<string> {
    let token = await this.cacheManager.get<string>('token');

    // Verifica se o token não existe ou é inválido
    if (!token) {
      console.log(
        'Token não encontrado no cache ou expirado. Realizando login...',
      );
      token = await this.login({
        username: process.env.BMC_USER || '',
        password: process.env.BMC_PASSWORD || '',
      });
    }

    return token; // Token retornado de forma segura
  }
}
