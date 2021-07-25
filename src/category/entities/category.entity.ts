import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @ManyToMany(() => Item, (item) => item.categories)
  items: Item[];

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn()
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category;
}
