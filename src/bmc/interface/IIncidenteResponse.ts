import { ApiProperty } from '@nestjs/swagger';

export class IncidentLinksDto {
  @ApiProperty()
  href: string;
}

export class IncidentResponseDto {
  @ApiProperty()
  'Incident Number': string;
}

export class IncidentResponseWrapperDto {
  @ApiProperty({ type: IncidentResponseDto })
  values: IncidentResponseDto;

  @ApiProperty({ type: [IncidentLinksDto] })
  _links: {
    self: IncidentLinksDto[];
  };
}
