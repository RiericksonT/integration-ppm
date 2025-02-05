import { Module } from '@nestjs/common';
import { BmcService } from './bmc.service';
import { BmcController } from './bmc.controller';
import { TrelloModule } from 'src/trello/trello.module'; // Certifique-se de importar o módulo, não o serviço
import { CacheModule } from '@nestjs/cache-manager';
import { Applogger } from 'src/logger/logger.service';

@Module({
  imports: [TrelloModule, CacheModule.register()], // Importa o módulo que fornece TrelloService
  controllers: [BmcController],
  providers: [BmcService, Applogger],
  exports: [BmcService],
})
export class BmcModule {}
