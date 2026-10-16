'use client';

/**
 * Global Project & Workbench State Provider
 * Handles IndexedDB persistence, auto-save state, demo reset, undo deleted shots,
 * and seamless switching between all 6 core workspaces.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Project,
  ScriptVersion,
  Scene,
  Asset,
  Shot,
  PromptVersion,
  MediaVersion,
  Review,
  Task,
  Member,
  AppConfig
} from '@/types';
import { dbService } from '@/services/storage/indexeddb';
import { Locale, TranslationDictionary, getDictionary } from '@/i18n';
import {
  DEMO_PROJECT_ID,
  DEMO_PROJECT,
  DEMO_SCRIPT_VERSION,
  DEMO_SCENES,
  DEMO_ASSETS,
  DEMO_MEMBERS,
  generateDemoShots,
  generateDemoPrompts,
  generateDemoTasks,
  generateDemoMedia
} from '@/services/demo/seedData';
import { exportProjectToJson, validateAndParseProjectJson } from '@/services/export';

interface ProjectContextValue {
  // Locale & Language
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: TranslationDictionary;

  // Brand & Config
  brandName: string;
  setBrandName: (name: string) => Promise<void>;
  members: Member[];
  activeMember: Member;
  setActiveMemberId: (id: string) => void;
  storageUsage: { usageBytes: number; quotaBytes: number };

  // Projects
  projects: Project[];
  activeProject: Project | null;
  setActiveProjectId: (id: string) => void;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  resetDemoProject: () => Promise<void>;
  exportCurrentProject: () => string;
  importProjectFromJson: (jsonStr: string) => Promise<void>;

  // Navigation
  activeTab: 'overview' | 'story' | 'bible' | 'shots' | 'production' | 'delivery';
  setActiveTab: (tab: 'overview' | 'story' | 'bible' | 'shots' | 'production' | 'delivery') => void;

  // Active Story & Scenes
  scripts: ScriptVersion[];
  scenes: Scene[];
  saveScript: (content: string, title?: string) => Promise<void>;
  addScene: (scene: Omit<Scene, 'id'>) => Promise<Scene>;
  updateScene: (id: string, updates: Partial<Scene>) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;

  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Asset>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  getAffectedShotsForAsset: (assetId: string) => Shot[];

  // Shots (The Core Hub)
  shots: Shot[];
  selectedShotId: string | null;
  setSelectedShotId: (id: string | null) => void;
  addShot: (sceneId?: string) => Promise<Shot>;
  updateShot: (id: string, updates: Partial<Shot>) => Promise<void>;
  deleteShot: (id: string) => Promise<void>;
  undoDeleteShot: () => Promise<void>;
  canUndoDelete: boolean;
  reorderShots: (orderedIds: string[]) => Promise<void>;
  batchUpdateShots: (ids: string[], updates: Partial<Shot>) => Promise<void>;

  // Media & Reviews
  media: MediaVersion[];
  reviews: Review[];
  uploadMediaForShot: (shotId: string, file: File, meta?: Partial<MediaVersion>) => Promise<MediaVersion>;
  adoptMediaVersion: (shotId: string, mediaVersionId: string) => Promise<void>;
  addReviewComment: (shotId: string, mediaVersionId: string, decision: Review['decision'], notes: string, timecodeSeconds?: number) => Promise<void>;
  
  // Prompts
  prompts: PromptVersion[];
  savePromptForShot: (prompt: PromptVersion) => Promise<void>;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Status & Notifications
  saveStatus: 'saved' | 'saving' | 'error';
  errorMessage: string | null;
  clearError: () => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocaleState] = useState<Locale>('ms'); // Default: Bahasa Melayu
  const [brandName, setBrandNameState] = useState('Ayu AiFilm Maker');
  const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);
  const [activeMemberId, setActiveMemberIdState] = useState<string>('mem_1');
  const [storageUsage, setStorageUsage] = useState({ usageBytes: 0, quotaBytes: 0 });

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'story' | 'bible' | 'shots' | 'production' | 'delivery'>('overview');

  const [scripts, setScripts] = useState<ScriptVersion[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [deletedShotsStack, setDeletedShotsStack] = useState<Shot[]>([]);

  const [media, setMedia] = useState<MediaVersion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = () => setErrorMessage(null);

  const t = getDictionary(locale);

  // Set Locale with persistence
  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    await dbService.setSetting('app_locale', newLocale);
  };

  // Initialize DB and Seed Demo Data if empty
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      // Load saved locale (default to 'ms' if not set)
      const savedLocale = await dbService.getSetting<Locale>('app_locale');
      if (savedLocale) {
        setLocaleState(savedLocale);
      } else {
        setLocaleState('ms'); // Default to Bahasa Melayu
      }

      // Load config & members
      const customBrand = await dbService.getSetting<string>('brand_name');
      if (customBrand && customBrand !== 'DIRECTOR OS') {
        setBrandNameState(customBrand);
      } else {
        setBrandNameState('Ayu AiFilm Maker');
        await dbService.setSetting('brand_name', 'Ayu AiFilm Maker');
      }

      let savedMembers = await dbService.getMembers();
      const hasChineseMembers = savedMembers && savedMembers.some(m => /[\u4e00-\u9fff]/.test(m.name));
      if (!savedMembers || savedMembers.length === 0 || hasChineseMembers) {
        for (const m of DEMO_MEMBERS) {
          await dbService.putMember(m);
        }
        savedMembers = DEMO_MEMBERS;
      }
      setMembers(savedMembers);

      // Load projects
      let allProjects = await dbService.getAllProjects();
      const existingDemo = allProjects.find(p => p.id === DEMO_PROJECT_ID);
      const demoNeedsUpgrade = !existingDemo
        || existingDemo.name !== DEMO_PROJECT.name
        || /[\u4e00-\u9fff]/.test(existingDemo.name)
        || /[\u4e00-\u9fff]/.test(existingDemo.logline);

      if (allProjects.length === 0 || demoNeedsUpgrade) {
        // Seed or refresh official demo project with latest 100% Bahasa Melayu assets
        await seedDemoProjectToDB();
        allProjects = await dbService.getAllProjects();
      }
      setProjects(allProjects);

      const targetProjectId = allProjects[0]?.id || null;
      setActiveProjectIdState(targetProjectId);

      if (targetProjectId) {
        await loadProjectEntities(targetProjectId);
      }

      // Check storage estimate
      const usage = await dbService.getStorageUsage();
      setStorageUsage(usage);
    } catch (err: any) {
      console.error('Failed to initialize Ayu AiFilm Maker DB:', err);
      setErrorMessage(`Gagal memuatkan enjin storan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const seedDemoProjectToDB = async () => {
    // 0. Clean old demo records if upgrading
    await dbService.deleteProject(DEMO_PROJECT_ID);
    // 1. Put project
    await dbService.putProject(DEMO_PROJECT);
    // 2. Put script
    await dbService.putScript(DEMO_SCRIPT_VERSION);
    // 3. Put scenes
    for (const sc of DEMO_SCENES) {
      await dbService.putScene(sc);
    }
    // 4. Put assets
    for (const as of DEMO_ASSETS) {
      await dbService.putAsset(as);
    }
    // 5. Generate and put shots
    const demoShots = generateDemoShots();
    for (const sh of demoShots) {
      await dbService.putShot(sh);
    }
    // 6. Prompts
    const demoPrompts = generateDemoPrompts(demoShots);
    for (const pr of demoPrompts) {
      await dbService.putPrompt(pr);
    }
    // 7. Media & Reviews
    const { media: demoMedia, reviews: demoReviews } = generateDemoMedia(demoShots);
    for (const m of demoMedia) {
      await dbService.putMedia(m);
    }
    for (const r of demoReviews) {
      await dbService.putReview(r);
    }
    // 8. Tasks
    const demoTasks = generateDemoTasks(demoShots);
    for (const tk of demoTasks) {
      await dbService.putTask(tk);
    }
  };

  const loadProjectEntities = async (projectId: string) => {
    const [
      loadedScripts,
      loadedScenes,
      loadedAssets,
      loadedShots,
      loadedTasks,
    ] = await Promise.all([
      dbService.getScripts(projectId),
      dbService.getScenes(projectId),
      dbService.getAssets(projectId),
      dbService.getShots(projectId),
      dbService.getTasks(projectId),
    ]);

    setScripts(loadedScripts);
    setScenes(loadedScenes);
    setAssets(loadedAssets);
    setShots(loadedShots);
    setTasks(loadedTasks);

    if (loadedShots.length > 0) {
      setSelectedShotId(loadedShots[0].id);
      // Load media, reviews, and prompts for shots
      const allMedia: MediaVersion[] = [];
      const allReviews: Review[] = [];
      const allPrompts: PromptVersion[] = [];

      for (const s of loadedShots) {
        const [shotMedia, shotReviews, shotPrompts] = await Promise.all([
          dbService.getMediaByShot(s.id),
          dbService.getReviews(s.id),
          dbService.getPrompts(s.id),
        ]);
        allMedia.push(...shotMedia);
        allReviews.push(...shotReviews);
        allPrompts.push(...shotPrompts);
      }
      setMedia(allMedia);
      setReviews(allReviews);
      setPrompts(allPrompts);
    } else {
      setSelectedShotId(null);
      setMedia([]);
      setReviews([]);
      setPrompts([]);
    }
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Brand Name
  const setBrandName = async (name: string) => {
    setBrandNameState(name);
    await dbService.setSetting('brand_name', name);
  };

  // Switch Active Project
  const setActiveProjectId = async (id: string) => {
    setActiveProjectIdState(id);
    await loadProjectEntities(id);
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  // Helper trigger save state
  const notifySaving = () => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  // Project CRUD
  const createProject = async (projectData: Partial<Project>): Promise<Project> => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: projectData.name || '新建电影制作项目',
      type: projectData.type || 'short_film',
      logline: projectData.logline || '',
      targetDurationSeconds: projectData.targetDurationSeconds || 120,
      aspectRatio: projectData.aspectRatio || '16:9',
      customAspectRatio: projectData.customAspectRatio,
      primaryLanguage: projectData.primaryLanguage || '中文 / 中文字幕',
      primaryProductionMethod: projectData.primaryProductionMethod || 'hybrid',
      visualDirection: projectData.visualDirection || '',
      deadline: projectData.deadline,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDemo: false,
    };

    await dbService.putProject(newProject);
    setProjects(prev => [newProject, ...prev]);
    await setActiveProjectId(newProject.id);
    return newProject;
  };

  const updateProject = async (updates: Partial<Project>) => {
    if (!activeProject) return;
    notifySaving();
    const updated: Project = { ...activeProject, ...updates, updatedAt: Date.now() };
    await dbService.putProject(updated);
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProject = async (id: string) => {
    await dbService.deleteProject(id);
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      const nextId = remaining[0]?.id || null;
      setActiveProjectIdState(nextId);
      if (nextId) await loadProjectEntities(nextId);
    }
  };

  const resetDemoProject = async () => {
    notifySaving();
    // Delete existing demo if present
    await dbService.deleteProject(DEMO_PROJECT_ID);
    await seedDemoProjectToDB();
    const all = await dbService.getAllProjects();
    setProjects(all);
    await setActiveProjectId(DEMO_PROJECT_ID);
  };

  // Export & Import
  const exportCurrentProject = (): string => {
    if (!activeProject) return '';
    return exportProjectToJson(
      activeProject,
      scripts,
      scenes,
      assets,
      shots,
      tasks,
      media
    );
  };

  const importProjectFromJson = async (jsonStr: string) => {
    try {
      const bundle = validateAndParseProjectJson(jsonStr);
      // Give imported project a unique ID to prevent overwriting
      const importedProj: Project = {
        ...bundle.project,
        id: `imported_${Date.now()}`,
        name: `${bundle.project.name} (已导入)`,
        updatedAt: Date.now(),
        isDemo: false,
      };

      await dbService.putProject(importedProj);

      // Re-map IDs for foreign keys
      for (const sc of bundle.scenes) {
        await dbService.putScene({ ...sc, projectId: importedProj.id });
      }
      for (const as of bundle.assets) {
        await dbService.putAsset({ ...as, projectId: importedProj.id });
      }
      for (const sh of bundle.shots) {
        await dbService.putShot({ ...sh, projectId: importedProj.id });
      }
      for (const tk of bundle.tasks) {
        await dbService.putTask({ ...tk, projectId: importedProj.id });
      }

      setProjects(prev => [importedProj, ...prev]);
      await setActiveProjectId(importedProj.id);
    } catch (err: any) {
      setErrorMessage(`导入项目失败: ${err.message}`);
      throw err;
    }
  };

  // Story & Scenes
  const saveScript = async (content: string, title?: string) => {
    if (!activeProject) return;
    notifySaving();
    const newVersion: ScriptVersion = {
      id: `script_${Date.now()}`,
      projectId: activeProject.id,
      versionNumber: scripts.length + 1,
      title: title || `剧本修订版 v${scripts.length + 1}`,
      content,
      createdBy: activeMember.name,
      createdAt: Date.now(),
    };
    await dbService.putScript(newVersion);
    setScripts(prev => [newVersion, ...prev]);
  };

  const addScene = async (sceneData: Omit<Scene, 'id'>): Promise<Scene> => {
    notifySaving();
    const newScene: Scene = {
      ...sceneData,
      id: `scene_${Date.now()}`,
      order: scenes.length + 1,
    };
    await dbService.putScene(newScene);
    setScenes(prev => [...prev, newScene]);
    return newScene;
  };

  const updateScene = async (id: string, updates: Partial<Scene>) => {
    notifySaving();
    const existing = scenes.find(s => s.id === id);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    await dbService.putScene(updated);
    setScenes(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const deleteScene = async (id: string) => {
    notifySaving();
    await dbService.deleteScene(id);
    setScenes(prev => prev.filter(s => s.id !== id));
  };

  const reorderScenes = async (sceneIds: string[]) => {
    notifySaving();
    const reordered: Scene[] = [];
    for (let i = 0; i < sceneIds.length; i++) {
      const sc = scenes.find(s => s.id === sceneIds[i]);
      if (sc) {
        const updated = { ...sc, order: i + 1, sceneNumber: i + 1 };
        await dbService.putScene(updated);
        reordered.push(updated);
      }
    }
    setScenes(reordered);
  };

  // Assets
  const addAsset = async (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> => {
    notifySaving();
    const newAsset: Asset = {
      ...assetData,
      id: `asset_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dbService.putAsset(newAsset);
    setAssets(prev => [...prev, newAsset]);
    return newAsset;
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    notifySaving();
    const existing = assets.find(a => a.id === id);
    if (!existing) return;
    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    await dbService.putAsset(updated);
    setAssets(prev => prev.map(a => (a.id === id ? updated : a)));
  };

  const deleteAsset = async (id: string) => {
    notifySaving();
    await dbService.deleteAsset(id);
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const getAffectedShotsForAsset = (assetId: string): Shot[] => {
    return shots.filter(shot => shot.assetReferences.some(r => r.assetId === assetId));
  };

  // Shots (The Core Workbench)
  const addShot = async (sceneId?: string): Promise<Shot> => {
    if (!activeProject) throw new Error('无活跃项目');
    notifySaving();
    const nextNumber = shots.length > 0 ? Math.max(...shots.map(s => s.shotNumber)) + 1 : 1;
    const targetSceneId = sceneId || scenes[0]?.id || 'scene_default';

    const newShot: Shot = {
      id: `shot_${Date.now()}`,
      projectId: activeProject.id,
      sceneId: targetSceneId,
      shotNumber: nextNumber,
      name: `新镜头 ${nextNumber}`,
      narrativeGoal: '',
      visualDescription: '',
      subjectAction: '',
      cameraMovement: 'static',
      targetDurationSeconds: 4,
      soundAndDialogue: '',
      productionMethod: activeProject.primaryProductionMethod || 'hybrid',
      status: 'draft',
      assetReferences: [],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'eye_level',
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await dbService.putShot(newShot);
    setShots(prev => [...prev, newShot]);
    setSelectedShotId(newShot.id);
    return newShot;
  };

  const updateShot = async (id: string, updates: Partial<Shot>) => {
    notifySaving();
    const existing = shots.find(s => s.id === id);
    if (!existing) return;
    const updated: Shot = { ...existing, ...updates, updatedAt: Date.now() };
    await dbService.putShot(updated);
    setShots(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const deleteShot = async (id: string) => {
    notifySaving();
    const target = shots.find(s => s.id === id);
    if (!target) return;
    setDeletedShotsStack(prev => [target, ...prev]);
    await dbService.deleteShot(id);
    const remaining = shots.filter(s => s.id !== id);
    setShots(remaining);
    if (selectedShotId === id) {
      setSelectedShotId(remaining[0]?.id || null);
    }
  };

  const undoDeleteShot = async () => {
    if (deletedShotsStack.length === 0) return;
    notifySaving();
    const [shotToRestore, ...rest] = deletedShotsStack;
    await dbService.putShot(shotToRestore);
    setShots(prev => [...prev, shotToRestore].sort((a, b) => a.shotNumber - b.shotNumber));
    setDeletedShotsStack(rest);
    setSelectedShotId(shotToRestore.id);
  };

  const reorderShots = async (orderedIds: string[]) => {
    notifySaving();
    const reordered: Shot[] = [];
    for (let i = 0; i < orderedIds.length; i++) {
      const s = shots.find(item => item.id === orderedIds[i]);
      if (s) {
        const updated = { ...s, shotNumber: i + 1, updatedAt: Date.now() };
        await dbService.putShot(updated);
        reordered.push(updated);
      }
    }
    setShots(reordered);
  };

  const batchUpdateShots = async (ids: string[], updates: Partial<Shot>) => {
    notifySaving();
    const idSet = new Set(ids);
    const updatedList: Shot[] = [];
    for (const s of shots) {
      if (idSet.has(s.id)) {
        const updated = { ...s, ...updates, updatedAt: Date.now() };
        await dbService.putShot(updated);
        updatedList.push(updated);
      } else {
        updatedList.push(s);
      }
    }
    setShots(updatedList);
  };

  // Media & Reviews
  const uploadMediaForShot = async (
    shotId: string,
    file: File,
    meta?: Partial<MediaVersion>
  ): Promise<MediaVersion> => {
    notifySaving();
    const isVideo = file.type.startsWith('video');
    const existingShotMedia = media.filter(m => m.shotId === shotId);
    const nextVer = existingShotMedia.length + 1;

    const newMedia: MediaVersion = {
      id: `media_${Date.now()}`,
      shotId,
      versionNumber: nextVer,
      versionName: meta?.versionName || `v${nextVer}.0_${file.name.replace(/\.[^/.]+$/, '')}`,
      mediaType: isVideo ? 'video' : 'image',
      blob: file, // Store raw Blob in IndexedDB!
      source: meta?.source || 'live_take',
      creatorName: activeMember.name,
      toolTag: meta?.toolTag || (isVideo ? 'Original Camera Raw' : 'Graphic Upload'),
      reviewStatus: 'ready_for_review',
      fileSize: file.size,
      notes: meta?.notes || '',
      createdAt: Date.now(),
    };

    await dbService.putMedia(newMedia);
    // Reload media for this shot to get resolved URL
    const updatedShotMedia = await dbService.getMediaByShot(shotId);
    setMedia(prev => [
      ...prev.filter(m => m.shotId !== shotId),
      ...updatedShotMedia,
    ]);

    // Update shot status to ready_for_review if currently draft
    const currentShot = shots.find(s => s.id === shotId);
    if (currentShot && currentShot.status === 'draft') {
      await updateShot(shotId, { status: 'ready_for_review' });
    }

    return newMedia;
  };

  const adoptMediaVersion = async (shotId: string, mediaVersionId: string) => {
    notifySaving();
    await updateShot(shotId, { adoptedMediaVersionId: mediaVersionId });
  };

  const addReviewComment = async (
    shotId: string,
    mediaVersionId: string,
    decision: Review['decision'],
    notes: string,
    timecodeSeconds?: number
  ) => {
    notifySaving();
    const reviewId = `rev_${Date.now()}`;
    const newReview: Review = {
      id: reviewId,
      shotId,
      mediaVersionId,
      reviewerName: activeMember.name,
      decision,
      feedbackNotes: notes,
      timecodedComments: timecodeSeconds !== undefined ? [
        {
          id: `tc_${Date.now()}`,
          reviewId,
          timestampSeconds: timecodeSeconds,
          authorName: activeMember.name,
          authorRole: activeMember.role,
          content: notes,
          createdAt: Date.now(),
        }
      ] : [],
      createdAt: Date.now(),
    };

    await dbService.putReview(newReview);
    setReviews(prev => [newReview, ...prev]);

    // If decision is approve, update shot status and adopt media
    if (decision === 'approve') {
      await updateShot(shotId, {
        status: 'approved',
        adoptedMediaVersionId: mediaVersionId,
      });
    } else if (decision === 'request_changes') {
      await updateShot(shotId, {
        status: 'changes_requested',
      });
    }
  };

  // Prompts
  const savePromptForShot = async (prompt: PromptVersion) => {
    notifySaving();
    await dbService.putPrompt(prompt);
    setPrompts(prev => [prompt, ...prev.filter(p => p.id !== prompt.id)]);
    await updateShot(prompt.shotId, { currentPromptVersionId: prompt.id });
  };

  // Tasks
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    notifySaving();
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dbService.putTask(newTask);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    notifySaving();
    const existing = tasks.find(t => t.id === id);
    if (!existing) return;
    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    await dbService.putTask(updated);
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    notifySaving();
    await dbService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{
        locale,
        setLocale,
        t,

        brandName,
        setBrandName,
        members,
        activeMember,
        setActiveMemberId: setActiveMemberIdState,
        storageUsage,

        projects,
        activeProject,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        resetDemoProject,
        exportCurrentProject,
        importProjectFromJson,

        activeTab,
        setActiveTab,

        scripts,
        scenes,
        saveScript,
        addScene,
        updateScene,
        deleteScene,
        reorderScenes,

        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        getAffectedShotsForAsset,

        shots,
        selectedShotId,
        setSelectedShotId,
        addShot,
        updateShot,
        deleteShot,
        undoDeleteShot,
        canUndoDelete: deletedShotsStack.length > 0,
        reorderShots,
        batchUpdateShots,

        media,
        reviews,
        uploadMediaForShot,
        adoptMediaVersion,
        addReviewComment,

        prompts,
        savePromptForShot,

        tasks,
        addTask,
        updateTask,
        deleteTask,

        saveStatus,
        errorMessage,
        clearError,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
