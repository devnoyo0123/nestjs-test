import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderSearchDto } from '../dto/ordersearch.dto';
import { PaginationDto } from '../../dto/pagination.dto';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findAll(orderSearchDto: OrderSearchDto) {
    const queryBuilder = await getConnection()
      .createQueryBuilder<Order>(Order, 'order')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.item', 'item')
      .andWhere('order.id = :id', { id: orderSearchDto.id });

    if (orderSearchDto?.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: orderSearchDto.status,
      });
    }

    const [order, count] = await queryBuilder.getManyAndCount();
    return new PaginationDto<Order>(count, order);
  }
}
