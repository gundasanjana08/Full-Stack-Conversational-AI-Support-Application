
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, UserIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { Message, MessageRole } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">OmniSupport AI</h3>
            <p className="text-xs text-slate-500">Live Assistant • Responds in seconds</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-700">How can we help today?</h4>
              <p className="text-sm text-slate-500 mt-1">
                Ask about billing, technical issues, or request a new feature. I can even create tickets for you!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === MessageRole.USER ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {msg.role === MessageRole.USER ? <UserIcon className="w-5 h-5" /> : <CpuChipIcon className="w-5 h-5" />}
            </div>
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === MessageRole.USER 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
              <CpuChipIcon className="w-5 h-5" />
            </div>
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Type your message here..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-400"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI-generated responses. For urgent help, type "Talk to human".
        </p>
      </form>
    </div>
  );
};

// Re-using icon locally to avoid extra import complexity in this specific file
const ChatBubbleLeftRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3m-12 1.5l.647-.647a.75.75 0 011.06 0L10.5 20.25l7.5-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ChatWindow;
