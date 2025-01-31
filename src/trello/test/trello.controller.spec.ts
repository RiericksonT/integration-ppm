import { Test, TestingModule } from '@nestjs/testing';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';

describe('TrelloController', () => {
  let controller: TrelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrelloController],
      providers: [TrelloService],
    }).compile();

    controller = module.get<TrelloController>(TrelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
