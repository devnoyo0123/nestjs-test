import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Orderitem } from '../../orderitem/entities/orderitem.entity';

// https://github.com/typeorm/typeorm/blob/master/docs/entity-inheritance.md#single-table-inheritance
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // https://github.com/typeorm/typeorm/blob/master/docs/many-to-many-relations.md
  @ManyToMany(() => Category, (category) => category.items)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Orderitem, (orderItem) => orderItem.item)
  orderItem: Orderitem[];
}
