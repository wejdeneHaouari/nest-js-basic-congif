import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { UserModule } from './user/user.module';
import { AuthService } from './shared/auth/auth.service';
import { JwtStrategy } from './shared/auth/jwt-strategy/jwt-strategy.service';
import { AuthController } from './shared/auth/auth.controller';
import { TestController } from './test/test.controller';


@Module({
  imports: [ MongooseModule.forRoot(ConfigurationService.connectionString),
    SharedModule,
    UserModule],
  controllers: [AppController, AuthController, TestController],
  providers: [AppService, AuthService, JwtStrategy],
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
