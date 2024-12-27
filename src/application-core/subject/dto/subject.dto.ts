import {
  SubjectGroup,
  SubjectGroupSchedule,
} from '../../../infrastructure/persistence/schema/subject.schema';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class SubjectGroupScheduleResponse implements SubjectGroupSchedule {
  @ApiProperty({
    example: 'MARTES',
    description: 'Día de la semana',
  })
  day: string;
  @ApiProperty({
    example: '07:00-09:00',
    description: 'Horario del grupo',
  })
  time: string;
  @ApiProperty({
    example: 'CAMILO TORRES',
    description: 'Edificio donde se dicta la clase',
  })
  building: string;
  @ApiProperty({
    example: '101',
    description: 'Salón donde se dicta la clase',
  })
  room: string;
  @ApiProperty({
    example: 'JOHN DOE',
    description: 'Profesor del grupo',
  })
  professor: string;
}

export class SubjectGroupResponse implements SubjectGroup {
  @ApiProperty({
    example: 'A2',
    description: 'Código del grupo',
  })
  sku: string;
  @ApiProperty({
    example: 30,
    description: 'Capacidad del grupo',
  })
  capacity: number;
  @ApiProperty({
    example: 0,
    description: 'Estudiantes matriculados en el grupo',
  })
  enrolled: number;
  @ApiProperty({
    isArray: true,
    type: SubjectGroupScheduleResponse,
    description: 'Horarios del grupo',
  })
  schedule: SubjectGroupScheduleResponse[];
}

export class SubjectResponse {
  @ApiProperty({
    example: '20253',
    description: 'Código de la materia',
  })
  sku: string;
  @ApiProperty({
    example: 'Cálculo II',
    description: 'Nombre de la materia',
  })
  name: string;
  @ApiProperty({
    isArray: true,
    example: ['20252'],
    description: 'Códigos de las materias que son requisitos',
  })
  requirements: string[];
  @ApiProperty({
    example: 4,
    description: 'Créditos de la materia',
  })
  credits: number;
  @ApiProperty({
    description: 'Nivel de la materia en el pensum',
    example: 1,
  })
  level: string | number;
  @ApiProperty({
    isArray: true,
    type: SubjectGroupResponse,
    description: 'Grupos de la materia',
  })
  groups: SubjectGroupResponse[];
}

export class CreateSubjectRequest {
  @ApiProperty({
    example: '20253',
    description: 'Código de la materia',
  })
  sku: string;
  @ApiProperty({
    example: 'Cálculo II',
    description: 'Nombre de la materia',
  })
  name: string;
  @ApiPropertyOptional({
    example: ['20252'],
    description: 'Códigos de las materias que son requisitos',
  })
  requirements: string[];
  @ApiProperty({
    example: 4,
    description: 'Créditos de la materia',
  })
  credits: number;
  @ApiProperty({
    description: 'Nivel de la materia en el pensum',
    example: 1,
  })
  level: string | number;
  @ApiPropertyOptional({
    isArray: true,
    type: SubjectGroupResponse,
    description: 'Grupos de la materia',
  })
  groups: SubjectGroupResponse[];
}

export class UpdateSubjectRequest extends PartialType(CreateSubjectRequest) {}
