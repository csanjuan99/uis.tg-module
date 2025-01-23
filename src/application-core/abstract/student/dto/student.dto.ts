import {
  StudentShift,
  User,
} from '../../../../infrastructure/persistence/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

class StudentShiftRequest implements StudentShift {
  @ApiProperty({
    type: String,
    description: 'Día de la semana',
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    example: 'MONDAY',
  })
  day: string;
  @ApiProperty({
    type: String,
    description: 'Jornada del dia',
    enum: ['AM', 'PM'],
    example: 'AM',
  })
  time: string;
}

export class UpdateStudentRequest {
  @ApiProperty({
    type: String,
    description: 'Nombre del estudiante',
    example: 'John',
  })
  @IsOptional()
  @IsString({
    message: 'El nombre del estudiante debe ser un texto',
  })
  name?: string;
  @ApiProperty({
    type: String,
    description: 'Apellido',
    example: 'Doe',
  })
  @IsOptional()
  @IsString({
    message: 'El apellido del estudiante debe ser un texto',
  })
  lastname?: string;
  @ApiProperty({
    type: StudentShiftRequest,
    description: 'Jornada del estudiante',
  })
  @IsOptional()
  @IsNotEmptyObject(
    {
      nullable: true,
    },
    {
      message: 'La jornada del estudiante no puede estar vacía',
    },
  )
  shift?: StudentShiftRequest;
  @ApiProperty({
    type: String,
    description: 'Contraseña del estudiante',
    example: '*********',
  })
  password?: string;
  @IsNotEmpty({
    message: 'El identificador del estudiante es requerido',
  })
  @IsString({
    message: 'El identificador del estudiante debe ser un texto',
  })
  studentId: string;
}
