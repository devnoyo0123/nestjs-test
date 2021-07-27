import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './repository/item-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemRepository])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
