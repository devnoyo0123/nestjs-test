import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/entities/member.entity';
import { Address } from '../address/entities/address.entity';
import { OrderRepository } from './repository/repository';
import { MemberRepository } from '../member/repository/repository.service';
import { ItemRepository } from '../item/repository/item-repository.service';
import { Book } from '../item/entities/book.entity';
import { ORDERStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from '../orderitem/entities/orderitem.entity';

describe('OrderService', () => {
  let orderService: OrderService;
  let module: TestingModule;
  let orderRepo;
  let memberRepo;
  let itemRepo;
  let orderItemRepo;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'service',
          password: 'local',
          database: 'mydb',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([
          OrderRepository,
          MemberRepository,
          ItemRepository,
          OrderItem,
        ]),
      ],
      providers: [OrderService],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepo = module.get<OrderRepository>(OrderRepository);
    memberRepo = module.get<MemberRepository>(MemberRepository);
    itemRepo = module.get<ItemRepository>(ItemRepository);
    orderItemRepo = module.get<Repository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  it('상품_주문', async () => {
    // given
    const member: Member = new Member();
    member.name = '회원1';
    member.address = new Address();
    member.address.city = '서울';
    member.address.street = '관악구';
    member.address.zipcode = '123-123';
    const createdMember = await memberRepo.save(member);
    const book: Book = new Book();
    book.name = '시골 JPA';
    book.price = 10000;
    book.stockQuantity = 10;
    const createItem = await itemRepo.save(book);

    const orderCount = 2;
    // when
    const orderId = await orderService.order(
      createdMember.id,
      createItem.id,
      orderCount,
    );

    // then
    const order = await orderRepo.findOne(orderId);

    expect(order.status).toEqual(ORDERStatus.ORDER);
  }, 30000);
});
