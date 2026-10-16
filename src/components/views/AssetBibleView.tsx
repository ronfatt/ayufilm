'use client';

/**
 * AssetBibleView: Visual Bible for Characters, Scenes, Props, and Visual Styles
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  Asset,
  AssetCategory,
  CharacterAssetDetails,
  SceneAssetDetails,
  PropAssetDetails,
  VisualStyleAssetDetails,
  Shot
} from '@/types';
import {
  Palette,
  User,
  MapPin,
  Package,
  Layers,
  Plus,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  Check,
  ChevronRight,
  Eye,
  Film
} from 'lucide-react';

export function AssetBibleView() {
  const {
    activeProject,
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    shots,
    updateShot,
    getAffectedShotsForAsset,
    setActiveTab,
    setSelectedShotId,
    t,
    locale,
  } = useProject();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('character');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(assets[0]?.id || null);

  // Version change & affected shots modal state
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [pendingAssetUpdate, setPendingAssetUpdate] = useState<{ assetId: string; updates: Partial<Asset> } | null>(null);
  const [affectedShots, setAffectedShots] = useState<Shot[]>([]);

  const filteredAssets = assets.filter(a => a.category === selectedCategory);
  const currentAsset = assets.find(a => a.id === selectedAssetId) || filteredAssets[0] || null;

  const categories = [
    { id: 'character' as const, label: t.bible.character, sub: 'Characters', icon: User },
    { id: 'scene' as const, label: t.bible.scene, sub: 'Environments', icon: MapPin },
    { id: 'prop' as const, label: t.bible.prop, sub: 'Props', icon: Package },
    { id: 'visual_style' as const, label: t.bible.visual_style, sub: 'Visual Style', icon: Palette },
  ];

  const handleInitiateAssetUpdate = (updates: Partial<Asset>) => {
    if (!currentAsset) return;
    const impact = getAffectedShotsForAsset(currentAsset.id);
    if (impact.length > 0) {
      setAffectedShots(impact);
      setPendingAssetUpdate({ assetId: currentAsset.id, updates });
      setIsImpactModalOpen(true);
    } else {
      updateAsset(currentAsset.id, updates);
    }
  };

  const handleResolveVersionChoice = async (updateShotsToNewVersion: boolean) => {
    if (!pendingAssetUpdate || !currentAsset) return;

    const nextVerNum = currentAsset.versions.length + 1;
    const newVersionId = `ver_${currentAsset.id}_v${nextVerNum}`;
    const newVersion = {
      versionId: newVersionId,
      versionNumber: nextVerNum,
      name: `Versi v${nextVerNum}.0`,
      description: locale === 'zh' ? '由导演修改更新的视觉设定版本' : 'Versi aset visual dikemas kini oleh pengarah',
      isLocked: true,
      createdAt: Date.now(),
    };

    const updatedAsset: Partial<Asset> = {
      ...pendingAssetUpdate.updates,
      currentVersionId: newVersionId,
      versions: [...currentAsset.versions, newVersion],
    };

    await updateAsset(currentAsset.id, updatedAsset);

    if (updateShotsToNewVersion) {
      for (const shot of affectedShots) {
        const updatedRefs = shot.assetReferences.map(ref => {
          if (ref.assetId === currentAsset.id) {
            return { ...ref, assetVersionId: newVersionId };
          }
          return ref;
        });
        await updateShot(shot.id, { assetReferences: updatedRefs });
      }
    }

    setIsImpactModalOpen(false);
    setPendingAssetUpdate(null);
  };

  const handleCreateNewAsset = async () => {
    if (!activeProject) return;
    let details: any = {};
    if (selectedCategory === 'character') {
      details = {
        identityRole: locale === 'zh' ? '新角色身份' : 'Peranan Watak Baru',
        ageRange: '25-30 tahun',
        appearance: locale === 'zh' ? '五官特征描述' : 'Keterangan ciri-ciri muka',
        hairstyle: locale === 'zh' ? '发型特征' : 'Gaya rambut',
        wardrobeVersions: [{ id: 'w1', label: locale === 'zh' ? '默认服装' : 'Pakaian Lalai', description: 'Gaya standard' }],
        voiceNotes: locale === 'zh' ? '声音特征' : 'Ciri-ciri suara',
      } as CharacterAssetDetails;
    } else if (selectedCategory === 'scene') {
      details = {
        spatialDescription: locale === 'zh' ? '空间结构' : 'Struktur ruang',
        entrancesExits: locale === 'zh' ? '主要通道' : 'Laluan utama',
        keyLightSources: locale === 'zh' ? '核心光源' : 'Pencahayaan utama',
        stateVersions: [{ id: 's1', label: locale === 'zh' ? '日间状态' : 'Keadaan Siang', description: 'Cahaya siang semulajadi' }],
      } as SceneAssetDetails;
    } else if (selectedCategory === 'prop') {
      details = {
        belongsToCharacter: locale === 'zh' ? '主角' : 'Watak Utama',
        keyStates: [{ id: 'p1', label: locale === 'zh' ? '标准手持状态' : 'Keadaan Standard', description: 'Rupa biasa' }],
      } as PropAssetDetails;
    } else {
      details = {
        colorPalette: locale === 'zh' ? '色彩基调' : 'Palet warna utama',
        contrastRatio: locale === 'zh' ? '对比度指南' : 'Panduan kontras',
        lightingMood: locale === 'zh' ? '光影风格' : 'Suasana pencahayaan',
        cinematographyRef: locale === 'zh' ? '摄影参考作品' : 'Rujukan sinematografi',
        aspectRatioRef: '16:9',
        prohibitions: locale === 'zh' ? '风格禁止事项' : 'Larangan gaya visual',
      } as VisualStyleAssetDetails;
    }

    const created = await addAsset({
      projectId: activeProject.id,
      category: selectedCategory,
      name: `${categories.find(c => c.id === selectedCategory)?.label} Baru`,
      summary: locale === 'zh' ? '设定概要描述' : 'Huraian ringkas tetapan',
      currentVersionId: 'ver_init_1',
      versions: [
        {
          versionId: 'ver_init_1',
          versionNumber: 1,
          name: 'Versi Awal v1.0',
          description: 'Piawaian visual yang dikunci pada mulanya',
          isLocked: true,
          createdAt: Date.now(),
        },
      ],
      details,
    });

    setSelectedAssetId(created.id);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-graphite-900">
      {/* Category Tabs & Asset Sidebar */}
      <div className="w-full lg:w-72 border-r border-graphite-750 flex flex-col bg-graphite-850 shrink-0">
        {/* Category Selector */}
        <div className="grid grid-cols-2 p-2 gap-1 border-b border-graphite-750">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isCatActive = selectedCategory === cat.id;
            const count = assets.filter(a => a.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const firstOfCat = assets.find(a => a.category === cat.id);
                  if (firstOfCat) setSelectedAssetId(firstOfCat.id);
                }}
                className={`p-2 rounded-lg text-left transition-all flex items-center justify-between ${
                  isCatActive
                    ? 'bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/30'
                    : 'text-graphite-300 hover:bg-graphite-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{cat.label}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-graphite-750 text-graphite-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredAssets.map(asset => {
            const isSelected = currentAsset?.id === asset.id;
            const linkedCount = getAffectedShotsForAsset(asset.id).length;

            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-graphite-800 border border-cyanAccent/40 text-graphite-100 shadow-sm'
                    : 'text-graphite-300 hover:bg-graphite-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  {asset.coverUrl ? (
                    <img
                      src={asset.coverUrl}
                      alt={asset.name}
                      className="w-9 h-9 rounded-md object-cover border border-graphite-700 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-graphite-800 border border-graphite-700 flex items-center justify-center shrink-0 text-graphite-400">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{asset.name}</div>
                    <div className="text-[10px] text-graphite-400 truncate">{asset.summary}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {linkedCount > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20">
                      {linkedCount} {locale === 'zh' ? '镜' : 'syot'}
                    </span>
                  )}
                  <Lock className="w-3 h-3 text-graphite-400" />
                </div>
              </button>
            );
          })}

          <button
            onClick={handleCreateNewAsset}
            className="w-full mt-2 py-2 rounded-lg border border-dashed border-graphite-650 hover:border-cyanAccent text-xs text-graphite-400 hover:text-cyanAccent flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.bible.newAsset}
          </button>
        </div>
      </div>

      {/* Main Asset Detail & Version Inspector */}
      {currentAsset ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent uppercase border border-cyanAccent/30">
                  {currentAsset.category}
                </span>
                <span className="text-[11px] text-graphite-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  {t.bible.lockedVersion}: {currentAsset.versions.find(v => v.versionId === currentAsset.currentVersionId)?.name || 'v1.0'}
                </span>
              </div>

              <input
                type="text"
                value={currentAsset.name}
                onChange={e => handleInitiateAssetUpdate({ name: e.target.value })}
                className="text-xl font-bold text-graphite-100 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyanAccent rounded px-1 w-full"
              />

              <input
                type="text"
                value={currentAsset.summary}
                onChange={e => handleInitiateAssetUpdate({ summary: e.target.value })}
                className="text-xs text-graphite-300 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyanAccent rounded px-1 w-full"
              />
            </div>

            {/* Linked Shots Quick Jump */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-graphite-400">
                {locale === 'zh'
                  ? `已引用此设定的镜头 (${getAffectedShotsForAsset(currentAsset.id).length}):`
                  : `Syot Merujuk Aset Ini (${getAffectedShotsForAsset(currentAsset.id).length}):`}
              </span>
              <div className="flex items-center gap-1 max-w-xs overflow-x-auto">
                {getAffectedShotsForAsset(currentAsset.id).slice(0, 5).map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedShotId(s.id);
                      setActiveTab('shots');
                    }}
                    className="px-2 py-1 rounded bg-graphite-750 hover:bg-cyanAccent/20 hover:text-cyanAccent text-[10px] font-mono border border-graphite-650 text-graphite-200 shrink-0"
                  >
                    Shot {s.shotNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Concept Art & Reference Showcase */}
          {currentAsset.coverUrl && (
            <div className="bg-graphite-850 border border-graphite-750 rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch">
              <div className="w-full md:w-96 h-56 md:h-64 bg-black relative shrink-0 overflow-hidden group">
                <img
                  src={currentAsset.coverUrl}
                  alt={currentAsset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-900/90 text-cyanAccent border border-cyanAccent/40 backdrop-blur-sm">
                    {locale === 'zh' ? '已定板制作基准' : 'Reka Bentuk Visual Sah'}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-graphite-900/80 text-graphite-300 backdrop-blur-sm">
                    8K Cinema Frame
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyanAccent" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-graphite-200">
                      {locale === 'zh' ? '设定视觉基准与参考 (Visual Bible Reference)' : 'Rujukan Piawaian Visual Siri'}
                    </h4>
                  </div>
                  <p className="text-xs text-graphite-300 leading-relaxed">
                    {currentAsset.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-graphite-750/70 text-[11px]">
                  <div className="bg-graphite-800/80 rounded-lg p-2 border border-graphite-700/60">
                    <span className="text-[9px] text-graphite-400 block font-mono">STATUS VERSI</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Terkunci (Locked)
                    </span>
                  </div>
                  <div className="bg-graphite-800/80 rounded-lg p-2 border border-graphite-700/60">
                    <span className="text-[9px] text-graphite-400 block font-mono">RUJUKAN SYOT</span>
                    <span className="font-bold text-cyanAccent">
                      {getAffectedShotsForAsset(currentAsset.id).length} Syot Aktif
                    </span>
                  </div>
                  <div className="bg-graphite-800/80 rounded-lg p-2 border border-graphite-700/60 col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-graphite-400 block font-mono">FORMAT VISUAL</span>
                    <span className="font-bold text-graphite-200">ARRI Alexa / AI Raw</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Asset Category-Specific Structured Details */}
          <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-graphite-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyanAccent" />
              {t.bible.structuredParams}
            </h3>

            {/* CHARACTER DETAILS */}
            {currentAsset.category === 'character' && (() => {
              const char = currentAsset.details as CharacterAssetDetails;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.roleIdentity}
                    </label>
                    <input
                      type="text"
                      value={char.identityRole}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...char, identityRole: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.ageRange}
                    </label>
                    <input
                      type="text"
                      value={char.ageRange}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...char, ageRange: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.appearance}
                    </label>
                    <textarea
                      value={char.appearance}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...char, appearance: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.hairstyle}
                    </label>
                    <input
                      type="text"
                      value={char.hairstyle}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...char, hairstyle: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.voiceNotes}
                    </label>
                    <input
                      type="text"
                      value={char.voiceNotes}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...char, voiceNotes: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>

                  {/* Wardrobe Versions */}
                  <div className="md:col-span-2 border-t border-graphite-750 pt-3 space-y-2">
                    <span className="text-[10px] text-graphite-400 font-semibold block">
                      {t.bible.wardrobeVersions}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {char.wardrobeVersions?.map(w => (
                        <div key={w.id} className="p-2.5 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1">
                          <div className="font-semibold text-cyanAccent text-xs">{w.label}</div>
                          <div className="text-[11px] text-graphite-300">{w.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SCENE DETAILS */}
            {currentAsset.category === 'scene' && (() => {
              const sc = currentAsset.details as SceneAssetDetails;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.spatialDescription}
                    </label>
                    <textarea
                      value={sc.spatialDescription}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...sc, spatialDescription: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.entrancesExits}
                    </label>
                    <input
                      type="text"
                      value={sc.entrancesExits}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...sc, entrancesExits: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.keyLightSources}
                    </label>
                    <input
                      type="text"
                      value={sc.keyLightSources}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...sc, keyLightSources: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                </div>
              );
            })()}

            {/* PROP DETAILS */}
            {currentAsset.category === 'prop' && (() => {
              const prop = currentAsset.details as PropAssetDetails;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.belongsToChar}
                    </label>
                    <input
                      type="text"
                      value={prop.belongsToCharacter || ''}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...prop, belongsToCharacter: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div className="md:col-span-2 border-t border-graphite-750 pt-2 space-y-2">
                    <span className="text-[10px] text-graphite-400 font-semibold block">
                      {t.bible.propStates}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {prop.keyStates?.map(st => (
                        <div key={st.id} className="p-2.5 rounded-lg bg-graphite-800 border border-graphite-700 space-y-1">
                          <div className="font-semibold text-cyanAccent text-xs">{st.label}</div>
                          <div className="text-[11px] text-graphite-300">{st.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VISUAL STYLE DETAILS */}
            {currentAsset.category === 'visual_style' && (() => {
              const style = currentAsset.details as VisualStyleAssetDetails;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.colorPalette}
                    </label>
                    <input
                      type="text"
                      value={style.colorPalette}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...style, colorPalette: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.contrastRatio}
                    </label>
                    <input
                      type="text"
                      value={style.contrastRatio}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...style, contrastRatio: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-graphite-400 font-semibold block mb-1">
                      {t.bible.cinematographyRef}
                    </label>
                    <input
                      type="text"
                      value={style.cinematographyRef}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...style, cinematographyRef: e.target.value } })}
                      className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-rose-400 font-semibold block mb-1">
                      {t.bible.prohibitions}
                    </label>
                    <input
                      type="text"
                      value={style.prohibitions}
                      onChange={e => handleInitiateAssetUpdate({ details: { ...style, prohibitions: e.target.value } })}
                      className="w-full bg-graphite-800 border border-rose-500/40 rounded-lg p-2 text-rose-300 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Version History List */}
          <div className="bg-graphite-850 border border-graphite-750 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-graphite-100 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-cyanAccent" />
              {t.bible.versionHistory}
            </h3>
            <div className="space-y-2">
              {currentAsset.versions.map(v => (
                <div
                  key={v.versionId}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    v.versionId === currentAsset.currentVersionId
                      ? 'bg-cyanAccent/10 border-cyanAccent/30 text-graphite-100'
                      : 'bg-graphite-800 border-graphite-700 text-graphite-400'
                  }`}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <span>{v.name}</span>
                      {v.versionId === currentAsset.currentVersionId && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyanAccent text-graphite-950 font-bold rounded">
                          {t.bible.currentAdopted}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-graphite-400">{v.description}</div>
                  </div>
                  <span className="text-[10px] font-mono text-graphite-400">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 text-center text-graphite-400 flex items-center justify-center">
          {locale === 'zh' ? '暂无选定设定资产，请在左侧新建。' : 'Tiada aset visual dipilih. Sila cipta di bar sisi.'}
        </div>
      )}

      {/* Affected Shots Warning & Version Decision Modal */}
      {isImpactModalOpen && currentAsset && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-graphite-850 border border-amber-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 border-b border-graphite-750 pb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-graphite-100">
                {t.bible.impactModalTitle}
              </h3>
            </div>

            <p className="text-xs text-graphite-300 leading-relaxed">
              {t.bible.impactModalDesc} ({affectedShots.length} {locale === 'zh' ? '个镜头' : 'syot'}):
            </p>

            <div className="p-2.5 rounded-lg bg-graphite-900 border border-graphite-750 max-h-32 overflow-y-auto space-y-1">
              {affectedShots.map(s => (
                <div key={s.id} className="text-[11px] font-mono text-graphite-300 flex items-center justify-between">
                  <span>Shot {s.shotNumber}: {s.name}</span>
                  <span className="text-graphite-400">[{s.status}]</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleResolveVersionChoice(false)}
                className="w-full p-3 rounded-lg bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-graphite-100 group-hover:text-cyanAccent">
                  {t.bible.strategy1Title}
                </div>
                <div className="text-[11px] text-graphite-400">
                  {t.bible.strategy1Desc}
                </div>
              </button>

              <button
                onClick={() => handleResolveVersionChoice(true)}
                className="w-full p-3 rounded-lg bg-cyanAccent/10 hover:bg-cyanAccent/20 border border-cyanAccent/30 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-cyanAccent">
                  {t.bible.strategy2Title}
                </div>
                <div className="text-[11px] text-graphite-300">
                  {t.bible.strategy2Desc}
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-graphite-750">
              <button
                onClick={() => {
                  setIsImpactModalOpen(false);
                  setPendingAssetUpdate(null);
                }}
                className="px-3 py-1.5 rounded text-xs text-graphite-400 hover:text-graphite-200"
              >
                {t.bible.cancelUpdate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
