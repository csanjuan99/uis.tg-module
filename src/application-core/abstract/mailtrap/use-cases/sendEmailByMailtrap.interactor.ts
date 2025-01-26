import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class SendEmailByMailtrapInteractor implements OnModuleInit {
  client: MailtrapClient;

  constructor() {}

  onModuleInit() {
    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN,
    });
  }

  async execute(
    to: { email: string }[],
    subject: string,
    text: string,
    html: string,
  ) {
    try {
      await this.client.send({
        from: {
          email: process.env.MAILTRAP_SENDER_EMAIL,
          name: process.env.MAILTRAP_SENDER_NAME,
        },
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
