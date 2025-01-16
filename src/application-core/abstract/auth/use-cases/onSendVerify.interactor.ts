import { Injectable, NotFoundException } from '@nestjs/common';
import { SendEmailInteractor } from '../../ses/use-cases/sendEmail.interactor';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import { Request } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class OnSendVerifyInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sendEmailInteractor: SendEmailInteractor,
    private readonly configService: ConfigService,
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

    await this.sendEmailInteractor.execute({
      to: [(payload.username as string).toLowerCase()],
      subject: 'Verifica tu cuenta',
      html,
      text: 'Verifica tu cuenta',
      source: this.configService.get<string>('aws.ses.source'),
    });
  }
}
