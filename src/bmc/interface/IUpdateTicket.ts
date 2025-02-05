import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SupportGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  defaultGroup?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  functionalRole?: string;
}

class UserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loginId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permission?: string[];

  @ApiPropertyOptional({ type: [SupportGroupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportGroupDto)
  assigneeSupportGroups?: SupportGroupDto[];
}

class AttachmentReferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dataSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attachmentFieldId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dataSourceId?: string;
}

class AttachmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileContentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @ApiPropertyOptional({ type: AttachmentReferenceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AttachmentReferenceDto)
  attachmentReference?: AttachmentReferenceDto;
}

export class UpdateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instanceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationCompany?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modifiedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  statusReason?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolutionNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  impact?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  urgency?: number;

  @ApiPropertyOptional({ type: UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  customer?: UserDto;

  @ApiPropertyOptional({ type: UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  assignee?: UserDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeGroupId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  needsAttention?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  launchUrl?: string;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeSupportOrganization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeSupportCompany?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;
}
