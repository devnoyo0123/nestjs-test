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
