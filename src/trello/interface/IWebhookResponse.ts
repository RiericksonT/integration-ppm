import { ApiProperty } from '@nestjs/swagger';

class Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  closed: boolean;

  @ApiProperty()
  idBoard: string;

  @ApiProperty()
  pos: number;

  @ApiProperty({ required: false })
  type?: string | null;

  @ApiProperty({ required: false })
  color?: string | null;

  @ApiProperty()
  datasource: { filter: boolean } = { filter: false };
}

class Card {
  @ApiProperty()
  idList: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  idShort: number;

  @ApiProperty()
  shortLink: string;
}

class Board {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortLink: string;
}

class List {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class Member {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  avatarHash: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  initials: string;
}

class Action {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idMemberCreator: string;

  @ApiProperty()
  data: {
    card: Card;
    old: { idList: string };
    board: Board;
    listBefore: List;
    listAfter: List;
  };

  @ApiProperty()
  type: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  display: {
    translationKey: string;
    entities: {
      card: Card;
      listBefore: List;
      listAfter: List;
      memberCreator: Member;
    };
  };

  @ApiProperty()
  memberCreator: Member;
}

class Webhook {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  idModel: string;

  @ApiProperty()
  callbackURL: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  consecutiveFailures: number;

  @ApiProperty({ required: false })
  firstConsecutiveFailDate?: string | null;
}

export class TrelloEventDTO {
  @ApiProperty()
  model: Model;

  @ApiProperty()
  action: Action;

  @ApiProperty()
  webhook: Webhook;
}
