import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { CultureCard } from './components/CultureCard';
import { CultureDetailModal } from './components/CultureDetailModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { ContributionWizard } from './components/ContributionWizard';
import { ModerationDashboard } from './components/ModerationDashboard';
import { useAtlasStore } from './store/useAtlasStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'moderator' | 'bookmarks'>('explore');
  const { entries, filters, selectedEntryId, setSelectedEntry } = useAtlasStore();

  const filteredEntries = entries.filter(entry => {
    // Basic search filtering
    if (filters.searchQuery && !entry.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    // Category filtering
    if (filters.selectedCategory && entry.category_id !== filters.selectedCategory) return false;
    // State filtering
    if (filters.selectedState && entry.state_id !== filters.selectedState) return false;
    // District filtering
    if (filters.selectedDistrict && entry.district_name !== filters.selectedDistrict) return false;
    // Language filtering
    if (filters.selectedLanguage && !entry.language.includes(filters.selectedLanguage)) return false;
    // Status filtering (Moderator view)
    if (filters.selectedStatus !== 'all' && entry.status !== filters.selectedStatus) return false;

    return true;
  });

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  return (
    <div className="min-h-screen bg-cream-100 font-sans text-charcoal-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <AIAssistantDrawer />
      <ContributionWizard />

      {activeTab === 'explore' && (
        <main>
          <HeroSection
            onExploreMap={() => setActiveTab('map')}
            onExploreDirectory={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SearchAndFilterBar />

            {/* Entry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEntries.map(entry => (
                <CultureCard
                  key={entry.id}
                  entry={entry}
                  onOpenDetail={setSelectedEntry}
                />
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-cream-300">
                <p className="text-charcoal-700 font-medium">No cultural traditions match these filters.</p>
                <button onClick={() => useAtlasStore.getState().resetFilters()} className="mt-4 text-heritage-600 font-semibold underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {activeTab === 'map' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InteractiveMap
            entries={entries}
            onSelectEntry={setSelectedEntry}
          />
        </main>
      )}

      {activeTab === 'moderator' && (
        <main>
            <ModerationDashboard />
        </main>
      )}

      {/* Entry Detail Overlay */}
      {selectedEntry && (
        <CultureDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
