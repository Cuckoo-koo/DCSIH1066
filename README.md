# 🏛️ Bharat Culture Atlas (भारत संस्कृति कोष्ठ)
> *"Preserving Voices, Connecting Generations."*

An interactive, community-powered digital repository dedicated to preserving India’s intangible heritage — oral traditions, folk songs, endangered dialects, sacred rituals, and indigenous knowledge across 28 States and 8 Union Territories with Google Gemini AI and React Leaflet maps.

---

## 🌟 Key Features & Implementation
- **🗺️ Interactive India Map Exploration (React Leaflet & GeoJSON):** Zoom into states and districts to discover localized cultural traditions, oral ballads, and sacred sites.
- **🎙️ Voice & Oral Recording Studio:** Direct in-browser microphone capture preserving authentic acoustic nuance, intonation, and regional dialects.
- **✨ Google Gemini AI Engine Integration:**
  - Speech-to-Text & Dialect Transcription.
  - Faithful English translation.
  - Anthropological cultural significance narrative generation.
  - Auto-tagging & UNESCO Intangible Cultural Heritage classification.
  - **Gemini AI Cultural Archivist Chatbot** for interactive querying.
- **🛡️ 3-Tier Archival Moderation Workflow:** Structured state machine (`Pending` ➔ `Reviewed` ➔ `Approved` ➔ `Live`) with moderation feedback tools.
- **🎨 Heritage Design System:** Built with Tailwind CSS following Heritage Orange (`#E07A1F`), Trust Blue (`#2563EB`), Growth Green (`#2E7D32`), Warm Cream background (`#FAF8F3`), Poppins typography, and golden-ratio cards.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Install Dependencies
```bash
cd bharat-culture-atlas
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```
*(Note: If keys are omitted during local preview, the application automatically runs in rich high-fidelity simulation mode).*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)
The PostgreSQL schema with Row Level Security (RLS) policies and 9 core relational entities is located in:
📂 `supabase/schema.sql`

To deploy to Supabase:
1. Open your Supabase SQL Editor.
2. Paste and run `supabase/schema.sql`.
3. Create a public storage bucket named `cultural-media`.

---

## 🏗️ Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide React, Framer Motion
- **State Management:** Zustand
- **Mapping:** React Leaflet, OpenStreetMap
- **AI Backend:** Google Gemini API (`@google/genai`)
- **Database & Auth:** Supabase (PostgreSQL, Storage, RLS)
- **Deployment:** Vercel

---
*Co-Authored-By: Claude Code <noreply@anthropic.com>*
