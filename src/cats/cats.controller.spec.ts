import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Cat} from "./entities/cat.entity";

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cat),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    catsController = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(catsController).toBeDefined();
  });

  // given
  it('create()는 id를 받아서 저장합니다.', () => {
    const spy = jest.spyOn(catsController, 'create');
    // when
    catsController.create({ name: 'amily' });
    // then
    expect(spy).toHaveBeenCalled();
  });

  // async throw errors
  // https://jestjs.io/blog/2017/12/18/jest-22#easier-testing-of-errors-thrown-in-async-code

  it('learn mock function', () => {
    const mockFn = jest.fn();

    mockFn();
    mockFn(1);

    expect(mockFn.mock.calls.length).toBe(2);
  });
});
