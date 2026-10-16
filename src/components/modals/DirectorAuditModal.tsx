'use client';

/**
 * DirectorAuditModal: Continuity, Cinematography, and Asset Rule Inspector
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { runDirectorAudit, AuditCheckResult } from '@/services/rules/directorAudit';
import {
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Film,
  Check
} from 'lucide-react';

interface DirectorAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectorAuditModal({ isOpen, onClose }: DirectorAuditModalProps) {
  const {
    activeProject,
    shots,
    assets,
    tasks,
    updateShot,
    setSelectedShotId,
    setActiveTab,
    t,
    locale,
  } = useProject();

  const [activeTabSub, setActiveTabSub] = useState<'rules' | 'checklist'>('rules');
  const [intentionalInputs, setIntentionalInputs] = useState<Record<string, string>>({});

  if (!isOpen || !activeProject) return null;

  const auditResult = runDirectorAudit(activeProject, shots, assets, tasks, locale);

  const handleMarkIntentional = async (ruleKey: string, shotId: string) => {
    const reason = intentionalInputs[ruleKey] || (
      locale === 'zh'
        ? '导演确认：此项为特殊艺术与情绪节奏编排，符合创作初衷。'
        : 'Pengesahan Pengarah: Ini adalah pilihan artistik untuk rentak dan impak dramatik.'
    );
    const targetShot = shots.find(s => s.id === shotId);
    if (!targetShot) return;

    const updatedChoices = { ...(targetShot.intentionalChoices || {}), [ruleKey]: reason };
    await updateShot(targetShot.id, { intentionalChoices: updatedChoices });
  };

  return (
    <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-graphite-850 border border-graphite-750 rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-graphite-750 px-6 flex items-center justify-between shrink-0 bg-graphite-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-graphite-100 flex items-center gap-2">
                {t.audit.modalTitle}
              </h2>
              <p className="text-[10px] text-graphite-400">
                {t.audit.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100 hover:bg-graphite-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-4 px-6 border-b border-graphite-750 bg-graphite-850/60 text-xs shrink-0">
          <button
            onClick={() => setActiveTabSub('rules')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTabSub === 'rules'
                ? 'border-cyanAccent text-cyanAccent'
                : 'border-transparent text-graphite-400 hover:text-graphite-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.audit.ruleAlertsTab} ({auditResult.issues.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSub('checklist')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTabSub === 'checklist'
                ? 'border-cyanAccent text-cyanAccent'
                : 'border-transparent text-graphite-400 hover:text-graphite-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.audit.checklistTab}</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTabSub === 'rules' ? (
            auditResult.issues.length > 0 ? (
              <div className="space-y-4">
                {auditResult.issues.map(issue => {
                  const isIntentional = issue.isIntentional;
                  const firstShotId = issue.affectedShotIds[0];

                  return (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                        isIntentional
                          ? 'bg-graphite-800/40 border-graphite-750 opacity-70'
                          : issue.severity === 'warning'
                          ? 'bg-amber-500/5 border-amber-500/30'
                          : 'bg-graphite-800 border-graphite-750'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {issue.severity === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-cyanAccent shrink-0" />
                          )}
                          <h4 className="font-bold text-graphite-100 text-xs">
                            {issue.title}
                          </h4>
                        </div>

                        {isIntentional ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {t.audit.intentionalBadge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite-750 text-graphite-400">
                            {t.audit.unverifiedBadge}
                          </span>
                        )}
                      </div>

                      {/* Reason & Suggestion */}
                      <div className="space-y-1.5 pl-6">
                        <div className="text-graphite-300 leading-relaxed">
                          <span className="text-graphite-400 font-semibold">{t.audit.reasonLabel} </span>
                          {issue.reason}
                        </div>
                        <div className="text-cyanAccent leading-relaxed">
                          <span className="text-graphite-400 font-semibold">{t.audit.suggestionLabel} </span>
                          {issue.suggestion}
                        </div>
                      </div>

                      {/* Affected Shots */}
                      <div className="pl-6 flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-graphite-400">{t.audit.affectedShotsLabel}</span>
                        {issue.affectedShotIds.slice(0, 6).map(sid => {
                          const s = shots.find(item => item.id === sid);
                          if (!s) return null;
                          return (
                            <button
                              key={sid}
                              onClick={() => {
                                setSelectedShotId(s.id);
                                setActiveTab('shots');
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded bg-graphite-750 hover:bg-cyanAccent/20 hover:text-cyanAccent text-[10px] font-mono border border-graphite-650 text-graphite-200"
                            >
                              Shot {s.shotNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Intentional Override Section */}
                      {!isIntentional && firstShotId && (
                        <div className="pl-6 pt-2 border-t border-graphite-750 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={t.audit.intentionalReasonPlaceholder}
                            value={intentionalInputs[issue.ruleKey] || ''}
                            onChange={e => setIntentionalInputs({ ...intentionalInputs, [issue.ruleKey]: e.target.value })}
                            className="flex-1 bg-graphite-900 border border-graphite-700 rounded-lg px-2.5 py-1 text-[11px] text-graphite-200 focus:outline-none focus:border-cyanAccent"
                          />
                          <button
                            onClick={() => handleMarkIntentional(issue.ruleKey, firstShotId)}
                            className="px-3 py-1 rounded-lg bg-graphite-750 hover:bg-graphite-700 text-graphite-200 text-[11px] font-semibold shrink-0 transition-colors"
                          >
                            {t.audit.markIntentionalBtn}
                          </button>
                        </div>
                      )}

                      {isIntentional && issue.intentionalReason && (
                        <div className="pl-6 text-[11px] text-graphite-400 font-mono italic">
                          {t.audit.intentionalDirectorNote} {issue.intentionalReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-graphite-100">{t.audit.allPassedTitle}</h3>
                <p className="text-xs text-graphite-400">
                  {t.audit.allPassedDesc}
                </p>
              </div>
            )
          ) : (
            /* Human Creative Checklist */
            <div className="space-y-6">
              {auditResult.humanChecklist.map((group, idx) => (
                <div key={idx} className="bg-graphite-800 border border-graphite-750 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-cyanAccent uppercase tracking-wider">
                    {group.category}
                  </h4>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div key={item.id} className="p-2.5 rounded-lg bg-graphite-850 border border-graphite-700 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={item.id}
                          className="mt-1 rounded bg-graphite-800 border-graphite-600 text-cyanAccent focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor={item.id} className="text-xs cursor-pointer">
                          <span className="font-semibold text-graphite-100 block">{item.label}</span>
                          <span className="text-[11px] text-graphite-400">{item.description}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-graphite-750 px-6 flex items-center justify-between shrink-0 bg-graphite-900 text-xs text-graphite-400">
          <span>{t.audit.footerDisclaimer}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-graphite-750 hover:bg-graphite-700 text-graphite-200 transition-colors font-medium"
          >
            {t.audit.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
