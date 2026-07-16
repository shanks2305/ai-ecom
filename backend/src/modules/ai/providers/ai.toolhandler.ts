import OpenAI from "openai";
import { toolExecutor } from "../tools/index.js";

export const handleToolCalls = async (message: OpenAI.ChatCompletionMessage) => {
    const res: OpenAI.ChatCompletionMessageParam[] = [];
    for (const toolCall of message.tool_calls!) {
        if (toolCall.type !== "function") continue;
        const id = toolCall.id;
        const functionName = toolCall.function.name;
        const functionArgs = toolCall.function.arguments;
        const toolResult = await toolExecutor(functionName, functionArgs);
        res.push({
            "role": "tool",
            "content": JSON.stringify(toolResult),
            "tool_call_id": id
        })
    }
    return res;
}