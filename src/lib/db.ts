import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
  return client;
};

const db: PrismaClient = globalThis.prismaGlobal || createPrismaClient();

if (process.env.NODE_ENV != "production") {
  globalThis.prismaGlobal = db;
}

process.on("beforeExit", async () => {
  await db.$disconnect();
});

export default db;
