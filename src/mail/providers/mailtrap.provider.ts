import { Injectable } from '@nestjs/common';
import { IMailProvider, ISendMailOptions } from '../interfaces/mail-provider.interface';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailtrapProvider implements IMailProvider {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: this.configService.get('MAILTRAP_USER'),
                pass: this.configService.get('MAILTRAP_PASS'),
            },
        });
    }

    async sendMail(options: ISendMailOptions) {
        await this.transporter.sendMail({
            from: this.configService.get('MAIL_FROM'),
            ...options,
        });
    }
}