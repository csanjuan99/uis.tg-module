import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import handlebars from 'handlebars';
import { Request } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { SendEmailByMailtrapInteractor } from '../../mailtrap/use-cases/sendEmailByMailtrap.interactor';

@Injectable()
export class SendVerifyInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sendEmailByMailtrapInteractor: SendEmailByMailtrapInteractor,
  ) {}

  async execute(req: Request, payload: { username: string }): Promise<void> {
    const t: string = this.jwtService.sign(
      {
        username: payload.username,
      },
      {
        expiresIn: '1m',
      },
    );

    const templatePath: string = path.join(
      process.cwd(),
      'dist',
      'templates',
      'verify-account.template.hbs',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException('No se encontró la plantilla de email');
    }

    const templateContent: string = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);

    const callback = `${req.headers.host}/api/auth/verify?t=${t}`;
    const resend = `${req.headers.host}/api/auth/resend-verify?t=${t}`;

    const html: string = template({
      callback,
      resend,
    });

    await this.sendEmailByMailtrapInteractor.execute(
      [
        {
          email: payload.username.toLowerCase(),
        },
      ],
      'Verifica tu cuenta',
      'Verifica tu cuenta',
      html,
    );
  }
}
