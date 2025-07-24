import mongoose from 'mongoose';
import {
  UserDocument,
  UserSchema,
} from './src/infrastructure/persistence/schema/user.schema';
import {
  Subject,
  SubjectDocument,
  SubjectGroup,
  SubjectSchema,
} from './src/infrastructure/persistence/schema/subject.schema';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seed() {
  try {
    await mongoose.connect(process.env.APP_DATABASE_URI);

    const userModel = mongoose.model('User', UserSchema);

    const root = {
      name: 'Root',
      lastname: 'Root',
      username: 'root@correo.uis.edu.co',
      password: '$2a$12$NXx4I1JBFvaZX./3EtvID.5Hk7/sXRjDhf2PE.iKS6tXuGSW46EHq',
      kind: 'ROOT',
      permissions: ['*'],
    };

    const user: UserDocument = await userModel.findOne({
      username: root.username,
    });

    if (!user) {
      await userModel.create(root);
    }
  } catch (e) {
    throw e;
  } finally {
    await mongoose.connection.close();
  }
}

export default seed;
