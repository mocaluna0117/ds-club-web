import { Module } from '@nestjs/common';
import { RebuildService } from './rebuild.service';

@Module({
  providers: [RebuildService],
  exports: [RebuildService],
})
export class RebuildModule {}
