'use client';

/**
 * ProjectOverviewView: Executive Director & Production Dashboard
 * Direct Answers (Primary: Bahasa Melayu, with Chinese translation support):
 * 1. Apakah yang sedang saya hasilkan? (What am I making?)
 * 2. Apakah yang memerlukan pengesahan saya? (What needs my approval?)
 * 3. Di manakah produksi sedang tersekat? (Where is production blocked?)
 * 4. Apakah langkah seterusnya? (What to do next?)
 * All metrics derived from real shot/task data; clicking filters jumps to Shot Workbench.
 */

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  Film,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  ShieldAlert,
  ListTodo,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ProjectOverviewViewProps {
  onFilterShotsByStatus: (status: string) => void;
}

export function ProjectOverviewView({ onFilterShotsByStatus }: ProjectOverviewViewProps) {
  const {
    activeProject,
    shots,
    tasks,
    assets,
    scenes,
    setActiveTab,
    setSelectedShotId,
    selectedShotId,
    t,
    locale,
  } = useProject();

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-graphite-400">
        {locale === 'zh' ? '请先创建或选择一个制作项目。' : 'Sila cipta atau pilih satu projek produksi terlebih dahulu.'}
      </div>
    );
  }

  // Real statistics derived from actual data
  const totalShots = shots.length;
  const approvedShots = shots.filter(s => s.status === 'approved');
  const reviewPendingShots = shots.filter(s => s.status === 'ready_for_review');
  const revisionShots = shots.filter(s => s.status === 'changes_requested');
  const inProgressShots = shots.filter(s => s.status === 'in_progress');
  const draftShots = shots.filter(s => s.status === 'draft');

  const totalDuration = shots.reduce((acc, s) => acc + (s.targetDurationSeconds || 0), 0);
  const targetDuration = activeProject.targetDurationSeconds || 120;
  const durationDiff = totalDuration - targetDuration;

  const blockedTasks = tasks.filter(t => t.status === 'blocked');
  const pendingTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'todo');

  const approvedPercent = totalShots > 0 ? Math.round((approvedShots.length / totalShots) * 100) : 0;
  const reviewPercent = totalShots > 0 ? Math.round((reviewPendingShots.length / totalShots) * 100) : 0;
  const progressPercent = totalShots > 0 ? Math.round((inProgressShots.length / totalShots) * 100) : 0;

  // Jump to specific shot
  const handleJumpToShot = (shotId: string) => {
    setSelectedShotId(shotId);
    setActiveTab('shots');
  };

  const handleFilterClick = (statusKey: string) => {
    onFilterShotsByStatus(statusKey);
    setActiveTab('shots');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Hero: "Apakah yang sedang saya hasilkan?" */}
      <section className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-cyanAccent/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
            {/* Series Cinematic Key Visual Poster */}
            <div className="w-28 sm:w-36 h-36 sm:h-44 rounded-lg overflow-hidden border border-graphite-700 shadow-xl shrink-0 relative group bg-graphite-900">
              <img
                src="/demo/series_cover.jpg"
                alt={activeProject.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-1.5 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40 font-bold backdrop-blur-sm">
                4K UHD
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 uppercase">
                  {activeProject.type.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-graphite-400 font-mono">
                  {activeProject.aspectRatio} • {activeProject.primaryLanguage}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-graphite-750 text-graphite-300 font-mono">
                  {activeProject.primaryProductionMethod === 'hybrid'
                    ? t.methods.hybrid
                    : activeProject.primaryProductionMethod === 'full_ai'
                    ? t.methods.full_ai
                    : t.methods.live_action}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-graphite-100 flex items-center gap-3">
                {activeProject.name}
                {activeProject.isDemo && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                    PROJEK DEMO
                  </span>
                )}
              </h1>

              <p className="text-sm text-graphite-300 max-w-3xl leading-relaxed">
                <span className="text-cyanAccent font-medium">{t.overview.loglineLabel}: </span>
                {activeProject.logline || 'Tiada huraian cerita'}
              </p>

              <div className="text-xs text-graphite-400">
                <span className="text-graphite-300 font-medium">{t.overview.visualDirectionLabel}: </span>
                {activeProject.visualDirection || 'Belum dikonfigurasi'}
              </div>
            </div>
          </div>

          {/* Quick Actions & Continue Last Work */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                if (selectedShotId) {
                  setActiveTab('shots');
                } else if (shots.length > 0) {
                  setSelectedShotId(shots[0].id);
                  setActiveTab('shots');
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-cyanAccent text-graphite-950 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-cyanAccent-hover transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <PlayCircle className="w-4 h-4" />
              {t.overview.resumeWork}
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className="px-4 py-2 rounded-lg bg-graphite-750 text-graphite-200 hover:bg-graphite-700 text-xs flex items-center justify-center gap-2 transition-colors border border-graphite-650"
            >
              <Film className="w-4 h-4 text-graphite-400" />
              {t.nav.delivery}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Status Grid: 4 Essential Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Apakah yang memerlukan pengesahan saya? */}
        <div
          onClick={() => handleFilterClick('ready_for_review')}
          className="bg-graphite-850 border border-graphite-750 hover:border-cyanAccent/50 rounded-xl p-4 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-graphite-400">{t.overview.whatNeedsConfirm}</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-sky-300">
              {reviewPendingShots.length}
            </span>
            <span className="text-xs text-graphite-400">{t.overview.pendingReviews}</span>
          </div>
          <div className="mt-2 text-xs text-graphite-400 flex items-center justify-between group-hover:text-cyanAccent transition-colors">
            <span>{revisionShots.length} {locale === 'zh' ? '需修改' : 'perlu pindaan'}</span>
            <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Di manakah produksi sedang tersekat? */}
        <div
          onClick={() => setActiveTab('production')}
          className="bg-graphite-850 border border-graphite-750 hover:border-rose-500/50 rounded-xl p-4 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-graphite-400">{t.overview.whereIsBlocked}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-400">
              {blockedTasks.length}
            </span>
            <span className="text-xs text-graphite-400">{t.overview.blockedTasks}</span>
          </div>
          <div className="mt-2 text-xs text-rose-400/90 truncate group-hover:text-rose-300 transition-colors">
            {blockedTasks[0] ? blockedTasks[0].blockerReason : (locale === 'zh' ? '暂无受阻任务' : 'Tiada sekatan operasi')}
          </div>
        </div>

        {/* Card 3: Durasi Sasaran vs Terkumpul */}
        <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-graphite-400">{t.overview.durationBudget}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-graphite-100">
              {totalDuration}s
            </span>
            <span className="text-xs text-graphite-400 font-mono">
              / {t.overview.targetDuration} {targetDuration}s
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center gap-1.5">
            {durationDiff > 0 ? (
              <span className="text-amber-400">{t.overview.overDuration} +{durationDiff}s</span>
            ) : durationDiff < 0 ? (
              <span className="text-cyanAccent">{t.overview.underDuration} {Math.abs(durationDiff)}s</span>
            ) : (
              <span className="text-emerald-400">{t.overview.exactDuration}</span>
            )}
          </div>
        </div>

        {/* Card 4: Kadar Kelulusan */}
        <div
          onClick={() => handleFilterClick('approved')}
          className="bg-graphite-850 border border-graphite-750 hover:border-emerald-500/50 rounded-xl p-4 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-graphite-400">{t.overview.approvedRate}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {approvedPercent}%
            </span>
            <span className="text-xs text-graphite-400 font-mono">
              ({approvedShots.length}/{totalShots} {locale === 'zh' ? '镜' : 'syot'})
            </span>
          </div>
          <div className="mt-2 text-xs text-graphite-400 flex items-center justify-between group-hover:text-emerald-300">
            <span>{t.overview.jumpToShots}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 3. Real Stage Progress & Next Step Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Production Stage Breakdown */}
        <div className="lg:col-span-2 bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-graphite-750 pb-3">
            <div>
              <h2 className="text-sm font-bold text-graphite-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyanAccent" />
                {t.overview.stageProgress}
              </h2>
              <p className="text-[11px] text-graphite-400 mt-0.5">
                {t.overview.stageSubtitle}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('shots')}
              className="text-xs text-cyanAccent hover:underline flex items-center gap-1"
            >
              {t.overview.viewAllShots}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Progress Bar Component */}
          <div className="space-y-2">
            <div className="h-4 rounded-full bg-graphite-750 overflow-hidden flex">
              <div
                style={{ width: `${approvedPercent}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`${t.status.approved}: ${approvedPercent}%`}
              />
              <div
                style={{ width: `${reviewPercent}%` }}
                className="bg-sky-500 h-full transition-all"
                title={`${t.status.ready_for_review}: ${reviewPercent}%`}
              />
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`${t.status.in_progress}: ${progressPercent}%`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
              <button
                onClick={() => handleFilterClick('approved')}
                className="flex items-center gap-2 p-2 rounded bg-graphite-800 hover:bg-graphite-750 text-left transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-graphite-400">{t.status.approved}</div>
                  <div className="font-mono font-bold text-emerald-400">{approvedShots.length}</div>
                </div>
              </button>

              <button
                onClick={() => handleFilterClick('ready_for_review')}
                className="flex items-center gap-2 p-2 rounded bg-graphite-800 hover:bg-graphite-750 text-left transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-graphite-400">{t.status.ready_for_review}</div>
                  <div className="font-mono font-bold text-sky-400">{reviewPendingShots.length}</div>
                </div>
              </button>

              <button
                onClick={() => handleFilterClick('changes_requested')}
                className="flex items-center gap-2 p-2 rounded bg-graphite-800 hover:bg-graphite-750 text-left transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-graphite-400">{t.status.changes_requested}</div>
                  <div className="font-mono font-bold text-rose-400">{revisionShots.length}</div>
                </div>
              </button>

              <button
                onClick={() => handleFilterClick('in_progress')}
                className="flex items-center gap-2 p-2 rounded bg-graphite-800 hover:bg-graphite-750 text-left transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-graphite-400">{t.status.in_progress}</div>
                  <div className="font-mono font-bold text-amber-400">{inProgressShots.length}</div>
                </div>
              </button>

              <button
                onClick={() => handleFilterClick('draft')}
                className="flex items-center gap-2 p-2 rounded bg-graphite-800 hover:bg-graphite-750 text-left transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-graphite-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-graphite-400">{t.status.draft}</div>
                  <div className="font-mono font-bold text-graphite-300">{draftShots.length}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Approval List Quick View */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-graphite-200">
              {t.overview.pendingReviewPill}
            </div>
            <div className="space-y-1.5">
              {reviewPendingShots.length > 0 ? (
                reviewPendingShots.slice(0, 3).map(shot => (
                  <div
                    key={shot.id}
                    onClick={() => handleJumpToShot(shot.id)}
                    className="p-2.5 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyanAccent font-bold text-xs">
                        Shot {String(shot.shotNumber).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="text-xs font-medium text-graphite-100">{shot.name}</div>
                        <div className="text-[10px] text-graphite-400 truncate max-w-md">
                          {shot.visualDescription}
                        </div>
                      </div>
                    </div>
                    <button className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] hover:bg-sky-500/30 shrink-0">
                      {t.overview.reviewNow}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-graphite-400 bg-graphite-800/50 rounded-lg">
                  {t.overview.noPendingReview}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: "Apakah langkah seterusnya?" */}
        <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-4">
          <div className="border-b border-graphite-750 pb-3">
            <h2 className="text-sm font-bold text-graphite-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyanAccent" />
              {t.overview.nextSteps}
            </h2>
            <p className="text-[11px] text-graphite-400 mt-0.5">
              {t.overview.nextStepsSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {reviewPendingShots.length > 0 && (
              <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 space-y-1.5">
                <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === 'zh'
                    ? `优先完成 ${reviewPendingShots.length} 个镜头的导演审阅`
                    : `Selesaikan semakan pengarah bagi ${reviewPendingShots.length} syot`}
                </div>
                <p className="text-[11px] text-graphite-300 leading-normal">
                  {locale === 'zh'
                    ? 'Shot 03、Shot 04 等素材已上传完成，核准后将自动推进剪辑交接表。'
                    : 'Bahan Shot 03 & Shot 04 telah dimuat naik. Pengesahan akan mengemaskini jadual serahan.'}
                </p>
                <button
                  onClick={() => handleFilterClick('ready_for_review')}
                  className="text-xs text-sky-400 font-medium hover:underline flex items-center gap-1 pt-1"
                >
                  {locale === 'zh' ? '去审核这些镜头' : 'Semak syot ini sekarang'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {blockedTasks.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {locale === 'zh'
                    ? `解除制作阻塞 (${blockedTasks.length} 项)`
                    : `Atasi Sekatan Operasi (${blockedTasks.length} tugasan)`}
                </div>
                <p className="text-[11px] text-graphite-300 leading-normal">
                  {blockedTasks[0]?.title}: {blockedTasks[0]?.blockerReason}
                </p>
                <button
                  onClick={() => setActiveTab('production')}
                  className="text-xs text-rose-400 font-medium hover:underline flex items-center gap-1 pt-1"
                >
                  {locale === 'zh' ? '前往任务看板排查' : 'Buka Papan Tugas'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="p-3 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1.5">
              <div className="text-xs font-semibold text-graphite-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyanAccent" />
                {locale === 'zh' ? '检查视听连续性规则' : 'Pemeriksaan Peraturan Kesinambungan'}
              </div>
              <p className="text-[11px] text-graphite-400 leading-normal">
                {locale === 'zh'
                  ? '建议运行顶部「导演核验」检查连续景别与轴线衔接，标记创作意图。'
                  : 'Jalankan "Audit Pengarah" di bahagian atas untuk memeriksa kesinambungan saiz syot dan paksi.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
