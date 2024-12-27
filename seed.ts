import mongoose from 'mongoose';
import {
  UserDocument,
  UserSchema,
} from './src/infrastructure/persistence/schema/user.schema';
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  GetObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import {
  Subject,
  SubjectDocument,
  SubjectGroup,
  SubjectSchema,
} from './src/infrastructure/persistence/schema/subject.schema';

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

    if (!user) {
      await userModel.create(root);
    }

    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_S3_REGION,
    });

    const subjectsInput: GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: 'materias.json',
    };

    const schedulesInput: GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: 'horarios.json',
    };

    const subjects = await getSubjects(client, subjectsInput);
    const schedules = await getSchedules(client, schedulesInput);

    const subjectModel = mongoose.model(Subject.name, SubjectSchema);

    for (const subject of subjects) {
      const _subject: SubjectDocument = await subjectModel.findOne({
        sku: subject['codigo'],
      });
      if (_subject) {
        continue;
      }
      await subjectModel.create({
        sku: subject['codigo'],
        name: subject['nombre'],
        credits: subject['creditos'],
        level: subject['nivel'],
        requirements: subject['requisitos'] ?? [],
        groups: [],
      });
    }

    const _subjects: SubjectDocument[] = await subjectModel.find();

    for (const subject of _subjects) {
      for (const schedule of schedules) {
        if (schedule['codigo'] === subject.sku) {
          for (const group of schedule['grupos']) {
            const _group: SubjectGroup = subject.groups.find(
              (g: SubjectGroup) => g.sku === group['grupo'],
            );
            if (_group) {
              continue;
            }
            subject.groups.push({
              sku: group['grupo'],
              capacity: 0,
              enrolled: 0,
              schedule: group['horario'] ?? [],
            });
          }
          await subject.save();
        }
      }
    }
  } catch (e) {
    throw e;
  } finally {
    await mongoose.connection.close();
  }
}

async function getSubjects(client: S3Client, request: GetObjectRequest) {
  const command = new GetObjectCommand(request);
  const response: GetObjectCommandOutput = await client.send(command);
  const body: string = await streamToString(response.Body as Readable);
  return JSON.parse(body)['materias'];
}

async function getSchedules(client: S3Client, request: GetObjectRequest) {
  const command = new GetObjectCommand(request);
  const response: GetObjectCommandOutput = await client.send(command);
  const body: string = await streamToString(response.Body as Readable);
  return JSON.parse(body);
}

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });

export default seed;
