export enum Persona {
  CHILD = 'CHILD',
  TOY = 'TOY',
  JUDGE = 'JUDGE'
}

export interface Message {
  id: string;
  sender: Persona;
  content: string;
  timestamp: number;
}

export interface ThreatType {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium';
  childGoal: string;
}

export interface SimulationState {
  isActive: boolean;
  threatType: ThreatType | null;
  turn: Persona | 'IDLE';
  messages: Message[];
  isThinking: boolean;
  roundCount: number;
  error?: string | null;
}

export type ConversationHistory = {
  role: 'user' | 'assistant';
  content: string;
}[];