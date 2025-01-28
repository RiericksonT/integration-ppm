import { Body, Controller, Post } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  sync(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.integrationService.sync(body);
  }
}
