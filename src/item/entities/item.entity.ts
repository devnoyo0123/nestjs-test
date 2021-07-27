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
import { OrderItem } from '../../orderitem/entities/orderitem.entity';

// https://github.com/typeorm/typeorm/blob/master/docs/entity-inheritance.md#single-table-inheritance
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stockQuantity: number;

  // https://github.com/typeorm/typeorm/blob/master/docs/many-to-many-relations.md
  @ManyToMany(() => Category, (category) => category.items)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderItem: OrderItem[];

  /**
   * 비즈니스 로직
   */

  public addStock(quantity: number) {
    this.stockQuantity += quantity;
  }

  public removeStock(quantity: number) {
    const restStock = this.stockQuantity - quantity;
    if (restStock < 0) {
      throw new Error('need more stock');
    }
    this.stockQuantity = restStock;
  }
}
