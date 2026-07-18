import { Prisma } from "../../generated/prisma/client.js";
import { PaymentMethod } from "../../generated/prisma/enums.js";
import { logger } from "../../lib/logger.js";
import { prisma, type PrismaTx } from "../../lib/prisma.js";

const createPayment = async (
    orderId: string,
    paymentMethod: PaymentMethod,
    tx?: PrismaTx,
) => {
    const db = tx ?? prisma;
    try {
        if(!Object.values(PaymentMethod).includes(paymentMethod)) {
            logger.error(`Invalid payment method`);
            throw new Error(`Invalid payment method`);
        }
        const order = await db.order.findUnique({
            where: { id: orderId },
        });
        if(!order) {
            logger.error(`Order not found`);
            throw new Error(`Order not found`);
        }
        const payment = await db.payment.create({
            data: { orderId: orderId, method: paymentMethod, amount: order.totalAmount },
        });
        return payment;
    } catch (error) {
        logger.error(`Error creating payment: ${error}`);
        throw error;
    }
}

const updatePayment = async (
    paymentId: string,
    query: Prisma.PaymentUpdateInput,
    tx?: PrismaTx,
) => {
    const db = tx ?? prisma;
    try {
        const payment = await db.payment.update({
            where: { id: paymentId },
            data: query,
        });
        return payment;
    } catch (error) {
        logger.error(`Error updating payment: ${error}`);
        throw error;
    }
}

export default {
    createPayment,
    updatePayment,
}
