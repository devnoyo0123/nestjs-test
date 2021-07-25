import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepository } from './repository/repository.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { IMember } from './entities/IMember';

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService, MemberRepository],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  it('회원가입', async () => {
    // given

    const createMemberDto: CreateMemberDto = {
      name: 'yobs',
    };

    const createdMember: IMember = {
      id: 1,
      name: 'yobs',
      address: null,
      orders: null,
      useYn: false,
    };

    const memberRepositoryJoinSpy = jest
      .spyOn(memberRepository, 'join')
      .mockResolvedValue(createdMember);

    const memberRepositoryfindNameSpy = jest
      .spyOn(memberRepository, 'findByName')
      .mockResolvedValue([]);

    // when
    const savedId = await memberService.join(createMemberDto);

    // then
    expect(memberRepositoryfindNameSpy).toBeCalledWith(createdMember.name);
    expect(memberRepositoryJoinSpy).toBeCalledWith(createMemberDto);
    expect(savedId).toEqual(createdMember.id);
  });
});
