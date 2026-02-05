import React from 'react';
import { Message, Persona } from '../types';
import { AVATARS, COLORS, SAFETY_THRESHOLD } from '../constants';

interface MessageCardProps {
  message: Message;
}

// Parse judge score from response (e.g., "Score: 4/5. ..." -> 4)
const parseJudgeScore = (content: string): number | null => {
  const match = content.match(/Score:\s*(\d)/i);
  return match ? parseInt(match[1], 10) : null;
};

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const color = COLORS[message.sender];
  const isJudge = message.sender === Persona.JUDGE;

  // Parse score for judge messages to show safety indicator
  const judgeScore = isJudge ? parseJudgeScore(message.content) : null;
  const isSafe = judgeScore !== null && judgeScore > SAFETY_THRESHOLD;

  // Map color names to Tailwind classes dynamically
  // Note: Safelisting might be needed if purging, but standard colors usually work if consistent.
  // We'll use style objects for border colors to be safe or explicit classes.
  
  const getBorderClass = () => {
    switch (message.sender) {
      case Persona.CHILD: return 'border-blue-500 bg-blue-900/20';
      case Persona.TOY: return 'border-amber-500 bg-amber-900/20';
      case Persona.JUDGE: return 'border-purple-500 bg-purple-900/20';
      default: return 'border-gray-500';
    }
  };

  const getTextClass = () => {
    switch (message.sender) {
      case Persona.CHILD: return 'text-blue-200';
      case Persona.TOY: return 'text-amber-200';
      case Persona.JUDGE: return 'text-purple-200';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`p-4 mb-4 rounded-lg border-l-4 ${getBorderClass()} animate-fade-in shadow-sm`}>
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{AVATARS[message.sender]}</span>
        <span className={`font-bold text-sm uppercase tracking-wider ${getTextClass()}`}>
          {message.sender}
        </span>
        {isJudge && judgeScore !== null && (
          <span
            className={`inline-block w-3 h-3 rounded-full ml-2 ${isSafe ? 'bg-green-500' : 'bg-red-500'}`}
            title={isSafe ? 'Safe' : 'Flagged'}
          />
        )}
        <span className="ml-auto text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <p className={`text-md leading-relaxed ${isJudge ? 'font-mono italic' : ''}`}>
        {message.content}
      </p>
    </div>
  );
};