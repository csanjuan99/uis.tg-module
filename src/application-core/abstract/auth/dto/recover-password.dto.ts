import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordRequest {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'john.doe@correo.uis.edu.co',
  })
  @IsNotEmpty({
    message: 'El correo electrónico es requerido',
  })
  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    },
    {
      message: 'El correo electrónico no es válido',
    },
  )
  username: string;
}
