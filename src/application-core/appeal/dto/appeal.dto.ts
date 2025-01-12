import {
  AppealRequest,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
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
  })
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AppealRequestChangeRequest)
  to: AppealRequestChangeRequest;
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

  @ApiProperty({
    description: 'Nombre de usuario del estudiante',
    example: 'john.doe@correo.uis.edu.co',
  })
  @IsNotEmpty({
    message: 'El nombre de usuario del estudiante es requerido',
  })
  username: string;
}

export class AppealResponse {
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
  requests: AppealRequest[];

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

export class UpdateAppealRequest extends PartialType(AppealResponse) {
  studentId: string;
  requests: AppealRequest[];
  status: AppealStatus;
}
