import type { NextFunction, Request, Response } from "express";
import { Permission } from "../../constant/permision.js";
import { requirePermission } from "../../lib/auth.js";
import { getConversationContext } from "../../lib/context.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";
import cartService from "../cart/cart.service.js";
import { cartItem } from "../cart/cart.types.js";
import orderService from "./order.service.js";
import { PaymentMethod, PaymentStatus } from "../../generated/prisma/enums.js";
import paymentService from "../payment/payment.service.js";

const buildOrderUrl = (orderNumber: string) =>
    `${process.env.FRONTEND_URL}?order=${orderNumber}`;

const checkOutUserCart = async (paymentMethod: PaymentMethod) => {
    try {
        if(!Object.values(PaymentMethod).includes(paymentMethod)) {
            logger.error(`Invalid payment method`);
            throw new Error(`Invalid payment method`);
        }
        requirePermission(Permission.ORDER_CREATE, "create order");
        const { user, conversationId } = getConversationContext();
        if(!user || !conversationId) {
            logger.error(`User or conversation not found`);
            throw new Error(`User or conversation not found`);
        }
        const cart = await cartService.getCart(conversationId);
        if(!cart) {
            logger.error(`Cart not found`);
            throw new Error(`Cart not found`);
        }
        const cartItems = cart.items as cartItem[];
        if (cartItems.length === 0) {
            logger.error(`Cart is empty`);
            throw new Error(`Cart is empty`);
        }

        const { orderDetails, orderNumber } = await prisma.$transaction(
            async (tx) => {
                const order = await orderService.createOrder(user.id, cart.id, tx);
                const payment = await paymentService.createPayment(
                    order.id,
                    paymentMethod,
                    tx,
                );
                if (!payment) {
                    logger.error(`Payment not created`);
                    throw new Error(`Payment not created`);
                }
                for (const item of cartItems) {
                    await orderService.createOrderItem(
                        order.id,
                        item.productId,
                        item.quantity,
                        tx,
                    );
                }
                const details = await orderService.getOrderDetailByOrderId(
                    order.orderNumber,
                    tx,
                );
                const deleteCart = await cartService.deleteCart(conversationId, tx);
                if (!deleteCart) {
                    logger.error(`Cart not deleted`);
                    throw new Error(`Cart not deleted`);
                }
                return {
                    orderDetails: details,
                    orderNumber: order.orderNumber,
                    url: buildOrderUrl(order.orderNumber),
                };
            },
        );

        return {
            orderDetails,
            url: buildOrderUrl(orderNumber),
        };
    } catch (error) {
        logger.error(`Error checking out user cart: ${error}`);
        throw error;
    }
}

const getOrderDetailsUser = async () => {
    try {
        requirePermission(Permission.ORDER_READ, "read order");
        const { user } = getConversationContext();
        if(!user) {
            logger.error(`User not found`);
            throw new Error(`User not found`);
        }
        const orders = await orderService.getOrderDetaisUser(user.id);
        return orders.map((order) => ({
            ...order,
            url: buildOrderUrl(order.orderNumber),
        }));
    } catch (error) {
        logger.error(`Error getting order details for user: ${error}`);
        throw error;
    }
}

const getOrderDetailByOrderId = async (orderId: string) => {
    try {
        requirePermission(Permission.ORDER_READ, "read order");
        const order = await orderService.getOrderDetailByOrderId(orderId);
        if (!order) {
            return { error: `No order found with order number ${orderId}` };
        }
        return { ...order, url: buildOrderUrl(order.orderNumber) };
    } catch (error) {
        logger.error(`Error getting order details by order id: ${error}`);
        throw error;
    }
}

const getPublicOrderByNumber = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { orderNumber } = req.params;
        if (!orderNumber) {
            res.status(400).json({ error: "orderNumber is required" });
            return;
        }
        const order = await orderService.getOrderDetailByOrderId(orderNumber);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json({ order });
    } catch (error) {
        logger.error(`Error getting public order details: ${error}`);
        next(error);
    }
};

const completeOrderPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { orderNumber } = req.params;
        if (!orderNumber) {
            res.status(400).json({ error: "orderNumber is required" });
            return;
        }

        const result = await prisma.$transaction(async (tx) => {
            const order = await orderService.getOrderDetailByOrderId(
                orderNumber,
                tx,
            );
            if (!order) {
                return { status: 404 as const, error: "Order not found" };
            }

            const payablePayment = order.payments.find(
                (payment) =>
                    payment.method === PaymentMethod.PAYMENT_GATEWAY &&
                    (payment.status === PaymentStatus.PENDING ||
                        payment.status === PaymentStatus.PROCESSING),
            );

            if (!payablePayment) {
                return {
                    status: 400 as const,
                    error: "There is no pending online payment for this order.",
                };
            }

            await paymentService.updatePayment(
                payablePayment.id,
                {
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                    provider: "mock-gateway",
                    transactionId: `mock_${Date.now()}`,
                },
                tx,
            );

            const updated = await orderService.getOrderDetailByOrderId(
                orderNumber,
                tx,
            );
            return { status: 200 as const, order: updated };
        });

        if (result.status !== 200) {
            res.status(result.status).json({ error: result.error });
            return;
        }
        res.status(200).json({ order: result.order });
    } catch (error) {
        logger.error(`Error completing order payment: ${error}`);
        next(error);
    }
};

export default {
    checkOutUserCart,
    getOrderDetailsUser,
    getOrderDetailByOrderId,
    getPublicOrderByNumber,
    completeOrderPayment,
}