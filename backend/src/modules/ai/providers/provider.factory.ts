import { env } from "../../../config/env.js";
 import { OpenAI } from "openai";

const createProvider = () => {
    try {
        const { apiKey, model, baseUrl } = env.ai;
        const clinet = new OpenAI({
            apiKey,
            baseURL: baseUrl,
        });
        return clinet;
    } catch (error) {
        throw error;
    }
}

const provider = createProvider();

export default provider;