import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { StudentProgram } from 'src/infrastructure/persistence/schema/user.schema';

export class VerifyEmailRequest {
  @ApiProperty({
    description: 'Email del usuario a verificar',
    example: 'john.doe@correo.uis.edu.co',
    type: String,
  })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsString({ message: 'El email debe ser una cadena de texto' })
  username: string;
}

export class VerifyEmailResponse {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Número de identificación del usuario',
    example: '12345678',
    type: String,
  })
  identification: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: 'Programa del usuario',
    example: {
      name: 'Ingeniería de Sistemas',
      id: 11,
    },
    type: StudentProgram,
  })
  program: StudentProgram;
}
