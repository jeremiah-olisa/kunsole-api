import { AuthProvider } from "@prisma/client";

export interface ICreateUserPayload {
  email: string;
  fullName: string;
  password: string;
  provider: AuthProvider;
}