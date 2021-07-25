import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Cat {
  // @PrimaryGeneratedColumn('increment', {type: 'int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
