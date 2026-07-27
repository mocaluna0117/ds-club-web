import { Module } from '@nestjs/common';
import { MembersResolver } from './members.resolver';
import { MembersService } from './members.service';
import { RebuildModule } from '../rebuild/rebuild.module';

@Module({
  imports: [RebuildModule],
  providers: [MembersResolver, MembersService],
})
export class MembersModule {}
