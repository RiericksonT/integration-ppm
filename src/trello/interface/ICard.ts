import { ApiProperty } from '@nestjs/swagger';

class TrelloAttachmentsByTypeDto {
  @ApiProperty()
  board: number;

  @ApiProperty()
  card: number;
}

class TrelloBadgesDto {
  @ApiProperty({ type: TrelloAttachmentsByTypeDto })
  attachmentsByType: {
    trello: TrelloAttachmentsByTypeDto;
  };

  @ApiProperty({ required: false })
  externalSource?: any;

  @ApiProperty()
  location: boolean;

  @ApiProperty()
  votes: number;

  @ApiProperty()
  viewingMemberVoted: boolean;

  @ApiProperty()
  subscribed: boolean;

  @ApiProperty()
  attachments: number;

  @ApiProperty()
  fogbugz: string;

  @ApiProperty()
  checkItems: number;

  @ApiProperty()
  checkItemsChecked: number;

  @ApiProperty({ required: false })
  checkItemsEarliestDue?: any;

  @ApiProperty()
  comments: number;

  @ApiProperty()
  description: boolean;

  @ApiProperty({ required: false })
  due?: string | null;

  @ApiProperty()
  dueComplete: boolean;

  @ApiProperty()
  lastUpdatedByAi: boolean;

  @ApiProperty({ required: false })
  start?: string | null;
}

class TrelloLabelDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idBoard: string;

  @ApiProperty()
  idOrganization: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nodeId: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  uses: number;
}

class TrelloCoverDto {
  @ApiProperty({ required: false })
  idAttachment?: string | null;

  @ApiProperty({ required: false })
  color?: string | null;

  @ApiProperty({ required: false })
  idUploadedBackground?: string | null;

  @ApiProperty()
  size: string;

  @ApiProperty()
  brightness: string;

  @ApiProperty({ required: false })
  idPlugin?: string | null;
}

class TrelloCustomFieldItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  value?: {
    date?: string;
    text?: string;
  };

  @ApiProperty({ required: false })
  idValue?: string | null;

  @ApiProperty()
  idCustomField: string;

  @ApiProperty()
  idModel: string;

  @ApiProperty()
  modelType: string;
}

export class TrelloCardDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: TrelloBadgesDto })
  badges: TrelloBadgesDto;

  @ApiProperty({ type: [Object] })
  checkItemStates: any[];

  @ApiProperty()
  closed: boolean;

  @ApiProperty()
  dueComplete: boolean;

  @ApiProperty()
  dateLastActivity: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  descData: {
    emoji: Record<string, any>;
  };

  @ApiProperty({ required: false })
  due?: string | null;

  @ApiProperty({ required: false })
  dueReminder?: any;

  @ApiProperty({ required: false })
  email?: string | null;

  @ApiProperty()
  idBoard: string;

  @ApiProperty({ type: [String] })
  idChecklists: string[];

  @ApiProperty()
  idList: string;

  @ApiProperty({ type: [String] })
  idMembers: string[];

  @ApiProperty({ type: [String] })
  idMembersVoted: string[];

  @ApiProperty()
  idShort: number;

  @ApiProperty({ required: false })
  idAttachmentCover?: string | null;

  @ApiProperty({ type: [TrelloLabelDto] })
  labels: TrelloLabelDto[];

  @ApiProperty({ type: [String] })
  idLabels: string[];

  @ApiProperty()
  manualCoverAttachment: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pinned: boolean;

  @ApiProperty()
  pos: number;

  @ApiProperty()
  shortLink: string;

  @ApiProperty()
  shortUrl: string;

  @ApiProperty({ required: false })
  start?: string | null;

  @ApiProperty()
  subscribed: boolean;

  @ApiProperty()
  url: string;

  @ApiProperty({ type: TrelloCoverDto })
  cover: TrelloCoverDto;

  @ApiProperty()
  isTemplate: boolean;

  @ApiProperty({ required: false })
  cardRole?: string | null;

  @ApiProperty({ required: false })
  mirrorSourceId?: string | null;

  @ApiProperty({ type: [TrelloCustomFieldItemDto], required: false })
  customFieldItems?: TrelloCustomFieldItemDto[];
}
