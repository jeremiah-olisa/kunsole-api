import { Injectable } from '@nestjs/common';
import { IMailProvider } from '../interfaces/mail-provider.interface';
import { ServerClient } from 'postmark';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostmarkProvider implements IMailProvider {
    private client: ServerClient;

    constructor(private configService: ConfigService) {
        this.client = new ServerClient(
            this.configService.get('POSTMARK_API_KEY', ""),
        );
    }

    async sendMail(options: { to: string; subject: string; html: string }) {
        await this.client.sendEmail({
            From: this.configService.get('MAIL_FROM', ""),
            To: options.to,
            Subject: options.subject,
            HtmlBody: options.html,
        });
    }
}