import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';

@Module({
  imports: [ MongooseModule.forRoot(ConfigurationService.connectionString),
    SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // static to not have injection in main ts
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly configurationService: ConfigurationService) {
   AppModule.port = AppModule.normalizePort(configurationService.get(Configuration.PORT));
   AppModule.host = configurationService.get(Configuration.HOST);
   AppModule.isDev = configurationService.isDevlopment;
  }
  private static normalizePort(param: number | string): number | string {
    const portNumber: number = typeof  param === 'string' ? parseInt(param, 10) : param;
    if (isNaN(portNumber)) return param;
    else if (portNumber >= 0) return portNumber;
  }
}
