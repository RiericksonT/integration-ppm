import { Test, TestingModule } from '@nestjs/testing';
import { BmcController } from '../bmc.controller';
import { BmcService } from '../bmc.service';

describe('BmcController', () => {
  let controller: BmcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BmcController],
      providers: [BmcService],
    }).compile();

    controller = module.get<BmcController>(BmcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
