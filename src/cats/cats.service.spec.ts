import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '../../test/mockRepository';

// mocking : https://minoo.medium.com/%EB%B2%88%EC%97%AD-jest-mocks%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4-34f75b0f7dbe

// https://stackoverflow.com/a/46856216
export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('CatsService', () => {
  let service: CatsService;
  let repositoryMock: MockType<Repository<Cat>>;
  let spyOn: Repository<Cat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cat),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repositoryMock = module.get(getRepositoryToken(Cat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a cat by id with Repository', async () => {
    const mockCat: Cat = { id: 1, name: 'Alni' };
    repositoryMock.findOne.mockReturnValue(mockCat);
    const cat = await service.findOne(1);
    expect(repositoryMock.findOne).toHaveBeenCalledWith(cat.id);
    expect(cat.name).toEqual('Alni');
    // 프로퍼티 하나씩을 다 비교해야하나?
  });

  it('should find cats with pagination with queryBuilder by mock.fn', async () => {
    const mockCats: Cat[] = [
      { id: 1, name: 'Alni' },
      { id: 2, name: 'Alni2' },
    ];

    const getManyAndCount = jest
      .fn()
      .mockReturnValue([mockCats, mockCats.length]);
    const take = jest.fn(() => ({ getManyAndCount }));
    const skip = jest.fn(() => ({ take }));
    repositoryMock.createQueryBuilder = jest.fn(() => ({ skip }));

    const cats = await service.findAll(0, 2);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('cat');
    expect(skip).toHaveBeenCalledWith(0);
    expect(take).toHaveBeenCalledWith(2);
    expect(getManyAndCount).toReturnWith(cats);
    expect(cats[0][0]).toEqual({ id: 1, name: 'Alni' });
  });
});
