import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { RecoverPasswordRequest } from '../dto/recover-password.dto';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { Request } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';
import handlebars from 'handlebars';
import { JwtService } from '@nestjs/jwt';
import { SendEmailByMailtrapInteractor } from '../../mailtrap/use-cases/sendEmailByMailtrap.interactor';

@Injectable()
export class RecoverPasswordInteractor {
  constructor(
    private readonly sendEmailByMailtrapInteractor: SendEmailByMailtrapInteractor,
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    req: Request,
    payload: RecoverPasswordRequest,
  ): Promise<{ message: string }> {
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.username,
    });

    if (!user) {
      throw new NotFoundException(
        'No pudimos encontrar un usuario con ese correo electrónico',
      );
    }

    const templatePath: string = path.join(
      process.cwd(),
      'dist',
      'templates',
      'recover-password.template.hbs',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException('No se encontró la plantilla de email');
    }

    const templateContent: string = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);

    const t: string = this.jwtService.sign(
      {
        username: user.username,
      },
      {
        expiresIn: '5m',
      },
    );

    const html: string = template({
      name: user.name,
      link: `${req.headers.origin}/cambiar-contrasena?t=${t}`,
    });

    await this.sendEmailByMailtrapInteractor.execute(
      [
        {
          email: user.username,
        },
      ],
      'Recuperar contraseña',
      'Recuperar contraseña',
      html,
    );

    return {
      message: 'success',
    };
  }
}
