import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const makePrismaClient = () => {
    const libsql = createClient({
        url: process.env.DATABASE_URL || "file:./dev.db",
    });
    const adapter = new PrismaLibSql(libsql as any);
    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || makePrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
