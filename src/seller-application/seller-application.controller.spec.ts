import { Test, TestingModule } from '@nestjs/testing';
import { SellerApplicationController } from './seller-application.controller';
import { SellerApplicationService } from './seller-application.service';

describe('SellerApplicationController', () => {
  let controller: SellerApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerApplicationController],
      providers: [SellerApplicationService],
    }).compile();

    controller = module.get<SellerApplicationController>(SellerApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
