import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    PersistenceModule,
  ],
  exports: [PersistenceModule],
})
export class InfrastructureModule {}
