import { Injectable } from '@nestjs/common';
import { IMailProvider, ISendMailOptions } from '../interfaces/mail-provider.interface';
import { ServerClient } from 'postmark';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostmarkProvider implements IMailProvider {
    private client: ServerClient;

    constructor(private configService: ConfigService) {
        try {
            this.client = new ServerClient(
                this.configService.get('POSTMARK_API_KEY', ""),
            );
        } catch (error) {
            console.error('Error initializing Postmark client:', error);
        }
    }

    async sendMail(options: ISendMailOptions) {
        await this.client.sendEmail({
            From: this.configService.get('MAIL_FROM', ""),
            To: options.to,
            Subject: options.subject,
            HtmlBody: options.content,
        });
    }
}