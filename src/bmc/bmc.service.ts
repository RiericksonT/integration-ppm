import { Injectable } from '@nestjs/common';
import { TrelloService } from 'src/trello/trello.service';

import { ITicketINCDto } from './interface/ITicketINC';
import { IncidentResponseWrapperDto } from './interface/IIncidenteResponse';

@Injectable()
export class BmcService {
  constructor(private trelloService: TrelloService) {}

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
      .then((res) => {
        return res.text();
      })
      .catch((error) => console.error(error));
  }

  //Function to create a INC in BMC
  async createIncident(
    body: ITicketINCDto,
  ): Promise<IncidentResponseWrapperDto | Error> {
    const token = await this.login({
      username: 'wendy.rhausten@grupomoura.com',
      password: '@Sejabemvindo2025',
    });

    if (!token) {
      throw new Error('Failed to login and retrieve token');
    }
    const response = await fetch(
      `${process.env.BMC_URL_QA}/arsys/v1/entry/HPD:IncidentInterface_Create?fields=values(Incident Number)`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `AR-JWT ${token}`, // Melhor usar uma variável de ambiente
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return new Error(
        `Erro ao criar incidente: ${response.status} ${response.statusText}`,
      );
    } else {
      const data: IncidentResponseWrapperDto =
        (await response.json()) as IncidentResponseWrapperDto;
      console.log('Incidente criado com sucesso:', data);
      return data;
    }
  }
}
