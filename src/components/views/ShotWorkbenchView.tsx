'use client';

/**
 * ShotWorkbenchView: The Core Hub of DIRECTOR OS
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  Shot,
  ShotStatus,
  ProductionMethod,
  ShotSize,
  CameraMovement,
  CameraAngle,
  EyelineDirection,
  MovementDirection,
  MediaVersion,
  Review
} from '@/types';
import { assemblePromptsForShot } from '@/services/prompt/generator';
import {
  Clapperboard,
  LayoutGrid,
  Table as TableIcon,
  PlaySquare,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Film,
  Upload,
  MessageSquare,
  Eye,
  Columns,
  Undo2,
  Tag,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ShotWorkbenchViewProps {
  initialFilterStatus?: string;
}

export function ShotWorkbenchView({ initialFilterStatus }: ShotWorkbenchViewProps) {
  const {
    activeProject,
    shots,
    selectedShotId,
    setSelectedShotId,
    addShot,
    updateShot,
    deleteShot,
    undoDeleteShot,
    canUndoDelete,
    reorderShots,
    scenes,
    assets,
    media,
    reviews,
    uploadMediaForShot,
    adoptMediaVersion,
    addReviewComment,
    prompts,
    savePromptForShot,
    saveStatus,
    t,
    locale,
  } = useProject();

  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'sequence'>('cards');
  const [directorDetailsOpen, setDirectorDetailsOpen] = useState(false);
  const [timelineStripOpen, setTimelineStripOpen] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus || 'all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sceneFilter, setSceneFilter] = useState<string>('all');

  // Center workspace tab: 'preview' | 'prompt' | 'workflow' | 'compare'
  const [centerTab, setCenterTab] = useState<'preview' | 'prompt' | 'workflow' | 'compare'>('preview');

  // Side-by-side compare versions
  const [compareVersionAId, setCompareVersionAId] = useState<string | null>(null);
  const [compareVersionBId, setCompareVersionBId] = useState<string | null>(null);

  // New review comment input
  const [newCommentText, setNewCommentText] = useState('');

  // Video element reference
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  // Aspect ratio preview state
  const [previewAspect, setPreviewAspect] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  const selectedShot = shots.find(s => s.id === selectedShotId) || shots[0] || null;
  const shotMediaList = selectedShot ? media.filter(m => m.shotId === selectedShot.id) : [];
  const adoptedMedia = selectedShot?.adoptedMediaVersionId
    ? shotMediaList.find(m => m.id === selectedShot.adoptedMediaVersionId)
    : shotMediaList[0];
  const shotReviews = selectedShot ? reviews.filter(r => r.shotId === selectedShot.id) : [];

  const filteredShots = shots.filter(shot => {
    if (statusFilter !== 'all' && shot.status !== statusFilter) return false;
    if (methodFilter !== 'all' && shot.productionMethod !== methodFilter) return false;
    if (sceneFilter !== 'all' && shot.sceneId !== sceneFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = shot.name.toLowerCase().includes(q);
      const matchDesc = shot.visualDescription.toLowerCase().includes(q);
      const matchNum = `shot ${shot.shotNumber}`.includes(q);
      if (!matchName && !matchDesc && !matchNum) return false;
    }
    return true;
  });

  useEffect(() => {
    if (shots.length > 0 && !selectedShotId) {
      setSelectedShotId(shots[0].id);
    }
  }, [shots, selectedShotId, setSelectedShotId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedShot || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await uploadMediaForShot(selectedShot.id, file);
    e.target.value = '';
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  const jumpToVideoTime = (timeSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRegeneratePrompt = async () => {
    if (!selectedShot) return;
    const compiled = assemblePromptsForShot(selectedShot, assets);
    await savePromptForShot(compiled);
  };

  const currentPrompt = selectedShot ? prompts.find(p => p.shotId === selectedShot.id) : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-graphite-900 select-none">
      {/* Workbench Header: View Switcher, Stats & Filter Bar */}
      <div className="h-12 border-b border-graphite-750 bg-graphite-850 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-graphite-800 border border-graphite-750">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                  : 'text-graphite-400 hover:text-graphite-200'
              }`}
              title={t.workbench.cardsView}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.workbench.cardsView}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                  : 'text-graphite-400 hover:text-graphite-200'
              }`}
              title={t.workbench.tableView}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t.workbench.tableView}</span>
            </button>
            <button
              onClick={() => setViewMode('sequence')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'sequence'
                  ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                  : 'text-graphite-400 hover:text-graphite-200'
              }`}
              title={t.workbench.sequenceView}
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>{t.workbench.sequenceView}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-graphite-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={t.workbench.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-graphite-800 border border-graphite-750 rounded-lg text-xs text-graphite-200 focus:outline-none focus:border-cyanAccent w-48 lg:w-60"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-graphite-800 border border-graphite-750 rounded-lg px-2 py-1 text-xs text-graphite-300 focus:outline-none focus:border-cyanAccent"
          >
            <option value="all">{t.status.all} ({shots.length})</option>
            <option value="draft">{t.status.draft} ({shots.filter(s => s.status === 'draft').length})</option>
            <option value="in_progress">{t.status.in_progress} ({shots.filter(s => s.status === 'in_progress').length})</option>
            <option value="ready_for_review">{t.status.ready_for_review} ({shots.filter(s => s.status === 'ready_for_review').length})</option>
            <option value="changes_requested">{t.status.changes_requested} ({shots.filter(s => s.status === 'changes_requested').length})</option>
            <option value="approved">{t.status.approved} ({shots.filter(s => s.status === 'approved').length})</option>
          </select>

          {/* Production Method Filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="bg-graphite-800 border border-graphite-750 rounded-lg px-2 py-1 text-xs text-graphite-300 focus:outline-none focus:border-cyanAccent hidden sm:inline-block"
          >
            <option value="all">{t.methods.all}</option>
            <option value="full_ai">{t.methods.full_ai}</option>
            <option value="live_action">{t.methods.live_action}</option>
            <option value="hybrid">{t.methods.hybrid}</option>
          </select>
        </div>

        {/* Right Action: Add Shot & Undo Delete */}
        <div className="flex items-center gap-2">
          {canUndoDelete && (
            <button
              onClick={undoDeleteShot}
              className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1 hover:bg-amber-500/30 transition-colors animate-pulse"
              title={t.workbench.undoDelete}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{t.workbench.undoDelete}</span>
            </button>
          )}

          <button
            onClick={() => addShot(selectedShot?.sceneId)}
            className="px-3 py-1 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyanAccent-hover transition-colors shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.workbench.newShot}</span>
          </button>
        </div>
      </div>

      {/* Main Body: 3-Column Layout (Cards View) */}
      {viewMode === 'cards' && (
        <div className="flex-1 flex overflow-hidden">
          {/* COLUMN 1: LEFT SHOT LIST */}
          <div className="w-72 lg:w-80 border-r border-graphite-750 flex flex-col bg-graphite-850 shrink-0">
            <div className="p-2 border-b border-graphite-750 flex items-center justify-between text-[11px] text-graphite-400">
              <span>{t.workbench.shotList} ({filteredShots.length})</span>
              <span className="font-mono">ID Kekal</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredShots.map(shot => {
                const isSelected = shot.id === selectedShot?.id;
                const shotMedias = media.filter(m => m.shotId === shot.id);
                const isApproved = shot.status === 'approved';
                const isReview = shot.status === 'ready_for_review';
                const isRevision = shot.status === 'changes_requested';

                return (
                  <div
                    key={shot.id}
                    onClick={() => setSelectedShotId(shot.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-graphite-800 border-cyanAccent shadow-[0_0_10px_rgba(0,229,255,0.15)] text-graphite-100'
                        : 'bg-graphite-850/80 border-graphite-750 hover:border-graphite-650 text-graphite-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-cyanAccent">
                          SYOT {String(shot.shotNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-graphite-750 text-graphite-300">
                          {shot.targetDurationSeconds}s
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isReview
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                            : isRevision
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : shot.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-graphite-700 text-graphite-400 border-graphite-600'
                        }`}
                      >
                        {shot.status === 'approved'
                          ? t.status.approved
                          : shot.status === 'ready_for_review'
                          ? t.status.ready_for_review
                          : shot.status === 'changes_requested'
                          ? t.status.changes_requested
                          : shot.status === 'in_progress'
                          ? t.status.in_progress
                          : t.status.draft}
                      </span>
                    </div>

                    <div className="text-xs font-semibold truncate mb-1">{shot.name}</div>
                    <div className="text-[11px] text-graphite-400 line-clamp-2 leading-relaxed">
                      {shot.visualDescription || (locale === 'zh' ? '暂无画面描述' : 'Tiada keterangan visual')}
                    </div>

                    {/* Footer Tags */}
                    <div className="mt-2 pt-1 border-t border-graphite-750/60 flex items-center justify-between text-[10px] text-graphite-400 font-mono">
                      <span>
                        {shot.productionMethod === 'hybrid'
                          ? t.methods.hybrid
                          : shot.productionMethod === 'full_ai'
                          ? t.methods.full_ai
                          : t.methods.live_action}
                      </span>
                      <span>{shotMedias.length} {locale === 'zh' ? '个版本' : 'versi'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: CENTER PREVIEW & PRODUCTION PIPELINE */}
          {selectedShot ? (
            <div className="flex-1 flex flex-col overflow-y-auto bg-graphite-900 border-r border-graphite-750">
              {/* Center Navigation Bar */}
              <div className="h-10 border-b border-graphite-750 bg-graphite-850 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyanAccent font-bold text-xs">
                    SYOT {String(selectedShot.shotNumber).padStart(2, '0')}: {selectedShot.name}
                  </span>
                  <span className="text-[10px] text-graphite-400 font-mono">
                    (ID: {selectedShot.id})
                  </span>
                </div>

                {/* Center Sub-tabs */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCenterTab('preview')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      centerTab === 'preview'
                        ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                        : 'text-graphite-400 hover:text-graphite-200'
                    }`}
                  >
                    {t.workbench.screenReview}
                  </button>
                  <button
                    onClick={() => setCenterTab('prompt')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      centerTab === 'prompt'
                        ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                        : 'text-graphite-400 hover:text-graphite-200'
                    }`}
                  >
                    {t.workbench.promptTab}
                  </button>
                  <button
                    onClick={() => setCenterTab('workflow')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      centerTab === 'workflow'
                        ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                        : 'text-graphite-400 hover:text-graphite-200'
                    }`}
                  >
                    {t.workbench.workflowTab}
                  </button>
                  {shotMediaList.length > 1 && (
                    <button
                      onClick={() => {
                        setCenterTab('compare');
                        setCompareVersionAId(shotMediaList[0]?.id || null);
                        setCompareVersionBId(shotMediaList[1]?.id || null);
                      }}
                      className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                        centerTab === 'compare'
                          ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                          : 'text-graphite-400 hover:text-graphite-200'
                      }`}
                    >
                      <Columns className="w-3 h-3" />
                      {t.workbench.compareTab}
                    </button>
                  )}
                </div>
              </div>

              {/* CENTER CONTENT */}
              <div className="p-4 space-y-4">
                {/* 1. PREVIEW TAB */}
                {centerTab === 'preview' && (
                  <div className="space-y-4">
                    {/* Viewfinder Container */}
                    <div className="relative bg-graphite-950 rounded-xl overflow-hidden border border-graphite-750 flex items-center justify-center min-h-[320px] max-h-[500px]">
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-graphite-900/80 backdrop-blur px-2 py-1 rounded-md border border-graphite-750 text-[10px] text-graphite-300 font-mono">
                        <span className="text-graphite-400">{t.workbench.aspectRatio}:</span>
                        <button
                          onClick={() => setPreviewAspect('16:9')}
                          className={`px-1.5 py-0.5 rounded ${previewAspect === '16:9' ? 'bg-cyanAccent text-graphite-950 font-bold' : 'hover:text-graphite-100'}`}
                        >
                          16:9
                        </button>
                        <button
                          onClick={() => setPreviewAspect('9:16')}
                          className={`px-1.5 py-0.5 rounded ${previewAspect === '9:16' ? 'bg-cyanAccent text-graphite-950 font-bold' : 'hover:text-graphite-100'}`}
                        >
                          9:16
                        </button>
                        <button
                          onClick={() => setPreviewAspect('1:1')}
                          className={`px-1.5 py-0.5 rounded ${previewAspect === '1:1' ? 'bg-cyanAccent text-graphite-950 font-bold' : 'hover:text-graphite-100'}`}
                        >
                          1:1
                        </button>
                        <span className="text-graphite-600 px-1">|</span>
                        <button
                          onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                          className="hover:text-cyanAccent"
                        >
                          {fitMode === 'contain' ? t.workbench.fitModeContain : t.workbench.fitModeCover}
                        </button>
                      </div>

                      {/* Display Image or Video */}
                      {adoptedMedia ? (
                        adoptedMedia.mediaType === 'video' ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <video
                              ref={videoRef}
                              src={adoptedMedia.url}
                              onTimeUpdate={handleTimeUpdate}
                              controls
                              className={`max-w-full max-h-[480px] ${previewAspect === '16:9' ? 'aspect-video' : previewAspect === '9:16' ? 'aspect-[9/16]' : 'aspect-square'} object-${fitMode}`}
                            />
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={adoptedMedia.url}
                            alt={selectedShot.name}
                            className={`max-w-full max-h-[480px] ${previewAspect === '16:9' ? 'aspect-video' : previewAspect === '9:16' ? 'aspect-[9/16]' : 'aspect-square'} object-${fitMode}`}
                          />
                        )
                      ) : (
                        <div className="p-8 text-center space-y-2">
                          <Film className="w-10 h-10 text-graphite-600 mx-auto" />
                          <div className="text-xs text-graphite-400">{t.workbench.noMedia}</div>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/30 text-xs cursor-pointer hover:bg-cyanAccent/25">
                            <Upload className="w-3.5 h-3.5" />
                            {t.workbench.uploadMedia}
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Media Versions Carousel & Adopt Action */}
                    <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-graphite-200">
                        <span>{t.workbench.mediaVersions} ({shotMediaList.length})</span>
                        <label className="text-[11px] text-cyanAccent hover:underline flex items-center gap-1 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                          {t.workbench.uploadNewVersion}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {shotMediaList.map(m => {
                          const isAdopted = m.id === selectedShot.adoptedMediaVersionId;

                          return (
                            <div
                              key={m.id}
                              className={`p-2 rounded-lg border text-xs space-y-1 relative group ${
                                isAdopted
                                  ? 'bg-cyanAccent/10 border-cyanAccent text-graphite-100 shadow-sm'
                                  : 'bg-graphite-800 border-graphite-700 text-graphite-400 hover:border-graphite-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-[10px] truncate">{m.versionName}</span>
                                {isAdopted && (
                                  <span className="text-[9px] px-1 py-0.2 bg-cyanAccent text-graphite-950 font-bold rounded">
                                    {t.workbench.adoptedVersion}
                                  </span>
                                )}
                              </div>

                              <div className="text-[10px] text-graphite-400 truncate">
                                {m.toolTag || m.source}
                              </div>

                              {!isAdopted && (
                                <button
                                  onClick={() => adoptMediaVersion(selectedShot.id, m.id)}
                                  className="w-full py-1 rounded bg-graphite-750 hover:bg-cyanAccent/20 hover:text-cyanAccent text-[10px] font-medium transition-colors"
                                >
                                  {t.workbench.markAdopted}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timecoded Director Comments & Approval Decision */}
                    <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-graphite-100 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-cyanAccent" />
                          {t.workbench.directorComments}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (!adoptedMedia) {
                                alert(
                                  locale === 'zh'
                                    ? '缺少素材时不能标记为已批准！请先上传或指定采用素材版本。'
                                    : 'Bahan visual tiada! Sila muat naik atau tentukan versi media diterima sebelum meluluskan.'
                                );
                                return;
                              }
                              addReviewComment(
                                selectedShot.id,
                                adoptedMedia.id,
                                'approve',
                                newCommentText || (locale === 'zh' ? '光影构图符合要求，核准定板。' : 'Pencahayaan & komposisi menepati jangkaan. Diluluskan.')
                              );
                              setNewCommentText('');
                            }}
                            className="px-3 py-1 rounded bg-emerald-500 text-graphite-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                          >
                            {t.workbench.approveShot}
                          </button>
                          <button
                            onClick={() => {
                              if (!adoptedMedia) {
                                alert(
                                  locale === 'zh'
                                    ? '请先上传素材版本再提出修改意见。'
                                    : 'Sila muat naik versi media terlebih dahulu.'
                                );
                                return;
                              }
                              addReviewComment(
                                selectedShot.id,
                                adoptedMedia.id,
                                'request_changes',
                                newCommentText || (locale === 'zh' ? '需按照导演意见修改重新生成。' : 'Perlu dipinda mengikut arahan pengarah.')
                              );
                              setNewCommentText('');
                            }}
                            className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs hover:bg-rose-500/30 transition-colors"
                          >
                            {t.workbench.requestChanges}
                          </button>
                        </div>
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={
                            adoptedMedia?.mediaType === 'video'
                              ? `${t.workbench.commentPlaceholder} (${currentVideoTime.toFixed(1)}s)`
                              : t.workbench.commentPlaceholder
                          }
                          value={newCommentText}
                          onChange={e => setNewCommentText(e.target.value)}
                          className="flex-1 bg-graphite-800 border border-graphite-700 rounded-lg px-3 py-1.5 text-xs text-graphite-200 focus:outline-none focus:border-cyanAccent"
                        />
                        <button
                          onClick={() => {
                            if (!newCommentText.trim() || !adoptedMedia) return;
                            addReviewComment(
                              selectedShot.id,
                              adoptedMedia.id,
                              'comment_only',
                              newCommentText,
                              adoptedMedia.mediaType === 'video' ? currentVideoTime : undefined
                            );
                            setNewCommentText('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-graphite-750 hover:bg-graphite-700 text-graphite-200 text-xs transition-colors"
                        >
                          {t.workbench.submitComment}
                        </button>
                      </div>

                      {/* Comments History */}
                      <div className="space-y-2 pt-2">
                        {shotReviews.map(r => (
                          <div key={r.id} className="p-2.5 rounded-lg bg-graphite-800/80 border border-graphite-750 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-graphite-200">{r.reviewerName}</span>
                              <span className="text-[10px] font-mono text-graphite-400">
                                {new Date(r.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-graphite-300 text-[11px] leading-relaxed">{r.feedbackNotes}</p>
                            {r.timecodedComments?.map(tc => (
                              <button
                                key={tc.id}
                                onClick={() => jumpToVideoTime(tc.timestampSeconds)}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent text-[10px] font-mono hover:bg-cyanAccent/20"
                              >
                                <Play className="w-2.5 h-2.5" />
                                <span>{tc.timestampSeconds.toFixed(1)}s: {tc.content}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PROMPT COMPILATION TAB */}
                {centerTab === 'prompt' && (
                  <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-graphite-750 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-graphite-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyanAccent" />
                          {t.prompts.title}
                        </h3>
                        <p className="text-[11px] text-graphite-400 mt-0.5">
                          {t.prompts.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={handleRegeneratePrompt}
                        className="px-3 py-1.5 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyanAccent-hover transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {t.prompts.regenerate}
                      </button>
                    </div>

                    {currentPrompt ? (
                      <div className="space-y-4 text-xs">
                        {/* Static Prompt */}
                        <div className="p-3 rounded-lg bg-graphite-900 border border-graphite-750 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyanAccent">{t.prompts.staticKeyframe}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(currentPrompt.staticKeyframePromptEn)}
                              className="text-[11px] text-graphite-400 hover:text-cyanAccent flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              {t.prompts.copyEnglish}
                            </button>
                          </div>
                          <p className="text-graphite-300 font-mono text-[11px] bg-graphite-850 p-2 rounded border border-graphite-750">
                            {currentPrompt.staticKeyframePromptZh}
                          </p>
                          <p className="text-graphite-400 font-mono text-[11px] bg-graphite-850 p-2 rounded border border-graphite-750">
                            {currentPrompt.staticKeyframePromptEn}
                          </p>
                        </div>

                        {/* Dynamic Prompt */}
                        <div className="p-3 rounded-lg bg-graphite-900 border border-graphite-750 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyanAccent">{t.prompts.dynamicVideo}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(currentPrompt.dynamicVideoPromptEn)}
                              className="text-[11px] text-graphite-400 hover:text-cyanAccent flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              {t.prompts.copyEnglish}
                            </button>
                          </div>
                          <p className="text-graphite-300 font-mono text-[11px] bg-graphite-850 p-2 rounded border border-graphite-750">
                            {currentPrompt.dynamicVideoPromptZh}
                          </p>
                          <p className="text-graphite-400 font-mono text-[11px] bg-graphite-850 p-2 rounded border border-graphite-750">
                            {currentPrompt.dynamicVideoPromptEn}
                          </p>
                        </div>

                        {/* Hybrid Instructions */}
                        {currentPrompt.hybridInstructionsZh && (
                          <div className="p-3 rounded-lg bg-graphite-900 border border-cyanAccent/30 space-y-2">
                            <div className="font-bold text-cyanAccent">{t.prompts.hybridInstructions}</div>
                            <pre className="text-graphite-300 font-mono text-[11px] bg-graphite-850 p-2 rounded whitespace-pre-wrap">
                              {currentPrompt.hybridInstructionsZh}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-graphite-400 space-y-2">
                        <div>{locale === 'zh' ? '尚未为此镜头组装提示词' : 'Tiada prompt dipasang untuk syot ini lagi'}</div>
                        <button
                          onClick={handleRegeneratePrompt}
                          className="px-3 py-1.5 rounded-lg bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40 text-xs"
                        >
                          {t.prompts.regenerate}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. WORKFLOW TAB */}
                {centerTab === 'workflow' && (
                  <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-4">
                    <div className="border-b border-graphite-750 pb-3">
                      <h3 className="text-sm font-bold text-graphite-100 flex items-center gap-2">
                        <Film className="w-4 h-4 text-cyanAccent" />
                        <span>Aliran Kaedah Produksi: </span>
                        <span className="text-cyanAccent font-mono">
                          {selectedShot.productionMethod === 'full_ai'
                            ? t.methods.full_ai
                            : selectedShot.productionMethod === 'live_action'
                            ? t.methods.live_action
                            : t.methods.hybrid}
                        </span>
                      </h3>
                    </div>

                    {selectedShot.productionMethod === 'full_ai' && (
                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-2">
                          <span className="font-bold text-graphite-200">
                            {locale === 'zh' ? '全 AI 制作全流程：' : 'Aliran Penuh AI Sepenuhnya:'}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-graphite-300 font-mono">
                            <span className="p-1.5 rounded bg-graphite-750">1. Rujukan Aset</span>
                            <span>→</span>
                            <span className="p-1.5 rounded bg-graphite-750">2. Bingkai Kunci</span>
                            <span>→</span>
                            <span className="p-1.5 rounded bg-graphite-750">3. Prompt Video</span>
                            <span>→</span>
                            <span className="p-1.5 rounded bg-cyanAccent/20 text-cyanAccent">4. Muat Naik & Semak</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedShot.productionMethod === 'live_action' && (
                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-2">
                          <span className="font-bold text-graphite-200">
                            {locale === 'zh' ? '真人实拍拍摄要求：' : 'Syarat Penggambaran Langsung:'}
                          </span>
                          <textarea
                            value={selectedShot.liveActionDetails?.shootingRequirements || ''}
                            onChange={e => {
                              const curr = selectedShot.liveActionDetails || { shootingRequirements: '', takeRecords: [] };
                              updateShot(selectedShot.id, {
                                liveActionDetails: { ...curr, shootingRequirements: e.target.value }
                              });
                            }}
                            placeholder={locale === 'zh' ? '填写现场机位调度、特技安全规范与降雨要求...' : 'Isi arahan kamera di lokasi, piawaian aksi lagak ngeri dan efek hujan...'}
                            className="w-full bg-graphite-850 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                            rows={3}
                          />
                        </div>

                        <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-750 space-y-2">
                          <span className="font-bold text-graphite-200">
                            {locale === 'zh' ? '现场 Take 选定记录：' : 'Rekod Take Terpilih Pengarah:'}
                          </span>
                          {selectedShot.liveActionDetails?.takeRecords?.map((tk, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded bg-graphite-850 border border-graphite-700">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${tk.isCircleTake ? 'bg-amber-500 text-graphite-950 font-bold' : 'bg-graphite-750 text-graphite-400'}`}>
                                  Take {tk.takeNumber} {tk.isCircleTake && '★Pilihan'}
                                </span>
                                <span className="text-graphite-300">{tk.description}</span>
                              </div>
                              <span className="text-graphite-400 font-mono text-[10px]">{tk.timecode || '00:00:00:00'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedShot.productionMethod === 'hybrid' && (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1">
                            <span className="font-bold text-cyanAccent block">
                              {locale === 'zh' ? '需要改变什么 (What to Change):' : 'Perlu Diubah (What to Change):'}
                            </span>
                            <textarea
                              value={selectedShot.hybridDetails?.whatToChange || ''}
                              onChange={e => {
                                const cur = selectedShot.hybridDetails || { whatToChange: '', whatToPreserve: '', preserveActingAndMotion: true, taskTypes: ['vfx'], trackingNotes: '' };
                                updateShot(selectedShot.id, { hybridDetails: { ...cur, whatToChange: e.target.value } });
                              }}
                              className="w-full bg-graphite-850 border border-graphite-700 rounded p-2 text-graphite-200"
                              rows={2}
                            />
                          </div>

                          <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1">
                            <span className="font-bold text-amber-300 block">
                              {locale === 'zh' ? '必须保留什么 (What to Preserve):' : 'Mesti Dikekalkan (What to Preserve):'}
                            </span>
                            <textarea
                              value={selectedShot.hybridDetails?.whatToPreserve || ''}
                              onChange={e => {
                                const cur = selectedShot.hybridDetails || { whatToChange: '', whatToPreserve: '', preserveActingAndMotion: true, taskTypes: ['vfx'], trackingNotes: '' };
                                updateShot(selectedShot.id, { hybridDetails: { ...cur, whatToPreserve: e.target.value } });
                              }}
                              className="w-full bg-graphite-800 border border-graphite-700 rounded p-2 text-graphite-200"
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1">
                          <span className="font-bold text-graphite-200 block">
                            {locale === 'zh' ? '跟踪、抠像与合成备注:' : 'Nota Penjejakan, Roto & Komposisi:'}
                          </span>
                          <textarea
                            value={selectedShot.hybridDetails?.trackingNotes || ''}
                            onChange={e => {
                              const cur = selectedShot.hybridDetails || { whatToChange: '', whatToPreserve: '', preserveActingAndMotion: true, taskTypes: ['vfx'], trackingNotes: '' };
                              updateShot(selectedShot.id, { hybridDetails: { ...cur, trackingNotes: e.target.value } });
                            }}
                            className="w-full bg-graphite-850 border border-graphite-700 rounded p-2 text-graphite-200"
                            rows={2}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SIDE-BY-SIDE COMPARE */}
                {centerTab === 'compare' && (
                  <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-graphite-200 border-b border-graphite-750 pb-2">
                      <span>{t.workbench.sideBySideTitle}</span>
                      <button
                        onClick={() => setCenterTab('preview')}
                        className="text-cyanAccent hover:underline text-[11px]"
                      >
                        {t.workbench.backToSingle}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <select
                          value={compareVersionAId || ''}
                          onChange={e => setCompareVersionAId(e.target.value)}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-xs text-graphite-200"
                        >
                          {shotMediaList.map(m => (
                            <option key={m.id} value={m.id}>A: {m.versionName}</option>
                          ))}
                        </select>
                        <div className="aspect-video bg-graphite-950 rounded-lg overflow-hidden border border-graphite-750 flex items-center justify-center">
                          {compareVersionAId && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={shotMediaList.find(m => m.id === compareVersionAId)?.url}
                              alt="Version A"
                              className="max-w-full max-h-full object-contain"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <select
                          value={compareVersionBId || ''}
                          onChange={e => setCompareVersionBId(e.target.value)}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-xs text-graphite-200"
                        >
                          {shotMediaList.map(m => (
                            <option key={m.id} value={m.id}>B: {m.versionName}</option>
                          ))}
                        </select>
                        <div className="aspect-video bg-graphite-950 rounded-lg overflow-hidden border border-graphite-750 flex items-center justify-center">
                          {compareVersionBId && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={shotMediaList.find(m => m.id === compareVersionBId)?.url}
                              alt="Version B"
                              className="max-w-full max-h-full object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* COLUMN 3: RIGHT SHOT PARAMETERS & PROGRESSIVE DIRECTOR DETAILS */}
          {selectedShot ? (
            <div className="w-80 lg:w-96 flex flex-col bg-graphite-850 overflow-y-auto shrink-0 p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-graphite-750 pb-2">
                  <span className="text-xs font-bold text-graphite-100 uppercase tracking-wider">
                    {locale === 'zh' ? '镜头基本参数' : 'Parameter Asas Syot'}
                  </span>
                  <button
                    onClick={() => {
                      const confirmMsg = locale === 'zh'
                        ? `确认删除 Shot ${selectedShot.shotNumber}？`
                        : `Sahkan padam Syot ${selectedShot.shotNumber}?`;
                      if (confirm(confirmMsg)) {
                        deleteShot(selectedShot.id);
                      }
                    }}
                    className="p-1 rounded text-graphite-400 hover:text-rose-400"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Shot Name */}
                <div>
                  <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                    {t.workbench.shotName}
                  </label>
                  <input
                    type="text"
                    value={selectedShot.name}
                    onChange={e => updateShot(selectedShot.id, { name: e.target.value })}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded-lg px-2.5 py-1 text-xs text-graphite-100 font-semibold focus:outline-none focus:border-cyanAccent"
                  />
                </div>

                {/* Narrative Goal */}
                <div>
                  <label className="text-[10px] text-cyanAccent font-semibold block mb-0.5">
                    {t.workbench.narrativeGoal}
                  </label>
                  <textarea
                    value={selectedShot.narrativeGoal}
                    onChange={e => updateShot(selectedShot.id, { narrativeGoal: e.target.value })}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-xs text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    rows={2}
                  />
                </div>

                {/* Visual Description */}
                <div>
                  <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                    {t.workbench.visualDescription}
                  </label>
                  <textarea
                    value={selectedShot.visualDescription}
                    onChange={e => updateShot(selectedShot.id, { visualDescription: e.target.value })}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-xs text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    rows={2}
                  />
                </div>

                {/* Subject Action & Camera Movement */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                      {t.workbench.subjectAction}
                    </label>
                    <input
                      type="text"
                      value={selectedShot.subjectAction}
                      onChange={e => updateShot(selectedShot.id, { subjectAction: e.target.value })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                      {t.workbench.cameraMovement}
                    </label>
                    <select
                      value={selectedShot.cameraMovement}
                      onChange={e => updateShot(selectedShot.id, { cameraMovement: e.target.value as CameraMovement })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                    >
                      <option value="static">Pegun (Static)</option>
                      <option value="pan">Sorot Kiri/Kanan (Pan)</option>
                      <option value="tilt">Condong Atas/Bawah (Tilt)</option>
                      <option value="dolly_in">Tolak Masuk (Dolly In)</option>
                      <option value="dolly_out">Tarik Keluar (Dolly Out)</option>
                      <option value="tracking">Jejak (Tracking)</option>
                      <option value="crane">Kren (Crane)</option>
                      <option value="handheld">Pegang Tangan (Handheld)</option>
                      <option value="orbit">Orbit (Orbit)</option>
                      <option value="zoom">Zum (Zoom)</option>
                    </select>
                  </div>
                </div>

                {/* Target Duration & Production Method */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                      {t.workbench.targetDurationSec}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={selectedShot.targetDurationSeconds}
                      onChange={e => updateShot(selectedShot.id, { targetDurationSeconds: Number(e.target.value) })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                      {locale === 'zh' ? '制作方式' : 'Kaedah Produksi'}
                    </label>
                    <select
                      value={selectedShot.productionMethod}
                      onChange={e => updateShot(selectedShot.id, { productionMethod: e.target.value as ProductionMethod })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                    >
                      <option value="hybrid">{t.methods.hybrid}</option>
                      <option value="full_ai">{t.methods.full_ai}</option>
                      <option value="live_action">{t.methods.live_action}</option>
                    </select>
                  </div>
                </div>

                {/* Sound & Dialogue */}
                <div>
                  <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                    {t.workbench.soundAndDialogue}
                  </label>
                  <input
                    type="text"
                    value={selectedShot.soundAndDialogue}
                    onChange={e => updateShot(selectedShot.id, { soundAndDialogue: e.target.value })}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded px-2.5 py-1 text-xs text-graphite-200"
                  />
                </div>
              </div>

              {/* PROGRESSIVE DISCLOSURE: DIRECTOR DETAILS */}
              <div className="border border-graphite-750 rounded-xl overflow-hidden bg-graphite-900/60">
                <button
                  onClick={() => setDirectorDetailsOpen(!directorDetailsOpen)}
                  className="w-full p-3 bg-graphite-800 flex items-center justify-between text-xs font-bold text-cyanAccent hover:bg-graphite-750 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{t.workbench.cinematographyDetails}</span>
                  </div>
                  {directorDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {directorDetailsOpen && (
                  <div className="p-3 space-y-3 text-xs border-t border-graphite-750">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                          {t.workbench.shotSize}
                        </label>
                        <select
                          value={selectedShot.directorDetails.shotSize || 'medium'}
                          onChange={e => updateShot(selectedShot.id, {
                            directorDetails: { ...selectedShot.directorDetails, shotSize: e.target.value as ShotSize }
                          })}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                        >
                          <option value="extreme_wide">Sangat Jauh / ELS</option>
                          <option value="wide">Jauh / WS</option>
                          <option value="medium_wide">Sederhana Jauh / MWS</option>
                          <option value="medium">Sederhana / MS</option>
                          <option value="medium_close">Sederhana Dekat / MCU</option>
                          <option value="close_up">Dekat / CU</option>
                          <option value="extreme_close">Sangat Dekat / ECU</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                          {t.workbench.cameraAngle}
                        </label>
                        <select
                          value={selectedShot.directorDetails.cameraAngle || 'eye_level'}
                          onChange={e => updateShot(selectedShot.id, {
                            directorDetails: { ...selectedShot.directorDetails, cameraAngle: e.target.value as CameraAngle }
                          })}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                        >
                          <option value="eye_level">Paras Mata (Eye Level)</option>
                          <option value="low_angle">Sudut Rendah (Low Angle)</option>
                          <option value="high_angle">Sudut Tinggi (High Angle)</option>
                          <option value="bird_eye">Pandangan Burung (Bird Eye)</option>
                          <option value="dutch_angle">Sudut Belanda (Dutch Angle)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                          {t.workbench.lensFocalLength}
                        </label>
                        <input
                          type="text"
                          placeholder="Cth: 35mm, 85mm"
                          value={selectedShot.directorDetails.lensFocalLength || ''}
                          onChange={e => updateShot(selectedShot.id, {
                            directorDetails: { ...selectedShot.directorDetails, lensFocalLength: e.target.value }
                          })}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                          {t.workbench.eyelineDirection}
                        </label>
                        <select
                          value={selectedShot.directorDetails.eyelineDirection || 'screen_left'}
                          onChange={e => updateShot(selectedShot.id, {
                            directorDetails: { ...selectedShot.directorDetails, eyelineDirection: e.target.value as EyelineDirection }
                          })}
                          className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                        >
                          <option value="screen_left">Kiri Skrin (Screen Left)</option>
                          <option value="screen_right">Kanan Skrin (Screen Right)</option>
                          <option value="direct_camera">Terus ke Kamera (Direct)</option>
                          <option value="off_screen_up">Atas Luar Skrin (Up)</option>
                          <option value="off_screen_down">Bawah Luar Skrin (Down)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                        {t.workbench.composition}
                      </label>
                      <input
                        type="text"
                        value={selectedShot.directorDetails.composition || ''}
                        onChange={e => updateShot(selectedShot.id, {
                          directorDetails: { ...selectedShot.directorDetails, composition: e.target.value }
                        })}
                        placeholder={locale === 'zh' ? '如: 三分构图，主体偏右...' : 'Cth: Komposisi pertigaan, subjek di kanan...'}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                        {t.workbench.lightingDirection}
                      </label>
                      <input
                        type="text"
                        value={selectedShot.directorDetails.lightingDirection || ''}
                        onChange={e => updateShot(selectedShot.id, {
                          directorDetails: { ...selectedShot.directorDetails, lightingDirection: e.target.value }
                        })}
                        placeholder={locale === 'zh' ? '如: 侧逆光，雨滴高光剔透...' : 'Cth: Cahaya belakang sisi, sorotan titisan hujan...'}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-graphite-400 font-semibold mb-1">
                        <span>{t.workbench.emotionalIntensity}</span>
                        <span className="font-mono text-cyanAccent">{selectedShot.directorDetails.emotionalIntensity || 5}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedShot.directorDetails.emotionalIntensity || 5}
                        onChange={e => updateShot(selectedShot.id, {
                          directorDetails: { ...selectedShot.directorDetails, emotionalIntensity: Number(e.target.value) }
                        })}
                        className="w-full accent-cyanAccent"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                        {t.workbench.continuityNotes}
                      </label>
                      <input
                        type="text"
                        value={selectedShot.directorDetails.continuityNotes || ''}
                        onChange={e => updateShot(selectedShot.id, {
                          directorDetails: { ...selectedShot.directorDetails, continuityNotes: e.target.value }
                        })}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-graphite-200"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-graphite-400 font-semibold block mb-0.5">
                        {t.workbench.vfxNotes}
                      </label>
                      <textarea
                        value={selectedShot.directorDetails.vfxNotes || ''}
                        onChange={e => updateShot(selectedShot.id, {
                          directorDetails: { ...selectedShot.directorDetails, vfxNotes: e.target.value }
                        })}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded p-2 text-graphite-200"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* VIEW MODE 2: EDITABLE TABLE */}
      {viewMode === 'table' && (
        <div className="flex-1 overflow-auto bg-graphite-900 p-4">
          <table className="w-full text-left text-xs border border-graphite-750">
            <thead className="bg-graphite-800 text-graphite-300 font-mono uppercase text-[10px] sticky top-0 z-10 border-b border-graphite-750">
              <tr>
                <th className="p-2.5 w-16">No</th>
                <th className="p-2.5 w-36">{t.workbench.shotName}</th>
                <th className="p-2.5 w-24">Kaedah</th>
                <th className="p-2.5 w-24">Status</th>
                <th className="p-2.5 w-20">Durasi</th>
                <th className="p-2.5 w-24">Saiz</th>
                <th className="p-2.5 w-28">Kamera</th>
                <th className="p-2.5">{t.workbench.visualDescription}</th>
                <th className="p-2.5">{t.workbench.subjectAction}</th>
                <th className="p-2.5">{t.workbench.narrativeGoal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-750 font-sans">
              {filteredShots.map(shot => (
                <tr
                  key={shot.id}
                  onClick={() => setSelectedShotId(shot.id)}
                  className={`hover:bg-graphite-800/80 cursor-pointer ${
                    shot.id === selectedShot?.id ? 'bg-cyanAccent/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono text-cyanAccent font-bold">
                    Shot {shot.shotNumber}
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={shot.name}
                      onChange={e => updateShot(shot.id, { name: e.target.value })}
                      className="w-full bg-transparent border-none text-graphite-100 font-medium focus:ring-1 focus:ring-cyanAccent rounded px-1"
                    />
                  </td>
                  <td className="p-2.5 font-mono text-graphite-300">
                    {shot.productionMethod}
                  </td>
                  <td className="p-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-graphite-800 border border-graphite-700">
                      {shot.status}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-graphite-200">
                    <input
                      type="number"
                      value={shot.targetDurationSeconds}
                      onChange={e => updateShot(shot.id, { targetDurationSeconds: Number(e.target.value) })}
                      className="w-14 bg-graphite-800 border border-graphite-700 rounded px-1.5 py-0.5 text-center"
                    />
                  </td>
                  <td className="p-2.5 text-graphite-300">
                    {shot.directorDetails.shotSize || '-'}
                  </td>
                  <td className="p-2.5 text-graphite-300">
                    {shot.cameraMovement}
                  </td>
                  <td className="p-2.5 text-graphite-300 max-w-xs truncate">
                    {shot.visualDescription}
                  </td>
                  <td className="p-2.5 text-graphite-300 max-w-xs truncate">
                    {shot.subjectAction}
                  </td>
                  <td className="p-2.5 text-graphite-300 max-w-xs truncate">
                    {shot.narrativeGoal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW MODE 3: SEQUENCE TIMELINE PREVIEW */}
      {viewMode === 'sequence' && (
        <div className="flex-1 flex flex-col p-6 items-center justify-center bg-graphite-950">
          <div className="max-w-4xl w-full bg-graphite-900 border border-graphite-750 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-graphite-100 flex items-center gap-2">
                  <PlaySquare className="w-5 h-5 text-cyanAccent" />
                  <span>{t.workbench.sequenceView}</span>
                </h3>
                <span className="text-xs text-graphite-400">
                  Syot {selectedShot?.shotNumber} / {shots.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const idx = shots.findIndex(s => s.id === selectedShot?.id);
                    if (idx > 0) setSelectedShotId(shots[idx - 1].id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-xs text-graphite-200"
                >
                  {t.delivery.prevShot}
                </button>
                <button
                  onClick={() => {
                    const idx = shots.findIndex(s => s.id === selectedShot?.id);
                    if (idx < shots.length - 1) setSelectedShotId(shots[idx + 1].id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs hover:bg-cyanAccent-hover"
                >
                  {t.delivery.nextShot}
                </button>
              </div>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-graphite-750 flex items-center justify-center relative">
              {adoptedMedia ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={adoptedMedia.url}
                  alt={selectedShot?.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-graphite-500 text-xs">{t.workbench.noMedia}</div>
              )}

              <div className="absolute bottom-4 left-4 bg-graphite-900/80 backdrop-blur px-3 py-2 rounded-lg border border-graphite-750 max-w-lg">
                <div className="font-mono text-cyanAccent font-bold text-xs">
                  SYOT {selectedShot?.shotNumber}: {selectedShot?.name}
                </div>
                <div className="text-[11px] text-graphite-300 mt-1">
                  {selectedShot?.visualDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTINUOUS TIMELINE STRIP */}
      {timelineStripOpen && viewMode === 'cards' && (
        <div className="h-28 border-t border-graphite-750 bg-graphite-900 px-4 py-2 shrink-0 flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[11px] text-graphite-400 pb-1">
            <span className="font-semibold text-graphite-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cyanAccent" />
              {t.workbench.timelineStrip} ({shots.length})
            </span>
            <button
              onClick={() => setTimelineStripOpen(false)}
              className="hover:text-graphite-200 text-[10px]"
            >
              {t.workbench.collapseTimeline}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {shots.map(s => {
              const isSelected = s.id === selectedShot?.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedShotId(s.id)}
                  className={`w-28 h-18 rounded-lg border shrink-0 p-1 flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-graphite-800 border-cyanAccent shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                      : 'bg-graphite-850 border-graphite-750 hover:border-graphite-650'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-cyanAccent">S{s.shotNumber}</span>
                    <span className="text-graphite-400">{s.targetDurationSeconds}s</span>
                  </div>

                  <div className="text-[10px] text-graphite-300 truncate font-medium">
                    {s.name}
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-graphite-400 font-mono">
                    <span>{s.directorDetails.shotSize || 'MS'}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'approved' ? 'bg-emerald-400' : s.status === 'ready_for_review' ? 'bg-sky-400' : 'bg-graphite-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
