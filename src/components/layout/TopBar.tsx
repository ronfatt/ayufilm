'use client';

/**
 * TopBar: Brand Branding, Language Switcher (Bahasa Melayu Utama / Terjemahan Cina),
 * Project Selector, Local Storage Indicator, Member Switcher, and Continuity Audit.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Locale } from '@/i18n';
import {
  Film,
  HardDrive,
  Users,
  AlertTriangle,
  Settings,
  Plus,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Languages,
  Globe
} from 'lucide-react';

interface TopBarProps {
  onOpenNewProject: () => void;
  onOpenSettings: () => void;
  onOpenAudit: () => void;
  auditIssueCount: number;
}

export function TopBar({
  onOpenNewProject,
  onOpenSettings,
  onOpenAudit,
  auditIssueCount
}: TopBarProps) {
  const {
    brandName,
    activeProject,
    projects,
    setActiveProjectId,
    members,
    activeMember,
    setActiveMemberId,
    saveStatus,
    resetDemoProject,
    storageUsage,
    locale,
    setLocale,
    t,
  } = useProject();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    const confirmMsg = locale === 'zh'
      ? '确认重置官方演示项目《NOD RAHSIA: Siri Musim 1》？此操作不会影响您自建的项目。'
      : 'Sahkan set semula projek demo rasmi "NOD RAHSIA: Siri Musim 1"? Tindakan ini tidak akan menjejaskan projek ciptaan anda.';

    if (confirm(confirmMsg)) {
      setIsResetting(true);
      await resetDemoProject();
      setIsResetting(false);
      setProjectDropdownOpen(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <header className="h-14 border-b border-graphite-750 bg-graphite-900 px-4 flex items-center justify-between select-none z-30">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Logo / Badge */}
        <div className="flex items-center gap-2 pr-3 border-r border-graphite-750">
          <div className="w-8 h-8 rounded-lg bg-cyanAccent/10 border border-cyanAccent/40 flex items-center justify-center text-cyanAccent shadow-[0_0_12px_rgba(0,229,255,0.25)]">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-graphite-100 flex items-center gap-1.5">
              {brandName}
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-graphite-750 text-cyanAccent font-mono border border-graphite-600">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-graphite-400">{t.brand.tagline}</span>
          </div>
        </div>

        {/* Project Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-graphite-800 border border-graphite-750 hover:border-graphite-600 transition-colors text-xs text-graphite-200"
          >
            <span className="text-graphite-400">
              {locale === 'zh' ? '当前项目:' : 'Projek Semasa:'}
            </span>
            <span className="font-semibold text-graphite-100 max-w-[200px] truncate">
              {activeProject ? activeProject.name : 'Tiada Projek'}
            </span>
            {activeProject?.isDemo && (
              <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 font-mono">
                DEMO
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-graphite-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-graphite-850 border border-graphite-700 rounded-lg shadow-2xl p-1.5 z-50">
              <div className="text-[10px] uppercase font-semibold text-graphite-400 px-2 py-1 tracking-wider">
                {locale === 'zh' ? `所有项目清单 (${projects.length})` : `Senarai Semua Projek (${projects.length})`}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      p.id === activeProject?.id
                        ? 'bg-cyanAccent/15 text-cyanAccent font-medium border border-cyanAccent/30'
                        : 'text-graphite-200 hover:bg-graphite-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-[10px] text-graphite-400">
                        {p.targetDurationSeconds}s • {p.aspectRatio} • {p.primaryProductionMethod === 'hybrid' ? t.methods.hybrid : p.primaryProductionMethod === 'full_ai' ? t.methods.full_ai : t.methods.live_action}
                      </div>
                    </div>
                    {p.isDemo && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 font-mono shrink-0">
                        Demo
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-graphite-750 mt-1 pt-1 space-y-1">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenNewProject();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-graphite-200 hover:bg-graphite-800 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-cyanAccent" />
                  {locale === 'zh' ? '新建制作项目' : 'Cipta Projek Baru'}
                </button>
                <button
                  onClick={handleResetDemo}
                  disabled={isResetting}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-amber-300 hover:bg-amber-950/30 flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isResetting ? 'animate-spin' : ''}`} />
                  {locale === 'zh' ? '重置官方演示项目数据' : 'Set Semula Projek Demo Rasmi'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Local Demo Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-graphite-800/80 border border-graphite-700 text-[11px] text-graphite-300">
          <HardDrive className="w-3 h-3 text-cyanAccent" />
          <span>{t.brand.localSandbox}</span>
          <span className="text-[10px] text-graphite-400 font-mono">
            (IndexedDB {storageUsage.usageBytes > 0 ? formatBytes(storageUsage.usageBytes) : 'OK'})
          </span>
        </div>
      </div>

      {/* Right Controls: Language Switcher, Auto-save, Audit, Member Perspective, Settings */}
      <div className="flex items-center gap-2.5">
        {/* Language Selection Dropdown (Bahasa Melayu Utama / Terjemahan Cina) */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-graphite-800 border border-cyanAccent/40 hover:bg-graphite-750 text-xs text-cyanAccent transition-colors font-medium shadow-[0_0_8px_rgba(0,229,255,0.15)]"
            title="Tukar Bahasa / 切换语言选项"
          >
            <Globe className="w-3.5 h-3.5 text-cyanAccent" />
            <span>
              {locale === 'ms'
                ? '🇲🇾 Bahasa Melayu'
                : locale === 'ms_zh'
                ? '🇲🇾/🇨🇳 Melayu + 中文'
                : '🇨🇳 中文'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {languageDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-graphite-850 border border-graphite-700 rounded-lg shadow-2xl p-1.5 z-50 text-xs">
              <div className="text-[10px] uppercase font-semibold text-graphite-400 px-2 py-1">
                Pilihan Bahasa / 语言与翻译选项
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => {
                    setLocale('ms');
                    setLanguageDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between ${
                    locale === 'ms' ? 'bg-cyanAccent/20 text-cyanAccent font-bold' : 'text-graphite-200 hover:bg-graphite-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇲🇾</span>
                    <div>
                      <div>Bahasa Melayu (Utama)</div>
                      <div className="text-[10px] text-graphite-400">Pilihan Lalai Pengarah</div>
                    </div>
                  </div>
                  {locale === 'ms' && <CheckCircle2 className="w-3.5 h-3.5 text-cyanAccent" />}
                </button>

                <button
                  onClick={() => {
                    setLocale('ms_zh');
                    setLanguageDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between ${
                    locale === 'ms_zh' ? 'bg-cyanAccent/20 text-cyanAccent font-bold' : 'text-graphite-200 hover:bg-graphite-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇲🇾/🇨🇳</span>
                    <div>
                      <div>Melayu + Terjemahan Cina</div>
                      <div className="text-[10px] text-graphite-400">双语对照模式 (Bilingual)</div>
                    </div>
                  </div>
                  {locale === 'ms_zh' && <CheckCircle2 className="w-3.5 h-3.5 text-cyanAccent" />}
                </button>

                <button
                  onClick={() => {
                    setLocale('zh');
                    setLanguageDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between ${
                    locale === 'zh' ? 'bg-cyanAccent/20 text-cyanAccent font-bold' : 'text-graphite-200 hover:bg-graphite-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇨🇳</span>
                    <div>
                      <div>Bahasa Cina (中文)</div>
                      <div className="text-[10px] text-graphite-400">Terjemahan Penuh Cina</div>
                    </div>
                  </div>
                  {locale === 'zh' && <CheckCircle2 className="w-3.5 h-3.5 text-cyanAccent" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Auto-save Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-graphite-400 font-mono">
          {saveStatus === 'saving' ? (
            <>
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
              <span className="text-amber-400 text-[11px]">{t.common.saving}</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-graphite-400 text-[11px]">{t.common.saveSuccess}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400 text-[11px]">{t.common.saveFailed}</span>
            </>
          )}
        </div>

        {/* Director Audit Rule Inspector Button */}
        <button
          onClick={onOpenAudit}
          className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
            auditIssueCount > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              : 'bg-graphite-800 border-graphite-750 text-graphite-300 hover:bg-graphite-750'
          }`}
          title={locale === 'zh' ? '打开导演连续性与规则核验面板' : 'Buka Audit Kesinambungan Pengarah'}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyanAccent" />
          <span>{locale === 'zh' ? '导演核验' : 'Audit Pengarah'}</span>
          {auditIssueCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-graphite-950 text-[10px] font-bold">
              {auditIssueCount}
            </span>
          )}
        </button>

        {/* Member Viewpoint Switcher (Demonstration role perspective) */}
        <div className="relative">
          <button
            onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-graphite-800 border border-graphite-750 hover:border-graphite-600 text-xs text-graphite-200 transition-colors"
            title="Tukar Perspektif Ahli Pasukan (Demo)"
          >
            <Users className="w-3.5 h-3.5 text-cyanAccent" />
            <span className="max-w-[120px] truncate">{activeMember.name}</span>
            <ChevronDown className="w-3 h-3 text-graphite-400" />
          </button>

          {memberDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-graphite-850 border border-graphite-700 rounded-lg shadow-2xl p-1.5 z-50">
              <div className="text-[10px] uppercase font-semibold text-graphite-400 px-2 py-1">
                {locale === 'zh' ? '切换演示成员视角 (Demo)' : 'Tukar Perspektif Demo (Perspektif Ahli)'}
              </div>
              <div className="text-[10px] text-graphite-400 px-2 pb-1.5 border-b border-graphite-750">
                {locale === 'zh'
                  ? '演示成员切换仅改变当前任务视角，不伪装多人同步服务。'
                  : 'Pertukaran ahli demo hanya mengubah perspektif tugas, tidak memalsukan penyegerakan awan.'}
              </div>
              <div className="mt-1 space-y-0.5">
                {members.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMemberId(m.id);
                      setMemberDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                      m.id === activeMember.id
                        ? 'bg-cyanAccent/15 text-cyanAccent font-medium'
                        : 'text-graphite-200 hover:bg-graphite-800'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] text-graphite-400 uppercase font-mono">
                      {m.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md bg-graphite-800 border border-graphite-750 hover:bg-graphite-750 hover:text-cyanAccent text-graphite-300 transition-colors"
          title={t.settings.title}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
