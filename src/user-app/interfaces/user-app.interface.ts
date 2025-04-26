import { AppUserRole } from "@prisma/client";

export interface IUserAppInvite {
    email: string;
    appId: string;
    role: AppUserRole;
    invitedBy: string;
    expiresAt: Date;
 }