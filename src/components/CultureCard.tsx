import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  Play,
  Pause,
  MapPin,
  Sparkles,
  Volume2,
  Share2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CulturalEntry } from '../types';
import { useAtlasStore } from '../store/useAtlasStore';

interface CultureCardProps {
  entry: CulturalEntry;
  onOpenDetail: (entry: CulturalEntry) => void;
}

export const CultureCard: React.FC<CultureCardProps> = ({ entry, onOpenDetail }) => {
  const { bookmarks, toggleBookmark, likeEntry } = useAtlasStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const isBookmarked = bookmarks.includes(entry.id);

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!entry.audio_url) return;

    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      if (audioElement) {
        audioElement.play();
        setIsPlayingAudio(true);
      } else {
        const audio = new Audio(entry.audio_url);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
        setAudioElement(audio);
        setIsPlayingAudio(true);
      }
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(entry.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeEntry(entry.id);
  };

  const mainImage = entry.media?.find(m => m.type === 'image')?.url ||
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => onOpenDetail(entry)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover cursor-pointer w-full max-w-[340px] mx-auto min-h-[440px]"
    >
      {/* 40% Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-cream-200">
        <img
          src={mainImage}
          alt={entry.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />

        {/* Top Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-heritage-700 shadow-sm backdrop-blur-xs">
            {entry.category_name}
          </span>
        </div>

        {/* Top Right Action (Bookmark) */}
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform duration-200 active:scale-90 ${
            isBookmarked
              ? 'bg-heritage-500 text-white shadow-soft-glow'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tradition'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Audio Playback Pill on Bottom of Image */}
        {entry.audio_url && (
          <button
            onClick={handleAudioToggle}
            className={`absolute bottom-3 left-3 flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all ${
              isPlayingAudio
                ? 'bg-heritage-500 text-white shadow-orange-glow animate-pulse'
                : 'bg-white/90 text-charcoal-900 hover:bg-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current text-white" />
                <span>Playing Audio</span>
                <div className="flex items-center space-x-0.5 ml-1">
                  <span className="w-1 bg-white animate-wave-1 rounded-full"></span>
                  <span className="w-1 bg-white animate-wave-2 rounded-full"></span>
                  <span className="w-1 bg-white animate-wave-3 rounded-full"></span>
                </div>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-heritage-600" />
                <span>{entry.audio_duration || 'Listen Audio'}</span>
              </>
            )}
          </button>
        )}

        {/* Language Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-white/90 backdrop-blur-xs">
            {entry.language.split('(')[0]}
          </span>
        </div>
      </div>

      {/* 60% Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Location & Era */}
          <div className="flex items-center justify-between text-xs text-charcoal-700 mb-2 font-medium">
            <div className="flex items-center space-x-1 text-heritage-600">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{entry.district_name}, {entry.state_name}</span>
            </div>
            {entry.era_or_tradition_age && (
              <span className="text-[10px] text-charcoal-700/80 italic shrink-0">
                {entry.era_or_tradition_age}
              </span>
            )}
          </div>

          {/* Title with Poppins Typography */}
          <h3 className="font-heading font-bold text-base text-charcoal-900 line-clamp-2 group-hover:text-heritage-600 transition-colors leading-snug">
            {entry.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-charcoal-700 line-clamp-3 leading-relaxed">
            {entry.description}
          </p>

          {/* AI Enhancement Pill */}
          {entry.ai_content && (
            <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-discovery-600 font-medium bg-discovery-50 px-2.5 py-1 rounded-lg border border-discovery-100">
              <Sparkles className="w-3 h-3 text-discovery-500 shrink-0" />
              <span className="truncate">AI Transcribed & Translated in English</span>
            </div>
          )}
        </div>

        {/* Card Footer: Creator profile & Likes */}
        <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={entry.creator_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={entry.creator_name}
              className="w-6 h-6 rounded-full object-cover border border-cream-300"
            />
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-charcoal-800 truncate max-w-[120px]">{entry.creator_name}</p>
              <p className="text-[9px] text-charcoal-700 truncate">{entry.creator_badge || 'Contributor'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-charcoal-700">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-xs hover:text-red-500 transition-colors group/heart"
            >
              <Heart className="w-3.5 h-3.5 group-hover/heart:scale-125 transition-transform text-charcoal-700 group-hover/heart:text-red-500" />
              <span>{entry.likes_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
