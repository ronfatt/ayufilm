/**
 * Decoupled Service Interfaces for DIRECTOR OS
 * Provides clean abstractions for Database, Object Storage (Media), AI Generation, and Auth.
 * Future cloud implementations simply implement these interfaces without touching UI logic.
 */

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

export interface IProjectService {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  exportProjectJson(projectId: string): Promise<string>;
  importProjectJson(jsonString: string): Promise<Project>;
}

export interface IStoryService {
  getScriptVersions(projectId: string): Promise<ScriptVersion[]>;
  saveScriptVersion(version: Omit<ScriptVersion, 'id' | 'createdAt'>): Promise<ScriptVersion>;
  getScenes(projectId: string): Promise<Scene[]>;
  createScene(scene: Omit<Scene, 'id'>): Promise<Scene>;
  updateScene(id: string, updates: Partial<Scene>): Promise<Scene>;
  deleteScene(id: string): Promise<void>;
  reorderScenes(projectId: string, sceneIds: string[]): Promise<void>;
}

export interface IAssetService {
  getAssets(projectId: string): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset | null>;
  createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset>;
  updateAsset(id: string, updates: Partial<Asset>): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  getAffectedShotsForAssetChange(assetId: string, projectId: string): Promise<Shot[]>;
}

export interface IShotService {
  getShots(projectId: string): Promise<Shot[]>;
  getShotById(id: string): Promise<Shot | null>;
  createShot(shot: Omit<Shot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shot>;
  updateShot(id: string, updates: Partial<Shot>): Promise<Shot>;
  deleteShot(id: string): Promise<void>;
  reorderShots(projectId: string, shotIds: string[]): Promise<void>;
  batchUpdateShots(shotIds: string[], updates: Partial<Shot>): Promise<void>;
}

export interface IMediaStorageService {
  uploadMedia(shotId: string, file: File | Blob, metadata: Omit<MediaVersion, 'id' | 'blob' | 'url' | 'createdAt'>): Promise<MediaVersion>;
  getMediaVersions(shotId: string): Promise<MediaVersion[]>;
  getMediaVersionById(id: string): Promise<MediaVersion | null>;
  deleteMediaVersion(id: string): Promise<void>;
  getMediaBlobUrl(mediaVersion: MediaVersion): Promise<string>;
  getStorageUsage(): Promise<{ usageBytes: number; quotaBytes: number }>;
}

export interface IReviewService {
  getReviews(shotId: string): Promise<Review[]>;
  addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
  adoptMediaVersion(shotId: string, mediaVersionId: string): Promise<void>;
  approveShot(shotId: string, mediaVersionId: string, reviewerNotes?: string): Promise<void>;
}

export interface ITaskService {
  getTasks(projectId: string): Promise<Task[]>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export interface IConfigService {
  getConfig(): Promise<AppConfig>;
  updateConfig(updates: Partial<AppConfig>): Promise<AppConfig>;
  getMembers(): Promise<Member[]>;
  resetDemoProject(): Promise<Project>;
}
