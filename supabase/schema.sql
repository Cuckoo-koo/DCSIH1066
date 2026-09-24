-- ==========================================================
-- BHARAT CULTURE ATLAS - DATABASE SCHEMA (Supabase / PostgreSQL)
-- ==========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'explorer' CHECK (role IN ('contributor', 'explorer', 'moderator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. States Table
CREATE TABLE IF NOT EXISTS public.states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    geojson_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Districts Table
CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#E07A1F',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Cultural Entries Table
CREATE TABLE IF NOT EXISTS public.cultural_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    state_id UUID REFERENCES public.states(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    audio_url TEXT,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Media Table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video')),
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AI Content Table
CREATE TABLE IF NOT EXISTS public.ai_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE UNIQUE,
    transcript TEXT,
    translation TEXT,
    summary TEXT,
    cultural_significance TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Reviews (Moderation Workflow) Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'needs_revision')),
    comments TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entry_id UUID REFERENCES public.cultural_entries(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, entry_id)
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Public can read approved entries and categories/states/districts
CREATE POLICY "Public entries are viewable by everyone" ON public.cultural_entries
    FOR SELECT USING (status = 'approved' OR auth.uid() = created_by);

CREATE POLICY "Users can create entries" ON public.cultural_entries
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Moderators can update any entry status" ON public.cultural_entries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('moderator', 'admin')
        )
    );

-- Seed Initial Categories
INSERT INTO public.categories (name, icon, description, color) VALUES
('Stories', 'BookOpen', 'Folk legends, village epics, oral narratives passed down by elders', '#E07A1F'),
('Songs', 'Music', 'Traditional ballads, harvest melodies, devotionals, and work chants', '#2563EB'),
('Crafts', 'Palette', 'Indigenous weaves, tribal pottery, sacred mural painting, metalwork', '#2E7D32'),
('Festivals', 'Sparkles', 'Village carnivals, sacred gatherings, harvest celebrations', '#D97706'),
('Food', 'UtensilsCrossed', 'Heritage culinary wisdom, seasonal fermentations, tribal gastronomy', '#DC2626'),
('Dialects', 'Languages', 'Endangered tongues, ancient idioms, folk poetry, whistled language', '#7C3AED'),
('Rituals', 'Flame', 'Sacred spirit dances, invocation ceremonies, healing rites', '#B45309')
ON CONFLICT (name) DO NOTHING;
