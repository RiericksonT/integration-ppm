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
    const id = this.getCardId(body);
    const cardDetails: TrelloCardDto =
      await this.trelloService.getTrelloCard(id);

    const name: string[] = this.getName(cardDetails);
    //Mount a body with trello infos and defaults configs
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
    return await this.bmcService.createIncident(bodyTicket);
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

  getCardId(body: TrelloEventDTO) {
    if (
      body.action.display.translationKey !==
      'action_move_card_from_list_to_list'
    ) {
      throw new Error('A ação realizada não foi mover card de coluna');
    }

    if (body.action.data.listAfter.name !== 'EM ANDAMENTO') {
      throw new Error('Coluna de destino não foi Em andamento');
    }

    return body.action.display.entities.card.id;
  }
}
