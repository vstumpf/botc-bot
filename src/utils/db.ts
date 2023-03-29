import { PrismaClient } from '@prisma/client';


export function createDBClient(): PrismaClient {
  return new PrismaClient();
}

export async function destroyDBClient(prisma: PrismaClient): Promise<void> {
  prisma.$disconnect().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
}
