import { prisma } from "./prisma.js";
import { tombstoneUnique } from "./soft-delete.js";

export const softDeleteBrand = async (id: string) => {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) {
    throw new Error("Brand not found");
  }

  return prisma.brand.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      slug: tombstoneUnique(brand.slug, brand.id),
    },
  });
};

export const softDeleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      slug: tombstoneUnique(category.slug, category.id),
    },
  });
};

export const softDeleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error("Product not found");
  }

  const deletedAt = new Date();

  await prisma.$transaction([
    prisma.inventory.updateMany({
      where: { productId: id },
      data: { deletedAt },
    }),
    prisma.productImage.updateMany({
      where: { productId: id },
      data: { deletedAt },
    }),
    prisma.product.update({
      where: { id },
      data: {
        deletedAt,
        slug: tombstoneUnique(product.slug, product.id),
        sku: tombstoneUnique(product.sku, product.id),
      },
    }),
  ]);
};
