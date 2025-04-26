import { Mailable } from "src/mail/mailables/mailable.abstract";
import { IUserAppInvite } from "../../interfaces/user-app.interface";
import { link } from "fs";


export class UserAppInviteMailable extends Mailable {
    constructor(private readonly inviteData: IUserAppInvite) {
        super();
    }

    async build(): Promise<void> {
        // Subject of the email
        this.subject(`You've been invited to collaborate on ${this.inviteData.appName}`)
            .to(this.inviteData.email)
            .view('src/user-app/mails/templates/user-app-invite-mail.template')
            .with({
                email: this.inviteData.email,
                appName: this.inviteData.appName,
                role: this.inviteData.role,
                invitedBy: this.inviteData.invitedBy,
                expiresAt: this.inviteData.expiresAt,
                link: `${process.env.APP_URL}/dashboard/apps/invite?appId=${this.inviteData.appId}&role=${this.inviteData.role}&token=${this.inviteData.token}`,
                year: new Date().getFullYear(),
            });
    }
}
