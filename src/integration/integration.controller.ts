import { Body, Controller, Get, Post } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('sync')
  async sync(@Body() body: { id: string }) {
    console.log('sync: ', JSON.stringify(body));
    return await this.integrationService.sync(body.id);
  }

  @Get('sync')
  getSync() {
    console.log('getSync');
    return;
  }
}
