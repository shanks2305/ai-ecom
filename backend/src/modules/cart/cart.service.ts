import { Prisma } from "../../generated/prisma/client.js";
import { prisma, type PrismaTx } from "../../lib/prisma.js";
import { cartItem, cartItemChange } from "./cart.types.js";
import { logger } from "../../lib/logger.js";

const createCart = async (userId: string, conversationId: string) => {
    try {
        const cart = await prisma.cart.create({
            data: {
                userId,
                conversationId,
                items: [],
            },
        });
        logger.info(`Cart created successfully: ${cart.id}`);
        return cart;
    } catch (error) {
        logger.info(`Error creating cart: ${error}`);
        throw error;
    }
}

const getCart = async (conversationId: string) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                conversationId,
            }, 
            include: {
                user: true,
            },
        });
        return cart;
    } catch (error) {
        logger.info(`Error getting cart: ${error}`);
        throw error;
    }

}

const updateCart = async (conversationId: string, data: Prisma.CartUpdateInput) => {
    try {
        const cart = await prisma.cart.update({
            where: {
                conversationId,
            },
            data,
        });
        return cart;
    } catch (error) {
        logger.info(`Error updating cart: ${error}`);
        throw error;
    }
}

const readItems = (raw: unknown): cartItem[] => {
    if (!Array.isArray(raw)) return [];
    const items: cartItem[] = [];
    for (const entry of raw) {
        if (!entry || typeof entry !== "object") continue;
        const e = entry as Record<string, unknown>;
        const productId = typeof e.productId === "string" ? e.productId : null;
        const productName = typeof e.productName === "string" ? e.productName : null;
        const quantity = typeof e.quantity === "number" ? e.quantity : null;
        if (!productId || !productName || quantity == null) continue;
        items.push({ productId, productName, quantity });
    }
    return items;
};

const mergeChanges = (current: cartItem[], changes: cartItemChange[]): cartItem[] => {
    const byProductId = new Map<string, cartItem>();
    for (const item of current) {
        byProductId.set(item.productId, { ...item });
    }
    for (const change of changes) {
        const existing = byProductId.get(change.productId);
        if (change.action === "add") {
            if (existing) {
                existing.quantity += change.quantity;
                existing.productName = change.productName || existing.productName;
            } else {
                byProductId.set(change.productId, {
                    productId: change.productId,
                    productName: change.productName,
                    quantity: change.quantity,
                });
            }
            continue;
        }
        if (!existing) continue;
        if (change.removeAll) {
            byProductId.delete(change.productId);
            continue;
        }
        existing.quantity -= change.quantity;
        if (existing.quantity <= 0) {
            byProductId.delete(change.productId);
        }
    }
    return Array.from(byProductId.values());
};

const applyCartChanges = async (conversationId: string, changes: cartItemChange[]) => {
    const existing = await prisma.cart.findFirst({ where: { conversationId } });
    if (!existing) {
        throw new Error("Cart not found for this conversation. Create a cart first.");
    }
    const currentItems = readItems(existing.items);
    const nextItems = mergeChanges(currentItems, changes);
    const cart = await prisma.cart.update({
        where: { conversationId },
        data: { items: nextItems as Prisma.InputJsonValue },
    });
    logger.info(`Cart updated successfully: ${cart.id}`);
    return cart;
};

const deleteCart = async (conversationId: string, tx?: PrismaTx) => {
    try {
        const db = tx ?? prisma;
        await db.cart.delete({
            where: {
                conversationId,
            },
        });
        logger.info(`Cart deleted successfully: ${conversationId}`);
        return true;
    } catch (error) {
        logger.error(`Error deleting cart: ${error}`);
        throw error;
    }
}

export default {
    createCart,
    getCart,
    updateCart,
    applyCartChanges,
    deleteCart,
}
