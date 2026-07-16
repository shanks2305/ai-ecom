const getBrandsTool = () => ({
    type: "function",
    function: {
        name: "get_brands",
        description: "Look up brand details from the store catalog.It gives a list of all brands in the store. Use when the user asks about a specific brand's description or details or need to get the brands id. Do not use for product listings.",
    }
})

const getAllCategoriesTool = () => ({
    type: "function",
    function: {
        name: "get_all_categories",
        description: "Look up all categories from the store catalog. It gives a list of all categories in the store. Use when the user asks about a specific category's description or details or need to get the categories id. Do not use for product listings.",
    }
})

const getAllProductsTool = () => ({
    type: "function",
    function: {
        name: "get_all_products",
        description: "Look up all products from the store catalog. It gives a list of all products in the store. Use when the user asks about a specific product's description or details. Do not use for category listings.",
    }
})

const getProductDetailsTool = () => ({
    type: "function",
    function: {
        name: "get_product_details",
        description: "Look up product details from the store catalog. If you have a category or a brand id, use this tool to get the products in that category or brand. For brand id, use the get_brands tool to get the brand id. For category id, use the get_categories tool to get the category id.",
    },
    parameters: {
        type: "object",
        properties: {
            category_id: { type: "string", description: "The category id of the product" },
            brand_id: { type: "string", description: "The brand id of the product" },
        },
        required: ["category_id", "brand_id"],
    },
})

const getSearchProductsTool = () => ({
    type: "function",
    function: {
        name: "get_search_products",
        description:"Search products by name or keywords. Use when the user asks for a specific product, price, or availability. For browsing by category or brand, prefer get_product_details with IDs from get_all_categories / get_brands. Do not use for category or brand listings.",
        parameters: {
            type: "object",
            properties: {
                query: { type: "string", description: "The query of the product" },
            },
            required: ["query"],
        },
    },
   
})

export default {
    getBrandsTool,
    getAllCategoriesTool,
    getAllProductsTool,
    getProductDetailsTool,
    getSearchProductsTool,
};
