import React, { useState } from 'react';
import {
  Compass,
  BookMarked,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  User,
  Menu,
  X,
  Search,
  Globe2
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'map' | 'moderator' | 'bookmarks';
  setActiveTab: (tab: 'explore' | 'map' | 'moderator' | 'bookmarks') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    handleLogin,
    handleLogout,
    bookmarks,
    toggleContributeModal,
    toggleAIAssistant,
    filters,
    setFilters
  } = useAtlasStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingCount = useAtlasStore(state => state.entries.filter(e => e.status === 'pending').length);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'explorer', label: 'Cultural Explorer', desc: 'Browse, listen, bookmark, ask AI' },
    { role: 'contributor', label: 'Village Elder / Contributor', desc: 'Record oral stories & folk songs' },
    { role: 'moderator', label: 'Archival Moderator', desc: 'Review, fact-check & publish' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-md border-b border-cream-300 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Tagline */}
          <div
            onClick={() => setActiveTab('explore')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-heritage-500 to-heritage-600 flex items-center justify-center text-white shadow-soft-glow group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-xl tracking-tight text-charcoal-900 group-hover:text-heritage-600 transition-colors">
                  Bharat Culture Atlas
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-heritage-100 text-heritage-700 border border-heritage-200">
                  सत्यमेव जयते
                </span>
              </div>
              <p className="text-xs text-charcoal-700 hidden sm:block font-medium">
                Preserving Voices, Connecting Generations
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search oral epics, dialects, songs..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-xs bg-cream-50 border border-cream-300 rounded-full focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:border-transparent transition-all placeholder-charcoal-700/60"
              />
              <Search className="w-4 h-4 text-charcoal-700/60 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'text-heritage-600 bg-heritage-50 font-semibold'
                  : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200/50'
              }`}
            >
              Atlas Repository
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'map'
                  ? 'text-heritage-600 bg-heritage-50 font-semibold'
                  : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200/50'
              }`}
            >
              <Globe2 className="w-4 h-4 text-heritage-500" />
              <span>India Map</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => toggleAIAssistant(true)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-discovery-500 hover:bg-discovery-50 transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-discovery-500" />
              <span>Gemini AI Archivist</span>
            </button>

            {/* Moderation Link (Badge with count) */}
            <button
              onClick={() => setActiveTab('moderator')}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'moderator'
                  ? 'text-heritage-600 bg-heritage-50 font-semibold'
                  : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-growth-500" />
              <span>Moderation Queue</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-heritage-500 text-white text-[11px] font-bold rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Bookmarks */}
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`relative p-2 rounded-lg text-charcoal-700 hover:bg-cream-200/50 transition-colors ${
                activeTab === 'bookmarks' ? 'text-heritage-600 bg-heritage-50' : ''
              }`}
              title="Saved Traditions"
            >
              <BookMarked className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-heritage-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
          </nav>

          {/* Actions: Persona Switcher & Contribute Button */}
          <div className="flex items-center space-x-3">

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-cream-300 bg-cream-50 hover:bg-cream-200/60 transition-colors text-xs font-medium text-charcoal-800"
              >
                <User className="w-3.5 h-3.5 text-heritage-600" />
                <span className="max-w-[100px] truncate">{currentUser?.name || 'Explorer'}</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-cream-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-cream-200">
                    <p className="text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider">
                      Switch Role (Testing Persona)
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        handleLogin(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-heritage-50 transition-colors ${
                        currentUser?.role === r.role ? 'bg-heritage-50/80 font-semibold text-heritage-700' : 'text-charcoal-800'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="text-[10px] text-charcoal-700 font-normal">{r.desc}</span>
                    </button>
                  ))}
                  <div className="border-t border-cream-200 mt-1 pt-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contribute Story CTA Button (Heritage Orange Glow, Scale 1.05 hover as per UI spec) */}
            <button
              onClick={() => toggleContributeModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-heritage-500 hover:bg-heritage-600 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-soft-glow hover:shadow-orange-glow transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Record Oral Story</span>
              <span className="sm:hidden">Record</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-cream-200/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50 px-4 py-3 space-y-2">
          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-cream-200"
          >
            Atlas Repository
          </button>
          <button
            onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-cream-200"
          >
            Interactive India Map
          </button>
          <button
            onClick={() => { setActiveTab('moderator'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-cream-200"
          >
            Moderation Queue ({pendingCount} pending)
          </button>
          <button
            onClick={() => { setActiveTab('bookmarks'); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-cream-200"
          >
            Saved Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => { toggleAIAssistant(true); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-discovery-600 bg-discovery-50"
          >
            ✨ Ask Gemini AI Archivist
          </button>
        </div>
      )}
    </header>
  );
};
