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

    // Leer archivos JSON desde el sistema de archivos local
    const subjects: Subject[] = getSubjects();
    const schedules: SubjectGroup[] = getSchedules();

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
              capacity: group['capacidad'],
              enrolled: group['matriculados'],
              schedule: (
                group['horario'] as {
                  dia: string;
                  hora: string;
                  edificio: string;
                  aula: string;
                  profesor: string;
                }[]
              ).map((s) => ({
                day: s['dia'],
                time: s['hora'],
                building: s['edificio'],
                room: s['aula'],
                professor: s['profesor'],
              })),
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

function getSubjects(): Subject[] {
  try {
    const filePath = join(process.cwd(), 'data', 'materias.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data['materias'];
  } catch (error) {
    console.error('Error al leer el archivo materias.json:', error);
    throw new Error('No se pudo cargar el archivo materias.json');
  }
}

function getSchedules(): SubjectGroup[] {
  try {
    const filePath = join(process.cwd(), 'data', 'horarios.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error al leer el archivo horarios.json:', error);
    throw new Error('No se pudo cargar el archivo horarios.json');
  }
}

export default seed;