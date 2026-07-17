import type OpenAI from "openai";

type Tool = OpenAI.ChatCompletionTool;

const NO_PARAMS = {
  type: "object" as const,
  properties: {},
  additionalProperties: false,
};

const getBrandsTool = (): Tool => ({
  type: "function",
  function: {
    name: "get_brands",
    description:
      "List every brand in the store as {id, name, description}. Use to look up a brand id or describe a brand. Not for product listings.",
    parameters: NO_PARAMS,
  },
});

const getAllCategoriesTool = (): Tool => ({
  type: "function",
  function: {
    name: "get_all_categories",
    description:
      "List every category in the store as {id, name, description}. Use to look up a category id or describe a category. Not for product listings.",
    parameters: NO_PARAMS,
  },
});

const findProductsTool = (): Tool => ({
  type: "function",
  function: {
    name: "find_products",
    description:
      "Return products, optionally filtered by category_id and/or brand_id. Get ids first from get_all_categories and get_brands. With no filters, returns the full catalog (can be large — prefer at least one filter or use search_products for keyword queries).",
    parameters: {
      type: "object",
      properties: {
        category_id: {
          type: "string",
          description:
            "Category id from get_all_categories. Omit to skip filtering by category.",
        },
        brand_id: {
          type: "string",
          description:
            "Brand id from get_brands. Omit to skip filtering by brand.",
        },
      },
      additionalProperties: false,
    },
  },
});

const searchProductsTool = (): Tool => ({
  type: "function",
  function: {
    name: "search_products",
    description:
      "Full-text search across product names and descriptions. Use when the user names a product, keyword, or feature (e.g. 'wireless headphones', 'red dress'). Prefer find_products when the user is browsing by category or brand.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Keywords to match against product name and description. Keep it short (1–5 words).",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
});

const getProductByIdTool = (): Tool => ({
  type: "function",
  function: {
    name: "get_product_by_id",
    description:
      "Fetch the full detail of a single product by its id (price, description, sku, etc.). Get the id from find_products or search_products first.",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Product id returned by find_products or search_products.",
        },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
});

const checkUserAuth = (): Tool => ({
  type: "function",
  function: {
    name: "check_user_auth",
    description:
      "Check whether the current user is authenticated in this session. Call this before any action that requires an account (checkout, view orders, admin tasks). Returns { message, user }.",
    parameters: NO_PARAMS,
  },
});

const loginUserTool = (): Tool => ({
  type: "function",
  function: {
    name: "login_user",
    description:
      "Start a login flow for an EXISTING account by sending a one-time OTP code to the user's email. Call this when the user asks to log in / sign in and has given an email. Do NOT call for a new account (use register_user instead). After this returns, the next required tool call is verify_otp once the user provides the code.",
    parameters: {
        type: "object",
        properties: {
            email: {
                type: "string",
                description: "The email address of the existing account to log in.",
            },
        },
        required: ["email"],
        additionalProperties: false,
    },
  },
});

const registerUserTool = (): Tool => ({
  type: "function",
  function: {
    name: "register_user",
    description:
      "Create a NEW account and send a one-time OTP code to the user's email to verify it. Call this only when the user does not yet have an account and has provided email, first name, and last name. After this returns, the next required tool call is verify_otp once the user provides the code.",
    parameters: {
        type: "object",
        properties: {
            email: {
                type: "string",
                description: "The email address for the new account.",
            },
            firstName: {
                type: "string",
                description: "First name of the new user.",
            },
            lastName: {
                type: "string",
                description: "Last name of the new user.",
            },
        },
        required: ["email", "firstName", "lastName"],
        additionalProperties: false,
    },
  },
});

const verifyOTP = (): Tool => ({
  type: "function",
  function: {
    name: "verify_otp",
    description:
      "Verify a one-time password (OTP) code that the user typed in chat after login_user or register_user was called. You MUST call this tool whenever the user's message contains a numeric code (typically 4–8 digits) and an OTP was recently requested — do not answer the user in natural language first. Use the email from the earlier login_user / register_user call. Set purpose to 'login' if login_user was called, or 'register' if register_user was called. On success, the user is authenticated for the rest of the session.",
    parameters: {
        type: "object",
        properties: {
            email: {
                type: "string",
                description:
                  "The email address the OTP was sent to. Reuse the email from the most recent login_user or register_user call.",
            },
            code: {
                type: "string",
                description:
                  "The OTP code the user typed. Extract the digits from the user's message (strip spaces, dashes, and any surrounding words).",
            },
            purpose: {
                type: "string",
                description:
                  "'login' if the OTP was sent via login_user, 'register' if via register_user.",
                enum: ["login", "register"],
            },
        },
        required: ["email", "code", "purpose"],
        additionalProperties: false,
    },
  },
});

const getCartItemsTool = (): Tool => ({
  type: "function",
  function: {
    name: "get_cart_items",
    description:
      "Get the current user's cart items. Call this when the user asks for their cart items.",
    parameters: NO_PARAMS,
  },
});

export default {
  getBrandsTool,
  getAllCategoriesTool,
  findProductsTool,
  searchProductsTool,
  getProductByIdTool,
  checkUserAuth,
  loginUserTool,
  registerUserTool,
  verifyOTP,
  getCartItemsTool,
};
