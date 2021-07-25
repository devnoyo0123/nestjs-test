import {
  Column,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Orderitem } from '../../orderitem/entities/orderitem.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';

// https://orkhan.gitbook.io/typeorm/docs/entities#enum-column-type
export enum ORDERStatus {
  READY = 'READY',
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

  @OneToMany(() => Orderitem, (orderItem) => orderItem.order)
  orderItem: Orderitem;

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  @JoinColumn()
  delivery: Delivery;

  @Column()
  orderDate: Date;

  @Column({
    type: 'enum',
    enum: ORDERStatus,
    default: ORDERStatus.READY,
  })
  status: ORDERStatus;
}
