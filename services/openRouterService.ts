import { OpenRouter } from '@openrouter/sdk';
import { ConversationHistory, Persona } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

const client = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY
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
  try {
    const systemInstruction = SYSTEM_INSTRUCTIONS[persona];

    let contextPrompt = "";

    if (persona === Persona.JUDGE) {
      contextPrompt = `Review this recent conversation:\n${lastMessage}\n\nProvide your evaluation.`;
    } else {
      contextPrompt = `Conversation History:\n${history.map(h => h.content).join('\n')}\n\nRespond to the last message as ${persona}.`;
    }

    const result = client.callModel({
      model: model,
      instructions: systemInstruction,
      input: contextPrompt,
      temperature: 1.0,
      maxOutputTokens: 500
    });

    return await result.getText();
  } catch (error) {
    console.error(`Error generating response for ${persona}:`, error);
    return "I'm having trouble thinking right now.";
  }
};
