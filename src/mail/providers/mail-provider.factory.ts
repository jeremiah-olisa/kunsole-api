import { Injectable } from '@nestjs/common';
import { IMailProvider, MailProvider } from '../interfaces/mail-provider.interface';
import { SmtpProvider } from './smtp.provider';
import { MailtrapProvider } from './mailtrap.provider';
import { PostmarkProvider } from './postmark.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailProviderFactory {
    constructor(
        private readonly configService: ConfigService,
        private readonly smtpProvider: SmtpProvider,
        private readonly mailtrapProvider: MailtrapProvider,
        private readonly postmarkProvider: PostmarkProvider,
    ) { }

    getProvider(provider?: MailProvider): IMailProvider {
        provider ??= this.configService.get<MailProvider>('MAIL_PROVIDER', MailProvider.SMTP);

        switch (provider!.toLocaleUpperCase()) {
            case MailProvider.MAILTRAP:
                return this.mailtrapProvider;
            case MailProvider.POSTMARK:
                return this.postmarkProvider;
            case MailProvider.SMTP:
                return this.smtpProvider;
            default:
                throw new Error(`Mail provider "${provider}" is not supported.`);
        }
    }
}