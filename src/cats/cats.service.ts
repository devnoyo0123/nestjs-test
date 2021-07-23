import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  create(createCatDto: CreateCatDto) {
    return this.catRepository.save({
      name: createCatDto.name,
    });
  }

  findAll(skip = 0, take = 1): Promise<[Cat[], number]> {
    // return this.catRepository.find()
    const result = this.catRepository
      .createQueryBuilder('cat')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return result;
  }

  findOne(id: number): Promise<Cat> {
    return this.catRepository.findOne(id);
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    const cat = this.catRepository.find({
      where: {
        id,
      },
    });
    return this.catRepository.update(id, updateCatDto);
  }

  remove(id: number) {
    return this.catRepository.delete(id);
  }
}
