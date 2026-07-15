import { Permission } from "../../constant/permision.js";
import { requirePermission } from "../../lib/auth.js";
import { softDeleteBrand } from "../../lib/catalog-soft-delete.js";
import { prisma } from "../../lib/prisma.js";
import slugify from "../../lib/slugify.js";

// create()
const createBrand = async (name: string, description?: string, logo?: string) => {
    try {
        requirePermission(Permission.BRAND_CREATE, "create a brand");
        const senatizedName = name.trim().toLowerCase();
        let slug = slugify(senatizedName);
        const existingBrand = await prisma.brand.findUnique({
            where: { slug },
        });
        if (existingBrand) {
            slug = slugify(senatizedName, true);
        }
    } catch (error) {
        throw error;
    }
}

// update()
const updateBrand = async (id: string, name: string, description?: string, logo?: string) => {
    try {
        requirePermission(Permission.BRAND_UPDATE, "update a brand");
        const brand = await prisma.brand.update({
            where: { id },
            data: { name, description, logo },
        });
        return brand;
    } catch (error) {
        throw error;
    }
}

// delete()
const deleteBrand = async (id: string) => {
    try {
        requirePermission(Permission.BRAND_DELETE, "delete a brand");
        await softDeleteBrand(id);
    } catch (error) {
        throw error;
    }
}

// getById()
const getBrandById = async (id: string) => {
    try {
        requirePermission(Permission.BRAND_READ, "read a brand");
        const brand = await prisma.brand.findUnique({
            where: { id },
        });
        return brand;
    } catch (error) {
        throw error;
    }
}

// getBySlug()
    const getBrandBySlug = async (slug: string) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { slug },
        });
        return brand;
    } catch (error) {
        throw error;
    }
}
// search()
    const searchBrands = async (query: string) => {
    try {
        const brands = await prisma.brand.findMany({
            where: { name: { contains: query, mode: "insensitive" } },
        });
        return brands;
    } catch (error) {
        throw error;
    }
}

// list()
    const listBrands = async () => {
    try {
        const brands = await prisma.brand.findMany();
        return brands;
    } catch (error) {
        throw error;
    }
}
export default {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrandById,
    getBrandBySlug,
    searchBrands,
    listBrands,
}