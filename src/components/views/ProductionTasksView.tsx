'use client';

/**
 * ProductionTasksView: Tasks, Kanban Board, and Dependency Management
 * Primary Language: Bahasa Melayu, with Chinese translation options.
 */

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Task, TaskStatus } from '@/types';
import {
  CheckSquare,
  Columns,
  List,
  Plus,
  AlertTriangle,
  Clock,
  User,
  Film,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export function ProductionTasksView() {
  const {
    activeProject,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    members,
    activeMember,
    shots,
    setActiveTab,
    setSelectedShotId,
    t,
    locale,
  } = useProject();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(activeMember.id);
  const [newShotId, setNewShotId] = useState<string>('');
  const [newDeadline, setNewDeadline] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (filterAssignee !== 'all' && task.assigneeId !== filterAssignee) return false;
    return true;
  });

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'todo', label: t.production.colTodo, color: 'text-graphite-300' },
    { status: 'in_progress', label: t.production.colInProgress, color: 'text-amber-400' },
    { status: 'blocked', label: t.production.colBlocked, color: 'text-rose-400' },
    { status: 'completed', label: t.production.colCompleted, color: 'text-emerald-400' },
  ];

  const handleCreateTask = async () => {
    if (!activeProject || !newTitle.trim()) return;
    const member = members.find(m => m.id === newAssigneeId);

    await addTask({
      projectId: activeProject.id,
      shotId: newShotId || undefined,
      title: newTitle,
      description: newDesc,
      assigneeId: newAssigneeId,
      assigneeName: member?.name || 'Ahli Produksi',
      status: 'todo',
      deadline: newDeadline || undefined,
    });

    setNewTitle('');
    setNewDesc('');
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-graphite-900">
      {/* Task Header & Filters */}
      <div className="h-12 border-b border-graphite-750 bg-graphite-850 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-lg bg-graphite-800 border border-graphite-750">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                  : 'text-graphite-400 hover:text-graphite-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{t.production.kanbanView}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyanAccent/20 text-cyanAccent font-semibold'
                  : 'text-graphite-400 hover:text-graphite-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t.production.listView}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-graphite-400">{t.production.memberFilter}</span>
            <select
              value={filterAssignee}
              onChange={e => setFilterAssignee(e.target.value)}
              className="bg-graphite-800 border border-graphite-750 rounded-lg px-2 py-1 text-xs text-graphite-200"
            >
              <option value="all">{t.production.allMembers} ({tasks.length})</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({tasks.filter(t => t.assigneeId === m.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyanAccent-hover transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.production.createTask}
        </button>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto p-4 flex gap-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);

            return (
              <div
                key={col.status}
                className="w-80 bg-graphite-850/80 border border-graphite-750 rounded-xl flex flex-col shrink-0 max-h-full"
              >
                <div className="p-3 border-b border-graphite-750 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-graphite-800 text-graphite-300 border border-graphite-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {colTasks.map(task => {
                    const linkedShot = shots.find(s => s.id === task.shotId);

                    return (
                      <div
                        key={task.id}
                        className="bg-graphite-800 border border-graphite-700 hover:border-graphite-600 rounded-lg p-3 space-y-2 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-graphite-100 leading-snug">
                            {task.title}
                          </h4>

                          <select
                            value={task.status}
                            onChange={e => updateTask(task.id, { status: e.target.value as TaskStatus })}
                            className="text-[10px] bg-graphite-750 border border-graphite-650 rounded px-1.5 py-0.5 text-graphite-300 shrink-0"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <p className="text-[11px] text-graphite-300 leading-normal">
                          {task.description}
                        </p>

                        {task.status === 'blocked' && task.blockerReason && (
                          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-300 flex items-start gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{t.production.blockerReason} {task.blockerReason}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-graphite-750 flex items-center justify-between text-[10px] text-graphite-400">
                          {linkedShot ? (
                            <button
                              onClick={() => {
                                setSelectedShotId(linkedShot.id);
                                setActiveTab('shots');
                              }}
                              className="font-mono text-cyanAccent hover:underline flex items-center gap-1"
                            >
                              <Film className="w-3 h-3" />
                              Shot {linkedShot.shotNumber}
                            </button>
                          ) : (
                            <span>{t.production.generalProjectTask}</span>
                          )}

                          <span className="flex items-center gap-1 font-medium text-graphite-300">
                            <User className="w-3 h-3" />
                            {task.assigneeName.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs border border-graphite-750 bg-graphite-850 rounded-xl overflow-hidden">
            <thead className="bg-graphite-800 text-graphite-400 font-mono text-[10px] uppercase border-b border-graphite-750">
              <tr>
                <th className="p-3">{t.production.taskTitle}</th>
                <th className="p-3">{t.production.linkedShot}</th>
                <th className="p-3">{t.production.assignee}</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tarikh Akhir</th>
                <th className="p-3">{t.production.blockerReason}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-750">
              {filteredTasks.map(t => {
                const s = shots.find(item => item.id === t.shotId);
                return (
                  <tr key={t.id} className="hover:bg-graphite-800/60">
                    <td className="p-3 font-semibold text-graphite-100">{t.title}</td>
                    <td className="p-3 font-mono text-cyanAccent">
                      {s ? `Shot ${s.shotNumber}` : '-'}
                    </td>
                    <td className="p-3 text-graphite-300">{t.assigneeName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : t.status === 'blocked'
                          ? 'bg-rose-500/20 text-rose-300'
                          : t.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-graphite-750 text-graphite-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-graphite-400">{t.deadline || '-'}</td>
                    <td className="p-3 text-rose-400">{t.blockerReason || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-graphite-850 border border-graphite-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-graphite-100 border-b border-graphite-750 pb-2">
              {t.production.taskModalTitle}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-graphite-400 block mb-1">{t.production.taskTitle}</label>
                <input
                  type="text"
                  placeholder={locale === 'zh' ? '如: 生成 Shot 08 暴雨街道全景图...' : 'Cth: Jana Shot 08 imej sudut luas lorong hujan...'}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-100 focus:outline-none focus:border-cyanAccent"
                />
              </div>

              <div>
                <label className="text-[10px] text-graphite-400 block mb-1">{t.production.taskDesc}</label>
                <textarea
                  placeholder={locale === 'zh' ? '具体要求、参考资产与技术指标...' : 'Syarat spesifik, rujukan aset dan penunjuk teknikal...'}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200 focus:outline-none focus:border-cyanAccent"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-graphite-400 block mb-1">{t.production.assignee}</label>
                  <select
                    value={newAssigneeId}
                    onChange={e => setNewAssigneeId(e.target.value)}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-graphite-400 block mb-1">{t.production.linkedShot}</label>
                  <select
                    value={newShotId}
                    onChange={e => setNewShotId(e.target.value)}
                    className="w-full bg-graphite-800 border border-graphite-700 rounded-lg p-2 text-graphite-200"
                  >
                    <option value="">{locale === 'zh' ? '(无关联镜头 / 全局任务)' : '(Tiada Syot / Tugasan Umum)'}</option>
                    {shots.map(s => (
                      <option key={s.id} value={s.id}>Shot {s.shotNumber}: {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-graphite-750">
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-graphite-750 text-graphite-300 text-xs hover:bg-graphite-700"
              >
                {t.production.cancel}
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-1.5 rounded-lg bg-cyanAccent text-graphite-950 font-bold text-xs hover:bg-cyanAccent-hover"
              >
                {t.production.confirmCreate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
