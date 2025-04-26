import { MailService } from "../services/mail.service";

export abstract class Mailable {
    protected toAddress: string;
    protected subjectText: string;
    protected templatePath: string;
    protected templateData: Record<string, any> = {};

    to(address: string): this {
        this.toAddress = address;
        return this;
    }

    subject(text: string): this {
        this.subjectText = text;
        return this;
    }

    view(path: string): this {
        this.templatePath = path;
        return this;
    }

    with(data: Record<string, any>): this {
        this.templateData = { ...this.templateData, ...data };
        return this;
    }

    abstract build(): Promise<void>;

    async send(mailService: MailService): Promise<void> {
        await this.build();
        await mailService.sendMail({
            to: this.toAddress,
            subject: this.subjectText,
            templatePath: this.templatePath,
            data: this.templateData,
        });
    }
}