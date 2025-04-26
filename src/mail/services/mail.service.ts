import { Injectable } from '@nestjs/common';
import { MailProviderFactory } from '../providers/mail-provider.factory';
import { Mailable } from '../mailables/mailable.abstract';
import { TemplateService } from './template.service';
import { ISendMailProps } from '../interfaces/mail-provider.interface';

@Injectable()
export class MailService {
  constructor(
    private providerFactory: MailProviderFactory,
    private templateService: TemplateService,
  ) { }

  async sendMail(options: ISendMailProps): Promise<void> {
    const provider = this.providerFactory.getProvider();

    let html = options.content;

    if (options.templatePath) {
      html = await this.templateService.render(
        options.templatePath,
        options.data || {},
      );
    }

    await provider.sendMail({
      to: options.to,
      subject: options.subject,
      content: html || '',
    });
  }

  async send(mailable: Mailable): Promise<void> {
    await mailable.send(this);
  }
}