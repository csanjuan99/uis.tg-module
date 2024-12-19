import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserGateway } from './gateway/user.gateway';

const SERVICES = [UserGateway];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class PersistenceModule {}
