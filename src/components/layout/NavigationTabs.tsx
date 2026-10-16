'use client';

/**
 * NavigationTabs: In-project workspace switcher
 * Seamless navigation between Overview, Story, Bible, Shots (Core), Production, and Delivery.
 * Malay as primary with Chinese translation support.
 */

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  LayoutDashboard,
  ScrollText,
  Palette,
  Clapperboard,
  CheckSquare,
  Sparkles,
  Film
} from 'lucide-react';

export function NavigationTabs() {
  const { activeTab, setActiveTab, shots, tasks, t, locale } = useProject();

  const unfinishedShotsCount = shots.filter(s => s.status !== 'approved').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const tabs = [
    {
      id: 'overview' as const,
      label: t.nav.overview,
      sub: t.nav.overviewSub,
      icon: LayoutDashboard,
    },
    {
      id: 'story' as const,
      label: t.nav.story,
      sub: t.nav.storySub,
      icon: ScrollText,
    },
    {
      id: 'bible' as const,
      label: t.nav.bible,
      sub: t.nav.bibleSub,
      icon: Palette,
    },
    {
      id: 'shots' as const,
      label: t.nav.shots,
      sub: t.nav.shotsSub,
      icon: Clapperboard,
      badge: shots.length > 0 ? `${shots.length}` : undefined,
      isCore: true,
    },
    {
      id: 'production' as const,
      label: t.nav.production,
      sub: t.nav.productionSub,
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: 'delivery' as const,
      label: t.nav.delivery,
      sub: t.nav.deliverySub,
      icon: Film,
      badge: unfinishedShotsCount > 0 ? (locale === 'zh' ? `${unfinishedShotsCount}待完成` : `${unfinishedShotsCount} Baki`) : (locale === 'zh' ? '就绪' : 'Sedia'),
      badgeColor: unfinishedShotsCount > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300',
    },
  ];

  return (
    <nav className="h-12 border-b border-graphite-750 bg-graphite-900/90 px-4 flex items-center gap-1 select-none overflow-x-auto scrollbar-none">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
              isActive
                ? 'bg-graphite-800 text-cyanAccent border border-cyanAccent/40 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                : 'text-graphite-300 hover:text-graphite-100 hover:bg-graphite-850 border border-transparent'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-colors ${
                isActive ? 'text-cyanAccent' : 'text-graphite-400 group-hover:text-graphite-200'
              }`}
            />
            <div className="flex items-baseline gap-1.5">
              <span>{tab.label}</span>
              <span className="text-[10px] text-graphite-400 font-mono hidden md:inline">
                {tab.sub}
              </span>
            </div>

            {tab.badge && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                  tab.badgeColor || (isActive ? 'bg-cyanAccent/20 text-cyanAccent border-cyanAccent/30' : 'bg-graphite-750 text-graphite-400 border-graphite-600')
                }`}
              >
                {tab.badge}
              </span>
            )}

            {tab.isCore && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-pulse" title="Teras Produksi / 核心中枢" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
