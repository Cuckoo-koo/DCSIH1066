import React, { useState, useEffect } from 'react';
import {
  Compass,
  Mic,
  Headphones,
  Globe2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';

interface HeroSectionProps {
  onExploreMap: () => void;
  onExploreDirectory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreMap, onExploreDirectory }) => {
  const { toggleContributeModal, toggleAIAssistant } = useAtlasStore();

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Preserving Voices, Connecting Generations.';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-cream-200/60 via-cream-100 to-cream-100 py-16 sm:py-24 border-b border-cream-300">

      {/* Floating Cultural Background Ornaments */}
      <div className="absolute top-10 left-8 sm:left-20 opacity-20 hover:opacity-40 transition-opacity pointer-events-none animate-float-slow">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-heritage-500 flex items-center justify-center">
          <span className="font-serif text-3xl text-heritage-600">ॐ</span>
        </div>
      </div>

      <div className="absolute top-16 right-10 sm:right-28 opacity-20 hover:opacity-40 transition-opacity pointer-events-none animate-float-delayed">
        <div className="w-28 h-28 rounded-full border border-growth-500/50 flex items-center justify-center p-4">
          <Sparkles className="w-12 h-12 text-growth-600" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">

          {/* National Digital Repository Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-100/90 border border-heritage-300 text-heritage-800 text-xs font-semibold mb-6 shadow-sm">
            <Award className="w-3.5 h-3.5 text-heritage-600" />
            <span>India\'s National Community Oral Heritage Repository</span>
            <span className="w-1.5 h-1.5 rounded-full bg-heritage-500 animate-ping"></span>
          </div>

          {/* Main Title with Poppins Typography */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-charcoal-900 tracking-tight leading-tight sm:leading-none">
            Bharat Culture Atlas
          </h1>

          {/* Typewriter Subheading with Heritage Color Accent */}
          <div className="h-10 sm:h-12 mt-4 flex items-center justify-center">
            <p className="text-xl sm:text-2xl font-medium text-heritage-600 font-serif italic">
              "{displayedText}"
              <span className="inline-block w-0.5 h-6 bg-heritage-500 ml-1 animate-pulse"></span>
            </p>
          </div>

          {/* Descriptive Copy */}
          <p className="mt-4 text-base sm:text-lg text-charcoal-700 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of undocumented folk songs, sacred rituals, whistled dialects, and indigenous village lore recorded directly by tradition custodians across all 28 States and 8 Union Territories.
          </p>

          {/* Action CTAs: Orange Glow, Scale hover */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreMap}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-heritage-500 hover:bg-heritage-600 active:scale-95 text-white font-semibold text-sm shadow-warm hover:shadow-orange-glow transition-all duration-200"
            >
              <Globe2 className="w-4 h-4" />
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => toggleContributeModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-cream-50 active:scale-95 text-charcoal-900 font-semibold text-sm border border-cream-300 shadow-sm hover:border-heritage-400 transition-all duration-200"
            >
              <Mic className="w-4 h-4 text-heritage-500" />
              <span>Record Oral Tradition</span>
            </button>

            <button
              onClick={() => toggleAIAssistant(true)}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-discovery-50 hover:bg-discovery-100 text-discovery-600 font-semibold text-sm border border-discovery-200 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-discovery-500" />
              <span>Ask Gemini AI Archivist</span>
            </button>
          </div>

          {/* Metrics & Impact Counters */}
          <div className="mt-14 pt-10 border-t border-cream-300/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 bg-white/70 rounded-xl border border-cream-300/50 shadow-sm backdrop-blur-xs hover:border-heritage-300 transition-all">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-heritage-600">10,000+</p>
              <p className="text-xs text-charcoal-700 font-medium mt-1">Oral Traditions Preserved</p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-cream-300/50 shadow-sm backdrop-blur-xs hover:border-discovery-300 transition-all">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-discovery-500">28 States</p>
              <p className="text-xs text-charcoal-700 font-medium mt-1">& 8 Union Territories</p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-cream-300/50 shadow-sm backdrop-blur-xs hover:border-growth-300 transition-all">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-growth-500">500+ Districts</p>
              <p className="text-xs text-charcoal-700 font-medium mt-1">Indigenous Regions</p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-cream-300/50 shadow-sm backdrop-blur-xs hover:border-heritage-300 transition-all">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-charcoal-800">45+ Dialects</p>
              <p className="text-xs text-charcoal-700 font-medium mt-1">AI Transcribed & Translated</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
