import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrelloModule } from './trello/trello.module';
import { BmcModule } from './bmc/bmc.module';
import { IntegrationModule } from './integration/integration.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TrelloModule, BmcModule, IntegrationModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
