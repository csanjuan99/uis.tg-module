import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class ResendVerifyInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(req: Request, res: Response) {
    if (!req.query.t) {
      res.status(401).send('No pudimos autorizar el acceso');
      return;
    }

    const decode: Record<string, any> = this.jwtService.decode(
      req.query.t as string,
    );

    const user: UserDocument = await this.userGateway.findOne({
      username: decode.username,
    });

    if (!user) {
      res.status(404).send('No pudimos encontrar un usuario asociado');
      return;
    }

    this.eventEmitter.emit('onVerify', req, { username: user.username });

    res
      .status(200)
      .send('Tu correo electrónico de verificación ha sido reenviado');
  }
}
