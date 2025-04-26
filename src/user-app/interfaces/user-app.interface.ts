import { AppUserRole } from "@prisma/client";

export interface IUserAppInvite {
    token: string;
    email: string;
    appName: string;
    appId: string;
    role: AppUserRole;
    invitedBy: string;
    expiresAt: Date;
}