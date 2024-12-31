import {
  AppealRequest,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class AppealRequestRequest {
  @ApiProperty({
    properties: {
      group: {
        type: 'string',
        example: 'A',
      },
      sku: {
        type: 'string',
        example: '1234',
      },
    },
    nullable: true,
  })
  @IsNotEmptyObject({
    nullable: true,
  })
  from: {
    group: string;
    sku: string;
  };
  @ApiProperty({
    nullable: true,
    properties: {
      group: {
        type: 'string',
        example: 'A',
      },
      sku: {
        type: 'string',
        example: '1234',
      },
    },
  })
  @IsNotEmptyObject({
    nullable: true,
  })
  to: {
    group: string;
    sku: string;
  };
}

export class CreateAppealRequest {
  @ApiProperty({
    description: 'Peticiones de la apelación',
    type: AppealRequestRequest,
  })
  @IsNotEmpty({
    message: 'Las peticiones de apelación son requeridas',
  })
  requests: AppealRequest[];
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
