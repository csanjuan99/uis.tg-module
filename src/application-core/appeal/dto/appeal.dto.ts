import {
  AppealLog,
  AppealRequestStatus,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AppealRequestFromChangeRequest {
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

export class AppealRequestToChangeRequest {
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

  @ApiProperty({
    description: 'Estado de la solicitud',
    type: Boolean,
  })
  @IsBoolean({
    message: 'El estado de la solicitud debe ser un booleano',
  })
  approved: boolean;
}

export class AppealRequestRequest {
  @ApiProperty({
    nullable: true,
    type: AppealRequestFromChangeRequest,
  })
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AppealRequestFromChangeRequest)
  from: AppealRequestFromChangeRequest;

  @ApiProperty({
    nullable: true,
    type: AppealRequestToChangeRequest,
    isArray: true,
  })
  @IsOptional()
  @IsArray({
    message: 'Las peticiones de cambio deben ser un listo',
  })
  @ValidateNested({ each: true })
  @Type(() => AppealRequestToChangeRequest)
  to: AppealRequestToChangeRequest[];

  @ApiProperty({
    description: 'Razón de la solicitud',
    example: 'El estudiante necesita cambiar de horario',
  })
  @IsOptional()
  @IsString({
    message: 'La razón de la solicitud debe ser un texto',
  })
  reason?: string;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: AppealRequestStatus.PENDING,
  })
  @IsOptional()
  @IsString({
    message: 'El estado de la solicitud debe ser un texto',
  })
  status?: AppealRequestStatus;
}

export class CreateAppealRequest {
  @ApiProperty({
    description: 'Peticiones de la solicitud',
    type: AppealRequestRequest,
    isArray: true,
  })
  @IsNotEmpty({
    message: 'Las peticiones de la solicitud son requeridas',
  })
  @ValidateNested({ each: true })
  @Type(() => AppealRequestRequest)
  requests: AppealRequestRequest[];

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

export class AppealStudentResponse {
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
