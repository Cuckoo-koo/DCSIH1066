import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Compass,
  MessageSquare,
  BookOpen,
  Volume2,
  ArrowRight
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { askGeminiCulturalAssistant } from '../lib/gemini';

export const AIAssistantDrawer: React.FC = () => {
  const { isAIAssistantOpen, toggleAIAssistant, entries, setSelectedEntry } = useAtlasStore();
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: "Namaste! I am your Gemini Cultural Archivist. Ask me about India's living oral traditions, endangered dialects, sacred ritual performances, or folk epics preserved by village elders.",
      time: 'Just now'
    }
  ]);

  if (!isAIAssistantOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userText = query;
    setQuery('');
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setIsTyping(true);

    try {
      const response = await askGeminiCulturalAssistant(userText, entries);
      setMessages(prev => [
        ...prev,
        {
          sender: 'gemini',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const sampleQuestions = [
    'Tell me about the whistled names of Kongthong',
    'What is the sacred origin of Theyyam in Kerala?',
    'Explain the Baul philosophy of Maner Manush',
    'How do Phad bards perform in the desert?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl border-l border-cream-300 flex flex-col animate-in slide-in-from-right duration-300">

      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-discovery-600 to-discovery-500 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base leading-tight">
              Gemini AI Cultural Archivist
            </h3>
            <p className="text-[11px] text-discovery-100">
              India Oral Heritage Intelligence Engine
            </p>
          </div>
        </div>
        <button
          onClick={() => toggleAIAssistant(false)}
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sample Quick Questions Pill Strip */}
      <div className="p-3 bg-discovery-50 border-b border-discovery-100 overflow-x-auto scrollbar-none flex items-center space-x-2 shrink-0">
        <span className="text-[10px] font-bold text-discovery-700 uppercase tracking-wider shrink-0">
          Suggestions:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(q)}
            className="px-2.5 py-1 bg-white hover:bg-discovery-100 text-discovery-800 text-[11px] font-medium rounded-full border border-discovery-200 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-cream-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-heritage-500 text-white rounded-tr-xs'
                  : 'bg-white border border-cream-300 text-charcoal-800 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-charcoal-700 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-cream-300 max-w-[80%] text-xs text-charcoal-700 animate-pulse">
            <Sparkles className="w-4 h-4 text-discovery-500 animate-spin" />
            <span>Consulting Bharat Oral Heritage Archives...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-cream-200 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask about rituals, folk epics, dialects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-discovery-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim() || isTyping}
          className="p-2.5 bg-discovery-500 hover:bg-discovery-600 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
