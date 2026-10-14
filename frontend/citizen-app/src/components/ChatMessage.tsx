import React from 'react';
import { ChatMessage as ChatMessageType } from '@garmiq/types';
import { Bot, User, BookOpen } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-2.5 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#0866D9] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
            isUser
              ? 'bg-[#0866D9] text-white rounded-tr-xs shadow-soft'
              : 'bg-white text-[#102A4C] border border-[#E2EDF9] rounded-tl-xs shadow-soft'
          }`}
        >
          {message.text}

          {/* Citations list for assistant replies */}
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#F0F4F8] flex flex-wrap gap-1.5">
              {message.citations.map((cite, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5F9FF] border border-[#D6E8FF] text-[10px] text-[#0866D9] font-medium"
                >
                  <BookOpen className="w-3 h-3 text-[#0866D9]" />
                  <span>
                    {cite.document} {cite.page ? `(p. ${cite.page})` : ''}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        <span className="text-[10px] text-[#5B708B] px-1 mt-1">
          {message.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#EDF5FF] text-[#0866D9] flex items-center justify-center shrink-0 border border-[#D6E8FF] mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
