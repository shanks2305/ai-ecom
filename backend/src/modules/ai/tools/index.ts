import { logger } from "../../../lib/logger.js";
import brandService from "../../catalog/brand.service.js";
import categoryService from "../../catalog/category.service.js";
import productService from "../../catalog/product.service.js";
import tools from "./tool.js";

export default function getTools() {
    return [
        tools.getBrandsTool(),
        tools.getAllCategoriesTool(),
        tools.getAllProductsTool(),
        tools.getProductDetailsTool(),
    ]
}

export const toolExecutor = async (toolName: string, toolParams: any) => {
    logger.info(`Executing tool: ${toolName} with params: ${JSON.stringify(toolParams)}`);
    switch(toolName) {
        case "get_brands":
            return await brandService.listBrands();
        case "get_all_categories":
            return await categoryService.listCategories();
        case "get_all_products":
            return await productService.listProducts();
        case "get_product_details":
            return await productService.getProductsByQuery({
                category_id: toolParams.category_id,
                brand_id: toolParams.brand_id,
            });
        case "get_search_products":
            return await productService.searchProducts(toolParams.query);
        default:
            () => `Tool ${toolName} not found`;
    }
}