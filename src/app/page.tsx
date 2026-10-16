'use client';

/**
 * DIRECTOR OS: Main Workstation App Root
 * Integrates TopBar, Workspace Navigation, 6 In-Project Views,
 * Continuity Audit Modal, Project Wizard, and System Settings.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { TopBar } from '@/components/layout/TopBar';
import { NavigationTabs } from '@/components/layout/NavigationTabs';
import { ProjectOverviewView } from '@/components/views/ProjectOverviewView';
import { StoryWorkspaceView } from '@/components/views/StoryWorkspaceView';
import { AssetBibleView } from '@/components/views/AssetBibleView';
import { ShotWorkbenchView } from '@/components/views/ShotWorkbenchView';
import { ProductionTasksView } from '@/components/views/ProductionTasksView';
import { DeliveryView } from '@/components/views/DeliveryView';
import { DirectorAuditModal } from '@/components/modals/DirectorAuditModal';
import { ProjectCreationModal } from '@/components/modals/ProjectCreationModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { runDirectorAudit } from '@/services/rules/directorAudit';
import { Film, AlertCircle, RefreshCw } from 'lucide-react';

export default function WorkstationPage() {
  const {
    activeProject,
    activeTab,
    isLoading,
    errorMessage,
    clearError,
    shots,
    assets,
    tasks,
    locale,
  } = useProject();

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Filter passed from overview to workbench
  const [shotWorkbenchStatusFilter, setShotWorkbenchStatusFilter] = useState<string>('all');

  // Compute live director continuity issue count
  const auditResult = activeProject
    ? runDirectorAudit(activeProject, shots, assets, tasks, locale)
    : { issues: [] };
  const auditIssueCount = auditResult.issues.filter(i => !i.isIntentional).length;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-graphite-950 text-graphite-200 space-y-3">
        <div className="w-12 h-12 rounded-xl bg-cyanAccent/10 border border-cyanAccent/40 flex items-center justify-center text-cyanAccent shadow-[0_0_20px_rgba(0,229,255,0.25)] animate-pulse">
          <Film className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold tracking-wider text-graphite-100">
          Ayu AiFilm Maker
        </div>
        <div className="flex items-center gap-2 text-xs text-graphite-400 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyanAccent" />
          Memuatkan pangkalan data tempatan dan projek demo siri NOD RAHSIA...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-graphite-950 text-graphite-200">
      {/* Top Application Bar */}
      <TopBar
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        auditIssueCount={auditIssueCount}
      />

      {/* Global Error Notice Bar if any */}
      {errorMessage && (
        <div className="bg-rose-500/20 text-rose-300 border-b border-rose-500/40 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={clearError}
            className="text-[11px] underline hover:text-white"
          >
            忽略
          </button>
        </div>
      )}

      {/* Main Workspace Frame */}
      {activeProject ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Workspace Tabs (Overview, Story, Bible, Shots, Tasks, Delivery) */}
          <NavigationTabs />

          {/* Active Workspace View */}
          <main className="flex-1 flex overflow-hidden">
            {activeTab === 'overview' && (
              <ProjectOverviewView
                onFilterShotsByStatus={statusKey => {
                  setShotWorkbenchStatusFilter(statusKey);
                }}
              />
            )}
            {activeTab === 'story' && <StoryWorkspaceView />}
            {activeTab === 'bible' && <AssetBibleView />}
            {activeTab === 'shots' && (
              <ShotWorkbenchView initialFilterStatus={shotWorkbenchStatusFilter} />
            )}
            {activeTab === 'production' && <ProductionTasksView />}
            {activeTab === 'delivery' && <DeliveryView />}
          </main>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Film className="w-12 h-12 text-graphite-600" />
          <h2 className="text-base font-bold text-graphite-200">尚未选择或创建制作项目</h2>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs hover:bg-cyanAccent-hover transition-colors"
          >
            即刻新建项目
          </button>
        </div>
      )}

      {/* Modals */}
      <DirectorAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <ProjectCreationModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
