/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { BmcService } from 'src/bmc/bmc.service';
import { ITicketINCDto } from 'src/bmc/interface/ITicketINC';
import { TrelloCardDto } from 'src/trello/interface/ICard';
import { TrelloEventDTO } from 'src/trello/interface/IWebhookResponse';
import { TrelloService } from 'src/trello/trello.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly bmcService: BmcService,
    private readonly trelloService: TrelloService,
  ) {}

  //Function to get data from trello card and create a SDM ticket
  async sync(body: TrelloEventDTO) {
    const req = this.processRequest(body);
    const cardDetails: TrelloCardDto = await this.trelloService.getTrelloCard(
      req.id,
    );

    const name: string[] = this.getName(cardDetails);
    //Mount a body with trello infos and defaults configs
    if (req.action === 'Create') {
      const bodyTicket: ITicketINCDto = {
        values: {
          First_Name: name[0],
          Last_Name: name[1],
          Description: cardDetails.name,
          Detailed_Decription: cardDetails.desc,
          Impact: '1-Critical',
          Urgency: '1-Critical',
          Status: 'Assigned',
          'Reported Source': 'Direct Input',
          Service_Type: 'User Service Request',
          'Assigned Group': `${process.env.BMC_SUPPORT_GROUP_NAME}`,
          'Assigned Group ID': `${process.env.BMC_SUPPORT_GROUP_ID}`,
          'Categorization Tier 1': `${process.env.CATEGORIZATION_TIER_1}`,
          'Categorization Tier 2': `${process.env.CATEGORIZATION_TIER_2}`,
          'Categorization Tier 3': `${process.env.CATEGORIZATION_TIER_3}`,
          Company: 'Grupo Moura',
          'Assigned Support Company': 'Grupo Moura',
          'Assigned Support Organization': 'DTISS',
          z1D_Action: 'CREATE',
          Flag_Create_Request: 'Yes',
        },
      };

      console.log(bodyTicket);
      const incident = await this.bmcService.createIncident(bodyTicket);
      if (incident) {
        const comment = await this.trelloService.commentOnCard(
          cardDetails.id,
          incident.values['Incident Number'],
        );

        console.log(comment);
        return {
          incident: incident.values['Incident Number'],
          TrelloCard: cardDetails.id,
        };
      }
    } else {
      const incident = await this.trelloService.getCommentsOnCard(
        cardDetails.id,
      );
      const filteredIncidents = incident.actions.filter((item) =>
        item.data.text.includes('INC'),
      );

      if (filteredIncidents.length === 0) {
        throw new Error('Não encontrou o incidente no card do Trello');
      }

      const updateBody = {
        id: filteredIncidents[0].data.text,
        status: req.status,
      };

      return await this.bmcService.updateIncident(updateBody);
    }
  }

  //Function to get a name of custom field in trello card
  getName(cardDetails: TrelloCardDto): string[] {
    // const requiredLabels = ['BUG', 'Website'];

    // if (
    //   !requiredLabels.every((tag) =>
    //     cardDetails.labels.some((label) => label.name === tag),
    //   )
    // ) {
    //   throw new Error();
    // }

    const labelCostummer = cardDetails.customFieldItems?.filter(
      (field) => field.idCustomField === `${process.env.TRELLO_CUSTOM_NAME}`,
    )[0];

    const name =
      labelCostummer && labelCostummer.value ? labelCostummer.value.text : '';

    const hasSpecialChars = /[^a-zA-ZÀ-ÿ\s]/.test(name!);

    if (hasSpecialChars) {
      return ['PEDRO', 'SANTANA'];
    }

    const nameParts = name!.split(' ').filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return [firstName, lastName];
  }

  processRequest(body: TrelloEventDTO) {
    if (
      body.action.display.translationKey !==
      'action_move_card_from_list_to_list'
    ) {
      throw new Error('A ação realizada não foi de arrastar um card');
    }
    const ListNames = new Map<string, number>([
      ['A FAZER', 1],
      ['EM ANDAMENTO', 2],
      ['REFAZER', 2],
      ['"NoBurn" P/DEPLOY EM QA', 3],
      ['TESTE QA', 3],
      ['VALIDAÇÃO', 3],
      ['"NoBurn" VALIDADO', 4],
    ]);

    const status = ListNames.get(body.action.data.listAfter.name);

    if (!status) {
      throw new Error('Coluna não mapeada');
    }

    if (status === 1) {
      return {
        id: body.action.display.entities.card.id,
        status,
        action: 'Create',
      };
    } else {
      return {
        id: body.action.display.entities.card.id,
        status,
        action: 'Update',
      };
    }
  }
}
