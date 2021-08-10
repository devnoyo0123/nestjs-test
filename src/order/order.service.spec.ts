import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/entities/member.entity';
import { Address } from '../address/entities/address.entity';
import { OrderRepository } from './repository/repository';
import { MemberRepository } from '../member/repository/repository.service';
import { ItemRepository } from '../item/repository/item-repository.service';
import { Book } from '../item/entities/book.entity';
import { Order, ORDERStatus } from './entities/order.entity';
import { getConnection, Repository } from 'typeorm';
import { OrderItem } from '../orderitem/entities/orderitem.entity';
import { Item } from '../item/entities/item.entity';

describe('OrderService', () => {
  let orderService: OrderService;
  let module: TestingModule;
  let orderRepo;
  let memberRepo;
  let itemRepo;
  let orderItemRepo;

  beforeAll(async () => {
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
          logging: true,
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

  describe('상품_주문', () => {
    // given
    let order = null;
    const orderCount = 2;

    beforeAll(async () => {
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
      const createItem: Item = await itemRepo.save(book);

      // when
      const orderId: number = await orderService.order(
        createdMember.id,
        createItem.id,
        orderCount,
      );

      order = await getConnection()
        .createQueryBuilder<Order>(Order, 'order')
        .innerJoinAndSelect('order.orderItems', 'orderItems')
        .innerJoinAndSelect('orderItems.item', 'item')
        .getOne();
    });

    // assert 문에 message가 있었으면 좋겠는데..
    it('주문 상태가 ORDER 상태이어야 합니다.', async () => {
      expect(order.status).toEqual(ORDERStatus.ORDER);
    });

    it('주문 아이템의 길이가 1이어야 합니다.', async () => {
      expect(order.orderItems.length).toEqual(1);
    });

    it('주문 수량과 단가를 곱한 값이 전체 가격이 되어야 합니다.', async () => {
      expect(orderCount * 10000).toEqual(order.getTotalPrice());
    });

    it('주문한 상품의 재고수량이 8이 되어야 합니다', async () => {
      expect(order.orderItems[0].item.stockQuantity).toEqual(8);
    });
  });

  it('상품주문_재고수량초과', async () => {
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
    const createItem: Item = await itemRepo.save(book);

    const orderCount = 11;

    // when then 이 같이 있는 경우 아닌가?

    // async await throwError
    // 사실 이렇게 테스트하기보다는 removeStock 단위 테스트를 하는게 좋음.
    await expect(
      orderService.order(createdMember.id, createItem.id, orderCount),
    ).rejects.toThrowError('need more stock');
  });

  describe('주문_취소', () => {
    it('주문 취소시 상태는 CANCEL 이다.', async () => {
      // given
      const member: Member = new Member();
      member.name = 'yobs';
      const item: Item = new Item();
      item.name = '시골 JPA';
      item.price = 10000;
      item.stockQuantity = 10;

      const orderCount = 2;

      const createdMember = await memberRepo.save(member);
      const createItem: Item = await itemRepo.save(item);

      const orderId = await orderService.order(
        createdMember.id,
        createItem.id,
        orderCount,
      );

      // when
      await orderService.cancelOrder(orderId);

      // then
      const getOrder: Order = await orderRepo.findOne(orderId);
      expect(getOrder.status).toEqual(ORDERStatus.CANCEL);
    });
  });

  describe('주문_취소', () => {
    it('주문이 취소된 상품은 그만큼 재고가 증가해야 한다.', async () => {
      // given
      const member: Member = new Member();
      member.name = 'yobs';
      const item: Item = new Item();
      item.name = '시골 JPA';
      item.price = 10000;
      item.stockQuantity = 10;

      const orderCount = 2;

      const createdMember = await memberRepo.save(member);
      const createItem: Item = await itemRepo.save(item);

      const orderId = await orderService.order(
        createdMember.id,
        createItem.id,
        orderCount,
      );

      // when
      await orderService.cancelOrder(orderId);

      // then
      const cancelItem: Item = await itemRepo.findOne(createItem.id);
      expect(cancelItem.stockQuantity).toEqual(10);
    }, 30000);
  });

  describe('주문_검색', () => {});
});
