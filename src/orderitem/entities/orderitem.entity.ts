import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md
  // you can omit @JoinColumn
  @ManyToOne(() => Item, (item) => item.orderItem)
  @JoinColumn()
  item: Item;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn()
  order: Order;

  @Column()
  orderPrice: number;

  @Column()
  count: number;

  /**
   * 생성 메서드
   * 주문엔티티는 생성할때 사용한다. 주문 회원, 배송정보, 주문 상품의 정보를 받아서
   * 실제 주문 엔티티를 생성한다.
   */
  static createOrderItem(item: Item, orderPrice: number, count: number) {
    const orderItem: OrderItem = new OrderItem();
    orderItem.item = item;
    orderItem.orderPrice = orderPrice;
    orderItem.count = count;

    item.removeStock(count);
    return orderItem;
  }

  /**
   * 비즈니스 로직
   * 주문 취소시 사용한다. 주문 상태를 취소로 변경하고 주문 상품에 주문 취소를 알린다.
   * 만약 이미 배송을 완료한 상품이면 주문을 취소하지 못하도록 예외를 발생시킨다.
   */
  cancel() {
    this.item.addStock(this.count);
  }

  /**
   * 조회 로직
   */
  getTotalPrice() {
    return this.count * this.orderPrice;
  }
}
