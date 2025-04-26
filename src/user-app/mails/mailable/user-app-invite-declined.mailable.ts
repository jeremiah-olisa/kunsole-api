import { Mailable } from "src/mail/mailables/mailable.abstract";

export class UserAppInviteDeclinedMailable extends Mailable {
    constructor(
        private readonly inviterEmail: string,
        private readonly inviteeEmail: string,
        private readonly appName: string
    ) {
        super();
    }

    async build(): Promise<void> {
        this.subject(`${this.inviteeEmail} declined your invitation to ${this.appName}`)
            .to(this.inviterEmail)
            .view('src/user-app/mails/templates/user-app-invite-declined.template')
            .with({
                inviterEmail: this.inviterEmail,
                inviteeEmail: this.inviteeEmail,
                appName: this.appName,
                year: new Date().getFullYear(),
            });
    }
}