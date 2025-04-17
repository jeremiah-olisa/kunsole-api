import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient;
}

export const InitialiseClient = () => {
    if (process.env.NODE_ENV === 'production') global.prisma = new PrismaClient();

    //check if there is already a connection to the database
    if (process.env.NODE_ENV !== 'production' && global.prisma)
        prisma = global.prisma;

    if (process.env.NODE_ENV !== 'production' && !global.prisma)
        global.prisma = new PrismaClient();
};

InitialiseClient();

export { prisma };
