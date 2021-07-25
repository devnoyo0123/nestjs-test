import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from './repository/repository.service';

@Module({
  controllers: [MemberController],
  imports: [TypeOrmModule.forFeature([MemberRepository])],
  providers: [MemberService],
})
export class MemberModule {}
