import React, { useRef, useEffect } from 'react';
import { Persona, Message } from '../types';
import { MessageCard } from './MessageCard';
import { AVATARS, AVAILABLE_MODELS } from '../constants';

interface ColumnProps {
  persona: Persona;
  messages: Message[];
  isActive: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  isSimulationActive: boolean;
}

export const Column: React.FC<ColumnProps> = ({ 
  persona, 
  messages, 
  isActive, 
  selectedModel, 
  onModelChange, 
  isSimulationActive 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getHeaderColor = () => {
    switch (persona) {
      case Persona.CHILD: return 'bg-blue-600';
      case Persona.TOY: return 'bg-amber-600';
      case Persona.JUDGE: return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-300">
      {/* Header */}
      <div className={`${getHeaderColor()} p-4 flex items-center justify-between shadow-md`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl filter drop-shadow-lg">{AVATARS[persona]}</span>
            <h2 className="text-xl font-bold text-white tracking-wide">{persona} AI</h2>
          </div>
          <select 
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={isSimulationActive}
            className="bg-black/20 text-xs text-white/90 border border-white/20 rounded px-2 py-1 focus:outline-none focus:bg-black/40 focus:border-white/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/30 transition-colors w-full max-w-[200px]"
            aria-label={`Select model for ${persona}`}
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.value} value={model.value} className="text-gray-900 bg-white">
                {model.label}
              </option>
            ))}
          </select>
        </div>
        
        {isActive && (
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4 bg-gradient-to-b from-gray-900/50 to-transparent"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
            <span className="text-4xl mb-2 grayscale">{AVATARS[persona]}</span>
            <p className="text-sm">Waiting for conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))
        )}
      </div>
    </div>
  );
};