import { VerificationPurpose } from "../../../generated/prisma/enums.js";
import { logger } from "../../../lib/logger.js";
import authService from "../../auth/auth.service.js";
import brandService from "../../catalog/brand.service.js";
import categoryService from "../../catalog/category.service.js";
import productService from "../../catalog/product.service.js";
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
        tools.getCartItemsTool(),
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

        default:
            logger.warn({ tool: toolName }, "Unknown tool call");
            return { error: `Unknown tool: ${toolName}` };
    }
};
