import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './repository/repository';
import { MemberRepository } from '../member/repository/repository.service';
import { ItemRepository } from '../item/repository/item-repository.service';
import { Member } from '../member/entities/member.entity';
import { Item } from '../item/entities/item.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { OrderItem } from '../orderitem/entities/orderitem.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    @InjectRepository(ItemRepository)
    private itemRepository: ItemRepository,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * 주문
   */

  /**
   * cascade를 써야하는가?
   * order가 배송, 주문 상품을 관리하는 상황에서 주문상품이나 배송이 다른쪽에 영향이 미치면
   * cascade 쓰지말고 각각 persist해라.
   * https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md
   * one to many, many to one
   * @param memberId
   * @param itemId
   * @param count
   */
  async order(
    memberId: number,
    itemId: number,
    count: number,
  ): Promise<number> {
    // 엔티티 조회
    const member: Member = await this.memberRepository.findOne(memberId);
    const item: Item = await this.itemRepository.findOne(itemId);

    // 배송정보 생성
    const delivery: Delivery = new Delivery();
    delivery.address = member.address;

    // 주문상품 생성
    const orderItem = OrderItem.createOrderItem(item, item.price, count);
    const createdOrderItem = await this.orderItemRepository.save(orderItem);

    // 주문 생성
    const order = Order.createOrder(member, delivery, orderItem);

    // 주문 저장
    const result = await this.orderRepository.save(order);
    return order.id;
  }

  /**
   * 주문 취소
   */

  async cancelOrder(orderId: number) {
    // 주문 엔티티 조회
    const order: Order = await this.orderRepository.findOne(orderId);
    // 주문 취소
    order.cancel();
  }
}
