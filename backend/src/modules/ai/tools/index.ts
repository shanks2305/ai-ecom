import { PaymentMethod, VerificationPurpose } from "../../../generated/prisma/enums.js";
import { getConversationContext } from "../../../lib/context.js";
import { logger } from "../../../lib/logger.js";
import authService from "../../auth/auth.service.js";
import cartController from "../../cart/cart.controller.js";
import { cartItem, cartItemChange } from "../../cart/cart.types.js";
import brandService from "../../catalog/brand.service.js";
import categoryService from "../../catalog/category.service.js";
import productService from "../../catalog/product.service.js";
import orderController from "../../order/order.controler.js";
import tools from "./tool.js";

export default function getTools() {
    return [
        tools.getBrandsTool(),
        tools.getAllCategoriesTool(),
        tools.findProductsTool(),
        tools.searchProductsTool(),
        tools.getProductByIdTool(),
        tools.checkUserAuth(),
        tools.loginUserTool(),
        tools.registerUserTool(),
        tools.verifyOTP(),
        tools.getCartTool(),
        tools.createCartTool(),
        tools.updateCartTool(),
        tools.getUserInfoTool(),
        tools.checkOutCartTool(),
        tools.getOrderDetailsOfUserTool(),
        tools.getOrderDetailByOrderIdTool(),
    ];
}

function parseArgs(raw: unknown): Record<string, unknown> {
    if (raw == null) return {};
    if (typeof raw === "object") return raw as Record<string, unknown>;
    if (typeof raw !== "string") return {};
    const trimmed = raw.trim();
    if (!trimmed) return {};
    try {
        const parsed = JSON.parse(trimmed);
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch (error) {
        logger.warn({ err: error, raw }, "Failed to parse tool arguments as JSON");
        return {};
    }
}

function requireString(args: Record<string, unknown>, key: string): string | null {
    const value = args[key];
    return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function parseCartItems(raw: unknown): cartItem[] | null {
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const items: cartItem[] = [];
    for (const entry of raw) {
        if (!entry || typeof entry !== "object") return null;
        const e = entry as Record<string, unknown>;
        const productId = typeof e.productId === "string" ? e.productId.trim() : "";
        const productName = typeof e.productName === "string" ? e.productName.trim() : "";
        const quantityRaw = typeof e.quantity === "number" ? e.quantity : NaN;
        const quantity = Number.isFinite(quantityRaw) ? Math.floor(quantityRaw) : NaN;
        if (!productId || !productName || !Number.isFinite(quantity) || quantity < 1) {
            return null;
        }
        items.push({ productId, productName, quantity });
    }
    return items;
}

function parseCartItemChanges(raw: unknown): cartItemChange[] | null {
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const changes: cartItemChange[] = [];
    for (const entry of raw) {
        if (!entry || typeof entry !== "object") return null;
        const e = entry as Record<string, unknown>;
        const productId = typeof e.productId === "string" ? e.productId.trim() : "";
        const productName = typeof e.productName === "string" ? e.productName.trim() : "";
        const action = e.action === "add" || e.action === "remove" ? e.action : null;
        const quantityRaw = typeof e.quantity === "number" ? e.quantity : NaN;
        const quantity = Number.isFinite(quantityRaw) ? Math.floor(quantityRaw) : NaN;
        const removeAll = e.removeAll === true;
        if (!productId || !productName || !action || !Number.isFinite(quantity) || quantity < 1) {
            return null;
        }
        if (removeAll && action !== "remove") {
            return null;
        }
        changes.push({ productId, productName, action, quantity, removeAll });
    }
    return changes;
}

export const toolExecutor = async (toolName: string, rawArgs: unknown) => {
    const args = parseArgs(rawArgs);
    logger.info({ tool: toolName, args }, "Executing tool");

    switch (toolName) {
        case "get_brands":
            return brandService.listBrands();

        case "get_all_categories":
            return categoryService.listCategories();

        case "find_products": {
            const where: Record<string, unknown> = {};
            const categoryId = requireString(args, "category_id");
            const brandId = requireString(args, "brand_id");
            if (categoryId) where.categoryId = categoryId;
            if (brandId) where.brandId = brandId;
            return productService.getProductsByQuery(where);
        }

        case "search_products": {
            const query = requireString(args, "query");
            if (!query) {
                return { error: "Missing required argument: query" };
            }
            return productService.searchProducts(query);
        }

        case "get_product_by_id": {
            const id = requireString(args, "id");
            if (!id) {
                return { error: "Missing required argument: id" };
            }
            const product = await productService.getProductById(id);
            return product ?? { error: `No product found with id ${id}` };
        }

        case "check_user_auth": {
            return authService.checkUserAuth();
        }

        case "login_user": {
            const email = requireString(args, "email");
            if (!email) {
                return { error: "Missing required argument: email" };
            }
            return authService.login(email);
        }

        case "register_user": {
            const email = requireString(args, "email");
            const firstName = requireString(args, "firstName");
            const lastName = requireString(args, "lastName");
            if (!email || !firstName || !lastName) {
                return { error: "Missing required arguments: email, firstName, lastName" };
            }
            return authService.register(email, firstName, lastName);
        }

        case "verify_otp": {
            const email = requireString(args, "email");
            const code = requireString(args, "code");
            const purposeRaw = requireString(args, "purpose");
            if (!email || !code || !purposeRaw) {
                return { error: "Missing required arguments: email, code, purpose" };
            }
            const normalized = purposeRaw.toUpperCase();
            if (
                normalized !== VerificationPurpose.LOGIN &&
                normalized !== VerificationPurpose.REGISTER
            ) {
                return {
                    error: `Invalid purpose: ${purposeRaw}. Expected "login" or "register".`,
                };
            }
            const { user } = await authService.verifyOTP(
                email,
                code,
                normalized as VerificationPurpose
            );
            return {
                ok: true,
                user,
            };
        }

        case "get_cart": {
            const { conversationId }  = getConversationContext()
            if(!conversationId) {
                return { error: "Conversation not found" };
            }
            const cart = await cartController.getCart(conversationId);
            return cart;
        }

        case "create_cart": {
            const { conversationId, user } = getConversationContext();
            if (!conversationId || !user) {
                logger.info(`You must be signed in and in an active conversation to create a cart.`);
                return { error: "You must be signed in and in an active conversation to create a cart." };
            }
            const items = parseCartItems(args.items);
            if (!items) {
                logger.info(`items must be a non-empty array of { productId, productName, quantity } objects.`);
                return { error: "items must be a non-empty array of { productId, productName, quantity } objects." };
            }
            logger.info(`Creating cart for user ${user.id} in conversation ${conversationId} with items ${items}`);

            return cartController.createCart(user.id, conversationId, items);
        }

        case "update_cart": {
            const { conversationId } = getConversationContext();
            if (!conversationId) {
                return { error: "Conversation not found" };
            }
            const changes = parseCartItemChanges(args.items);
            if (!changes) {
                return {
                    error: "items must be a non-empty array of { productId, productName, action, quantity, removeAll? } objects. action must be 'add' or 'remove'; quantity must be an integer >= 1; removeAll (optional) is only valid with action='remove'.",
                };
            }
            return cartController.updateCart(conversationId, changes);
        }

        case "get_user_info": {
            const { user } = getConversationContext();
            if (!user) {
                return { error: "User not found" };
            }
            return user;
        }

        case "check_out_cart": {
            const paymentMethod = requireString(args, "paymentMethod");
            if (!paymentMethod) {
                return { error: "Missing required argument: paymentMethod" };
            }
            if (!Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)) {
                return { error: "Invalid payment method" };
            }
            return orderController.checkOutUserCart(paymentMethod as PaymentMethod);
        }

        case "get_order_details_of_user": {
            return orderController.getOrderDetailsUser();
        }

        case "get_order_detail_by_order_number": {
            const orderNumber = requireString(args, "orderNumber");
            if (!orderNumber) {
                return { error: "Missing required argument: orderNumber" };
            }
            return orderController.getOrderDetailByOrderId(orderNumber);
        }

        default:
            logger.warn({ tool: toolName }, "Unknown tool call");
            return { error: `Unknown tool: ${toolName}` };
    }
};
