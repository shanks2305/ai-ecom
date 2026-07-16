import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { brands, categories, products, type CategorySeed } from "./seed-data.js";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

function generateSku(sequence: number): string {
  return `GM-${String(sequence).padStart(5, "0")}`;
}

async function clearCatalog() {
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
}

async function seedBrands() {
  await prisma.brand.createMany({
    data: brands.map((brand) => ({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
    })),
  });

  const created = await prisma.brand.findMany();
  return new Map(created.map((brand) => [brand.slug, brand.id]));
}

async function seedCategories() {
  const categoryIdBySlug = new Map<string, string>();

  async function createCategoryTree(items: CategorySeed[], parentId?: string) {
    for (const item of items) {
      const category = await prisma.category.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          parentId,
        },
      });

      categoryIdBySlug.set(item.slug, category.id);

      if (item.children?.length) {
        await createCategoryTree(item.children, category.id);
      }
    }
  }

  await createCategoryTree(categories);
  return categoryIdBySlug;
}

async function seedProducts(
  brandIdBySlug: Map<string, string>,
  categoryIdBySlug: Map<string, string>,
) {
  let created = 0;

  for (const product of products) {
    const brandId = brandIdBySlug.get(product.brandSlug);
    const categoryId = categoryIdBySlug.get(product.categorySlug);

    if (!brandId || !categoryId) {
      throw new Error(
        `Missing brand or category for product "${product.name}" (${product.brandSlug} / ${product.categorySlug})`,
      );
    }

    created += 1;

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        sku: generateSku(created),
        price: product.price,
        currency: "INR",
        status: product.status ?? "PUBLISHED",
        brandId,
        categoryId,
        inventories: {
          create: {
            quantity: 20 + Math.floor(Math.random() * 180),
          },
        },
      },
    });

    if (created % 25 === 0) {
      console.log(`  … ${created} products seeded`);
    }
  }

  return created;
}

async function main() {
  console.log("Clearing existing catalog data…");
  await clearCatalog();

  console.log("Seeding brands…");
  const brandIdBySlug = await seedBrands();
  console.log(`  ✓ ${brandIdBySlug.size} brands`);

  console.log("Seeding categories…");
  const categoryIdBySlug = await seedCategories();
  console.log(`  ✓ ${categoryIdBySlug.size} categories`);

  console.log("Seeding products…");
  const productCount = await seedProducts(brandIdBySlug, categoryIdBySlug);
  console.log(`  ✓ ${productCount} products`);
}

main()
  .then(async () => {
    console.log("Gaming catalog seed completed.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
