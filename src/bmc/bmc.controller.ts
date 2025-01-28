import { Controller } from '@nestjs/common';
import { BmcService } from './bmc.service';

@Controller('bmc')
export class BmcController {
  constructor(private readonly bmcService: BmcService) {}
}
