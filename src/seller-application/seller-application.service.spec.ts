import { Test, TestingModule } from '@nestjs/testing';
import { SellerApplicationService } from './seller-application.service';

describe('SellerApplicationService', () => {
  let service: SellerApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerApplicationService],
    }).compile();

    service = module.get<SellerApplicationService>(SellerApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
