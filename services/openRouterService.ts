import { OpenRouter } from '@openrouter/sdk';
import { ConversationHistory, Persona } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

// Debug: Log API key status (masked for security)
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
// console.log('[OpenRouter] Initializing...');
// console.log('[OpenRouter] API Key status:', apiKey ? `Present (${apiKey.slice(0, 10)}...${apiKey.slice(-4)})` : 'MISSING');

// if (!apiKey) {
//   console.error('[OpenRouter] VITE_OPENROUTER_API_KEY is not set! Check your environment variables.');
// }

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
  // const requestId = Math.random().toString(36).slice(2, 8);
  // console.log(`[OpenRouter][${requestId}] Starting request for ${persona}`);

  try {
    const systemInstruction = SYSTEM_INSTRUCTIONS[persona];

    let userContent = "";

    if (persona === Persona.JUDGE) {
      userContent = `Review this recent conversation:\n${lastMessage}\n\nProvide your evaluation.`;
    } else {
      userContent = `Conversation History:\n${history.map(h => h.content).join('\n')}\n\nRespond to the last message as ${persona}.`;
    }

    // Log request details
    // console.log(`[OpenRouter][${requestId}] Request details:`, {
    //   model,
    //   persona,
    //   systemInstructionLength: systemInstruction?.length || 0,
    //   userContentLength: userContent.length,
    //   historyMessages: history.length
    // });

    // Use the correct SDK method: chat.send()
    const response = await client.chat.send({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemInstruction
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      temperature: 1.0,
      maxTokens: 500
    });

    // console.log(`[OpenRouter][${requestId}] Response received:`, {
    //   id: response.id,
    //   model: response.model,
    //   choicesCount: response.choices?.length || 0
    // });

    // Extract text from response
    const content = response.choices?.[0]?.message?.content;

    // Handle both string and array content types
    let text: string;
    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      // Extract text from content array
      text = content
        .filter((item): item is { type: 'text'; text: string } => item.type === 'text')
        .map(item => item.text)
        .join('');
    } else {
      // console.error(`[OpenRouter][${requestId}] No content in response:`, JSON.stringify(response, null, 2));
      throw new Error('No content in API response');
    }

    if (!text) {
      // console.error(`[OpenRouter][${requestId}] Empty content in response:`, JSON.stringify(response, null, 2));
      throw new Error('Empty content in API response');
    }

    // console.log(`[OpenRouter][${requestId}] Success! Response length: ${text.length}`);
    // console.log(`[OpenRouter][${requestId}] Response preview: ${text.slice(0, 100)}...`);

    return text;
  } catch (error) {
    // console.error(`[OpenRouter][${requestId}] Error for ${persona}:`, {
    //   name: (error as Error)?.name,
    //   message: (error as Error)?.message,
    //   stack: (error as Error)?.stack?.split('\n').slice(0, 5).join('\n')
    // });

    // Log additional error details if available
    // if (error && typeof error === 'object') {
    //   const err = error as Record<string, unknown>;
    //   if ('response' in err) {
    //     console.error(`[OpenRouter][${requestId}] Response data:`, err.response);
    //   }
    //   if ('status' in err) {
    //     console.error(`[OpenRouter][${requestId}] Status:`, err.status);
    //   }
    //   if ('body' in err) {
    //     console.error(`[OpenRouter][${requestId}] Body:`, err.body);
    //   }
    // }

    throw error;
  }
};
