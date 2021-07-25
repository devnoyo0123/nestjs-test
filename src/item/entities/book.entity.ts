import { ChildEntity, Column } from 'typeorm';
import { Item } from './item.entity';

@ChildEntity()
export class Book extends Item {
  @Column()
  author: string;

  @Column()
  isbn: string;
}
