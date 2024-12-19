import mongoose from 'mongoose';
import {
  UserDocument,
  UserSchema,
} from './src/infrastructure/persistence/schema/user.schema';

async function seed() {
  try {
    await mongoose.connect(process.env.APP_DATABASE_URI);

    const userModel = mongoose.model('User', UserSchema);

    const root = {
      username: 'root@correo.uis.edu.co',
      password: '$2a$12$NXx4I1JBFvaZX./3EtvID.5Hk7/sXRjDhf2PE.iKS6tXuGSW46EHq',
      kind: 'ROOT',
      permissions: ['*'],
    };

    const user: UserDocument = await userModel.findOne({
      username: root.username,
    });

    if (user) {
      return;
    }

    await userModel.create(root);
  } catch (e) {
    throw e;
  } finally {
    await mongoose.connection.close();
  }
}

export default seed;
