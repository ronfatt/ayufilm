'use client';

/**
 * SettingsModal: Brand Configuration, Language Selection, Storage Quota, JSON Backup,
 * and External Services Decoupled Architecture Guide.
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Locale } from '@/i18n';
import {
  Settings,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  X,
  Server,
  Cloud,
  Globe,
  Check
} from 'lucide-react';
import { triggerFileDownload } from '@/services/export';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    brandName,
    setBrandName,
    storageUsage,
    resetDemoProject,
    exportCurrentProject,
    importProjectFromJson,
    activeProject,
    locale,
    setLocale,
    t,
  } = useProject();

  const [inputBrand, setInputBrand] = useState(brandName);
  const [brandSaved, setBrandSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleSaveBrand = async () => {
    if (!inputBrand.trim()) return;
    await setBrandName(inputBrand);
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const text = await file.text();
    try {
      await importProjectFromJson(text);
      alert(locale === 'zh' ? '项目工程 JSON 导入成功！已切换到导入的项目。' : 'Projek JSON berjaya diimport! Bertukar ke projek baru.');
      onClose();
    } catch (err: any) {
      alert(`Import Gagal: ${err.message}`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-graphite-850 border border-graphite-750 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-graphite-750 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-graphite-100">{t.settings.title}</h2>
              <p className="text-[10px] text-graphite-400">{t.settings.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100 hover:bg-graphite-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Switcher Setting */}
        <div className="space-y-2 bg-graphite-900 border border-graphite-750 p-4 rounded-xl text-xs">
          <label className="text-[11px] font-bold text-graphite-200 block flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyanAccent" />
            <span>{t.settings.languageLabel}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setLocale('ms')}
              className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                locale === 'ms'
                  ? 'bg-cyanAccent/15 border-cyanAccent text-cyanAccent font-bold'
                  : 'bg-graphite-800 border-graphite-700 text-graphite-300 hover:bg-graphite-750'
              }`}
            >
              <div>
                <div>🇲🇾 Bahasa Melayu</div>
                <div className="text-[10px] text-graphite-400">Utama (Default)</div>
              </div>
              {locale === 'ms' && <Check className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setLocale('ms_zh')}
              className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                locale === 'ms_zh'
                  ? 'bg-cyanAccent/15 border-cyanAccent text-cyanAccent font-bold'
                  : 'bg-graphite-800 border-graphite-700 text-graphite-300 hover:bg-graphite-750'
              }`}
            >
              <div>
                <div>🇲🇾/🇨🇳 Melayu + 中文</div>
                <div className="text-[10px] text-graphite-400">Bilingual Subtitles</div>
              </div>
              {locale === 'ms_zh' && <Check className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setLocale('zh')}
              className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                locale === 'zh'
                  ? 'bg-cyanAccent/15 border-cyanAccent text-cyanAccent font-bold'
                  : 'bg-graphite-800 border-graphite-700 text-graphite-300 hover:bg-graphite-750'
              }`}
            >
              <div>
                <div>🇨🇳 中文</div>
                <div className="text-[10px] text-graphite-400">Bahasa Cina</div>
              </div>
              {locale === 'zh' && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Brand Name Customization */}
        <div className="space-y-2 bg-graphite-900 border border-graphite-750 p-4 rounded-xl text-xs">
          <label className="text-[11px] font-bold text-graphite-200 block">
            {t.settings.brandLabel}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputBrand}
              onChange={e => setInputBrand(e.target.value)}
              placeholder="Ayu AiFilm Maker"
              className="flex-1 bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-100 font-bold focus:outline-none focus:border-cyanAccent"
            />
            <button
              onClick={handleSaveBrand}
              className="px-4 py-2 rounded-lg bg-cyanAccent text-graphite-950 font-bold hover:bg-cyanAccent-hover transition-colors"
            >
              {brandSaved ? t.settings.savedBadge : t.settings.updateBrandBtn}
            </button>
          </div>
          <p className="text-[10px] text-graphite-400">
            {t.settings.brandDesc}
          </p>
        </div>

        {/* Local Storage & IndexedDB Status */}
        <div className="space-y-3 bg-graphite-900 border border-graphite-750 p-4 rounded-xl text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-graphite-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyanAccent" />
              {t.settings.sandboxTitle}
            </span>
            <span className="text-[10px] font-mono text-emerald-400">{t.settings.sandboxStatus}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-graphite-850 border border-graphite-750">
              <span className="text-graphite-400 block text-[10px]">{t.settings.usedStorage}</span>
              <span className="text-graphite-100 font-bold">{formatBytes(storageUsage.usageBytes)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-graphite-850 border border-graphite-750">
              <span className="text-graphite-400 block text-[10px]">{t.settings.availableQuota}</span>
              <span className="text-graphite-100 font-bold">{formatBytes(storageUsage.quotaBytes)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-graphite-400">
              {t.settings.sandboxDesc}
            </span>
            <button
              onClick={async () => {
                const confirmMsg = locale === 'zh'
                  ? '确认重置官方演示项目数据？'
                  : 'Sahkan set semula data projek demo rasmi?';
                if (confirm(confirmMsg)) {
                  setIsResetting(true);
                  await resetDemoProject();
                  setIsResetting(false);
                  alert(locale === 'zh' ? '官方演示数据已恢复初始状态。' : 'Data demo rasmi telah dipulihkan.');
                }
              }}
              disabled={isResetting}
              className="text-amber-400 hover:underline text-[11px] flex items-center gap-1 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              {t.settings.resetDemoBtn}
            </button>
          </div>
        </div>

        {/* Project Import / Export */}
        <div className="space-y-3 bg-graphite-900 border border-graphite-750 p-4 rounded-xl text-xs">
          <span className="font-bold text-graphite-200 block">
            {t.settings.backupTitle}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const str = exportCurrentProject();
                triggerFileDownload(str, `${activeProject?.name || 'Project'}_Backup.json`);
              }}
              className="flex-1 py-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-graphite-200 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyanAccent" />
              {t.settings.exportJsonBtn}
            </button>

            <label className="flex-1 py-2 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-graphite-200 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyanAccent" />
              {t.settings.importJsonBtn}
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="space-y-2 border-t border-graphite-750 pt-4 text-xs text-graphite-400">
          <span className="font-bold text-graphite-300 block">
            {t.settings.architectureTitle}
          </span>
          <p className="text-[11px] leading-relaxed">
            {t.settings.architectureDesc}
          </p>
          <ul className="text-[11px] space-y-1 list-disc list-inside font-mono text-graphite-400">
            <li><span className="text-graphite-200">IProjectService / IShotService</span>: PostgreSQL / Supabase</li>
            <li><span className="text-graphite-200">IMediaStorageService</span>: AWS S3 / Cloudflare R2</li>
            <li><span className="text-graphite-200">IAIService</span>: Kling / Runway / Midjourney API</li>
            <li><span className="text-graphite-200">ICollaborationService</span>: WebSocket / Yjs / Realtime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
