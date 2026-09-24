import { GoogleGenerativeAI } from "@google/genai";
import { AIProcessRequest, AIProcessResponse, CulturalEntry } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const isGeminiConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key');

const genAI = isGeminiConfigured ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }) : null;

// Mock Indian Language Translations / Dict / Cultural Phrases for simulation logic below
const MOCK_DATA: Record<string, string[]> = {
  transcripts: [
    'തോറ്റം പാട്ട്: ആദിയിൽ ഈ ഭൂമി കടലായ് കിടക്കവേ...',
    'খাঁচার ভিতর অচিন পাখি কেমনে আসে যায়...',
    'গাভো গাভো রে ভোপা জি, देवनारायण भगवान री अमर कथा...',
    'আই ঐ, মোক নিচিঙिবা পাত, মইহে তেজীমলা তোমাৰ মৰমৰ কন্যা...',
    '[Whistled Cadence: Mother\'s song calling child home]',
    'বড়াदेव के कृपा से महुआ के छाँव में राजा के जनम भइल...'
  ],
  translations: [
    'Theyyam Invocation of Creation: The God Muthappan emerges from primal fire...',
    'Understanding the unknowable bird within the mortal cage of the body...',
    'Bhopa sings of Lord Devnarayan riding his green steed across desert sands...',
    'Mother, pluck not my tender lotus leaves, I am your reborn child Tejimola...',
    'High pitch whistle echoing across the Khasi valley, melodic identifier of infant\'s call...',
    'Bana strings resonate with spirits of ancestors as Pardhan bards recount 30-generations genealogies...'
  ],
  narratives: [
    'The 1500-yearThey practiced performance by living village communities in North Kerala is not merely spiritual theatre but also an essential system of social justice where marginalized bards become the living oracle deities passing counsel and blessing down upon all villagers regardless of caste.',
    'Baul spiritual mysticism, recognized by UNESCO World Heritage in 2005, rejected traditional caste and religious sectarianism through spontaneous nomadic musical balladry exploring internal love for the Maner Manush Divine Person within.',
    'Phad scrolls act as portable night temples where Rajasthani Bhopa priest-singers recite full 30-night ancient epics of the pastoral hero gods on hand-painted vegetable-dyed canvases, preserving ancient Mewari warrior values.',
    'This whistles language in Kongthong Meghalaya, known as Jingrwai Iawbei, is tied to ancient matrilineal kinship loops where mothers compose unique lifetime melodies for newborns, acoustic adaptation enabling high communication within deep canyon valley ecosystems.',
    'The Bana instrument made of goatskin is used by Gond history keepers to recount cosmological origin stories and clan genealogies essential for maintaining indigenous tribal eco-guardian identities in central Indian deciduous forests.'
  ],
  cultural_significance: [
    'Pre-Vedic Dravidian spirit propitiation, matrilineal lineage devotion, and organic dye alchemy.',
    'Bridges Sufi Islamic thought and Hindu Vaishnava devotion through non-dualistic humanism.',
    'Preserves oral genealogical methodology, ancient Mewari military code, and nomadic bards culture.',
    'Unique acoustic ecology adaptation nomination for UNESCO Intangible Cultural Heritage list.'
  ]
};

/**
 * Intelligent AI processing logic with real Gemini API call OR realistic mock simulation!
 */
export async function processHeritageEntry(payload: AIProcessRequest): Promise<AIProcessResponse> {
  const { title, rawText, state, district, category, language } = payload;
  console.log(`[Google Gemini Engine]: Simulating processing for "${title}" from ${state}, language ${language} in "intense-preservation-mode" with high fidelity fallback...`);

  // Simple prompt definition for real Gemini query construction
  const culturalPrompt = `You are a specialized Cultural Heritage preservation artificial intelligence agent called "Gemini Bharat Culture Engine™". Analyze this raw submission for India\'s National Digital Repository: Title: "${title}", Category: "${category}", Origin State: "${state}" (${district} District), Native language of tradition: "${language}".
Raw text snippet from bards / elders : """${rawText}""". Write a report: 1. Generate faithful English translation. 2. A profound 150-word deep cultural narrative of this tradition and its anthropological ecosystem. 3. Detailed cultural significance. 4. A list of exactly 8 relevant cultural classification tags (e.g. #OralTradition, #IntangibleHeritage, #Bilingual, #UNESCO, #EcoGuardianism, name of specific dialect, specific instrument). 5. Notes on how the dialect sounds - rhythmic metre or specific intonation. If you don\'t have a real API key, generate a realistic high-quality simulation anchored in existing cultural knowledge of this Indian region and category.`;

  // ————————————————————————————————————————————————————————
  // Attempt Real Gemini API Call (if configured and online!)
  // ————————————————————————————————————————————————————————
  if (isGeminiConfigured) {
    try {
      if (model) {
        const result = await model.generateContent(culturalPrompt);
        const responseText = result.response.text();
        console.log('[Google Gemini Engine]: Real API response received.', responseText);

        // Attempting to parse the text with realistic robust fallbacks.
        const sections = responseText.split('#'); // Fallback structure splitters used in prompt
        return {
          transcript: rawText,
          translation: result.response.text().split('translation:')[1]?.split('narrative:')[0]?.trim() || result.response.text().split(':')[1]?.trim() || MOCK_DATA.translations[0],
          summary: result.response.text().split('summary:')[1]?.split('significance:')[0]?.trim() || MOCK_DATA.narratives[0].substring(0, 150),
          generated_narrative: result.response.text().split('narrative:')[1]?.split('significance:')[0]?.trim() || result.response.text().split('cultural narrative:')[1]?.split('significant:')[0]?.trim() || MOCK_DATA.narratives[0],
          cultural_significance: result.response.text().split('significance:')[1]?.split('tags:')[0]?.trim() || MOCK_DATA.cultural_significance[0],
          tags: result.response.text().split('tags:')[1]?.trim()?.split(/\s+/) || ['#OralTradition', '#IntangibleHeritage', `#${category}`, `#${state}`],
          dialect_notes: result.response.text().split('intone:')[1]?.split('note:')[0]?.trim() || result.response.text().split('metre:')[1]?.split('resonance:')[0]?.trim() || 'Rhythmic ballad verse metre suited for high acoustic resonance suited for open desert night air.'
        };
      }
    } catch (realApiError) {
      console.warn('[Google Gemini Engine] Real API call failed. Activating intelligent high-fidelity fallback simulation standard.', realApiError);
    }
  }

  // ————————————————————————————————————————————————————————
  // High-Fidelity Gemini Fallback Simulation Logic standard (PRD specified: loading skeletons always, never blank screen)
  // ————————————————————————————————————————————————————————
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find matching index in MOCK_DATA based on sample entry titles
      const matchIndex = MOCK_DATA.transcripts.findIndex(t => t.includes(language)) || 0;
      const index = Math.max(0, matchIndex);

      resolve({
        transcript: rawText,
        translation: MOCK_DATA.translations[index],
        summary: MOCK_DATA.narratives[index].substring(0, 150) + "...",
        generated_narrative: MOCK_DATA.narratives[index],
        cultural_significance: MOCK_DATA.cultural_significance[index],
        tags: ['#OralTradition', '#IntangibleHeritage', `#${category}`, `#${state}`, `#Bilingual`, '#HeritageDigitalRepository', `#${language}`, '#UNESCOIntangibleMasterpiece'],
        dialect_notes: 'Spoken in specialized ancient ballad verse metre (Gatha / Doha / Metre) requiring specialized deep breathe chanting and high resonance suitable for open desert night air communication between groups up to 1km distance.'
      });
    }, 3800); // UI DESIGN: Skeleton Screen / Loading always visible, matching loading design guidelines.
  });
}

/**
 * AI Assistant Chatbot Question Handling (Gemini Chat simulation/loop)
 */
export async function askGeminiCulturalAssistant(userQuery: string, contextEntries: CulturalEntry[]): Promise<string> {
  const heritagePromptStr = `You are a scholarly and compassionate AI Heritage Cultural Assistant chatbot for "Bharat Culture Atlas ™". Explore the depths of Indian cultural heritage, folk tales, oral traditions, languages and indigenous knowledge. I will give you a list of authentic cultural entries recently digitally preserved by village elders in our database: ${contextEntries.map(e => `[Entry "${e.title}" from ${e.state_name}: ${e.description.substring(0, 100)}...]`).join(', ')}. Use this specific knowledge about these existing heritage records to answer the user inquiry accurately and citationally where possible (cite specifically an entry's title). Explain deep cultural meaning but try not to generate brand new fictitious tales unless explicitly asked for a creative narration. User inquiry: """${userQuery}""". Provide respectful, bilingual or regional language responses standard procedure.`;

  if (isGeminiConfigured && model) {
    try {
      const chat = model.startChat({ history: [] }); // Simple chat for a single turn with full context prompt
      const result = await chat.sendMessage(heritagePromptStr);
      return result.response.text();
    } catch (e) { console.error('AI chat failed:', e); }
  }

  // Realistic Intelligent fallback responses matching cultural scope
  return new Promise((resolve) => setTimeout(() => {
    const q = userQuery.toLowerCase();
    if (q.includes('folk tale') || q.includes('story')) resolve(`Greetings! Discover "Burhi Aair Xadhu" (Grandmother's Tales) of Majuli, Assam — specifically the beloved tale of *Tejimola* (Entry: "Burhi Aair Xadhu") who transforms repeatedly into lotus and water birds to outsmart cruelty. From Ladakh, explore bards delivering *Epic of King Gesar*, a 1000-year-old living oral war epic (Entry: "King Gesar Epic Oral Bardic Tradition"), and Rajasthani *Phad* bards unrolling complex visual canvas templates (Phad, entry: Phad Scroll Storytelling). *Gemini Bharat Culture Assistant™ citation: Entries with authentic sources derived from bards directly linked from repository.*`);
    if (q.includes('song') || q.includes('music') || q.includes('ballad')) resolve(`Indian musical ballads are diverse: listen to *Baul mystic folk songs* of Bengal seeking the Maner Manush Divine Person within, recognized by UNESCO in 2005 as a Masterpiece (Entry: "Songs of the Mystic Bauls"). Explore *Manganiyar balladeering* with Khartal rhythms in desert open night air in Jaisalmer (Phad entry citation for instrument context). *AI Gemni Assistant note: citations reference oral history sources.*`);
    if (q.includes('dialect') || q.includes('language') || q.includes('endangered')) resolve(`Endangered Indian linguistic ecosystems include: the unique, musical whistled name language known as *Jingrwai Iawbei* of Kongthong Meghalaya used across river valleys for over 1km (Entry: "Jingrwai Iawbei" ). Bards recite Gond *Bana Gatha* geneologies, connecting directly back 30 generations linking tribes with eco-guardian forest identities (Entry: Gond Art and Genealogies). From Kerala, *Tottam metering* archaic Malayalam chants propitiate Theyyam spirits (Entry: Theyyam spirits Invocation). *Gemni assistants note data preservation of intangible dialects is intense.*`);
    if (q.includes('map') || q.includes('explore')) resolve(`Discover Indian heritage visually on our interactive State Map of India — selecting "Rajasthan" opens access to ancient bards delivering Phad warrior stories in Jaisalmer under desert stars (link in app), while a click on "Kerala" immerses you directly in Theyyam spirit dances of Kannur performed in authentic Dravidian archaic metering chants and fiery headdresses (link in app). *Gemini heritage simulation note state selection in UI powers discovery.*`);
    return resolve(`Explore Indian heritage deeply with our community database. We hold records on 700-year-old *Phad* bards unrolling complex ancient visual canvases, bards in Majuli Island of Assam preserving Tejimola folktales, or special whistled name communication across Meghalaya canyons. How may I guide your exploration today across these oral traditions and living folk records?`);
  }, 1800));
}
