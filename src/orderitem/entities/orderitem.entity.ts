import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Item} from "../../item/entities/item.entity";
import {Order} from "../../order/entities/order.entity";

@Entity()
export class Orderitem {
  @PrimaryGeneratedColumn()
  id: number;

  // https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md
  // you can omit @JoinColumn
  @ManyToOne(() => Item, (item) => item.orderItem)
  item: Item;

  @ManyToOne(() => Order, (order) => order.orderItem)
  order: Order;

  @Column()
  orderPrice: number;

  @Column()
  count: number;
}
