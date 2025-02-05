import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TextData {
  @ApiProperty()
  emoji: Record<string, unknown>;
}

class Card {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  idShort: number;

  @ApiProperty()
  @IsString()
  shortLink: string;
}

class Board {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  shortLink: string;
}

class List {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;
}

class Data {
  @ApiProperty()
  @IsString()
  idCard: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => TextData)
  textData: TextData;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Card)
  card: Card;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Board)
  board: Board;

  @ApiProperty()
  @ValidateNested()
  @Type(() => List)
  list: List;
}

class PerAction {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNumber()
  disableAt: number;

  @ApiProperty()
  @IsNumber()
  warnAt: number;
}

class Reactions {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PerAction)
  perAction: PerAction;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PerAction)
  uniquePerAction: PerAction;
}

class Limits {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Reactions)
  reactions: Reactions;
}

class MemberCreator {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsBoolean()
  activityBlocked: boolean;

  @ApiProperty()
  @IsString()
  avatarHash: string;

  @ApiProperty()
  @IsString()
  avatarUrl: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idMemberReferrer: string | null;

  @ApiProperty()
  @IsString()
  initials: string;

  @ApiProperty()
  nonPublic: Record<string, unknown>;

  @ApiProperty()
  @IsBoolean()
  nonPublicAvailable: boolean;

  @ApiProperty()
  @IsString()
  username: string;
}

export class TrelloActionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  idMemberCreator: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Data)
  data: Data;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appCreator?: string | null;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Limits)
  limits: Limits;

  @ApiProperty()
  @ValidateNested()
  @Type(() => MemberCreator)
  memberCreator: MemberCreator;
}

export class TrelloActionsDto {
  @ApiProperty({ type: [TrelloActionDto] })
  @ValidateNested({ each: true })
  @Type(() => TrelloActionDto)
  actions: TrelloActionDto[];
}
