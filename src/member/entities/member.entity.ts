import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { Order } from '../../order/entities/order.entity';
import { IMember } from './IMember';

@Entity()
export class Member implements IMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => Address)
  address: Address;

  @OneToMany(() => Order, (order) => order.member)
  orders: Order[];

  @Column({
    default: false,
  })
  useYn: boolean;
}
