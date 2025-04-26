import { AppUserRole } from "@prisma/client";
import { Mailable } from "src/mail/mailables/mailable.abstract";

export class UserAppInviteAcceptedMailable extends Mailable {
    constructor(
        private readonly inviterEmail: string,
        private readonly inviteeEmail: string,
        private readonly appName: string,
        private readonly role: AppUserRole
    ) {
        super();
    }

    async build(): Promise<void> {
        this.subject(`${this.inviteeEmail} accepted your invitation to ${this.appName}`)
            .to(this.inviterEmail)
            .view('src/user-app/mails/templates/user-app-invite-accepted.template')
            .with({
                inviterEmail: this.inviterEmail,
                inviteeEmail: this.inviteeEmail,
                appName: this.appName,
                role: this.role,
                year: new Date().getFullYear(),
            });
    }
}