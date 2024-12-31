export class SendEmailRequest {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
  source: string;
}
