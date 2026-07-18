import { logger } from "../../lib/logger.js";
import generateOrderNumber from "../../lib/orderNumber.js";
import { prisma, type PrismaTx } from "../../lib/prisma.js";
import { cartItem } from "../cart/cart.types.js";

const MAX_ORDER_NUMBER_RETRIES = 5;

const isUniqueConstraintError = (error: unknown): boolean =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002";

const createOrder = async (
    userId: string,
    cartId: string,
    tx?: PrismaTx,
) => {
    const db = tx ?? prisma;
    try {
        const cart = await db.cart.findUnique({
            where: {
                id: cartId,
            },
        });
        if(!cart) {
            logger.error(`Cart not found: ${cartId}`);
            throw new Error(`Cart not found: ${cartId}`);
        }
        const items = cart.items as cartItem[];
        const products = await db.product.findMany({
            where: { id: { in: items.map((i) => i.productId) } },
            select: { id: true, price: true },
        });
        const priceById = new Map(products.map((p) => [p.id, p.price]));
        const totalAmount = items.reduce((acc, item) => {
            const price = priceById.get(item.productId);
            if (price == null) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            return acc + price * item.quantity;
        }, 0);

        for (let attempt = 0; attempt < MAX_ORDER_NUMBER_RETRIES; attempt++) {
            const orderNumber = generateOrderNumber();
            try {
                return await db.order.create({
                    data: {
                        userId: userId,
                        totalAmount: totalAmount,
                        orderNumber: orderNumber,
                    },
                });
            } catch (error) {
                if (isUniqueConstraintError(error)) {
                    logger.warn(
                        `Order number collision on attempt ${attempt + 1}: ${orderNumber}`,
                    );
                    continue;
                }
                throw error;
            }
        }

        throw new Error(
            `Failed to generate a unique order number after ${MAX_ORDER_NUMBER_RETRIES} attempts`,
        );
    } catch (error) {
        logger.error(`Error creating order: ${error}`);
        throw error;
    }
};

const createOrderItem = async (
    orderId: string,
    productId: string,
    quantity: number,
    tx?: PrismaTx,
) => {
    const db = tx ?? prisma;
    try {
        const product = await db.product.findUnique({
            where: { id: productId },
        });
        if(!product) {
            logger.error(`Product not found: ${productId}`);
            throw new Error(`Product not found: ${productId}`);
        }
        const orderItem = await db.orderItem.create({
            data: {
                orderId: orderId,
                productId: productId,
                quantity: quantity,
                productName: product.name,
                productSku: product.sku,
                unitPrice: product.price,
            },
        });
        return orderItem;
    } catch (error) {
        logger.error(`Error creating order item: ${error}`);
        throw error;
    }
}

const getOrderDetaisUser = async (userId: string, tx?: PrismaTx) => {
    const db = tx ?? prisma;
    try {
        const orders = await db.order.findMany({
            where: { userId: userId },
            include: {
                items: true,
                payments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return orders;
    } catch (error) {
        logger.error(`Error getting order details for user: ${error}`);
        throw error;
    }
}

const getOrderDetailByOrderId = async (orderId: string, tx?: PrismaTx) => {
    const db = tx ?? prisma;
    try {
        const order = await db.order.findUnique({
            where: { orderNumber: orderId },
            include: {
                items: true,
                payments: true,
            },
        });
        return order;
    } catch (error) {
        logger.error(`Error getting order details by order id: ${error}`);
        throw error;
    }
}


export default {
    createOrder,
    createOrderItem,
    getOrderDetaisUser,
    getOrderDetailByOrderId,
}
