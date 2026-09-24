import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  MapPin,
  Sparkles,
  MessageSquare,
  User,
  AlertCircle
} from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { CulturalEntry } from '../types';

export const ModerationDashboard: React.FC = () => {
  const { entries, updateEntryStatus, currentUser } = useAtlasStore();
  const [activeStatusTab, setActiveStatusTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const filteredEntries = entries.filter(e => e.status === activeStatusTab);

  const handleAudioPlay = (entry: CulturalEntry) => {
    if (!entry.audio_url) return;
    if (playingAudioId === entry.id && audioInstance) {
      audioInstance.pause();
      setPlayingAudioId(null);
    } else {
      if (audioInstance) audioInstance.pause();
      const newAudio = new Audio(entry.audio_url);
      newAudio.onended = () => setPlayingAudioId(null);
      newAudio.play();
      setAudioInstance(newAudio);
      setPlayingAudioId(entry.id);
    }
  };

  const handleApprove = (entry: CulturalEntry) => {
    updateEntryStatus(entry.id, 'approved', {
      id: `rev-${Date.now()}`,
      entry_id: entry.id,
      reviewer_id: currentUser?.id || 'usr-mod',
      reviewer_name: currentUser?.name || 'Dr. Archival Scholar',
      status: 'approved',
      comments: reviewComment || 'Verified for authentic oral lineage, linguistic accuracy and respectful community ethics.',
      reviewed_at: new Date().toISOString()
    });
    setReviewComment('');
  };

  const handleReject = (entry: CulturalEntry) => {
    updateEntryStatus(entry.id, 'rejected', {
      id: `rev-${Date.now()}`,
      entry_id: entry.id,
      reviewer_id: currentUser?.id || 'usr-mod',
      reviewer_name: currentUser?.name || 'Dr. Archival Scholar',
      status: 'rejected',
      comments: reviewComment || 'Requires clearer audio recording or additional dialect contextualization from village community.',
      reviewed_at: new Date().toISOString()
    });
    setReviewComment('');
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const approvedCount = entries.filter(e => e.status === 'approved').length;
  const rejectedCount = entries.filter(e => e.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-growth-50 text-growth-600 flex items-center justify-center border border-growth-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-charcoal-900">
                National Archival Moderation Queue
              </h1>
              <p className="text-xs text-charcoal-700">
                Review, verify dialect accuracy, and approve community oral traditions for public discovery.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-heritage-100 text-heritage-800 font-bold">
              {pendingCount} Pending Review
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-growth-100 text-growth-800 font-bold">
              {approvedCount} Approved & Live
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-cream-200">
          <button
            onClick={() => setActiveStatusTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeStatusTab === 'pending'
                ? 'bg-heritage-500 text-white shadow-soft-glow'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Queue ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveStatusTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeStatusTab === 'approved'
                ? 'bg-growth-600 text-white shadow-sm'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved & Published ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveStatusTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeStatusTab === 'rejected'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Revision Required ({rejectedCount})</span>
          </button>
        </div>
      </div>

      {/* Review Queue List */}
      <div className="space-y-6">
        {filteredEntries.map(entry => {
          const isSelected = selectedEntryId === entry.id;

          return (
            <div
              key={entry.id}
              className="bg-white rounded-3xl border border-cream-300 shadow-sm p-6 overflow-hidden transition-all hover:border-heritage-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Left: Thumbnail & Audio preview */}
                <div className="w-full lg:w-48 shrink-0">
                  <div className="h-36 rounded-2xl overflow-hidden bg-cream-200 border border-cream-300">
                    <img
                      src={entry.media?.[0]?.url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {entry.audio_url && (
                    <button
                      onClick={() => handleAudioPlay(entry)}
                      className={`w-full mt-2.5 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                        playingAudioId === entry.id
                          ? 'bg-heritage-500 text-white shadow-soft-glow'
                          : 'bg-heritage-100 text-heritage-800 hover:bg-heritage-200'
                      }`}
                    >
                      {playingAudioId === entry.id ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{playingAudioId === entry.id ? 'Pause Audio' : 'Verify Voice Recording'}</span>
                    </button>
                  )}
                </div>

                {/* Center: Metadata & Description */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-heritage-100 text-heritage-700">
                      {entry.category_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cream-200 text-charcoal-800">
                      {entry.language}
                    </span>
                    <span className="text-xs text-charcoal-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-500" />
                      {entry.district_name}, {entry.state_name}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-charcoal-900 leading-snug">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    {entry.description}
                  </p>

                  {/* AI Verification Summary */}
                  {entry.ai_content && (
                    <div className="p-3 bg-discovery-50/60 rounded-xl border border-discovery-100 text-xs">
                      <div className="flex items-center space-x-1 text-discovery-700 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini AI Linguistic Verification:</span>
                      </div>
                      <p className="text-charcoal-800 italic">
                        "{entry.ai_content.translation}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-charcoal-700 pt-1">
                    <User className="w-3.5 h-3.5 text-heritage-500" />
                    <span>Submitted by: <strong>{entry.creator_name}</strong> ({entry.creator_badge || 'Contributor'})</span>
                  </div>
                </div>

                {/* Right: Moderator Actions */}
                <div className="w-full lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-cream-200 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Moderator Review Notes / Feedback:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add verification notes..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    {entry.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleApprove(entry)}
                          className="py-2.5 px-3 bg-growth-600 hover:bg-growth-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          onClick={() => handleReject(entry)}
                          className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-all active:scale-95"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Needs Revision</span>
                        </button>
                      </div>
                    )}

                    {entry.status === 'approved' && (
                      <div className="p-2.5 bg-growth-50 rounded-xl text-center text-growth-800 text-xs font-bold flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-growth-600" />
                        <span>Live in Atlas Repository</span>
                      </div>
                    )}

                    {entry.status === 'rejected' && (
                      <div className="p-2.5 bg-red-50 rounded-xl text-center text-red-800 text-xs font-bold flex items-center justify-center space-x-1">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Held for Revision</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-300 text-charcoal-700 text-sm">
            No entries currently in the {activeStatusTab} queue.
          </div>
        )}
      </div>

    </div>
  );
};
