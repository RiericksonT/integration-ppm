import { Injectable } from '@nestjs/common';
import { TrelloService } from 'src/trello/trello.service';

import { ITicketINC } from './interface/ITicketINC';
import { IncidentResponse } from './interface/IIncidenteResponse';

@Injectable()
export class BmcService {
  constructor(private trelloService: TrelloService) {}

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

  // async createRequest() {
  //   // const token = await this.login({
  //   //   username: 'wendy.rhausten@grupomoura.com',
  //   //   password: '@Sejabemvindo2025',
  //   // });

  //   // console.log(`Login success: ${token}`);

  //   try {
  //     const response = await fetch(
  //       `${process.env.BMC_URL_QA}/arsys/v1/entry/SRM:RequestInterface_Create`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `AR-JWT eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIhPSF7ZW5jfSE9IUFBQUFETEVpaWU3NGRTcldJQ2xLWktlTWQzTHBveVVHNkxpRlVrUXpBQUFrNnMwWWU5WEZxK2Q0MXRsanlqc3N2elQxRHltSVVRMmlMODVQVnc9PSIsIl9sb2NhbGVMYW5ndWFnZSI6IioiLCJuYmYiOjE3MzgzMjMxMTMsImlzcyI6InBsYXRmb3JtLWludC0wLnBsYXRmb3JtLWludCIsIl9sb2NhbGVDb3VudHJ5IjoiIiwiX2F1dGhTdHJpbmciOiIhPSF7ZW5jfSE9IUFBQUFETEVpaWU3NGRTcldJQ2xLWlBzb013eTZyN3JYNnBxbVN3Nm9hR0U9IiwiZXhwIjoxNzM4MzUyMDMzLCJfY2FjaGVJZCI6NjY4MDk0LCJpYXQiOjE3MzgzMjMyMzMsImp0aSI6IklER0JBWkZGQkM1UDJBU1FZMFM3U1FZMFM3S0FLVSIsIl9hYnNvbHV0ZUV4cGlyYXRpb25UaW1lIjoxNzM4NDA5NjMzfQ.0nwu_CHODobEc72eDY0bfukdbmiUodgo6nt6euQf4yc`,
  //         },
  //         body: JSON.stringify({
  //           values: {
  //             RequestedForInstanceID: 'AGGFPS5XEFMJJASDB1KTSDB1KTR6CH',
  //             'Enable Assignment Engine': 'Yes',
  //             'Customer First Name': 'KAIQUE',
  //             'Customer Last Name': 'RIERICKSON TORRES',
  //             OfferingTitle: 'TEST REST API Day 2: Test Request Creation',
  //             'Short Description': 'TESTE esse incidente será cancelado',
  //             Status: 'Draft',
  //             TitleInstanceID: 'SRGF976UIZ5DOAQ427D1Q340SYM1FV',
  //             Company: 'Grupo Moura',
  //             z1D_EmailID: 'rierickson.torres@grupomoura.com',
  //             'z1D Action': 'CREATE',
  //             'Source Keyword': 'IM',
  //             'Customer Company': 'Grupo Moura',
  //             'Location Company': 'DTISS',
  //           },
  //         }),
  //       },
  //     );

  //     if (!response.ok) {
  //       const errorText = await response.text(); // Lê o body uma única vez
  //       console.error('Erro na resposta do BMC:', errorText);
  //       throw new Error(`Erro ao criar Request: ${errorText}`);
  //     }

  //     const data = response.headers.get('location');
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.error('Erro ao criar Request:', error.message);
  //     throw new Error(
  //       `Erro ao criar Request: ${error.message || error.status}`,
  //     );
  //   }
  // }

  async createIncident(body: ITicketINC): Promise<IncidentResponse | Error> {
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
      const data: IncidentResponse =
        (await response.json()) as IncidentResponse;
      console.log('Incidente criado com sucesso:', data);
      return data;
    }
  }
}
