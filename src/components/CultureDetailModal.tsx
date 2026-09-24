import React, { useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Play,
  Pause,
  MapPin,
  Calendar,
  User,
  Sparkles,
  Volume2,
  Languages,
  BookOpen,
  Send,
  MessageCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { CulturalEntry } from '../types';
import { useAtlasStore } from '../store/useAtlasStore';
import { askGeminiCulturalAssistant } from '../lib/gemini';

interface CultureDetailModalProps {
  entry: CulturalEntry | null;
  onClose: () => void;
}

export const CultureDetailModal: React.FC<CultureDetailModalProps> = ({ entry, onClose }) => {
  const { bookmarks, toggleBookmark, likeEntry, entries } = useAtlasStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(entry?.audio_url ? new Audio(entry.audio_url) : null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcription' | 'narrative' | 'gemini'>('overview');

  // Gemini Chat state inside this specific tradition
  const [geminiQuestion, setGeminiQuestion] = useState('');
  const [geminiAnswers, setGeminiAnswers] = useState<{ q: string; a: string }[]>([]);
  const [isAskingGemini, setIsAskingGemini] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  if (!entry) return null;

  const isBookmarked = bookmarks.includes(entry.id);

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      audio.onended = () => setIsPlaying(false);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleAskGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuestion.trim() || isAskingGemini) return;

    const question = geminiQuestion;
    setGeminiQuestion('');
    setIsAskingGemini(true);

    try {
      const response = await askGeminiCulturalAssistant(
        `In the context of the tradition "${entry.title}" (${entry.category_name} from ${entry.district_name}, ${entry.state_name}): ${question}`,
        entries
      );
      setGeminiAnswers(prev => [...prev, { q: question, a: response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAskingGemini(false);
    }
  };

  const mainImage = entry.media?.find(m => m.type === 'image')?.url ||
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-cream-50 rounded-3xl shadow-2xl border border-cream-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-charcoal-900 shrink-0">
          <img
            src={mainImage}
            alt={entry.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill and State tag */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-heritage-500 text-white shadow-sm">
                  {entry.category_name}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-charcoal-800">
                  {entry.language}
                </span>
                {entry.era_or_tradition_age && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white/90">
                    {entry.era_or_tradition_age}
                  </span>
                )}
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                {entry.title}
              </h2>
              <div className="flex items-center space-x-3 text-white/80 text-xs sm:text-sm mt-1">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-400" />
                  {entry.district_name}, {entry.state_name}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-heritage-400" />
                  {entry.creator_name} ({entry.creator_badge || 'Tradition Keeper'})
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => likeEntry(entry.id)}
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors"
                title="Like"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => toggleBookmark(entry.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                  isBookmarked
                    ? 'bg-heritage-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white hover:text-heritage-600'
                }`}
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-charcoal-900 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Share Toast */}
        {copiedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-growth-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg z-50 animate-bounce flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Audio Player Bar (If audio is present) */}
        {entry.audio_url && (
          <div className="bg-heritage-50 px-6 py-3.5 border-b border-heritage-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAudio}
                className="w-10 h-10 rounded-full bg-heritage-500 hover:bg-heritage-600 text-white flex items-center justify-center shadow-soft-glow transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <div>
                <p className="text-xs font-bold text-heritage-900">
                  {isPlaying ? 'Playing Audio Recording' : 'Listen to Oral Recording'}
                </p>
                <p className="text-[11px] text-heritage-700">
                  Captured by {entry.creator_name} • Duration: {entry.audio_duration || '3:45'}
                </p>
              </div>
            </div>

            {/* Sound Wave Animation Visualizer */}
            <div className="flex items-center space-x-1">
              {[20, 45, 80, 60, 95, 40, 70, 85, 30, 60, 90, 50, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-heritage-500 transition-all ${
                    isPlaying ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{ height: isPlaying ? `${h / 3}px` : '8px' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs inside Modal */}
        <div className="flex items-center space-x-1 px-6 border-b border-cream-200 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-heritage-500 text-heritage-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transcription')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'transcription'
                ? 'border-heritage-500 text-heritage-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>AI Transcription & Translation</span>
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'narrative'
                ? 'border-heritage-500 text-heritage-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-discovery-500" />
            <span>Anthropological Story</span>
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'gemini'
                ? 'border-discovery-500 text-discovery-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-discovery-500" />
            <span>Ask Gemini Archivist</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-bold text-base text-charcoal-900 mb-2">
                  Cultural Context & Summary
                </h3>
                <p className="text-sm text-charcoal-800 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              {entry.ai_content?.summary && (
                <div className="p-4 bg-discovery-50/60 rounded-2xl border border-discovery-100">
                  <div className="flex items-center space-x-2 text-discovery-600 font-semibold text-xs mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Cultural Summary</span>
                  </div>
                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    {entry.ai_content.summary}
                  </p>
                </div>
              )}

              {/* Tags Cloud */}
              {entry.ai_content?.tags && (
                <div>
                  <h4 className="text-xs font-bold text-charcoal-700 mb-2 uppercase tracking-wider">
                    Preservation Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.ai_content.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-cream-200 text-charcoal-800 hover:bg-cream-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRANSCRIPTION & TRANSLATION TAB */}
          {activeTab === 'transcription' && (
            <div className="space-y-6">
              {entry.ai_content ? (
                <>
                  <div className="p-4 bg-white rounded-2xl border border-cream-300">
                    <h4 className="font-heading font-bold text-xs text-heritage-600 uppercase tracking-wider mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Original Oral Voice / Script ({entry.language})
                    </h4>
                    <p className="text-sm text-charcoal-900 font-serif italic leading-relaxed p-3 bg-cream-100 rounded-xl">
                      "{entry.ai_content.transcript}"
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-cream-300">
                    <h4 className="font-heading font-bold text-xs text-discovery-600 uppercase tracking-wider mb-2 flex items-center">
                      <Languages className="w-4 h-4 mr-1.5" />
                      English Scholarly Translation
                    </h4>
                    <p className="text-sm text-charcoal-900 leading-relaxed p-3 bg-discovery-50/50 rounded-xl">
                      "{entry.ai_content.translation}"
                    </p>
                  </div>

                  {entry.ai_content.dialect_notes && (
                    <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block mb-1">
                        Dialect & Linguistic Acoustic Notes:
                      </span>
                      <p className="text-amber-800 leading-relaxed">
                        {entry.ai_content.dialect_notes}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-charcoal-700 text-sm">
                  AI transcription is currently being processed for this audio recording.
                </div>
              )}
            </div>
          )}

          {/* NARRATIVE TAB */}
          {activeTab === 'narrative' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-cream-300">
                <div className="flex items-center space-x-2 text-heritage-600 font-bold text-sm mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Deep Anthropological Narrative</span>
                </div>
                <p className="text-sm text-charcoal-800 leading-relaxed whitespace-pre-line">
                  {entry.ai_content?.generated_narrative || entry.description}
                </p>
              </div>

              {entry.ai_content?.cultural_significance && (
                <div className="p-4 bg-growth-50 rounded-2xl border border-growth-200">
                  <p className="text-xs font-bold text-growth-900 mb-1">
                    National & Intangible Cultural Significance:
                  </p>
                  <p className="text-xs text-growth-800 leading-relaxed">
                    {entry.ai_content.cultural_significance}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ASK GEMINI TAB */}
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <div className="p-3 bg-discovery-50 rounded-xl border border-discovery-200 text-xs text-discovery-800 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 shrink-0 text-discovery-600" />
                <span>
                  Ask questions about the history, musical metre, bards, or customs of "{entry.title}". Powered by Gemini AI.
                </span>
              </div>

              {/* Chat Log */}
              <div className="space-y-3 min-h-[160px]">
                {geminiAnswers.length === 0 && !isAskingGemini && (
                  <div className="text-center py-8 text-charcoal-700 text-xs italic">
                    Try asking: "What musical instruments accompany this?", "Why is this ritual performed?", or "Is this practice recognized by UNESCO?"
                  </div>
                )}

                {geminiAnswers.map((item, i) => (
                  <div key={i} className="space-y-2 text-xs">
                    <div className="p-3 bg-cream-200 rounded-xl text-charcoal-900 font-semibold max-w-[85%] ml-auto">
                      {item.q}
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-cream-300 text-charcoal-800 max-w-[90%] mr-auto shadow-sm leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                ))}

                {isAskingGemini && (
                  <div className="p-4 bg-white rounded-xl border border-cream-300 max-w-[90%] mr-auto shadow-sm flex items-center space-x-2 text-xs text-charcoal-700 animate-pulse">
                    <Sparkles className="w-4 h-4 text-discovery-500 animate-spin" />
                    <span>Gemini AI is analyzing oral heritage archives...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskGemini} className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="Ask a question about this tradition..."
                  value={geminiQuestion}
                  onChange={(e) => setGeminiQuestion(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-cream-300 rounded-xl focus:ring-2 focus:ring-discovery-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!geminiQuestion.trim() || isAskingGemini}
                  className="px-4 py-2.5 bg-discovery-500 hover:bg-discovery-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
