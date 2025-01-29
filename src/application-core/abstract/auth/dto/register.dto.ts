import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty({
    example: 'john.doe@correo.uis.edu.co',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@correo\.uis\.edu\.co$/, {
    message: 'El correo electrónico debe ser un correo institucional de la UIS',
  })
  @IsNotEmpty({
    message: 'El correo electrónico es requerido',
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
  email: string;
  @ApiProperty({
    required: true,
  })
  @IsString({
    message: 'La contraseña es una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string;
  @ApiProperty({
    required: true,
  })
  @IsString({
    message: 'La confirmación de la contraseña es una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La confirmación de la contraseña es requerida',
  })
  confirm_password: string;
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString({
    message: 'El nombre es una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre es requerido',
  })
  name: string;
  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString({
    message: 'El apellido es una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El apellido es requerido',
  })
  lastname: string;
  @ApiProperty({
    example: '225421',
    required: true,
  })
  @IsString({
    message: 'El código del estudiante es una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El código del estudiante es requerido',
  })
  identification: string;
}
