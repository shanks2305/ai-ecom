import { env } from "../../../config/env.js";
import { OpenAI } from "openai";

export default new OpenAI({
    apiKey: env.ai.apiKey,
    baseURL: env.ai.baseUrl,
});
