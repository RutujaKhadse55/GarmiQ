import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { sendChatMessage } from '@garmiq/api-client';
import { ChatMessage as ChatMessageType } from '@garmiq/types';
import { ChatMessage } from '../components/ChatMessage';
import {
  Bot,
  Send,
  Sparkles,
  ChevronLeft,
  RotateCcw,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं गर्मी-क्यू हीट सेफ्टी असिस्टेंट हूं। अत्यधिक तापमान, हाइड्रेशन और निकटतम कूलिंग सेंटर के बारे में मुझसे कुछ भी पूछें।'
        : language === 'mr'
        ? 'नमस्कार! मी गर्मी-क्यू उष्णता सुरक्षा सहाय्यक आहे. अति उष्णतेपासून बचाव, हायड्रेशन किंवा कुलिंग सेंटर्सबद्दल विचारा.'
        : 'Hello! I am GarmiQ Heat Safety Assistant. Ask me anything about staying cool, hydration tips, warning signs of heatstroke, or nearby shelters.',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      citations: [{ document: 'NDMA Heatwave Guidelines', page: 'General' }]
    }
  ]);

  const quickPrompts = [
    t('chat.q1', 'How can I stay safe in extreme heat today?'),
    t('chat.q2', 'Where is the nearest clean drinking water point?'),
    t('chat.q3', 'What are the emergency signs of heat stroke?'),
    t('chat.q4', 'When should I avoid outdoor work or cycling?')
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(text, language);
      const botMsg: ChatMessageType = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        citations: res.citations
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessageType = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue connecting to the thermal advice server. Please stay hydrated and rest in shade.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-between pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EDF9] px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-[#F5F9FF] border border-[#E2EDF9] flex items-center justify-center text-[#102A4C]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-[#102A4C]">
                  {t('chat.title', 'GarmiQ AI Assistant')}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-[#5B708B]">
                {t('chat.subtitle', 'Ask questions about heat safety')}
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-[#EDF5FF] text-[10px] font-bold text-[#0866D9] border border-[#D6E8FF]">
            Verified AI
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-3 overflow-y-auto">
        <div className="space-y-1">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#E2EDF9] shadow-soft text-xs text-[#5B708B] w-fit">
              <Bot className="w-4 h-4 text-[#0866D9] animate-spin" />
              <span>Analyzing heat mitigation guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length < 3 && (
          <div className="mt-4 pt-3 border-t border-[#E2EDF9]">
            <span className="text-[11px] font-bold text-[#5B708B] flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0866D9]" />
              <span>{t('chat.quickPromptsTitle', 'Suggested Questions')}</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left p-2.5 rounded-xl bg-white hover:bg-[#EDF5FF] border border-[#E2EDF9] text-xs font-semibold text-[#102A4C] transition-all active:scale-[0.99] truncate shadow-2xs"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Input Field Bar */}
      <div className="sticky bottom-16 z-30 bg-white border-t border-[#E2EDF9] p-3 max-w-md mx-auto w-full shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            maxLength={300}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.inputPlaceholder', 'Ask a question about heat safety...')}
            className="flex-1 py-2.5 px-3.5 bg-[#F8FAFD] border border-[#D6E8FF] rounded-2xl text-xs text-[#102A4C] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#0866D9] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-[#0866D9] hover:bg-[#054EB0] disabled:bg-[#B5D6FF] text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[9px] text-[#5B708B] text-right mt-1 px-1">
          {input.length}/300 chars
        </div>
      </div>
    </div>
  );
};
