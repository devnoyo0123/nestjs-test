import { Column } from 'typeorm';

// https://github.com/typeorm/typeorm/blob/master/docs/embedded-entities.md
export class Address {
  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  street: string;

  @Column({
    nullable: true,
  })
  zipcode: string;
}
