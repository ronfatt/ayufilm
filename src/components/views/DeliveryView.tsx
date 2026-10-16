'use client';

/**
 * DeliveryView: Sequential Cut Preview, Duration Budget, and Edit Handover Exporters
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  exportStoryboardToCsv,
  exportEditHandoverCsv,
  triggerFileDownload
} from '@/services/export';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Download,
  FileSpreadsheet,
  Printer,
  FileJson,
  Clock,
  ChevronRight
} from 'lucide-react';

export function DeliveryView() {
  const {
    activeProject,
    shots,
    media,
    scenes,
    assets,
    exportCurrentProject,
    t,
    locale,
  } = useProject();

  const sortedShots = [...shots].sort((a, b) => a.shotNumber - b.shotNumber);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemainingInShot, setSecondsRemainingInShot] = useState(
    sortedShots[0]?.targetDurationSeconds || 4
  );

  const activeShot = sortedShots[currentShotIndex] || null;
  const activeMedia = activeShot?.adoptedMediaVersionId
    ? media.find(m => m.id === activeShot.adoptedMediaVersionId)
    : media.find(m => m.shotId === activeShot?.id);

  const totalDuration = sortedShots.reduce((acc, s) => acc + (s.targetDurationSeconds || 0), 0);
  const targetDuration = activeProject?.targetDurationSeconds || 120;
  const durationDiff = totalDuration - targetDuration;

  const unfinishedShots = sortedShots.filter(s => s.status !== 'approved');
  const missingMediaShots = sortedShots.filter(s => {
    return !media.some(m => m.shotId === s.id);
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && activeShot) {
      timer = setInterval(() => {
        setSecondsRemainingInShot(prev => {
          if (prev <= 1) {
            if (currentShotIndex < sortedShots.length - 1) {
              const nextIdx = currentShotIndex + 1;
              setCurrentShotIndex(nextIdx);
              return sortedShots[nextIdx].targetDurationSeconds || 4;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentShotIndex, activeShot, sortedShots]);

  const handleTogglePlay = () => {
    if (!isPlaying && currentShotIndex >= sortedShots.length - 1 && secondsRemainingInShot === 0) {
      setCurrentShotIndex(0);
      setSecondsRemainingInShot(sortedShots[0]?.targetDurationSeconds || 4);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextShot = () => {
    if (currentShotIndex < sortedShots.length - 1) {
      const nextIdx = currentShotIndex + 1;
      setCurrentShotIndex(nextIdx);
      setSecondsRemainingInShot(sortedShots[nextIdx].targetDurationSeconds || 4);
    }
  };

  const handlePrevShot = () => {
    if (currentShotIndex > 0) {
      const prevIdx = currentShotIndex - 1;
      setCurrentShotIndex(prevIdx);
      setSecondsRemainingInShot(sortedShots[prevIdx].targetDurationSeconds || 4);
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportCurrentProject();
    triggerFileDownload(
      jsonStr,
      `${activeProject?.name || 'Project'}_DirectorOS_${Date.now()}.json`,
      'application/json;charset=utf-8'
    );
  };

  const handleExportStoryboardCsv = () => {
    if (!activeProject) return;
    const csvStr = exportStoryboardToCsv(activeProject, scenes, shots, assets);
    triggerFileDownload(
      csvStr,
      `${activeProject.name}_Papan_Cerita_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const handleExportHandoverCsv = () => {
    if (!activeProject) return;
    const csvStr = exportEditHandoverCsv(activeProject, shots, media);
    triggerFileDownload(
      csvStr,
      `${activeProject.name}_Jadual_Serahan_Suntingan_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const handlePrintStoryboard = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto bg-graphite-900 select-none">
      {/* Left: Sequential Preview Stage */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        {/* Notice Banner */}
        <div className="px-4 py-2 rounded-lg bg-graphite-850 border border-graphite-750 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyanAccent">
            <Film className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{locale === 'zh' ? '制作预演模式' : 'Mod Pratonton Pra-Visual'}</span>
            <span className="text-graphite-400 font-normal">
              — {t.delivery.previsualNotice}
            </span>
          </div>

          <span className="font-mono text-graphite-400 text-[11px]">
            {currentShotIndex + 1} / {sortedShots.length} {t.delivery.shotCount}
          </span>
        </div>

        {/* Viewfinder Player */}
        <div className="relative bg-black rounded-2xl overflow-hidden border border-graphite-750 flex items-center justify-center min-h-[380px] max-h-[540px] shadow-2xl">
          {activeMedia ? (
            activeMedia.mediaType === 'video' ? (
              <video
                src={activeMedia.url}
                autoPlay
                muted
                loop
                className="max-w-full max-h-[500px] aspect-video object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMedia.url}
                alt={activeShot?.name}
                className="max-w-full max-h-[500px] aspect-video object-contain"
              />
            )
          ) : (
            <div className="p-8 text-center space-y-2">
              <Film className="w-12 h-12 text-graphite-700 mx-auto" />
              <div className="text-graphite-400 text-xs">{t.workbench.noMedia}</div>
            </div>
          )}

          {/* Lower-Third Cue */}
          <div className="absolute bottom-4 left-4 right-4 bg-graphite-950/85 backdrop-blur-md p-3.5 rounded-xl border border-graphite-750 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-cyanAccent">
                  SYOT {activeShot?.shotNumber}
                </span>
                <span className="text-xs font-bold text-graphite-100">{activeShot?.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-graphite-800 text-graphite-300 font-mono">
                  {activeShot?.directorDetails.shotSize} • {activeShot?.cameraMovement}
                </span>
              </div>
              <div className="text-[11px] text-graphite-300 max-w-2xl truncate">
                {activeShot?.visualDescription}
              </div>
              {activeShot?.soundAndDialogue && (
                <div className="text-[10px] text-graphite-400 font-mono">
                  Dialog/Bunyi: {activeShot.soundAndDialogue}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-mono font-bold text-cyanAccent">
                00:0{secondsRemainingInShot}
              </div>
              <div className="text-[10px] text-graphite-400 font-mono">
                {locale === 'zh' ? '本镜设定:' : 'Sasaran:'} {activeShot?.targetDurationSeconds}s
              </div>
            </div>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevShot}
              disabled={currentShotIndex === 0}
              className="p-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-graphite-300 disabled:opacity-40 transition-colors"
              title={t.delivery.prevShot}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-4 py-2 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyanAccent-hover transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? t.delivery.pausePreview : t.delivery.playContinuous}</span>
            </button>

            <button
              onClick={handleNextShot}
              disabled={currentShotIndex >= sortedShots.length - 1}
              className="p-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-graphite-300 disabled:opacity-40 transition-colors"
              title={t.delivery.nextShot}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentShotIndex(0);
                setSecondsRemainingInShot(sortedShots[0]?.targetDurationSeconds || 4);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 text-graphite-400 hover:text-graphite-200"
              title={t.delivery.restartStart}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-graphite-400">
            <span>
              {t.delivery.adoptedMediaRatio} {sortedShots.filter(s => s.adoptedMediaVersionId).length}/{sortedShots.length}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Handover Exporters & Delivery Audit */}
      <div className="w-full lg:w-96 border-l border-graphite-750 bg-graphite-850 p-6 flex flex-col space-y-5 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-graphite-100 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-cyanAccent" />
            {t.delivery.title}
          </h2>
          <p className="text-[11px] text-graphite-400 mt-0.5">
            {t.delivery.subtitle}
          </p>
        </div>

        {/* Duration Budget Card */}
        <div className="p-4 rounded-xl bg-graphite-900 border border-graphite-750 space-y-2 text-xs">
          <div className="flex items-center justify-between text-graphite-400">
            <span>{t.overview.durationBudget}</span>
            <Clock className="w-3.5 h-3.5 text-cyanAccent" />
          </div>

          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xl font-bold text-graphite-100">{totalDuration} saat</span>
            <span className="text-graphite-400">{t.overview.targetDuration}: {targetDuration}s</span>
          </div>

          <div className="text-[11px] pt-1 border-t border-graphite-750/80">
            {durationDiff > 0 ? (
              <span className="text-amber-400">⚠️ {t.overview.overDuration} +{durationDiff}s</span>
            ) : durationDiff < 0 ? (
              <span className="text-cyanAccent">ℹ️ {t.overview.underDuration} {Math.abs(durationDiff)}s</span>
            ) : (
              <span className="text-emerald-400">✓ {t.overview.exactDuration}</span>
            )}
          </div>
        </div>

        {/* Delivery Readiness Alerts */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] text-graphite-400 font-semibold block uppercase">
            {t.delivery.checklistTitle}
          </span>

          <div className="space-y-1.5">
            <div className="p-2.5 rounded-lg bg-graphite-800 border border-graphite-700 flex items-center justify-between">
              <span className="text-graphite-300">{t.delivery.unapprovedShots}</span>
              <span className={`font-mono font-bold ${unfinishedShots.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {unfinishedShots.length}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-graphite-800 border border-graphite-700 flex items-center justify-between">
              <span className="text-graphite-300">{t.delivery.missingMediaShots}</span>
              <span className={`font-mono font-bold ${missingMediaShots.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {missingMediaShots.length}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Professional Exporters */}
        <div className="space-y-2.5 pt-2 border-t border-graphite-750">
          <span className="text-[10px] text-graphite-400 font-semibold block uppercase">
            {locale === 'zh' ? '正式交付文件导出:' : 'Eksport Dokumen Industri Rasmi:'}
          </span>

          {/* 1. Edit Handover CSV */}
          <button
            onClick={handleExportHandoverCsv}
            className="w-full p-3 rounded-lg bg-cyanAccent/10 hover:bg-cyanAccent/20 border border-cyanAccent/40 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-cyanAccent flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                {t.delivery.exportHandoverCsv}
              </div>
              <div className="text-[10px] text-graphite-400 mt-0.5">
                {t.delivery.exportHandoverCsvDesc}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyanAccent transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 2. Storyboard CSV */}
          <button
            onClick={handleExportStoryboardCsv}
            className="w-full p-3 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-graphite-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                {t.delivery.exportStoryboardCsv}
              </div>
              <div className="text-[10px] text-graphite-400 mt-0.5">
                {t.delivery.exportStoryboardCsvDesc}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-graphite-400" />
          </button>

          {/* 3. Printable Storyboard Layout */}
          <button
            onClick={handlePrintStoryboard}
            className="w-full p-3 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-graphite-200 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-sky-400" />
                {t.delivery.printStoryboardPdf}
              </div>
              <div className="text-[10px] text-graphite-400 mt-0.5">
                {t.delivery.printStoryboardPdfDesc}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-graphite-400" />
          </button>

          {/* 4. Project Full JSON Backup */}
          <button
            onClick={handleExportJson}
            className="w-full p-3 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-750 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-graphite-200 flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-amber-400" />
                {t.delivery.exportFullJson}
              </div>
              <div className="text-[10px] text-graphite-400 mt-0.5">
                {t.delivery.exportFullJsonDesc}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-graphite-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
