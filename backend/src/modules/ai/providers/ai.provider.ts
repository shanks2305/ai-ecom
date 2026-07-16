import { env } from "../../../config/env.js";
import { provider } from "./index.js";

const chat = async (messages: any[]) => {
    try {
        const response = await provider.chat.completions.create({
            model: env.ai.model,
            messages,
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}

export default {
    chat,
}