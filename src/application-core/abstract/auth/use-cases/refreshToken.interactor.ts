/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtResponse } from '../dto/jwt.dto';

@Injectable()
export class RefreshTokenInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(req: Request): Promise<JwtResponse> {
    const token = req.query.t as string;

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token); // Ya hace decode + verificación
    } catch {
      throw new ForbiddenException('Sesión expirada o token inválido');
    }

    const user: UserDocument = await this.userGateway.findOne({
      username: decoded.username,
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const access_token = this.jwtService.sign({
      sub: user.id,
      name: user.name,
      lastname: user.lastname,
      identification: user.identification,
      shift: user.shift,
      username: user.username,
      permissions: user.permissions,
      kind: user.kind,
      program: user.program,
    });

    return { access_token };
  }
}
