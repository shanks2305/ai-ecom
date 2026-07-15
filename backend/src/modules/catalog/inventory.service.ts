import { Permission } from "../../constant/permision.js";
import { requirePermission } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

// create()
const createInventory = async (productId: string, quantity: number) => {
    try {
        requirePermission(Permission.INVENTORY_CREATE, "create inventory");
        const inventory = await prisma.inventory.create({
            data: { productId, quantity },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}

// update()
const updateInventory = async (id: string, quantity: number) => {
    try {
        requirePermission(Permission.INVENTORY_UPDATE, "update inventory");
        const inventory = await prisma.inventory.update({
            where: { id },
            data: { quantity },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
// reserve()
const reserveInventory = async (id: string, quantity: number) => {
    try {
        requirePermission(Permission.INVENTORY_UPDATE, "reserve inventory");
        const inventory = await prisma.inventory.update({
            where: { id },
            data: { quantity },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
// release()
const releaseInventory = async (id: string, quantity: number) => {
    try {
        requirePermission(Permission.INVENTORY_UPDATE, "release inventory");
        const inventory = await prisma.inventory.update({
            where: { id },
            data: { quantity },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
// available()
const availableInventory = async (id: string) => {
    try {
        requirePermission(Permission.INVENTORY_UPDATE, "available inventory");
        const inventory = await prisma.inventory.findUnique({
            where: { id },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
// adjust()
const adjustInventory = async (id: string, quantity: number) => {
    try {
        requirePermission(Permission.INVENTORY_UPDATE, "adjust inventory");
        const inventory = await prisma.inventory.update({
            where: { id },
            data: { quantity },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
const getInventoryById = async (id: string) => {
    try {
        requirePermission(Permission.INVENTORY_READ, "get inventory by id");
        const inventory = await prisma.inventory.findUnique({
            where: { id },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
const getInventoryByProductId = async (productId: string) => {
    try {
        requirePermission(Permission.INVENTORY_READ, "get inventory by product id");
        const inventory = await prisma.inventory.findMany({
            where: { productId },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
const listInventories = async () => {
    try {
        requirePermission(Permission.INVENTORY_READ, "list inventories");
        const inventories = await prisma.inventory.findMany();
        return inventories;
    } catch (error) {
        throw error;
    }
}
export default {
    createInventory,
    updateInventory,
    reserveInventory,
    releaseInventory,
    availableInventory,
    adjustInventory,
    getInventoryById,
    getInventoryByProductId,
    listInventories,
}