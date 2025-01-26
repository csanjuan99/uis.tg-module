import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiProperty({
    description: 'Nueva contraseña',
    example: '********',
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @IsString({
    message: 'La contraseña debe ser un texto',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string;
  @ApiProperty({
    description: 'Confirmación de la nueva contraseña',
    example: '********',
  })
  @IsNotEmpty({
    message: 'La confirmación de la contraseña es requerida',
  })
  @IsString({
    message: 'La confirmación de la contraseña debe ser un texto',
  })
  confirmPassword: string;
}
