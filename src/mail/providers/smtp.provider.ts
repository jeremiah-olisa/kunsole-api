import { Injectable } from '@nestjs/common';
import { IMailProvider, ISendMailOptions } from '../interfaces/mail-provider.interface';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmtpProvider implements IMailProvider {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: this.configService.get('SMTP_SECURE'),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
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