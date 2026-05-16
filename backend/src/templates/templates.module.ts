import { Module } from '@nestjs/common';
import { TemplatesResolver } from './templates.resolver';
import { TemplatesService } from './templates.service';

@Module({
  providers: [TemplatesResolver, TemplatesService],
})
export class TemplatesModule {}
