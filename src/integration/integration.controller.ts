import { Body, Controller, Get, Post } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('sync')
  sync(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.integrationService.sync(body);
  }

  @Get('sync')
  getSync() {
    return;
  }
}
