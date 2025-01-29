import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    example: 'john.doe@correo.uis.edu.co',
    required: true,
  })
  @IsNotEmpty({
    message: 'El correo electrónico de usuario es requerido',
  })
  @IsEmail(
    {
      allow_display_name: false,
      require_tld: true,
      allow_ip_domain: false,
    },
    {
      message: 'El correo electrónico debe ser un correo electrónico válido',
    },
  )
  username: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  password: string;
}
