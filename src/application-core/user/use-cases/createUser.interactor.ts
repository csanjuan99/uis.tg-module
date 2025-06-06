/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { CreateUserRequest } from '../dto/user.dto';
import { hashSync } from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';

// Mapeo de IDs a nombres de programas
const PROGRAM_NAMES = {
  11: 'INGENIERIA DE SISTEMAS',
  27: 'DISEÑO INDUSTRIAL',
  69: 'INGENIERIA BIOMEDICA',
  50: 'INGENIERIA EN CIENCIA DE DATOS',
  21: 'INGENIERIA CIVIL',
  24: 'INGENIERIA MECANICA',
} as const;

@Injectable()
export class CreateUserInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: CreateUserRequest) {
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.username,
    });

    if (user) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con este nombre de usuario',
      );
    }

    // Debug: Ver qué llega en el payload
    console.log('Payload original:', JSON.stringify(payload, null, 2));
    console.log('Program ID:', payload.program?.id);
    console.log('Tipo de program.id:', typeof payload.program?.id);

    // Asignar automáticamente el nombre del programa basado en el ID
    if (payload.program && payload.program.id) {
      console.log('Entrando a la lógica de asignación de nombre');
      
      // Convertir a número si es string
      const programId = typeof payload.program.id === 'string' 
        ? parseInt(payload.program.id, 10)
        : payload.program.id;
      
      console.log('Program ID convertido:', programId);
      console.log('PROGRAM_NAMES disponibles:', PROGRAM_NAMES);
      
      const programName = PROGRAM_NAMES[programId as keyof typeof PROGRAM_NAMES];
      console.log('Program name encontrado:', programName);
      
      if (programName) {
        payload.program.name = programName;
        console.log('Nombre asignado exitosamente:', payload.program.name);
      } else {
        console.log('No se encontró nombre para el ID:', programId);
      }
    } else {
      console.log('No hay program o program.id en el payload');
    }

    // Debug: Ver el payload después de la modificación
    console.log('Payload después de modificación:', JSON.stringify(payload, null, 2));

    // Hash de la contraseña
    payload.password = hashSync(payload.password, 10);

    const result = await this.userGateway.create(payload);
    
    // Debug: Ver el resultado final
    console.log('Usuario creado:', JSON.stringify(result, null, 2));
    
    return result;
  }
}

