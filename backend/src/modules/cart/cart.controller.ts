import { logger } from "../../lib/logger.js";
import cartService from "./cart.service.js";
import { cartItem, cartItemChange } from "./cart.types.js";

const createCart = async (userId: string, conversationId: string, items?: cartItem[]) => {
    try {
        const cart = await cartService.createCart(userId, conversationId);
        if (items && items.length > 0) {
            const updatedCart = await cartService.updateCart(conversationId, {
                items: items,
            });
            logger.info(`Cart updated successfully: ${conversationId}`);
        }
        logger.info(`Cart created successfully: ${conversationId}`);
        return cart;
    } catch (error) {
        logger.info(`Error creating cart: ${error}`);
        throw error;
    }
}

const getCart = async (conversationId: string) => {
    try {
        const cart = await cartService.getCart(conversationId);
        return {
            ok: true,
            message: "Cart fetched successfully.",
            data: cart,
        };
    } catch (error) {
        logger.info(`Error getting cart: ${error}`);
        throw error
    }
}

const updateCart = async (conversationId: string, changes: cartItemChange[]) => {
    try {
        const cart = await cartService.applyCartChanges(conversationId, changes);
        return {
            ok: true,
            message: "Cart updated successfully.",
            data: cart,
        };
    } catch (error) {
        logger.info(`Error updating cart: ${error}`);
        throw error;
    }
}

const deleteCart = async (conversationId: string) => {
    try {
        await cartService.deleteCart(conversationId);
        return {
            ok: true,
            message: "Cart deleted successfully.",
        };
    } catch (error) {
        logger.info(`Error deleting cart: ${error}`);
        throw error;

    }
}
export default {
    createCart,
    getCart,
    updateCart,
    deleteCart
}
