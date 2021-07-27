import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemRepository } from './repository/item-repository.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemRepository)
    private itemRepository: ItemRepository,
  ) {}

  async create(createItemDto: CreateItemDto) {
    return await this.itemRepository.save(createItemDto);
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: number) {
    return this.itemRepository.findOne(id);
  }
}
