import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};
export const repositoryMockFactory: () => MockType<Repository<Cat>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  }),
);

describe('CatsService', () => {
  let service: CatsService;
  let repositoryMock: MockType<Repository<Cat>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cat),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repositoryMock = module.get(getRepositoryToken(Cat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a cat', () => {
    const cat: Cat = { id: 1, name: 'Alni' };
    repositoryMock.findOne.mockReturnValue(cat);
    expect(service.findOne(1)).toEqual(cat);
    expect(repositoryMock.findOne).toHaveBeenCalledWith(cat.id);
  });
});
