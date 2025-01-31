import { Module } from '@nestjs/common';
import { BmcService } from './bmc.service';
import { BmcController } from './bmc.controller';
import { TrelloModule } from 'src/trello/trello.module'; // Certifique-se de importar o módulo, não o serviço

@Module({
  imports: [TrelloModule], // Importa o módulo que fornece TrelloService
  controllers: [BmcController],
  providers: [BmcService],
  exports: [BmcService],
})
export class BmcModule {}
