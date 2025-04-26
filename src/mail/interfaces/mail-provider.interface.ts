export interface ISendMailOptions {
    to: string;
    subject: string;
    content: string;
}

export interface ISendMailProps {
    to: string;
    subject: string;
    templatePath?: string;
    data?: Record<string, any>;
    content?: string;
}

export interface IMailProvider {
    sendMail(options: ISendMailOptions): Promise<void>;
}

export enum MailProvider {
    POSTMARK = "POSTMARK",
    SMTP = "SMTP",
    MAILTRAP = "MAILTRAP",
    CONSOLE = "CONSOLE"
}