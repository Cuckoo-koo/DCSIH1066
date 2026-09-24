export type UserRole = 'contributor' | 'explorer' | 'moderator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  contributions_count?: number;
}

export type EntryStatus = 'pending' | 'reviewed' | 'approved' | 'rejected';

export type MediaType = 'image' | 'audio' | 'video';

export interface Media {
  id: string;
  entry_id?: string;
  url: string;
  type: MediaType;
  caption?: string;
}

export interface AIContent {
  transcript: string;
  translation: string;
  summary: string;
  tags: string[];
  cultural_significance?: string;
  dialect_notes?: string;
  generated_narrative?: string;
  confidence_score?: number;
}

export interface Review {
  id: string;
  entry_id: string;
  reviewer_id: string;
  reviewer_name: string;
  status: 'approved' | 'rejected' | 'needs_revision';
  comments: string;
  reviewed_at: string;
}

export interface CulturalEntry {
  id: string;
  title: string;
  description: string;
  language: string;
  state_id: string;
  state_name: string;
  district_name: string;
  district_id?: string;
  category_id: string;
  category_name: string;
  created_by: string;
  creator_name: string;
  creator_avatar?: string;
  creator_badge?: string; // e.g., 'Village Elder', 'Folklorist', 'Heritage Archivist'
  status: EntryStatus;
  audio_url?: string;
  audio_duration?: string;
  audio_waveform?: number[];
  likes_count: number;
  views_count: number;
  created_at: string;
  media: Media[];
  ai_content?: AIContent;
  reviews?: Review[];
  latitude: number;
  longitude: number;
  era_or_tradition_age?: string;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  entry_count?: number;
}

export interface StateData {
  id: string;
  name: string;
  code: string;
  capital: string;
  region: 'North' | 'South' | 'East' | 'West' | 'NorthEast' | 'Central';
  coordinates: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
  highlights: string[];
  traditions_count: number;
  districts: string[];
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedState: string | null;
  selectedDistrict: string | null;
  selectedLanguage: string | null;
  selectedStatus: EntryStatus | 'all';
  sortBy: 'latest' | 'popular' | 'title';
  selectedRegion: string | null;
}

export interface AIProcessRequest {
  audioBlob?: Blob;
  audioUrl?: string;
  rawText: string;
  title: string;
  state: string;
  district: string;
  category: string;
  language: string;
}

export interface AIProcessResponse {
  transcript: string;
  translation: string;
  summary: string;
  tags: string[];
  cultural_significance: string;
  generated_narrative: string;
  dialect_notes: string;
}
