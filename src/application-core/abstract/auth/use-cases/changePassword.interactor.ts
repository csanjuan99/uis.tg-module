import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { ChangePasswordRequest } from '../dto/change-password.dto';

@Injectable()
export class ChangePasswordInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    t: string,
    payload: ChangePasswordRequest,
  ): Promise<{ message: string }> {
    if (!t) {
      throw new UnauthorizedException(
        'No estas autorizado para realizar esta acción',
      );
    }

    let decode: Partial<UserDocument>;

    try {
      decode = this.jwtService.decode(t) as Partial<UserDocument>;
    } catch {
      throw new BadRequestException('La autorización es invalida');
    }

    const user: UserDocument = await this.userGateway.findOne({
      username: decode.username,
    });

    if (!user) {
      new BadRequestException(
        'No pudimos encontrar un usuario con ese correo electrónico',
      );
    }

    if (payload.password !== payload.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const salt: string = await genSalt(10);

    user.password = await hash(payload.password, salt);

    await user.save();

    return {
      message: 'success',
    };
  }
}
