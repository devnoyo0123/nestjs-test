import { Test, TestingModule } from '@nestjs/testing';
import { ItemRepository } from './item-repository.service';

describe('ItemRepository', () => {
  let service: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemRepository],
    }).compile();

    service = module.get<ItemRepository>(ItemRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
