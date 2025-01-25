import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SubjectGroupSchedule } from '../../../infrastructure/persistence/schema/subject.schema';
import { Type } from 'class-transformer';

class ScheduleSubjectGroupScheduleRequest {
  @ApiProperty({
    example: 'MONDAY',
  })
  @IsNotEmpty({
    message: 'El día de la semana es requerido',
  })
  @IsString({
    message: 'El día de la semana debe ser un texto',
  })
  day: string;
  @ApiProperty({
    example: '8:00 - 10:00',
  })
  @IsNotEmpty({
    message: 'El horario de la materia es requerido',
  })
  @IsString({
    message: 'El horario de la materia debe ser un texto',
  })
  time: string;
  @ApiProperty({
    example: 'CAMILO TORRES',
  })
  @IsNotEmpty({
    message: 'El edificio de la materia es requerido',
  })
  @IsString({
    message: 'El edificio de la materia debe ser un texto',
  })
  building: string;
  @ApiProperty({
    example: '201',
  })
  @IsNotEmpty({
    message: 'El salón de la materia es requerido',
  })
  @IsString({
    message: 'El salón de la materia debe ser un texto',
  })
  room: string;
  @ApiProperty({
    example: 'JUAN PEREZ',
  })
  @IsNotEmpty({
    message: 'El profesor de la materia es requerido',
  })
  @IsString({
    message: 'El profesor de la materia debe ser un texto',
  })
  professor: string;
}

class ScheduleSubjectGroupRequest {
  @ApiProperty({
    example: 'A2',
  })
  @IsNotEmpty({
    message: 'El sku del grupo de la materia es requerido',
  })
  sku: string;
  @ApiProperty({
    type: ScheduleSubjectGroupScheduleRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'El horario del grupo de la materia es requerido',
  })
  @IsArray({
    message: 'El horario del grupo de la materia debe ser una lista',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => ScheduleSubjectGroupScheduleRequest)
  schedule: ScheduleSubjectGroupScheduleRequest[];
}

class ScheduleSubjectRequest {
  @ApiProperty({
    type: ScheduleSubjectGroupRequest,
  })
  @IsNotEmptyObject(
    {
      nullable: false,
    },
    {
      message: 'El grupo de la materia es requerido',
    },
  )
  group: ScheduleSubjectGroupRequest;
  @ApiProperty({
    example: '22052',
  })
  @IsNotEmpty({
    message: 'El sku de la materia es requerido',
  })
  @IsString({
    message: 'El sku de la materia debe ser un texto',
  })
  sku: string;
  @ApiProperty({
    example: 'Calculo I',
  })
  @IsNotEmpty({
    message: 'El nombre de la materia es requerido',
  })
  @IsString({
    message: 'El nombre de la materia debe ser un texto',
  })
  name: string;
}

export class CreateScheduleRequest {
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias es requerida',
  })
  @IsArray({
    message: 'Las materia del horario deben ser una lista',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => ScheduleSubjectRequest)
  subjects: ScheduleSubjectRequest[];

  @IsNotEmptyObject(
    {
      nullable: false,
    },
    {
      message: 'El identificador del estudiante es requerido',
    },
  )
  student: object;
}

export class UpdateScheduleRequest extends PartialType(CreateScheduleRequest) {}

class ScheduleSubjectGroupScheduleResponse {
  @ApiProperty({
    example: 'MONDAY',
  })
  day: string;
  @ApiProperty({
    example: '8:00 - 10:00',
  })
  time: string;
  @ApiProperty({
    example: 'CAMILO TORRES',
  })
  building: string;
  @ApiProperty({
    example: '201',
  })
  room: string;
  @ApiProperty({
    example: 'JUAN PEREZ',
  })
  professor: string;
}

class ScheduleSubjectGroupResponse {
  @ApiProperty({
    example: 'A2',
  })
  sku: string;
  @ApiProperty({
    type: ScheduleSubjectGroupScheduleResponse,
    isArray: true,
  })
  schedule: ScheduleSubjectGroupScheduleResponse[];
}

class ScheduleSubjectResponse {
  @ApiProperty({
    type: String,
  })
  _id: string;
  @ApiProperty({
    example: '22052',
  })
  sku: string;
  @ApiProperty({
    example: 'Calculo I',
  })
  name: string;
  @ApiProperty({
    type: ScheduleSubjectGroupResponse,
  })
  group: ScheduleSubjectGroupResponse;
}

export class ScheduleResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  subjects: ScheduleSubjectResponse[];
  @ApiProperty({
    description: 'Identificador del estudiante',
  })
  studentId: string;
}
