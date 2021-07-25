import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }
  //
  // @Get()
  // findAll(): Promise<[Cat[], number]> {
  //   return this.catsService.findAll(0, 1);
  // }

  @Get()
  find(): Promise<Cat[]> {
    return this.catsService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNumber = Number(id);
    return this.catsService.findOne(idNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
