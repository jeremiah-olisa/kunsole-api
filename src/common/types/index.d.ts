import { PrismaClient } from '@prisma/client';

export type PrismaClientTransaction = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
> | Prisma.TransactionClient;