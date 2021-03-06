import { Address } from '../../address/entities/address.entity';
import { Order } from '../../order/entities/order.entity';

export class CreateMemberDto {
  id?: number;
  name: string;
  address?: Address;
  orders?: Order[];
  useYn?: boolean;
}
