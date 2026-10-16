'use client';

/**
 * ProjectCreationModal: Streamlined New Project Wizard
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Project, AspectRatio, ProductionMethod } from '@/types';
import { Film, Sparkles, X, ArrowRight, Check } from 'lucide-react';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCreationModal({ isOpen, onClose }: ProjectCreationModalProps) {
  const { createProject, setActiveTab, t, locale } = useProject();

  const [name, setName] = useState('');
  const [type, setType] = useState<Project['type']>('short_film');
  const [logline, setLogline] = useState('');
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(120);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [primaryLanguage, setPrimaryLanguage] = useState(
    locale === 'zh' ? '中文 / 英文辅助' : 'Bahasa Melayu / Sarikata Cina'
  );
  const [primaryProductionMethod, setPrimaryProductionMethod] = useState<ProductionMethod>('hybrid');
  const [visualDirection, setVisualDirection] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createProject({
      name,
      type,
      logline,
      targetDurationSeconds,
      aspectRatio,
      primaryLanguage,
      primaryProductionMethod,
      visualDirection,
      deadline: deadline || undefined,
    });

    setActiveTab('overview');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-graphite-850 border border-graphite-750 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-graphite-750 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-graphite-100">
                {locale === 'zh' ? '新建影视制作项目向导' : 'Panduan Cipta Projek Produksi Filem Baru'}
              </h2>
              <p className="text-[10px] text-graphite-400">
                {locale === 'zh' ? '设置核心创作与视听技术参数' : 'Tetapan parameter kreatif teras dan teknikal audio visual'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100 hover:bg-graphite-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project Name */}
          <div>
            <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
              {locale === 'zh' ? '项目名称 (必填) *' : 'Nama Projek (Wajib) *'}
            </label>
            <input
              type="text"
              required
              placeholder={locale === 'zh' ? '例如: 《极夜裂变 / CHRONO ECLIPSE》' : 'Cth: NOD RAHSIA 2 / MISI KUALA LUMPUR'}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2.5 text-graphite-100 font-semibold focus:outline-none focus:border-cyanAccent"
            />
          </div>

          {/* Project Type & Production Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                {locale === 'zh' ? '项目形态' : 'Bentuk / Format Projek'}
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
              >
                <option value="short_film">Filem Pendek (Short Film)</option>
                <option value="short_drama">Drama Pendek (Short Drama)</option>
                <option value="commercial">Iklan Komersial (Commercial)</option>
                <option value="music_video">Video Muzik (MV)</option>
                <option value="custom">Tersuai (Custom)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                {locale === 'zh' ? '主要制作方式' : 'Kaedah Produksi Utama'}
              </label>
              <select
                value={primaryProductionMethod}
                onChange={e => setPrimaryProductionMethod(e.target.value as any)}
                className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
              >
                <option value="hybrid">{t.methods.hybrid}</option>
                <option value="full_ai">{t.methods.full_ai}</option>
                <option value="live_action">{t.methods.live_action}</option>
              </select>
            </div>
          </div>

          {/* Logline */}
          <div>
            <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
              {t.overview.loglineLabel}
            </label>
            <textarea
              placeholder={locale === 'zh' ? '描述主角、主要危机与终极行动目标...' : 'Huraikan watak utama, krisis dihadapi dan matlamat tindakan...'}
              value={logline}
              onChange={e => setLogline(e.target.value)}
              className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2.5 text-graphite-200 focus:outline-none focus:border-cyanAccent"
              rows={2}
            />
          </div>

          {/* Target Duration, Aspect Ratio, Language */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                {t.workbench.targetDurationSec}
              </label>
              <input
                type="number"
                min={10}
                max={3600}
                value={targetDurationSeconds}
                onChange={e => setTargetDurationSeconds(Number(e.target.value))}
                className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                {t.workbench.aspectRatio}
              </label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value as any)}
                className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
              >
                <option value="16:9">16:9 (Skrin Lebar)</option>
                <option value="9:16">9:16 (Menegak Telefon)</option>
                <option value="1:1">1:1 (Segi Empat)</option>
                <option value="2.39:1">2.39:1 (Anamorfik)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                {locale === 'zh' ? '主要语言' : 'Bahasa Utama'}
              </label>
              <input
                type="text"
                value={primaryLanguage}
                onChange={e => setPrimaryLanguage(e.target.value)}
                className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
              />
            </div>
          </div>

          {/* Visual Direction */}
          <div>
            <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
              {t.overview.visualDirectionLabel}
            </label>
            <input
              type="text"
              placeholder={locale === 'zh' ? '例如: 赛博朋克黑雨纪实、高对比硬侧逆光...' : 'Cth: Cyberpunk Noir, Hujan lebat, neon hijau dan biru kontras tinggi...'}
              value={visualDirection}
              onChange={e => setVisualDirection(e.target.value)}
              className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2.5 text-graphite-200 focus:outline-none focus:border-cyanAccent"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-graphite-750">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-graphite-750 text-graphite-300 hover:bg-graphite-700 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyanAccent text-graphite-950 font-bold hover:bg-cyanAccent-hover transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-1.5"
            >
              <span>{locale === 'zh' ? '创建并进入工作台' : 'Cipta & Buka Meja Kerja'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
