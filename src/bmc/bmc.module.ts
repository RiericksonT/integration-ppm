import { Module } from '@nestjs/common';
import { BmcService } from './bmc.service';
import { BmcController } from './bmc.controller';

@Module({
  controllers: [BmcController],
  providers: [BmcService],
})
export class BmcModule {}
