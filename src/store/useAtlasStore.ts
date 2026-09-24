import { create } from 'zustand';
import { CulturalEntry, FilterState, User, UserRole, Review } from '../types';
import { INITIAL_ENTRIES } from '../data/mockEntries';

interface AtlasStore {
  currentUser: User | null;
  entries: CulturalEntry[];
  bookmarks: string[];
  filters: FilterState;
  selectedState: string | null;
  selectedDistrict: string | null;
  selectedEntryId: string | null;
  isContributeModalOpen: boolean;
  isAIAssistantOpen: boolean;

  // Actions
  handleLogin: (role: UserRole) => void;
  handleLogout: () => void;

  setFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;

  setSelectedState: (stateId: string | null) => void;
  setSelectedDistrict: (districtId: string | null) => void;
  setSelectedEntry: (entryId: string | null) => void;

  toggleContributeModal: (isOpen?: boolean) => void;
  toggleAIAssistant: (isOpen?: boolean) => void;

  addEntry: (entry: Omit<CulturalEntry, 'id' | 'likes_count' | 'views_count' | 'created_at'>) => void;
  updateEntryStatus: (id: string, status: CulturalEntry['status'], reviewBlock?: Review) => void;
  toggleBookmark: (entryId: string) => void;
  likeEntry: (entryId: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedCategory: null,
  selectedState: null,
  selectedDistrict: null,
  selectedLanguage: null,
  selectedStatus: 'all',
  sortBy: 'latest',
  selectedRegion: null,
};

// Create some default users for testing
const MOCK_USERS: Record<UserRole, User> = {
  explorer: { id: 'usr-1', name: 'Cultural Explorer', email: 'explorer@bharat.dev', role: 'explorer', created_at: new Date().toISOString() },
  contributor: { id: 'usr-2', name: 'Village Elder', email: 'elder@bharat.dev', role: 'contributor', created_at: new Date().toISOString(), contributions_count: 12 },
  moderator: { id: 'usr-3', name: 'Dr. Archival Scholar', email: 'mod@bharat.dev', role: 'moderator', created_at: new Date().toISOString() },
  admin: { id: 'usr-4', name: 'Ministry Admin', email: 'admin@bharat.dev', role: 'admin', created_at: new Date().toISOString() },
};

export const useAtlasStore = create<AtlasStore>((set, get) => ({
  // Load from local storage for persistence across reloads during dev/testing
  currentUser: JSON.parse(localStorage.getItem('bca_user') || 'null') || MOCK_USERS.explorer,
  entries: JSON.parse(localStorage.getItem('bca_entries') || 'null') || INITIAL_ENTRIES,
  bookmarks: JSON.parse(localStorage.getItem('bca_bookmarks') || '[]'),

  filters: defaultFilters,
  selectedState: null,
  selectedDistrict: null,
  selectedEntryId: null,
  isContributeModalOpen: false,
  isAIAssistantOpen: false,

  handleLogin: (role) => {
    const user = MOCK_USERS[role];
    localStorage.setItem('bca_user', JSON.stringify(user));
    set({ currentUser: user });
  },

  handleLogout: () => {
    localStorage.removeItem('bca_user');
    set({ currentUser: null });
  },

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: defaultFilters }),

  setSelectedState: (stateId) => set({ selectedState: stateId, selectedDistrict: null }),
  setSelectedDistrict: (districtId) => set({ selectedDistrict: districtId }),
  setSelectedEntry: (entryId) => set({ selectedEntryId: entryId }),

  toggleContributeModal: (isOpen) => set((state) => ({
    isContributeModalOpen: isOpen !== undefined ? isOpen : !state.isContributeModalOpen
  })),

  toggleAIAssistant: (isOpen) => set((state) => ({
    isAIAssistantOpen: isOpen !== undefined ? isOpen : !state.isAIAssistantOpen
  })),

  addEntry: (entryPayload) => set((state) => {
    const newEntry: CulturalEntry = {
      ...entryPayload,
      id: `entry-${Date.now()}`,
      likes_count: 0,
      views_count: 0,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...state.entries];
    localStorage.setItem('bca_entries', JSON.stringify(updated));
    return { entries: updated, isContributeModalOpen: false };
  }),

  updateEntryStatus: (id, status, reviewBlock) => set((state) => {
    const updated = state.entries.map(e => {
      if (e.id !== id) return e;
      return {
        ...e,
        status,
        reviews: reviewBlock ? [...(e.reviews || []), reviewBlock] : e.reviews
      };
    });
    localStorage.setItem('bca_entries', JSON.stringify(updated));
    return { entries: updated };
  }),

  toggleBookmark: (entryId) => set((state) => {
    const isBookmarked = state.bookmarks.includes(entryId);
    const updated = isBookmarked
      ? state.bookmarks.filter(id => id !== entryId)
      : [...state.bookmarks, entryId];
    localStorage.setItem('bca_bookmarks', JSON.stringify(updated));
    return { bookmarks: updated };
  }),

  likeEntry: (entryId) => set((state) => {
    const updated = state.entries.map(e =>
      e.id === entryId ? { ...e, likes_count: e.likes_count + 1 } : e
    );
    localStorage.setItem('bca_entries', JSON.stringify(updated));
    return { entries: updated };
  }),
}));
