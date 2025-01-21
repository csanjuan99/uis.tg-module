import {
  AppealLog,
  AppealRequestStatus,
  AppealStatus,
  AppealStudent,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AppealRequestChangeRequest {
  @ApiProperty({
    description: 'Grupo de la materia',
    example: 'A',
  })
  @IsNotEmpty({
    message: 'El grupo de la materia es requerido',
  })
  group: string;

  @ApiProperty({
    description: 'Código de la materia',
    example: '225421',
  })
  @IsNotEmpty({
    message: 'El código de la materia es requerido',
  })
  sku: string;

  @ApiProperty({
    description: 'Nombre de la materia',
    example: 'Cálculo I',
  })
  @IsNotEmpty({
    message: 'El nombre de la materia es requerido',
  })
  name: string;
}

export class AppealRequestRequest {
  @ApiProperty({
    nullable: true,
    type: AppealRequestChangeRequest,
  })
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AppealRequestChangeRequest)
  from: AppealRequestChangeRequest;

  @ApiProperty({
    nullable: true,
    type: AppealRequestChangeRequest,
    isArray: true,
  })
  @IsOptional()
  @IsArray({
    message: 'Las peticiones de cambio deben ser un listo',
  })
  @ValidateNested({ each: true })
  @Type(() => AppealRequestChangeRequest)
  to: AppealRequestChangeRequest[];
}

export class AppealStudentRequest implements AppealStudent {
  @ApiProperty({
    required: true,
    description: 'Nombre del estudiante',
    example: 'Juan',
  })
  @IsNotEmpty({
    message: 'El nombre del estudiante es requerido',
  })
  @IsString({
    message: 'El nombre del estudiante debe ser un texto',
  })
  name: string;
  @ApiProperty({
    required: true,
    description: 'Apellido del estudiante',
    example: 'Doe',
  })
  @IsNotEmpty({
    message: 'El apellido del estudiante es requerido',
  })
  @IsString({
    message: 'El apellido del estudiante debe ser un texto',
  })
  lastname: string;
  @ApiProperty({
    required: true,
    description: 'Nombre de usuario del estudiante',
    example: 'john.doe@correo.uis.edu.co',
  })
  @IsNotEmpty({
    message: 'El nombre de usuario del estudiante es requerido',
  })
  @IsString({
    message: 'El nombre de usuario del estudiante debe ser un texto',
  })
  username: string;
  @ApiProperty({
    required: true,
    description: 'Identificación del estudiante',
    example: '217xxxx',
  })
  @IsNotEmpty({
    message: 'La identificación del estudiante es requerida',
  })
  @IsString({
    message: 'La identificación del estudiante debe ser un texto',
  })
  identification: string;
}

export class CreateAppealRequest {
  @ApiProperty({
    description: 'Peticiones de la apelación',
    type: AppealRequestRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'Las peticiones de apelación son requeridas',
  })
  @ValidateNested({ each: true })
  @Type(() => AppealRequestRequest)
  requests: AppealRequestRequest[];

  @IsNotEmpty({
    message: 'El estudiante es requerido',
  })
  user: AppealStudentRequest;
}

export class AppealStudentResponse implements AppealStudent {
  @ApiProperty({
    description: 'Nombre del estudiante',
    example: 'Juan',
  })
  name: string;
  @ApiProperty({
    description: 'Apellido del estudiante',
    example: 'Doe',
  })
  lastname: string;
  @ApiProperty({
    description: 'Nombre de usuario del estudiante',
    example: 'john.doe@correo.uis.edu.co',
  })
  username: string;
  @ApiProperty({
    description: 'Identificación del estudiante',
    example: '217xxxx',
  })
  identification: string;
}

export class AppealResponse {
  @ApiProperty({
    description: 'Estudiante de la solicitud',
  })
  student: AppealStudentResponse;
  @ApiPropertyOptional({
    description: 'Observaciones de la solicitud',
    example: 'El estudiante necesita cambiar de horario',
  })
  observation?: string;
  @ApiProperty({
    description: 'Identificador del estudiante',
    example: '5f7c0b7b9f6d7a001f5e0e1b',
  })
  studentId: string;

  @ApiProperty({
    description: 'Peticiones de la apelación',
    type: AppealRequestRequest,
  })
  @ValidateNested({ each: true })
  @Type(() => AppealRequestRequest)
  requests: AppealRequestRequest[];

  @ApiPropertyOptional({
    description: 'Registros de actividad',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  logs?: Record<string, any>[];

  @ApiProperty({
    description: 'Estado de la apelación',
    example: AppealStatus.PENDING,
  })
  status: AppealStatus;
}

export class UpdateAppealRequest {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsNotEmptyObject()
  student: AppealStudentRequest;
  @ApiPropertyOptional({})
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AppealRequestRequest)
  requests: AppealRequestRequest[];
  @ApiPropertyOptional({})
  @IsOptional()
  logs?: AppealLog[];
  @ApiPropertyOptional({})
  @IsOptional()
  observation?: string;
  @ApiPropertyOptional({})
  @IsOptional()
  status: string;
}
