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
    private trelloService: TrelloService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //Function to login in BMC API and get a token
  async login(body: { username: string; password: string }) {
    return fetch(`${process.env.BMC_URL_QA}/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: body.username,
        password: body.password,
      }).toString(),
    })
      .then(async (res) => {
        const token = await res.text();
        console.log(token);
        return token;
      })
      .catch((error) => console.error(error));
  }

  //Function to create a INC in BMC
  async createIncident(
    body: ITicketINCDto,
  ): Promise<IncidentResponseWrapperDto> {
    try {
      if (!(await this.cacheManager.get('token'))) {
        const token = await this.login({
          username: `${process.env.BMC_USER}`,
          password: `${process.env.BMC_PASSWORD}`,
        });

        await this.cacheManager.set('token', JSON.stringify(token), 520000);
      }
      const tokenString = await this.cacheManager.get('token');
      const token =
        typeof tokenString === 'string' ? JSON.parse(tokenString) : tokenString;
      if (!token) {
        throw new Error('Failed to login and retrieve token');
      }

      console.log('Token recebido!');

      const url = `${process.env.BMC_URL_QA}/arsys/v1/entry/HPD:IncidentInterface_Create?fields=values(Incident Number)`;
      console.log(`Enviando requisição para ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `AR-JWT ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log(`Requisição enviada, status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao criar incidente: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as IncidentResponseWrapperDto;
      console.log('Incidente criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      throw error;
    }
  }

  async updateIncident(body: UpdateTicketDto) {
    try {
      if (!(await this.cacheManager.get('token'))) {
        const token = await this.login({
          username: `${process.env.BMC_USER}`,
          password: `${process.env.BMC_PASSWORD}`,
        });

        await this.cacheManager.set('token', JSON.stringify(token), 520000);
      }
      const tokenString = await this.cacheManager.get('token');
      const token =
        typeof tokenString === 'string' ? JSON.parse(tokenString) : tokenString;
      if (!token) {
        throw new Error('Failed to login and retrieve token');
      }

      console.log('Token recebido!');
      const response = await fetch(
        `${process.env.BMC_URL_PROD}/com.bmc.dsm.itsm.itsm-rest-api/incident/${body.id}`,
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
        console.error(
          `Erro ao atualizar incidente: ${response.status} - ${response.statusText}`,
        );
        const errorText = await response.text(); // Captura o corpo da resposta mesmo que não seja JSON
        console.error('Detalhes do erro:', errorText);
        return;
      }

      // Verifica se há conteúdo antes de tentar parsear JSON
      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};

      console.log('Incidente atualizado com sucesso:', responseData);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }
}
