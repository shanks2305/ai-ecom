import { Permission } from "../../constant/permision.js";
import { requirePermission } from "../../lib/auth.js";
import { softDeleteCategory } from "../../lib/catalog-soft-delete.js";
import { prisma } from "../../lib/prisma.js";
import slugify from "../../lib/slugify.js";

// create()
const createCategory = async (name: string, description?: string, parentId?: string) => {
    try {
        requirePermission(Permission.CATEGORY_CREATE, "create a category");
        const senatizedName = name.trim().toLowerCase();
        let slug = slugify(senatizedName);
        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            slug = slugify(senatizedName, true);
        }
        const category = await prisma.category.create({
            data: { name: senatizedName, slug, description, parentId },
        });
        return category;
    } catch (error) {
        throw error;
    }
}   
// update()
const updateCategory = async (id: string, name: string, description?: string, parentId?: string) => {
    try {
        requirePermission(Permission.CATEGORY_UPDATE, "update a category");
        const category = await prisma.category.update({
            where: { id },
            data: { name, description, parentId },
        });
        return category;
    } catch (error) {
        throw error;
    }
}

// delete()
const deleteCategory = async (id: string) => {
    try {
        requirePermission(Permission.CATEGORY_DELETE, "delete a category");
        await softDeleteCategory(id);
    } catch (error) {
        throw error;
    }
}
// getTree()
const getTree = async () => {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: {
                    where: { deletedAt: null },
                    include: {
                        children: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });
        return categories;
    } catch (error) {
        throw error;
    }
}

// getChildren()
const getChildren = async (parentId: string) => {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId },
        });
        return categories;
    } catch (error) {
        throw error;
    }
}

// getBySlug()
const getBySlug = async (slug: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
        });
        return category;
    } catch (error) {
        throw error;
    }
}

// search()
const searchCategories = async (query: string) => {
    try {
        const categories = await prisma.category.findMany({
            where: { name: { contains: query, mode: "insensitive" } },
        });
        return categories;
    } catch (error) {
        throw error;
    }
}

const listCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        return categories;
    } catch (error) {
        throw error;
    }
}

const getCategoryById = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        return category;
    } catch (error) {
        throw error;
    }
}

export default {
    createCategory,
    updateCategory,
    deleteCategory,
    getTree,
    getChildren,
    getBySlug,
    searchCategories,
    listCategories,
    getCategoryById,
}