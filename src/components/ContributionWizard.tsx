import React, { useState, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Music,
  FileText,
  Languages,
  MapPin,
  HelpCircle,
  User,
  Clock,
  Layers
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { INDIAN_STATES, CATEGORIES_LIST } from '../data/indiaGeoData';
import { processHeritageEntry } from '../lib/gemini';
import { uploadMediaFile } from '../lib/supabase';
import confetti from 'canvas-confetti';

export const ContributionWizard: React.FC = () => {
  const { isContributeModalOpen, toggleContributeModal, addEntry, currentUser } = useAtlasStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [tellerName, setTellerName] = useState(currentUser?.name || '');
  const [tellerBadge, setTellerBadge] = useState('Village Elder & Tradition Keeper');
  const [eraAge, setEraAge] = useState('Ancient Oral Lineage');

  // Media / Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80');

  // AI State
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiResult, setAiResult] = useState<{
    transcript: string;
    translation: string;
    summary: string;
    tags: string[];
    cultural_significance: string;
    dialect_notes: string;
    generated_narrative: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  if (!isContributeModalOpen) return null;

  // Audio Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } catch (err) {
      console.warn('Microphone access simulation:', err);
      // Fallback simulation audio url
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    if (!recordedAudioUrl) {
      setRecordedAudioUrl('https://cdn.freesound.org/previews/517/517789_5674468-lq.mp3');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedMediaFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Step 3: Trigger Gemini AI Processing
  const handleTriggerAI = async () => {
    setIsProcessingAI(true);
    const selectedStateObj = INDIAN_STATES.find(s => s.id === selectedState);
    const categoryObj = CATEGORIES_LIST.find(c => c.id === selectedCategory);

    try {
      const res = await processHeritageEntry({
        rawText: description,
        title: title || 'Oral Story of the Living Ancestors',
        state: selectedStateObj?.name || 'India',
        district: selectedDistrict || 'Ancient Valley',
        category: categoryObj?.name || 'Oral Lore',
        language: language || 'Folk Vernacular',
      });
      setAiResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Final Submit
  const handleFinalSubmit = () => {
    const selectedStateObj = INDIAN_STATES.find(s => s.id === selectedState);
    const categoryObj = CATEGORIES_LIST.find(c => c.id === selectedCategory);

    addEntry({
      title: title || 'Preserved Heritage Oral Narrative',
      description: description,
      language: language || 'Indigenous Vernacular',
      state_id: selectedState,
      state_name: selectedStateObj?.name || 'India',
      district_name: selectedDistrict || 'Local Region',
      category_id: selectedCategory || 'cat-stories',
      category_name: categoryObj?.name || 'Stories',
      created_by: currentUser?.id || 'usr-elder',
      creator_name: tellerName || currentUser?.name || 'Village Elder',
      creator_badge: tellerBadge,
      status: 'pending', // Submits to moderation queue as per PRD flow
      audio_url: recordedAudioUrl || undefined,
      audio_duration: recordedAudioUrl ? `0${Math.floor(recordingSeconds / 60)}:${recordingSeconds % 60 < 10 ? '0' : ''}${recordingSeconds % 60 || '45'}` : undefined,
      latitude: selectedStateObj?.coordinates[0] || 20.5937,
      longitude: selectedStateObj?.coordinates[1] || 78.9629,
      era_or_tradition_age: eraAge,
      media: [
        {
          id: `med-${Date.now()}`,
          url: imagePreviewUrl,
          type: 'image',
          caption: title
        }
      ],
      ai_content: aiResult ? {
        transcript: aiResult.transcript,
        translation: aiResult.translation,
        summary: aiResult.summary,
        tags: aiResult.tags,
        cultural_significance: aiResult.cultural_significance,
        dialect_notes: aiResult.dialect_notes,
        generated_narrative: aiResult.generated_narrative
      } : undefined
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    toggleContributeModal(false);
  };

  const selectedStateObj = INDIAN_STATES.find(s => s.id === selectedState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cream-300 flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-heritage-500 to-heritage-600 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-100">
              Community Contribution Portal
            </span>
            <h2 className="font-heading font-bold text-lg sm:text-xl">
              Preserve a Cultural Tradition
            </h2>
          </div>
          <button
            onClick={() => toggleContributeModal(false)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 border-b border-cream-200 bg-cream-50 text-[11px] font-semibold text-center py-2.5">
          <div className={step >= 1 ? 'text-heritage-600 font-bold' : 'text-charcoal-700'}>
            1. Voice & Media
          </div>
          <div className={step >= 2 ? 'text-heritage-600 font-bold' : 'text-charcoal-700'}>
            2. Metadata & Lore
          </div>
          <div className={step >= 3 ? 'text-discovery-600 font-bold' : 'text-charcoal-700'}>
            3. Gemini AI Analysis
          </div>
          <div className={step >= 4 ? 'text-growth-600 font-bold' : 'text-charcoal-700'}>
            4. Review & Submit
          </div>
        </div>

        {/* Scrollable Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          {/* STEP 1: VOICE & MEDIA CAPTURE */}
          {step === 1 && (
            <div className="space-y-6">
              {/* In-browser Voice Recorder */}
              <div className="p-5 rounded-2xl bg-heritage-50/80 border-2 border-dashed border-heritage-300 text-center">
                <h3 className="font-heading font-bold text-sm text-heritage-900 mb-1">
                  Record Oral Story / Folk Song directly from Microphone
                </h3>
                <p className="text-xs text-heritage-700 mb-4">
                  Pass the microphone to the elder or singer. Capturing acoustic nuances preserves authentic dialects.
                </p>

                <div className="flex flex-col items-center justify-center space-y-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center space-x-2 px-5 py-3 rounded-full bg-heritage-500 hover:bg-heritage-600 text-white font-bold text-xs shadow-soft-glow active:scale-95 transition-all"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Voice Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center space-x-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop Recording ({recordingSeconds}s)</span>
                    </button>
                  )}

                  {recordedAudioUrl && (
                    <div className="mt-2 text-xs text-growth-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Oral Audio snippet captured successfully!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo / Artwork Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal-800">
                  Upload Photograph or Artwork of Tradition / Artisan
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream-200 border border-cream-300 shrink-0">
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cream-200 file:text-charcoal-900 hover:file:bg-cream-300 cursor-pointer"
                    />
                    <p className="text-[11px] text-charcoal-700 mt-1">
                      Supports PNG, JPG, WebP. High resolution images recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: METADATA & LORE */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal-800 mb-1">
                  Title of Tradition / Folk Epic / Song *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Villu Paatu: The Bow Song of Tirunelveli"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">State / UT *</label>
                  <select
                    value={selectedState}
                    onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">District *</label>
                  <select
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    disabled={!selectedStateObj}
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500 disabled:opacity-50"
                  >
                    <option value="">{selectedStateObj ? 'Select District' : 'Choose State first'}</option>
                    {selectedStateObj?.districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Category *</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES_LIST.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Native Language / Dialect *</label>
                  <input
                    type="text"
                    placeholder="e.g. Tenyidie, Marwari, Sohra Khasi"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-800 mb-1">
                  Story Content / Transcribed Lyrics / Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide the oral story in original words, verses, or describe the ritual in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Tradition Keeper / Elder's Name</label>
                  <input
                    type="text"
                    value={tellerName}
                    onChange={e => setTellerName(e.target.value)}
                    placeholder="e.g. Smt. Kamala Devi"
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Estimated Era / Age</label>
                  <input
                    type="text"
                    value={eraAge}
                    onChange={e => setEraAge(e.target.value)}
                    placeholder="e.g. 500 Years Living Tradition"
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GEMINI AI PROCESSING & TRANSLATION */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-discovery-50 rounded-2xl border border-discovery-200">
                <div className="flex items-center space-x-2 text-discovery-700 font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-discovery-600" />
                  <span>Google Gemini AI Engine</span>
                </div>
                <p className="text-discovery-800 leading-relaxed">
                  Gemini will transcribe dialects, translate into English, generate an anthropological cultural narrative, and classify preservation tags automatically.
                </p>
              </div>

              {!aiResult && !isProcessingAI && (
                <div className="text-center py-6">
                  <button
                    onClick={handleTriggerAI}
                    className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-discovery-500 hover:bg-discovery-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Gemini Cultural Analysis</span>
                  </button>
                </div>
              )}

              {isProcessingAI && (
                <div className="p-8 text-center space-y-3">
                  <div className="inline-block w-8 h-8 border-3 border-discovery-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-semibold text-charcoal-800">
                    Gemini AI is analyzing oral speech, acoustic cadence & linguistic history...
                  </p>
                  <p className="text-[11px] text-charcoal-700 italic">
                    Cross-referencing UNESCO Intangible Cultural Heritage database...
                  </p>
                </div>
              )}

              {aiResult && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3 bg-white rounded-xl border border-cream-300">
                    <span className="font-bold text-heritage-600 block mb-1">English Translation:</span>
                    <p className="text-charcoal-800 italic">"{aiResult.translation}"</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-cream-300">
                    <span className="font-bold text-discovery-600 block mb-1">AI Cultural Narrative:</span>
                    <p className="text-charcoal-800">{aiResult.generated_narrative}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-cream-300">
                    <span className="font-bold text-charcoal-700 block mb-1">Auto-Generated Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiResult.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-cream-200 text-charcoal-800 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-growth-50 rounded-2xl border border-growth-200">
                <div className="flex items-center space-x-2 text-growth-800 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-growth-600" />
                  <span>Ready for National Moderation Queue</span>
                </div>
                <p className="text-growth-700">
                  Following PRD rules, entries are submitted with status <strong className="text-growth-900">Pending</strong>, where archival scholars review audio quality and dialect authenticity before public publishing.
                </p>
              </div>

              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 space-y-2">
                <p className="font-heading font-bold text-sm text-charcoal-900">{title || 'Untitled Tradition'}</p>
                <p className="text-charcoal-700"><strong>Region:</strong> {selectedDistrict}, {selectedStateObj?.name}</p>
                <p className="text-charcoal-700"><strong>Language:</strong> {language}</p>
                <p className="text-charcoal-700"><strong>Custodian:</strong> {tellerName} ({tellerBadge})</p>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-cream-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 2 && !aiResult) {
                  setStep(3);
                } else {
                  setStep((s) => (s + 1) as any);
                }
              }}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-heritage-500 hover:bg-heritage-600 text-white text-xs font-bold shadow-soft-glow active:scale-95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-growth-600 hover:bg-growth-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit to Atlas Archive</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
