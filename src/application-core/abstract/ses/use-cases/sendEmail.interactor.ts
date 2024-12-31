import {
  SendEmailCommand,
  SendEmailRequest as EmailRequest,
  SESClient,
} from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailRequest } from '../dto/send-email.dto';

@Injectable()
export class SendEmailInteractor {
  constructor(private readonly configService: ConfigService) {}

  private ses: SESClient;

  async execute(payload: SendEmailRequest): Promise<any> {
    const input: EmailRequest = {
      Destination: {
        CcAddresses: payload.cc,
        BccAddresses: payload.bcc,
        ToAddresses: payload.to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: payload.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: payload.text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: payload.subject,
        },
      },
      Source: payload.source,
    };
    this.ses = new SESClient({
      region: this.configService.get<string>('aws.ses.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.ses.accessKeyId'),
        secretAccessKey: this.configService.get<string>(
          'aws.ses.secretAccessKey',
        ),
      },
    });
    const command = new SendEmailCommand(input);

    try {
      return await this.ses.send(command);
    } catch (e) {
      throw e;
    }
  }
}
