import { ApiProperty } from '@nestjs/swagger';

class TrelloActionDataCardDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  idShort: number;

  @ApiProperty()
  shortLink: string;
}

class TrelloActionDataBoardDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortLink: string;
}

class TrelloActionDataListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  color?: string | null;
}

class TrelloActionTextDataDto {
  @ApiProperty()
  emoji: Record<string, any>;
}

class TrelloActionDataDto {
  @ApiProperty()
  idCard: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  textData: TrelloActionTextDataDto;

  @ApiProperty()
  card: TrelloActionDataCardDto;

  @ApiProperty()
  board: TrelloActionDataBoardDto;

  @ApiProperty()
  list: TrelloActionDataListDto;
}

class TrelloActionLimitsDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  disableAt: number;

  @ApiProperty()
  warnAt: number;
}

class TrelloActionReactionsDto {
  @ApiProperty()
  perAction: TrelloActionLimitsDto;

  @ApiProperty()
  uniquePerAction: TrelloActionLimitsDto;
}

class TrelloMemberCreatorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  activityBlocked: boolean;

  @ApiProperty()
  avatarHash: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ nullable: true })
  idMemberReferrer: string | null;

  @ApiProperty()
  initials: string;

  @ApiProperty()
  nonPublic: Record<string, any>;

  @ApiProperty()
  nonPublicAvailable: boolean;

  @ApiProperty()
  username: string;
}

export class TrelloActionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idMemberCreator: string;

  @ApiProperty()
  data: TrelloActionDataDto;

  @ApiProperty({ nullable: true })
  appCreator: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  limits: TrelloActionReactionsDto;

  @ApiProperty()
  memberCreator: TrelloMemberCreatorDto;
}
