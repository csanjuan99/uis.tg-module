import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class VerifyInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(req: Request, res: Response): Promise<void> {
    const t = req.query.t as string;

    if (!t) {
      res.status(401).send('No pudimos autorizar el acceso');
      return;
    }

    try {
      this.jwtService.verify(t);
    } catch {
      res
        .status(403)
        .send('No pudimos verificar tu cuenta, intenta de nuevo mas tarde');
      return;
    }

    const decode: Record<string, any> = this.jwtService.decode(t);

    const user: UserDocument = await this.userGateway.findOne({
      username: decode.username,
    });

    if (!user) {
      res.status(404).send('No pudimos encontrar un usuario asociado');
      return;
    }

    user.verified = true;

    await user.save();

    res.status(200).send('Tu cuenta ha sido verificada');
  }
}
