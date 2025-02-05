/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, BadRequestException } from '@nestjs/common';
import { BmcService } from 'src/bmc/bmc.service';
import { ITicketINCDto } from 'src/bmc/interface/ITicketINC';
import { UpdateTicketDto } from 'src/bmc/interface/IUpdateTicket';
import { Applogger } from 'src/logger/logger.service';
import { TrelloCardDto } from 'src/trello/interface/ICard';
import { TrelloEventDTO } from 'src/trello/interface/IWebhookResponse';
import { TrelloService } from 'src/trello/trello.service';

@Injectable()
export class IntegrationService {
  private readonly STATUS_MAP = new Map<string, number>([
    ['A FAZER', 1],
    ['EM ANDAMENTO', 2],
    ['REFAZER', 2],
    ['"NoBurn" P/DEPLOY EM QA', 3],
    ['TESTE QA', 3],
    ['VALIDAÇÃO', 3],
    ["'NoBurn' VALIDADO", 4],
  ]);

  constructor(
    private readonly bmcService: BmcService,
    private readonly trelloService: TrelloService,
    private logger: Applogger,
  ) {
    this.logger.setContext('Integration Service');
  }

  async sync(body: TrelloEventDTO) {
    this.logger.log(
      `Iniciando sincronização com Trello: ${JSON.stringify(body)}`,
    );

    try {
      const { id, status, action } = this.processRequest(body);
      this.logger.log(`Card ID: ${id}, Status: ${status}, Ação: ${action}`);

      const cardDetails = await this.trelloService.getTrelloCard(id);
      this.logger.log(
        `Detalhes do Card obtidos: ${JSON.stringify(cardDetails)}`,
      );

      const [firstName, lastName] = this.extractName(cardDetails);
      this.logger.log(`Nome extraído: ${firstName} ${lastName}`);

      if (action === 'Create') {
        return this.createIncident(cardDetails, firstName, lastName);
      } else {
        return this.updateIncident(cardDetails.id, status);
      }
    } catch (error) {
      this.logger.error('Erro ao sincronizar Trello:', error.message);
      throw error;
    }
  }

  private async createIncident(
    cardDetails: TrelloCardDto,
    firstName: string,
    lastName: string,
  ) {
    this.logger.log(`Criando incidente para o Card: ${cardDetails.id}`);

    const bodyTicket: ITicketINCDto = {
      values: {
        First_Name: firstName,
        Last_Name: lastName,
        Description: cardDetails.name,
        Detailed_Decription: cardDetails.desc,
        Impact: '1-Critical',
        Urgency: '1-Critical',
        Status: 'Assigned',
        'Reported Source': 'Direct Input',
        Service_Type: 'User Service Request',
        'Assigned Group': process.env.BMC_SUPPORT_GROUP_NAME ?? '',
        'Assigned Group ID': process.env.BMC_SUPPORT_GROUP_ID ?? '',
        'Categorization Tier 1': process.env.CATEGORIZATION_TIER_1 ?? '',
        'Categorization Tier 2': process.env.CATEGORIZATION_TIER_2 ?? '',
        'Categorization Tier 3': process.env.CATEGORIZATION_TIER_3 ?? '',
        Company: 'Grupo Moura',
        'Assigned Support Company': 'Grupo Moura',
        'Assigned Support Organization': 'DTISS',
        z1D_Action: 'CREATE',
        Flag_Create_Request: 'Yes',
      },
    };

    try {
      const incident = await this.bmcService.createIncident(bodyTicket);
      if (!incident) throw new Error('Falha ao criar incidente');

      this.logger.log(
        `Incidente criado com sucesso: ${incident.values['Incident Number']}`,
      );

      await this.trelloService.commentOnCard(
        cardDetails.id,
        incident.values['Incident Number'],
      );

      return {
        incident: incident.values['Incident Number'],
        TrelloCard: cardDetails.id,
      };
    } catch (error) {
      this.logger.error('Erro ao criar incidente:', error.message);
      throw error;
    }
  }

  private async updateIncident(cardId: string, status: number) {
    this.logger.log(
      `Atualizando incidente para o Card: ${cardId}, Novo Status: ${status}`,
    );

    try {
      const incidents = await this.trelloService.getCommentsOnCard(cardId);
      const incidentId = incidents.find((item) =>
        item.data?.text?.includes('INC'),
      )?.data?.text;

      if (!incidentId) {
        this.logger.warn(`Nenhum incidente encontrado para o Card ${cardId}`);
        throw new BadRequestException(
          'Não encontrou o incidente no card do Trello',
        );
      }

      const updateBody: UpdateTicketDto = { id: incidentId, status };
      if (status === 3) updateBody.statusReason = 8000;
      if (status === 4) {
        updateBody.statusReason = 17000;
        updateBody.resolutionNote = 'Ticket resolvido e validado';
      }

      this.logger.log(
        `Atualizando incidente: ${incidentId} com ${JSON.stringify(updateBody)}`,
      );

      return this.bmcService.updateIncident(updateBody);
    } catch (error) {
      this.logger.error('Erro ao atualizar incidente:', error.message);
      throw error;
    }
  }

  private extractName(cardDetails: TrelloCardDto): string[] {
    const labelCustomer = cardDetails.customFieldItems?.find(
      (field) => field.idCustomField === process.env.TRELLO_CUSTOM_NAME,
    );

    const name = labelCustomer?.value?.text ?? '';
    if (/[^a-zA-ZÀ-ÿ\s]/.test(name)) return ['PEDRO', 'SANTANA'];

    const [firstName = '', ...lastNameParts] = name.split(' ').filter(Boolean);
    return [firstName, lastNameParts.join(' ')];
  }

  private processRequest(body: TrelloEventDTO) {
    if (
      body.action.display.translationKey !==
      'action_move_card_from_list_to_list'
    ) {
      this.logger.warn(
        'A ação realizada não foi de mover um card de uma lista para outra.',
      );
      throw new BadRequestException(
        'A ação realizada não foi de arrastar um card',
      );
    }

    const status = this.STATUS_MAP.get(body.action.data.listAfter.name);
    if (!status) {
      this.logger.warn(
        `Coluna ${body.action.data.listAfter.name} não mapeada.`,
      );
      throw new BadRequestException('Coluna não mapeada');
    }

    this.logger.log(
      `Processando requisição: ID ${body.action.display.entities.card.id}, Novo Status ${status}`,
    );

    return {
      id: body.action.display.entities.card.id,
      status,
      action: status === 1 ? 'Create' : 'Update',
    };
  }
}
