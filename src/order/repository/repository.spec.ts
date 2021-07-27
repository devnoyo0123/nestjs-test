import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from './repository';

describe('OrderRepository', () => {
  let service: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRepository],
    }).compile();

    service = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
