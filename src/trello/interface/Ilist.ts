import { ApiProperty } from '@nestjs/swagger';

class TrelloDatasourceDto {
  @ApiProperty()
  filter: boolean;
}

export class TrelloListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  closed: boolean;

  @ApiProperty({ required: false, nullable: true })
  color?: string | null;

  @ApiProperty()
  idBoard: string;

  @ApiProperty()
  pos: number;

  @ApiProperty()
  subscribed: boolean;

  @ApiProperty({ required: false, nullable: true })
  softLimit?: number | null;

  @ApiProperty({ required: false, nullable: true })
  type?: string | null;

  @ApiProperty({ type: TrelloDatasourceDto })
  datasource: TrelloDatasourceDto;
}
