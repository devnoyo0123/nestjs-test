import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { OrderItem } from '../../orderitem/entities/orderitem.entity';
import {
  Delivery,
  DeliveryStatus,
} from '../../delivery/entities/delivery.entity';

// https://orkhan.gitbook.io/typeorm/docs/entities#enum-column-type
export enum ORDERStatus {
  ORDER = 'ORDER',
  CANCEL = 'CANCEL',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // https://github.com/typeorm/typeorm/blob/master/docs/relations.md#cascades
  @ManyToOne(() => Member, (member) => member.orders, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  member: Member; // 주문 회원

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {})
  orderItems: OrderItem[];

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  @JoinColumn()
  delivery: Delivery;

  @Column()
  orderDate: Date;

  @Column({
    type: 'enum',
    enum: ORDERStatus,
    default: ORDERStatus.ORDER,
  })
  status: ORDERStatus;

  /**
   * 연관관계 메서드
   */

  setMember(member: Member) {
    this.member = member;
  }

  addOrderItem(orderItem: OrderItem) {
    orderItem.order = this;
    if (this.orderItems?.length) {
      this.orderItems = [...this.orderItems, orderItem];
    } else {
      this.orderItems = [orderItem];
    }
  }

  private setDelivery(delivery: Delivery) {
    this.delivery = delivery;
  }

  /**
   * 생성 메서드
   */

  static createOrder(
    member: Member,
    delivery: Delivery,
    ...orderItems: OrderItem[]
  ): Order {
    const order: Order = new Order();
    order.setMember(member);
    order.setDelivery(delivery);
    orderItems.forEach((orderItem) => {
      order.addOrderItem(orderItem);
    });
    order.status = ORDERStatus.ORDER;
    order.orderDate = new Date();
    return order;
  }

  /**
   * 비즈니스 로직
   */

  cancel() {
    if (this.delivery.status === DeliveryStatus.COMP) {
      throw new Error('이미 배송완료된 상품은 취소가 불가능합니다.');
    }

    this.status = ORDERStatus.CANCEL;
    this.orderItems.forEach((orderItem) => {
      orderItem.cancel();
    });
  }

  /**
   * 조회 로직
   */

  getTotalPrice(): number {
    const totalPrice = this.orderItems.reduce((acc, orderItem) => {
      return acc + orderItem.getTotalPrice();
    }, 0);

    return totalPrice;
  }
}
