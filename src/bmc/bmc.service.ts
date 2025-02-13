/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { TrelloService } from 'src/trello/trello.service';
import { ITicketINCDto } from './interface/ITicketINC';
import { IncidentResponseWrapperDto } from './interface/IIncidenteResponse';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UpdateTicketDto } from './interface/IUpdateTicket';
import { Applogger } from 'src/logger/logger.service';
import { SurveyRequestDto } from './interface/IUpdateRequest';

@Injectable()
export class BmcService {
  constructor(
    private readonly trelloService: TrelloService,
    private logger: Applogger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.logger.setContext('BMC service');
  }

  // Função para fazer login e obter o token BMC
  private async login(body: {
    username: string;
    password: string;
  }): Promise<string> {
    try {
      this.logger.log(`Tentando fazer login com o usuário: ${body.username}`);
      const res = await fetch(`${process.env.BMC_URL_PROD}/jwt/login`, {
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
        this.logger.error(
          `Falha ao fazer login: ${res.status} ${res.statusText}`,
        );
        throw new Error(
          `Falha ao fazer login: ${res.status} ${res.statusText}`,
        );
      }

      const token = await res.text();
      await this.cacheManager.set('token', token, 520000); // Cache com TTL para o token
      this.logger.log('Login bem-sucedido. Token armazenado no cache.');
      return token;
    } catch (error) {
      this.logger.error('Erro ao fazer login no BMC:', error.message);
      throw error;
    }
  }

  // Função para criar um incidente no BMC
  async createIncident(
    body: ITicketINCDto,
  ): Promise<IncidentResponseWrapperDto> {
    try {
      this.logger.log('Tentando criar incidente no BMC.');
      const token = await this.getToken();
      const url = `${process.env.BMC_URL_PROD}/arsys/v1/entry/HPD:IncidentInterface_Create?fields=values(Incident Number)`;

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
        this.logger.error(
          `Erro ao criar incidente: ${response.status} ${response.statusText} - ${errorText}`,
        );
        throw new Error(
          `Erro ao criar incidente: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data: IncidentResponseWrapperDto = await response.json();
      this.logger.log(`Incidente criado com sucesso: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error('Erro ao criar incidente:', error.message);
      throw error;
    }
  }

  // Função para atualizar um incidente no BMC
  async updateIncident(body: UpdateTicketDto): Promise<void> {
    try {
      this.logger.log(`Tentando atualizar o incidente com ID: ${body.id}`);
      const token = await this.getToken();
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
        const errorText = await response.text();
        this.logger.error(
          `Erro ao atualizar incidente: ${response.status} ${response.statusText}`,
        );
        this.logger.error('Detalhes do erro:', errorText);
        return;
      }

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};
      this.logger.log(
        `Incidente atualizado com sucesso: ${JSON.stringify(responseData)}`,
      );
    } catch (error) {
      this.logger.error(
        'Erro na requisição para atualizar incidente:',
        error.message,
      );
      throw error; // Re-throw to propagate error to the caller
    }
  }

  async updateRequest(body: SurveyRequestDto, incID: string): Promise<void> {
    try {
      this.logger.log(
        `Udapte requeste iniciado buscando a req vinculada a: ${incID}`,
      );
      const id = await this.getReqID(incID);
      this.logger.log(
        `Tentando pegar o id da request linkada ao incidente com ID: ${id}`,
      );
      const token = await this.getToken();
      const response = await fetch(
        `${process.env.BMC_URL_PROD}/arsys/v1/entry/SRM:Request/${id}`,
        {
          method: 'PUT',
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
        this.logger.error(
          `Erro ao obter id da req: ${response.status} ${response.statusText}`,
        );
        this.logger.error('Detalhes do erro:', errorText);
        return;
      }

      this.logger.log(`Id obtido com sucesso: ${JSON.stringify(!response.ok)}`);
      return;
    } catch (error) {
      this.logger.error(
        'Erro na requisição para atualizar a request:',
        error.message,
      );
      throw error; // Re-throw to propagate error to the caller
    }
  }

  private async getReqID(incID: string) {
    try {
      this.logger.log(
        `Tentando buscar a request linkada ao incidente com ID: ${incID}`,
      );
      const token = await this.getToken();
      const response = await fetch(
        `${process.env.BMC_URL_PROD}/arsys/v1/entry/SRM:Request?limit=50&q='AppRequestID'="${incID}"`,
        {
          method: 'GET',
          headers: {
            'X-Requested-By': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `AR-JWT ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Erro ao obter id da req: ${response.status} ${response.statusText}`,
        );
        this.logger.error('Detalhes do erro:', errorText);
        return;
      }

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};
      console.log(`Response da busca pela req:${responseData}`);
      const requestID = responseData.SysRequestID;
      this.logger.log(`ID da request obito: ${JSON.stringify(requestID)}`);
      return requestID;
    } catch (error) {
      this.logger.error(
        'Erro na requisição para Erro ao obter id da req:',
        error.message,
      );
      throw error; // Re-throw to propagate error to the caller
    }
  }

  // Função auxiliar para obter o token do cache ou realizar login
  private async getToken(): Promise<string> {
    let token = await this.cacheManager.get<string>('token');

    // Verifica se o token não existe ou é inválido
    if (!token) {
      this.logger.warn(
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
