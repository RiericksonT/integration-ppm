import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Values {
  @ApiProperty({ description: 'Unique identifier for the attachment' })
  @IsString()
  acmo_AnexoGuid: string;

  @ApiProperty({ description: 'Active approval status' })
  @IsString()
  @IsOptional()
  'Active Approval'?: string;

  @ApiProperty({ description: 'Reason for status change' })
  @IsString()
  Status_Reason: string;

  @ApiProperty({ description: 'Form attachment identifier' })
  @IsString()
  acmo_FormAnexo: string;

  @ApiProperty({
    description: 'Indicates if the AIO process has been created',
    required: false,
  })
  @IsOptional()
  AOICreated?: any;

  @ApiProperty({
    description: 'Application Request Instance ID',
    required: false,
  })
  @IsOptional()
  AppRequestInstanceID?: any;

  @ApiProperty({ description: 'Support Group ID' })
  @IsString()
  ASGRPID: string;

  @ApiProperty({ description: 'Assignee Group' })
  @IsString()
  'Assignee Group': string;

  @ApiProperty({ description: 'Dataset ID' })
  @IsString()
  BS_DatasetId: string;

  @ApiProperty({ description: 'Integer Field' })
  @IsNumber()
  z1D_Int2: number;

  @ApiProperty({ description: 'Approval Notification' })
  @IsString()
  NT_ApproverNotification: string;

  @ApiProperty({ description: 'Assignment Notification' })
  @IsString()
  NT_AssignNotification: string;

  @ApiProperty({ description: 'Reason Code Assignee' })
  @IsString()
  'Reason Code_Assignee': string;

  @ApiProperty({ description: 'Instance ID' })
  @IsString()
  CSQ_Instance_ID: string;

  @ApiProperty({ description: 'SR Type Field 2' })
  @IsString()
  'SR Type Field 2': string;

  @ApiProperty({ description: 'Resolution Description' })
  @IsString()
  acmo_resolucao: string;

  @ApiProperty({ description: 'Email Subject' })
  @IsString()
  acmo_EmailSubject: string;

  @ApiProperty({ description: 'Email Body' })
  @IsString()
  acmo_tmpBodyEmail: string;

  @ApiProperty({ description: 'Source Keyword' })
  @IsString()
  'Source Keyword': string;

  @ApiProperty({
    description: 'Survey Association Instance ID',
    required: false,
  })
  @IsOptional()
  SurveyAssocInstanceID?: any;

  @ApiProperty({ description: 'Survey Check', required: false })
  @IsOptional()
  z1D_SurveyCheck?: any;

  @ApiProperty({ description: 'Priority level' })
  @IsString()
  Priority: string;

  @ApiProperty({ description: 'Urgency level' })
  @IsString()
  Urgency: string;

  @ApiProperty({ description: 'Impact level' })
  @IsString()
  Impact: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  Company: string;

  @ApiProperty({ description: 'Requester Instance ID' })
  @IsString()
  RequesterInstanceId?: string;
}

export class SurveyRequestDto {
  @ApiProperty({ description: 'Values object containing request details' })
  @ValidateNested()
  @Type(() => Values)
  values: Values;
}
