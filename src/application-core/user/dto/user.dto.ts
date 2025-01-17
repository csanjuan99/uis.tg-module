import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserResponse {
  @ApiProperty({
    type: String,
    description: 'Nombre del usuario',
    example: 'John',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  lastname: string;
  @ApiProperty({
    type: String,
    description: 'Nombre de usuario',
    example: 'john@corre.uis.edu.co',
  })
  username: string;
  @ApiProperty({
    examples: ['STUDENT', 'ADMIN', 'ROOT'],
    description: 'Tipo de usuario',
    example: 'STUDENT',
  })
  kind: 'STUDENT' | 'ADMIN' | 'ROOT';
  @ApiProperty({
    type: Boolean,
    description: 'Estado de verificación del usuario',
    example: true,
  })
  verified?: boolean;
  @ApiProperty({
    type: [String],
    description: 'Permisos del usuario',
    example: ['*'],
  })
  permissions: string[];
}

export class CreateUserRequest {
  @ApiProperty({
    type: String,
    description: 'Nombre del usuario',
    example: 'John',
  })
  @IsNotEmpty({
    message: 'El nombre del usuario es requerido',
  })
  @IsString({
    message: 'El nombre del usuario debe ser un texto',
  })
  name: string;
  @IsNotEmpty({
    message: 'El apellido del usuario es requerido',
  })
  @IsString({
    message: 'El apellido del usuario debe ser un texto',
  })
  @ApiProperty({
    type: String,
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  lastname: string;
  @IsNotEmpty({
    message: 'El nombre de usuario es requerido',
  })
  @IsString({
    message: 'El nombre de usuario debe ser un texto',
  })
  @ApiProperty({
    type: String,
    description: 'Nombre de usuario',
    example: 'john@corre.uis.edu.co',
  })
  username: string;
  @IsNotEmpty({
    message: 'La contraseña del usuario es requerida',
  })
  @IsString({
    message: 'La contraseña del usuario debe ser un texto',
  })
  @ApiProperty({
    type: String,
    description: 'Contraseña del usuario en texto plano',
    example: '*********',
  })
  password: string;
  @IsNotEmpty({
    message: 'El tipo de usuario es requerido',
  })
  @ApiProperty({
    examples: ['STUDENT', 'ADMIN', 'ROOT'],
    description: 'Tipo de usuario',
    example: 'STUDENT',
  })
  kind: 'STUDENT' | 'ADMIN' | 'ROOT';
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Estado de verificación del usuario',
    example: true,
  })
  verified?: boolean;
  @IsNotEmpty({
    message: 'Los permisos del usuario son requeridos',
  })
  @ApiProperty({
    type: [String],
    description: 'Permisos del usuario',
    example: ['*'],
  })
  permissions: string[];
}

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
