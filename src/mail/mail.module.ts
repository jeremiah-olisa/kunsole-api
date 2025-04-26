import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { SmtpProvider } from './providers/smtp.provider';
import { MailtrapProvider } from './providers/mailtrap.provider';
import { PostmarkProvider } from './providers/postmark.provider';
import { TemplateService } from './services/template.service';

@Module({
  providers: [MailService, SmtpProvider, MailtrapProvider, PostmarkProvider, TemplateService],
  exports: [MailService],
})
export class MailModule { }
