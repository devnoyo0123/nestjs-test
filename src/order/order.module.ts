import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './repository/repository';
import { MemberRepository } from '../member/repository/repository.service';
import { ItemRepository } from '../item/repository/item-repository.service';
import { OrderItem } from '../orderitem/entities/orderitem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      MemberRepository,
      ItemRepository,
      OrderItem,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
