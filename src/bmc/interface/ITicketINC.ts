import { ApiProperty } from '@nestjs/swagger';

export class TicketValuesDto {
  @ApiProperty({ description: 'Primeiro nome do solicitante', example: 'John' })
  First_Name: string;

  @ApiProperty({ description: 'Sobrenome do solicitante', example: 'Doe' })
  Last_Name: string;

  @ApiProperty({
    description: 'Descrição curta do incidente',
    example: 'Erro ao acessar o sistema',
  })
  Description: string;

  @ApiProperty({
    description: 'Descrição detalhada do problema',
    example: 'Usuário relata erro 500 ao tentar logar.',
  })
  Detailed_Decription: string;

  @ApiProperty({
    description: 'Impacto do incidente',
    example: '2-High',
    enum: ['1-Critical', '2-High', '3-Moderate', '4-Minor/Localized'],
  })
  Impact: '1-Critical' | '2-High' | '3-Moderate' | '4-Minor/Localized';

  @ApiProperty({
    description: 'Urgência do incidente',
    example: '1-Critical',
    enum: ['1-Critical', '2-High', '3-Medium', '4-Low'],
  })
  Urgency: '1-Critical' | '2-High' | '3-Medium' | '4-Low';

  @ApiProperty({
    description: 'Status do incidente',
    example: 'New',
    enum: ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
  })
  Status: 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

  @ApiProperty({ description: 'Fonte do relato', example: 'E-mail' })
  'Reported Source': string;

  @ApiProperty({
    description: 'Tipo de serviço relacionado',
    example: 'Suporte Técnico',
  })
  Service_Type: string;

  @ApiProperty({
    description: 'Grupo designado para o incidente',
    example: 'TI-Suporte',
  })
  'Assigned Group': string;

  @ApiProperty({ description: 'ID do grupo designado', example: '12345' })
  'Assigned Group ID': string;

  @ApiProperty({ description: 'Categoria nível 1', example: 'Hardware' })
  'Categorization Tier 1': string;

  @ApiProperty({ description: 'Categoria nível 2', example: 'Computador' })
  'Categorization Tier 2': string;

  @ApiProperty({ description: 'Categoria nível 3', example: 'Placa Mãe' })
  'Categorization Tier 3': string;

  @ApiProperty({ description: 'Empresa responsável', example: 'Empresa XYZ' })
  Company: string;

  @ApiProperty({
    description: 'Companhia de suporte designada',
    example: 'Suporte Global',
  })
  'Assigned Support Company': string;

  @ApiProperty({
    description: 'Organização de suporte',
    example: 'Infraestrutura TI',
  })
  'Assigned Support Organization': string;

  @ApiProperty({
    description: 'Ação a ser realizada',
    example: 'CREATE',
    enum: ['CREATE', 'UPDATE', 'DELETE'],
  })
  z1D_Action: 'CREATE' | 'UPDATE' | 'DELETE';

  @ApiProperty({
    description: 'Indica se um pedido deve ser criado',
    example: 'Yes',
    enum: ['Yes', 'No'],
  })
  Flag_Create_Request: 'Yes' | 'No';
  Assignee: string;
}

export class ITicketINCDto {
  @ApiProperty({ type: TicketValuesDto })
  values: TicketValuesDto;
}
