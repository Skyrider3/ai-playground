import { OpenRouter } from '@openrouter/sdk';
import { ConversationHistory, Persona } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

// Debug: Log API key status (masked for security)
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
console.log('[OpenRouter] API Key status:', apiKey ? `Present (${apiKey.slice(0, 10)}...${apiKey.slice(-4)})` : 'MISSING');

if (!apiKey) {
  console.error('[OpenRouter] VITE_OPENROUTER_API_KEY is not set! Check your environment variables.');
}

const client = new OpenRouter({
  apiKey: apiKey
});

/**
 * Generates a response for a specific persona based on the conversation history.
 */
export const generatePersonaResponse = async (
  persona: Persona,
  history: ConversationHistory,
  lastMessage: string,
  model: string
): Promise<string> => {
  const requestId = Math.random().toString(36).slice(2, 8);
  console.log(`[OpenRouter][${requestId}] Starting request for ${persona}`);

  try {
    const systemInstruction = SYSTEM_INSTRUCTIONS[persona];

    let contextPrompt = "";

    if (persona === Persona.JUDGE) {
      contextPrompt = `Review this recent conversation:\n${lastMessage}\n\nProvide your evaluation.`;
    } else {
      contextPrompt = `Conversation History:\n${history.map(h => h.content).join('\n')}\n\nRespond to the last message as ${persona}.`;
    }

    // Log request details
    console.log(`[OpenRouter][${requestId}] Request details:`, {
      model,
      persona,
      instructionLength: systemInstruction?.length || 0,
      contextLength: contextPrompt.length,
      historyMessages: history.length
    });

    const result = client.callModel({
      model: model,
      instructions: systemInstruction,
      input: contextPrompt,
      temperature: 1.0,
      maxOutputTokens: 500
    });

    console.log(`[OpenRouter][${requestId}] callModel returned, awaiting getText()...`);

    // Log the raw result object for debugging
    console.log(`[OpenRouter][${requestId}] Result object type:`, typeof result);
    console.log(`[OpenRouter][${requestId}] Result object keys:`, Object.keys(result || {}));

    const text = await result.getText();

    console.log(`[OpenRouter][${requestId}] Success! Response length: ${text?.length || 0}`);
    console.log(`[OpenRouter][${requestId}] Response preview: ${text?.slice(0, 100)}...`);

    return text;
  } catch (error) {
    console.error(`[OpenRouter][${requestId}] Error for ${persona}:`, {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack?.split('\n').slice(0, 3).join('\n')
    });

    // Log additional error details if available
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      if ('response' in err) {
        console.error(`[OpenRouter][${requestId}] Response data:`, err.response);
      }
      if ('status' in err) {
        console.error(`[OpenRouter][${requestId}] Status:`, err.status);
      }
    }

    throw error; // Re-throw to let the caller handle it
  }
};
