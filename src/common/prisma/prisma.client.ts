import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient;
}

/**
 * Initializes a singleton Prisma client instance.
 *
 * In production, it ensures that a single global Prisma client is reused
 * to prevent connection overload.
 * In development, it attaches the Prisma client to the global object
 * to maintain a single instance across hot reloads.
 */
export const InitialiseClient = () => {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }

    prisma = global.prisma;
};

InitialiseClient();

export { prisma };
