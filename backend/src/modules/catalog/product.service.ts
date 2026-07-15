import { Permission } from "../../constant/permision.js";
import { ProductStatus } from "../../generated/prisma/enums.js";
import { requirePermission } from "../../lib/auth.js";
import { softDeleteProduct } from "../../lib/catalog-soft-delete.js";
import { prisma } from "../../lib/prisma.js";
import slugify from "../../lib/slugify.js";
import generateSku from "../../lib/sku.js";
import brandService from "./brand.service.js";
import categoryService from "./category.service.js";

// create()
const createProduct = async (name: string, price: number, brandId: string, categoryId: string, description: string,) => {
    try {
        requirePermission(Permission.PRODUCT_CREATE, "create a product");   
        const senatizedName = name.trim().toLowerCase();
        let slug = slugify(senatizedName);
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            slug = slugify(senatizedName, true);
        }
        if (!brandId || !categoryId) {
            throw new Error("Brand and category are required");
        }
        const brand = await brandService.getBrandById(brandId);
        const category = await categoryService.getCategoryById(categoryId); 
        if (!brand || !category) {
            throw new Error("Brand and category not found");
        }
        const sku = generateSku({ brandCode: brand?.slug, categoryCode: category?.slug });
        const product = await prisma.product.create({
            data: { name: senatizedName, slug, description, sku, price, brandId, categoryId },
        });
        return product;

    } catch (error) {
        throw error;
    }   
}

// delete()
const deleteProduct = async (id: string) => {
    try {
        requirePermission(Permission.PRODUCT_DELETE, "delete a product");
        await softDeleteProduct(id);
    } catch (error) {
        throw error;
    }
}

// update()
const updateProduct = async (id: string, name: string, price: number, brandId: string, categoryId: string, description: string,) => {
    try {
        requirePermission(Permission.PRODUCT_UPDATE, "update a product");
        const product = await prisma.product.update({
            where: { id },
            data: { name, price, brandId, categoryId, description },
        });
        return product;
    } catch (error) {
        throw error;
    }
}

// archive()
const archiveProduct = async (id: string) => {
    try {
        requirePermission(Permission.PRODUCT_UPDATE, "archive a product");
        const product = await prisma.product.update({
            where: { id },
            data: { status: ProductStatus.ARCHIVED },
        });
        return product;
    } catch (error) {
        throw error;
    }
}

// activate()
const activateProduct = async (id: string) => {
    try {
        requirePermission(Permission.PRODUCT_UPDATE, "activate a product");
        const product = await prisma.product.update({
            where: { id },
            data: { status: ProductStatus.PUBLISHED },
        });
        return product;
    } catch (error) {
        throw error;
    }
}
// getById()
const getProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        return product;
    } catch (error) {
        throw error;
    }
}
// getBySku()
const getProductBySku = async (sku: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { sku },
        });
        return product;
    } catch (error) {
        throw error;
    }
}

// getBySlug()
const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
        });
        return product;
    } catch (error) {
        throw error;
    }
}
// search()
const searchProducts = async (query: string) => {
    try {
        const products = await prisma.product.findMany({
            where: { name: { contains: query, mode: "insensitive" } },
        });
        return products;
    } catch (error) {
        throw error;
    }
}

// list()
const listProducts = async () => {
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        throw error;
    }
}
// findAlternatives()
const findAlternatives = async (ids: string[]) => {
    try {
        if (!ids.length) {
            return [];
        }

        const products = await prisma.product.findMany({
            where: { id: { in: ids } },
        });

        const productMap = new Map(products.map((product) => [product.id, product]));
        return ids
            .map((id) => productMap.get(id))
            .filter((product): product is NonNullable<typeof product> => product !== undefined);
    } catch (error) {
        throw error;
    }
}

export default {
    createProduct,
    deleteProduct,
    updateProduct,
    archiveProduct,
    activateProduct,
    getProductById,
    getProductBySku,
    getProductBySlug,
    searchProducts,
    listProducts,
    findAlternatives,
}