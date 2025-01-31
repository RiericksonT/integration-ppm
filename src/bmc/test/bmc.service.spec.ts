import { Test, TestingModule } from '@nestjs/testing';
import { BmcService } from '../bmc.service';

describe('BmcService', () => {
  let service: BmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BmcService],
    }).compile();

    service = module.get<BmcService>(BmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
