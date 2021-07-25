import { EntityRepository, Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Member)
export class MemberRepository extends Repository<Member> {
  async join(member: Member) {
    return await this.save(member);
  }

  async findById(id: number) {
    return await this.findOne(id);
  }

  async findAll() {
    return await this.find();
  }

  async findByName(name: string) {
    return await this.find({
      where: {
        name,
      },
    });
  }
}
