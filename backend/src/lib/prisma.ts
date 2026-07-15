import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { isSoftDeleteModel, withActiveOnly } from "./soft-delete.js";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const softDeleteModelMap = {
  User: "user",
  Brand: "brand",
  Category: "category",
  Product: "product",
  Inventory: "inventory",
  ProductImage: "productImage",
} as const;

type SoftDeleteModel = keyof typeof softDeleteModelMap;

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: env.databaseUrl });
  const base = new PrismaClient({ adapter });

  return base.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = withActiveOnly(args.where);
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = withActiveOnly(args.where);
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (!isSoftDeleteModel(model)) {
            return query(args);
          }

          const delegate = base[softDeleteModelMap[model as SoftDeleteModel]];

          return (delegate as { findFirst: (args: unknown) => unknown }).findFirst({
            ...args,
            where: withActiveOnly(args.where),
          });
        },
        async count({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = withActiveOnly(args.where);
          }
          return query(args);
        },
        async update({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = withActiveOnly(
              args.where as Record<string, unknown>,
            ) as typeof args.where;
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = withActiveOnly(args.where);
          }
          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;
