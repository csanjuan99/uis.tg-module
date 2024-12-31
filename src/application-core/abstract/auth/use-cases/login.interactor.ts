import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from '../dto/jwt.dto';
import { LoginRequest } from '../dto/login.dto';

@Injectable()
export class LoginInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: LoginRequest): Promise<JwtResponse> {
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.username,
    });

    if (!user) {
      throw new NotFoundException('No pudimos encontrar el usuario');
    }

    if (!bcrypt.compareSync(payload.password, user.password)) {
      throw new BadRequestException('Tu contraseña es incorrecta');
    }

    const access_token: string = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      permissions: user.permissions,
      kind: user.kind,
    });

    return {
      access_token,
    };
  }
}
