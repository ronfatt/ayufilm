'use client';

/**
 * StoryWorkspaceView: Script Editor, Versioning, Scene Breakdown, and Shot Linking
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { parseScriptByRules } from '@/services/story/parser';
import {
  ScrollText,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Save,
  Clock,
  MapPin,
  Users,
  Sun,
  Moon,
  Heart,
  Film,
  Check
} from 'lucide-react';
import { Scene } from '@/types';

export function StoryWorkspaceView() {
  const {
    activeProject,
    scripts,
    scenes,
    saveScript,
    addScene,
    updateScene,
    deleteScene,
    shots,
    setActiveTab,
    setSelectedShotId,
    t,
    locale,
  } = useProject();

  const currentScript = scripts[0];
  const [scriptContent, setScriptContent] = useState(currentScript?.content || '');
  const [scriptTitle, setScriptTitle] = useState(
    currentScript?.title || (locale === 'zh' ? '主拍摄剧本 Rev 1.0' : 'Skrip Penggambaran Utama Rev 1.0')
  );
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [parsedDrafts, setParsedDrafts] = useState<Scene[]>([]);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [scriptSavedNotification, setScriptSavedNotification] = useState(false);

  const handleSaveScript = async () => {
    await saveScript(scriptContent, scriptTitle);
    setScriptSavedNotification(true);
    setTimeout(() => setScriptSavedNotification(false), 2500);
  };

  const handleRunRuleBreakdown = () => {
    if (!activeProject) return;
    const results = parseScriptByRules(scriptContent, activeProject.id);
    setParsedDrafts(results);
    setIsBreakdownModalOpen(true);
  };

  const handleApplyBreakdownScenes = async () => {
    for (const sc of parsedDrafts) {
      await addScene({
        projectId: sc.projectId,
        sceneNumber: sc.sceneNumber,
        heading: sc.heading,
        location: sc.location,
        timeOfDay: sc.timeOfDay,
        characters: sc.characters,
        actionSummary: sc.actionSummary,
        dialogueSummary: sc.dialogueSummary,
        emotionalGoal: sc.emotionalGoal,
        estimatedDurationSeconds: sc.estimatedDurationSeconds,
        order: sc.order,
      });
    }
    setIsBreakdownModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-graphite-900">
      {/* Left: Script Editor & Versioning */}
      <div className="w-full lg:w-1/2 border-r border-graphite-750 flex flex-col h-full bg-graphite-900/60">
        {/* Header */}
        <div className="h-12 border-b border-graphite-750 px-4 flex items-center justify-between shrink-0 bg-graphite-850">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-cyanAccent" />
            <input
              type="text"
              value={scriptTitle}
              onChange={e => setScriptTitle(e.target.value)}
              className="bg-transparent border-none font-semibold text-xs text-graphite-100 focus:outline-none focus:ring-1 focus:ring-cyanAccent rounded px-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunRuleBreakdown}
              className="px-2.5 py-1 rounded bg-graphite-750 hover:bg-graphite-700 text-cyanAccent text-xs flex items-center gap-1.5 transition-colors border border-cyanAccent/30"
              title={t.story.breakdownSubtitle}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.story.breakdownScript}
            </button>
            <button
              onClick={handleSaveScript}
              className="px-3 py-1 rounded bg-cyanAccent text-graphite-950 font-semibold text-xs flex items-center gap-1.5 hover:bg-cyanAccent-hover transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {t.story.saveNewVersion}
            </button>
          </div>
        </div>

        {scriptSavedNotification && (
          <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30 text-xs flex items-center justify-between animate-fadeIn">
            <span>{t.story.savedNotice}</span>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        {/* Script Text Area */}
        <div className="flex-1 p-4 flex flex-col">
          <textarea
            value={scriptContent}
            onChange={e => setScriptContent(e.target.value)}
            placeholder={
              locale === 'zh'
                ? '在此粘贴或编写剧本文本... 支持标准格式：SCENE 1: INT. 地点 - NIGHT'
                : 'Tampal atau taip skrip di sini... Format standard: SCENE 1: INT. LOKASI - NIGHT'
            }
            className="flex-1 w-full p-4 bg-graphite-850 border border-graphite-750 rounded-lg text-sm font-mono text-graphite-200 focus:outline-none focus:border-cyanAccent resize-none leading-relaxed"
          />
          <div className="mt-2 text-[11px] text-graphite-400 flex items-center justify-between">
            <span>
              {locale === 'zh'
                ? `支持中英文/马来文混合剧本 • 字数: ${scriptContent.length}`
                : `Menyokong Skrip Bahasa Melayu, Inggeris & Cina • ${scriptContent.length} aksara`}
            </span>
            <span>
              {scripts.length} {t.story.versionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Scene List & Detailed Scene Cards */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-graphite-900 overflow-y-auto">
        <div className="h-12 border-b border-graphite-750 px-4 flex items-center justify-between shrink-0 bg-graphite-850 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-graphite-100">
              {t.story.scenesList} ({scenes.length} {locale === 'zh' ? '场' : 'babak'})
            </span>
            <span className="text-[10px] text-graphite-400">
              {locale === 'zh' ? '已拆解结构化剧情单元' : 'Unit Babak Berstruktur'}
            </span>
          </div>

          <button
            onClick={async () => {
              if (!activeProject) return;
              const nextNum = scenes.length + 1;
              await addScene({
                projectId: activeProject.id,
                sceneNumber: nextNum,
                heading: `SCENE ${nextNum}: INT. LOKASI BARU - NIGHT`,
                location: locale === 'zh' ? '新地点' : 'Lokasi Baru',
                timeOfDay: 'night',
                characters: [locale === 'zh' ? '主角' : 'Watak Utama'],
                actionSummary: locale === 'zh' ? '动作梗概待补充' : 'Ringkasan aksi untuk dilengkapkan',
                dialogueSummary: locale === 'zh' ? '核心对白待补充' : 'Fokus dialog untuk dilengkapkan',
                emotionalGoal: locale === 'zh' ? '确立场次戏剧张力' : 'Membina ketegangan dramatik babak',
                estimatedDurationSeconds: 30,
                order: nextNum,
              });
            }}
            className="px-2.5 py-1 rounded bg-graphite-750 hover:bg-graphite-700 text-graphite-200 text-xs flex items-center gap-1 transition-colors border border-graphite-650"
          >
            <Plus className="w-3.5 h-3.5 text-cyanAccent" />
            {t.story.addSceneManual}
          </button>
        </div>

        {/* Scene Cards */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {scenes.map(scene => {
            const linkedShots = shots.filter(s => s.sceneId === scene.id);
            const isEditing = editingSceneId === scene.id;

            return (
              <div
                key={scene.id}
                className="bg-graphite-850 border border-graphite-750 hover:border-graphite-650 rounded-xl p-4 transition-all shadow-sm space-y-3"
              >
                {/* Scene Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="px-2 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 font-mono text-xs font-bold shrink-0">
                      {locale === 'zh' ? `第 ${scene.sceneNumber} 场` : `Babak ${scene.sceneNumber}`}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={scene.heading}
                        onChange={e => updateScene(scene.id, { heading: e.target.value })}
                        className="flex-1 bg-graphite-800 border border-graphite-700 rounded px-2 py-0.5 text-xs text-graphite-100 font-semibold focus:outline-none focus:border-cyanAccent"
                      />
                    ) : (
                      <h3 className="font-semibold text-xs text-graphite-100 truncate">
                        {scene.heading}
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingSceneId(isEditing ? null : scene.id)}
                      className="p-1 rounded text-graphite-400 hover:text-cyanAccent hover:bg-graphite-750 transition-colors"
                      title={isEditing ? 'Selesai' : 'Edit'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const confirmMsg = locale === 'zh'
                          ? `确认删除第 ${scene.sceneNumber} 场？关联镜头将失去场次归属。`
                          : `Sahkan padam Babak ${scene.sceneNumber}? Syot berkaitan akan kehilangan perkaitan babak.`;
                        if (confirm(confirmMsg)) {
                          deleteScene(scene.id);
                        }
                      }}
                      className="p-1 rounded text-graphite-400 hover:text-rose-400 hover:bg-graphite-750 transition-colors"
                      title="Padam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scene Metadata Tags */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-graphite-300">
                  <div className="flex items-center gap-1 bg-graphite-800 px-2 py-0.5 rounded border border-graphite-700/80">
                    <MapPin className="w-3 h-3 text-cyanAccent" />
                    <span>{scene.location}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-graphite-800 px-2 py-0.5 rounded border border-graphite-700/80">
                    {scene.timeOfDay === 'day' ? (
                      <Sun className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Moon className="w-3 h-3 text-indigo-400" />
                    )}
                    <span>{scene.timeOfDay === 'day' ? t.story.dayScene : t.story.nightScene}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-graphite-800 px-2 py-0.5 rounded border border-graphite-700/80">
                    <Clock className="w-3 h-3 text-graphite-400" />
                    <span>{t.story.estimatedDuration} {scene.estimatedDurationSeconds}s</span>
                  </div>

                  <div className="flex items-center gap-1 bg-graphite-800 px-2 py-0.5 rounded border border-graphite-700/80">
                    <Film className="w-3 h-3 text-cyanAccent" />
                    <span>{linkedShots.length} {t.story.linkedShotsCount}</span>
                  </div>
                </div>

                {/* Scene Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-graphite-900/50 p-3 rounded-lg border border-graphite-750">
                  <div>
                    <span className="text-[10px] text-graphite-400 block font-semibold mb-0.5">
                      {t.story.actionSummary}:
                    </span>
                    {isEditing ? (
                      <textarea
                        value={scene.actionSummary}
                        onChange={e => updateScene(scene.id, { actionSummary: e.target.value })}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded p-1.5 text-xs text-graphite-200"
                        rows={2}
                      />
                    ) : (
                      <p className="text-graphite-300 leading-normal">{scene.actionSummary}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-graphite-400 block font-semibold mb-0.5">
                      {t.story.dialogueSummary}:
                    </span>
                    {isEditing ? (
                      <textarea
                        value={scene.dialogueSummary}
                        onChange={e => updateScene(scene.id, { dialogueSummary: e.target.value })}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded p-1.5 text-xs text-graphite-200"
                        rows={2}
                      />
                    ) : (
                      <p className="text-graphite-300 leading-normal">{scene.dialogueSummary}</p>
                    )}
                  </div>
                </div>

                {/* Emotional Goal (Matlamat Emosi) */}
                <div className="flex items-start gap-2 bg-cyanAccent/5 border border-cyanAccent/20 p-2.5 rounded-lg text-xs">
                  <Heart className="w-3.5 h-3.5 text-cyanAccent shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] text-cyanAccent font-semibold block">
                      {t.story.emotionalGoal}:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={scene.emotionalGoal}
                        onChange={e => updateScene(scene.id, { emotionalGoal: e.target.value })}
                        className="w-full bg-graphite-800 border border-graphite-700 rounded px-2 py-1 text-xs text-graphite-100 mt-1"
                      />
                    ) : (
                      <span className="text-graphite-200">{scene.emotionalGoal}</span>
                    )}
                  </div>
                </div>

                {/* Linked Shots Quick Bar */}
                {linkedShots.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
                    <span className="text-[10px] text-graphite-400 shrink-0">
                      {locale === 'zh' ? '所属分镜:' : 'Syot Terpaut:'}
                    </span>
                    {linkedShots.map(shot => (
                      <button
                        key={shot.id}
                        onClick={() => {
                          setSelectedShotId(shot.id);
                          setActiveTab('shots');
                        }}
                        className="px-2 py-0.5 rounded bg-graphite-800 hover:bg-cyanAccent/20 hover:text-cyanAccent text-[10px] font-mono border border-graphite-700 text-graphite-300 transition-colors shrink-0"
                      >
                        Shot {shot.shotNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Breakdown Confirmation Modal */}
      {isBreakdownModalOpen && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-graphite-850 border border-graphite-700 rounded-xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-750 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyanAccent" />
                <h3 className="text-sm font-bold text-graphite-100">
                  {t.story.breakdownModalTitle}
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {t.story.breakdownRuleBadge}
              </span>
            </div>

            <p className="text-xs text-graphite-300 leading-relaxed">
              {t.story.breakdownDesc} ({parsedDrafts.length} {locale === 'zh' ? '场' : 'babak'})
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {parsedDrafts.map((d, i) => (
                <div key={i} className="p-3 rounded-lg bg-graphite-900 border border-graphite-750 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyanAccent">{d.heading}</span>
                    <span className="text-graphite-400 font-mono">{d.timeOfDay.toUpperCase()}</span>
                  </div>
                  <div className="text-[11px] text-graphite-300">
                    <span className="text-graphite-400">
                      {locale === 'zh' ? '登场角色：' : 'Watak Terlibat: '}
                    </span>
                    {d.characters.join(', ')}
                  </div>
                  <div className="text-[11px] text-graphite-400 truncate">
                    {d.actionSummary}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-graphite-750">
              <button
                onClick={() => setIsBreakdownModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-graphite-750 text-graphite-300 hover:bg-graphite-700 text-xs transition-colors"
              >
                {t.story.cancel}
              </button>
              <button
                onClick={handleApplyBreakdownScenes}
                className="px-4 py-2 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs hover:bg-cyanAccent-hover transition-colors shadow-[0_0_12px_rgba(0,229,255,0.3)]"
              >
                {t.story.confirmMerge}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
