import { Body, Controller, Post } from '@nestjs/common';
import { BmcService } from './bmc.service';

@Controller('bmc')
export class BmcController {
  constructor(private readonly bmcService: BmcService) {}
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return await this.bmcService.login(body);
  }
}
