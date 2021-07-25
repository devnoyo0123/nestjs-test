import { ChildEntity, Column } from 'typeorm';
import { Item } from './item.entity';

@ChildEntity()
export class Movie extends Item {
  @Column()
  director: string;

  @Column()
  actor: string;
}
