import { Injectable } from '@nestjs/common';
import { IMailProvider, MailProvider } from '../interfaces/mail-provider.interface';
import { SmtpProvider } from './smtp.provider';
import { MailtrapProvider } from './mailtrap.provider';
import { PostmarkProvider } from './postmark.provider';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { getClassName } from 'src/common/utils';

@Injectable()
export class MailProviderFactory {
    constructor(
        private readonly configService: ConfigService,
        private readonly moduleRef: ModuleRef,
    ) { }

    getProvider(provider?: MailProvider): IMailProvider {
        provider ??= this.configService.get<MailProvider>('MAIL_PROVIDER', MailProvider.SMTP);

        switch (provider!.toLocaleUpperCase()) {
            case MailProvider.MAILTRAP:
                return this.moduleRef.get<MailtrapProvider>(MailtrapProvider, { strict: false });
            case MailProvider.POSTMARK:
                return this.moduleRef.get<PostmarkProvider>(PostmarkProvider, { strict: false });
            case MailProvider.SMTP:
                return this.moduleRef.get<SmtpProvider>(SmtpProvider, { strict: false });
            default:
                throw new Error(`Mail provider "${provider}" is not supported.`);
        }
    }
}