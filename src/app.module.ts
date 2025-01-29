import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './infrastructure/config/database.config';
import JwtConfig from './infrastructure/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application-core/abstract/auth/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application-core/abstract/auth/strategy/jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { PermissionGuard } from './application-core/abstract/auth/guards/permission.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import AwsConfig from './infrastructure/config/aws.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, JwtConfig, AwsConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    UserInterfaceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    JwtStrategy,
    AppService,
  ],
})
export class AppModule {}
