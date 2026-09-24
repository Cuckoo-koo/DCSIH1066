import React from 'react';
import {
  Filter,
  RotateCcw,
  Sparkles,
  BookOpen,
  Music,
  Palette,
  UtensilsCrossed,
  Languages,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { INDIAN_STATES, CATEGORIES_LIST } from '../data/indiaGeoData';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'BookOpen': <BookOpen className="w-3.5 h-3.5" />,
  'Music': <Music className="w-3.5 h-3.5" />,
  'Palette': <Palette className="w-3.5 h-3.5" />,
  'Sparkles': <Sparkles className="w-3.5 h-3.5" />,
  'Utensils': <UtensilsCrossed className="w-3.5 h-3.5" />,
  'Languages': <Languages className="w-3.5 h-3.5" />,
  'Flame': <Flame className="w-3.5 h-3.5" />,
};

export const SearchAndFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useAtlasStore();

  const selectedStateObj = INDIAN_STATES.find(s => s.id === filters.selectedState);
  const districtList = selectedStateObj ? selectedStateObj.districts : [];

  const languagesList = [
    'Bengali',
    'Malayalam',
    'Assamese',
    'Khasi',
    'Rajasthani',
    'Gondi',
    'Ladakhi',
    'Kannada',
    'Tamil',
    'Odia',
    'Punjabi',
    'Maithili',
    'Pahari',
    'Kashmiri'
  ];

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.selectedCategory ||
    filters.selectedState ||
    filters.selectedDistrict ||
    filters.selectedLanguage ||
    filters.sortBy !== 'latest'
  );

  return (
    <div className="bg-white rounded-2xl border border-cream-300 shadow-sm p-4 sm:p-5 mb-8">
      {/* Category Horizontal Pill Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none border-b border-cream-200">
        <button
          onClick={() => setFilters({ selectedCategory: null })}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filters.selectedCategory === null
              ? 'bg-heritage-500 text-white shadow-soft-glow'
              : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
          }`}
        >
          <span>All Traditions</span>
        </button>

        {CATEGORIES_LIST.map((cat) => {
          const isSelected = filters.selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters({ selectedCategory: isSelected ? null : cat.id })}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-heritage-500 text-white shadow-soft-glow font-semibold'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {CATEGORY_ICONS[cat.icon]}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {/* State Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">State / UT</label>
          <select
            value={filters.selectedState || ''}
            onChange={(e) => setFilters({ selectedState: e.target.value || null, selectedDistrict: null })}
            className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg text-charcoal-900 focus:ring-2 focus:ring-heritage-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All States & UTs</option>
            {INDIAN_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.region})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-charcoal-700 absolute right-3 bottom-2.5 pointer-events-none" />
        </div>

        {/* District Dropdown (Dynamic based on selected state) */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">District</label>
          <select
            disabled={!selectedStateObj}
            value={filters.selectedDistrict || ''}
            onChange={(e) => setFilters({ selectedDistrict: e.target.value || null })}
            className={`w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg text-charcoal-900 focus:ring-2 focus:ring-heritage-500 focus:outline-none appearance-none cursor-pointer ${
              !selectedStateObj ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">{selectedStateObj ? 'All Districts' : 'Select State First'}</option>
            {districtList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-charcoal-700 absolute right-3 bottom-2.5 pointer-events-none" />
        </div>

        {/* Language / Dialect Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">Language / Dialect</label>
          <select
            value={filters.selectedLanguage || ''}
            onChange={(e) => setFilters({ selectedLanguage: e.target.value || null })}
            className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg text-charcoal-900 focus:ring-2 focus:ring-heritage-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All Languages</option>
            {languagesList.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-charcoal-700 absolute right-3 bottom-2.5 pointer-events-none" />
        </div>

        {/* Sort Order */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg text-charcoal-900 focus:ring-2 focus:ring-heritage-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="latest">Most Recently Preserved</option>
            <option value="popular">Most Listened & Viewed</option>
            <option value="title">Alphabetical (A - Z)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-charcoal-700 absolute right-3 bottom-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Active Filter Tags & Reset */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
          <span className="text-charcoal-700 font-medium">
            Active filters applied
          </span>
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-1 text-heritage-600 hover:text-heritage-700 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
