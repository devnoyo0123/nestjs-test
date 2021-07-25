import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import {Order, ORDERStatus} from '../../order/entities/order.entity';

export enum DeliveryStatus {
  READY = 'READY',
  COMP = 'COMP',
}


@Entity()
export class Delivery {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.delivery)
  order: Order;

  @Column(() => Address)
  address: Address;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.READY,
  })
  status: DeliveryStatus;
}
