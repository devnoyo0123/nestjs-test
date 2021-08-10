import { ORDERStatus } from '../entities/order.entity';

export class OrderSearchDto {
  id: number;
  status: ORDERStatus;
}
