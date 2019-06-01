import { Module, Global } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';

@Global()
@Module({
  exports: [ConfigurationService, MapperService],
  providers: [ConfigurationService, MapperService],
})
export class SharedModule {}
