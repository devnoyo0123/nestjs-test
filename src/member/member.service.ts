import { Injectable } from '@nestjs/common';
import { Member } from './entities/member.entity';
import { IMember } from './entities/IMember';
import { MemberRepository } from './repository/repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
  ) {}
  async join(createMemberDto: CreateMemberDto) {
    // 중복회원 검증
    await this.validateDuplicateMember(createMemberDto);
    const member: Member = Object.assign(new Member(), createMemberDto);
    const result = await this.memberRepository.join(member);
    return result.id;
  }

  async findAll() {
    await this.memberRepository.findAll();
  }

  async findOne(id: number) {
    return await this.memberRepository.findById(id);
  }

  // https://github.com/typeorm/typeorm/blob/master/docs/repository-api.md
  async update(id: number, updateMemberDto: IMember) {
    return await this.memberRepository.update(id, updateMemberDto);
  }

  async remove(id: number) {
    return await this.memberRepository.update(id, { useYn: false });
  }

  private async validateDuplicateMember(member: CreateMemberDto) {
    const findMembers: Member[] = await this.memberRepository.findByName(
      member.name,
    );

    if (findMembers.length > 0) {
      throw new Error('이미 존재하는 회원입니다.');
    }
  }
}
