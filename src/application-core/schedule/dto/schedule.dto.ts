import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class ScheduleSubjectRequest {
  @ApiProperty({
    example: 'A2',
  })
  @IsNotEmpty({
    message: 'El grupo de la materia es requerido',
  })
  @IsString({
    message: 'El grupo de la materia debe ser un texto',
  })
  group: string;
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
  @ApiProperty({
    example: 'LUNES',
  })
  @IsNotEmpty({
    message: 'El día de la materia es requerido',
  })
  @IsString({
    message: 'El día de la materia debe ser un texto',
  })
  day: string;
  @ApiProperty({
    example: '8:00 - 10:00',
  })
  @IsNotEmpty({
    message: 'La hora de la materia es requerida',
  })
  @IsString({
    message: 'La hora de la materia debe ser un texto',
  })
  time: string;
  @ApiProperty({
    example: 'LABORATORIOS PESADOS',
  })
  @IsNotEmpty({
    message: 'El edificio de la materia es requerido',
  })
  @IsString({
    message: 'El edificio de la materia debe ser un texto',
  })
  building: string;
  @ApiProperty({
    example: '254',
  })
  @IsNotEmpty({
    message: 'El salón de la materia es requerido',
  })
  @IsString({
    message: 'El salón de la materia debe ser un texto',
  })
  room: string;
  @ApiProperty({
    example: 'LEONEL PARRA PINILLA',
  })
  @IsNotEmpty({
    message: 'El profesor de la materia es requerido',
  })
  @IsString({
    message: 'El profesor de la materia debe ser un texto',
  })
  professor: string;
}

export class CreateScheduleRequest {
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del lunes es requerida',
  })
  monday: ScheduleSubjectRequest[];
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del martes es requerida',
  })
  tuesday: ScheduleSubjectRequest[];
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del miércoles es requerida',
  })
  wednesday: ScheduleSubjectRequest[];
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del jueves es requerida',
  })
  thursday: ScheduleSubjectRequest[];
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del viernes es requerida',
  })
  friday: ScheduleSubjectRequest[];
  @ApiProperty({
    type: ScheduleSubjectRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'La lista de materias del sábado es requerida',
  })
  saturday: ScheduleSubjectRequest[];
  @ApiProperty({
    description: 'Identificador del estudiante',
  })
  @IsNotEmpty({
    message: 'El identificador del estudiante es requerido',
  })
  @IsString({
    message: 'El identificador del estudiante debe ser un texto',
  })
  studentId: string;
}

export class UpdateScheduleRequest extends PartialType(CreateScheduleRequest) {}

class ScheduleSubjectResponse {
  @ApiProperty({
    example: 'A2',
  })
  group: string;
  @ApiProperty({
    example: '22052',
  })
  sku: string;
  @ApiProperty({
    example: 'Calculo I',
  })
  name: string;
  @ApiProperty({
    example: 'LUNES',
  })
  day: string;
  @ApiProperty({
    example: '8:00 - 10:00',
  })
  time: string;
  @ApiProperty({
    example: 'LABORATORIOS PESADOS',
  })
  building: string;
  @ApiProperty({
    example: '254',
  })
  room: string;
  @ApiProperty({
    example: 'LEONEL PARRA PINILLA',
  })
  professor: string;
}

export class ScheduleResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  monday: ScheduleSubjectResponse[];
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  tuesday: ScheduleSubjectResponse[];
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  wednesday: ScheduleSubjectResponse[];
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  thursday: ScheduleSubjectResponse[];
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  friday: ScheduleSubjectResponse[];
  @ApiProperty({
    type: ScheduleSubjectResponse,
    isArray: true,
  })
  saturday: ScheduleSubjectResponse[];
  @ApiProperty({
    description: 'Identificador del estudiante',
  })
  studentId: string;
}
