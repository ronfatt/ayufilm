/**
 * IndexedDB Local Persistence Engine for DIRECTOR OS
 * Fully offline-capable, storing rich structured records and binary Blobs (Images & Videos).
 */

import { openDB, IDBPDatabase } from 'idb';
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

const DB_NAME = 'director_os_db';
const DB_VERSION = 1;

export class DirectorDatabase {
  private dbPromise: Promise<IDBPDatabase> | null = null;
  private blobUrlCache: Map<string, string> = new Map();

  private getDB(): Promise<IDBPDatabase> {
    if (typeof window === 'undefined') {
      return new Promise(() => {}); // Server-side dummy
    }
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Projects
          if (!db.objectStoreNames.contains('projects')) {
            const store = db.createObjectStore('projects', { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt');
          }
          // Script Versions
          if (!db.objectStoreNames.contains('scripts')) {
            const store = db.createObjectStore('scripts', { keyPath: 'id' });
            store.createIndex('projectId', 'projectId');
          }
          // Scenes
          if (!db.objectStoreNames.contains('scenes')) {
            const store = db.createObjectStore('scenes', { keyPath: 'id' });
            store.createIndex('projectId', 'projectId');
            store.createIndex('order', 'order');
          }
          // Assets
          if (!db.objectStoreNames.contains('assets')) {
            const store = db.createObjectStore('assets', { keyPath: 'id' });
            store.createIndex('projectId', 'projectId');
            store.createIndex('category', 'category');
          }
          // Shots
          if (!db.objectStoreNames.contains('shots')) {
            const store = db.createObjectStore('shots', { keyPath: 'id' });
            store.createIndex('projectId', 'projectId');
            store.createIndex('sceneId', 'sceneId');
            store.createIndex('shotNumber', 'shotNumber');
          }
          // Prompts
          if (!db.objectStoreNames.contains('prompts')) {
            const store = db.createObjectStore('prompts', { keyPath: 'id' });
            store.createIndex('shotId', 'shotId');
          }
          // Media (stores Blob directly)
          if (!db.objectStoreNames.contains('media')) {
            const store = db.createObjectStore('media', { keyPath: 'id' });
            store.createIndex('shotId', 'shotId');
          }
          // Reviews
          if (!db.objectStoreNames.contains('reviews')) {
            const store = db.createObjectStore('reviews', { keyPath: 'id' });
            store.createIndex('shotId', 'shotId');
          }
          // Tasks
          if (!db.objectStoreNames.contains('tasks')) {
            const store = db.createObjectStore('tasks', { keyPath: 'id' });
            store.createIndex('projectId', 'projectId');
            store.createIndex('status', 'status');
          }
          // Members
          if (!db.objectStoreNames.contains('members')) {
            db.createObjectStore('members', { keyPath: 'id' });
          }
          // App Settings
          if (!db.objectStoreNames.contains('app_settings')) {
            db.createObjectStore('app_settings', { keyPath: 'key' });
          }
        },
      });
    }
    return this.dbPromise;
  }

  // --- Projects ---
  async getAllProjects(): Promise<Project[]> {
    const db = await this.getDB();
    const projects = await db.getAll('projects');
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getProject(id: string): Promise<Project | null> {
    const db = await this.getDB();
    const project = await db.get('projects', id);
    return project || null;
  }

  async putProject(project: Project): Promise<void> {
    const db = await this.getDB();
    await db.put('projects', project);
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(['projects', 'scenes', 'shots', 'assets', 'tasks', 'scripts', 'media', 'reviews', 'prompts'], 'readwrite');
    
    // Delete project
    await tx.objectStore('projects').delete(id);
    
    // Delete related scenes
    const sceneIndex = tx.objectStore('scenes').index('projectId');
    let sceneCursor = await sceneIndex.openCursor(IDBKeyRange.only(id));
    while (sceneCursor) {
      await sceneCursor.delete();
      sceneCursor = await sceneCursor.continue();
    }

    // Delete related shots & associated media
    const shotIndex = tx.objectStore('shots').index('projectId');
    let shotCursor = await shotIndex.openCursor(IDBKeyRange.only(id));
    const shotIds: string[] = [];
    while (shotCursor) {
      shotIds.push(shotCursor.value.id);
      await shotCursor.delete();
      shotCursor = await shotCursor.continue();
    }

    // Delete related assets
    const assetIndex = tx.objectStore('assets').index('projectId');
    let assetCursor = await assetIndex.openCursor(IDBKeyRange.only(id));
    while (assetCursor) {
      await assetCursor.delete();
      assetCursor = await assetCursor.continue();
    }

    // Delete related tasks
    const taskIndex = tx.objectStore('tasks').index('projectId');
    let taskCursor = await taskIndex.openCursor(IDBKeyRange.only(id));
    while (taskCursor) {
      await taskCursor.delete();
      taskCursor = await taskCursor.continue();
    }

    // Delete related scripts
    const scriptIndex = tx.objectStore('scripts').index('projectId');
    let scriptCursor = await scriptIndex.openCursor(IDBKeyRange.only(id));
    while (scriptCursor) {
      await scriptCursor.delete();
      scriptCursor = await scriptCursor.continue();
    }

    // Delete shot-specific media & reviews & prompts
    for (const shotId of shotIds) {
      const mediaIndex = tx.objectStore('media').index('shotId');
      let mediaCursor = await mediaIndex.openCursor(IDBKeyRange.only(shotId));
      while (mediaCursor) {
        await mediaCursor.delete();
        mediaCursor = await mediaCursor.continue();
      }

      const reviewIndex = tx.objectStore('reviews').index('shotId');
      let reviewCursor = await reviewIndex.openCursor(IDBKeyRange.only(shotId));
      while (reviewCursor) {
        await reviewCursor.delete();
        reviewCursor = await reviewCursor.continue();
      }

      const promptIndex = tx.objectStore('prompts').index('shotId');
      let promptCursor = await promptIndex.openCursor(IDBKeyRange.only(shotId));
      while (promptCursor) {
        await promptCursor.delete();
        promptCursor = await promptCursor.continue();
      }
    }

    await tx.done;
  }

  // --- Scripts & Scenes ---
  async getScripts(projectId: string): Promise<ScriptVersion[]> {
    const db = await this.getDB();
    const index = db.transaction('scripts').store.index('projectId');
    return index.getAll(projectId);
  }

  async putScript(script: ScriptVersion): Promise<void> {
    const db = await this.getDB();
    await db.put('scripts', script);
  }

  async getScenes(projectId: string): Promise<Scene[]> {
    const db = await this.getDB();
    const index = db.transaction('scenes').store.index('projectId');
    const scenes = await index.getAll(projectId);
    return scenes.sort((a, b) => a.order - b.order);
  }

  async putScene(scene: Scene): Promise<void> {
    const db = await this.getDB();
    await db.put('scenes', scene);
  }

  async deleteScene(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('scenes', id);
  }

  // --- Assets ---
  async getAssets(projectId: string): Promise<Asset[]> {
    const db = await this.getDB();
    const index = db.transaction('assets').store.index('projectId');
    return index.getAll(projectId);
  }

  async getAsset(id: string): Promise<Asset | null> {
    const db = await this.getDB();
    const asset = await db.get('assets', id);
    return asset || null;
  }

  async putAsset(asset: Asset): Promise<void> {
    const db = await this.getDB();
    await db.put('assets', asset);
  }

  async deleteAsset(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('assets', id);
  }

  // --- Shots ---
  async getShots(projectId: string): Promise<Shot[]> {
    const db = await this.getDB();
    const index = db.transaction('shots').store.index('projectId');
    const shots = await index.getAll(projectId);
    return shots.sort((a, b) => a.shotNumber - b.shotNumber);
  }

  async getShot(id: string): Promise<Shot | null> {
    const db = await this.getDB();
    const shot = await db.get('shots', id);
    return shot || null;
  }

  async putShot(shot: Shot): Promise<void> {
    const db = await this.getDB();
    await db.put('shots', shot);
  }

  async deleteShot(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('shots', id);
  }

  // --- Media & Blobs ---
  async putMedia(media: MediaVersion): Promise<void> {
    const db = await this.getDB();
    await db.put('media', media);
  }

  async getMediaByShot(shotId: string): Promise<MediaVersion[]> {
    const db = await this.getDB();
    const index = db.transaction('media').store.index('shotId');
    const versions = await index.getAll(shotId);
    
    // Resolve Blob URLs
    for (const v of versions) {
      if (v.blob) {
        if (!this.blobUrlCache.has(v.id)) {
          this.blobUrlCache.set(v.id, URL.createObjectURL(v.blob));
        }
        v.url = this.blobUrlCache.get(v.id);
      }
    }
    return versions.sort((a, b) => b.versionNumber - a.versionNumber);
  }

  async getMedia(id: string): Promise<MediaVersion | null> {
    const db = await this.getDB();
    const media = await db.get('media', id);
    if (media && media.blob) {
      if (!this.blobUrlCache.has(media.id)) {
        this.blobUrlCache.set(media.id, URL.createObjectURL(media.blob));
      }
      media.url = this.blobUrlCache.get(media.id);
    }
    return media || null;
  }

  async deleteMedia(id: string): Promise<void> {
    const db = await this.getDB();
    if (this.blobUrlCache.has(id)) {
      URL.revokeObjectURL(this.blobUrlCache.get(id)!);
      this.blobUrlCache.delete(id);
    }
    await db.delete('media', id);
  }

  // --- Reviews ---
  async getReviews(shotId: string): Promise<Review[]> {
    const db = await this.getDB();
    const index = db.transaction('reviews').store.index('shotId');
    const reviews = await index.getAll(shotId);
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  }

  async putReview(review: Review): Promise<void> {
    const db = await this.getDB();
    await db.put('reviews', review);
  }

  // --- Prompts ---
  async getPrompts(shotId: string): Promise<PromptVersion[]> {
    const db = await this.getDB();
    const index = db.transaction('prompts').store.index('shotId');
    const prompts = await index.getAll(shotId);
    return prompts.sort((a, b) => b.versionNumber - a.versionNumber);
  }

  async putPrompt(prompt: PromptVersion): Promise<void> {
    const db = await this.getDB();
    await db.put('prompts', prompt);
  }

  // --- Tasks ---
  async getTasks(projectId: string): Promise<Task[]> {
    const db = await this.getDB();
    const index = db.transaction('tasks').store.index('projectId');
    return index.getAll(projectId);
  }

  async putTask(task: Task): Promise<void> {
    const db = await this.getDB();
    await db.put('tasks', task);
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('tasks', id);
  }

  // --- Members ---
  async getMembers(): Promise<Member[]> {
    const db = await this.getDB();
    return db.getAll('members');
  }

  async putMember(member: Member): Promise<void> {
    const db = await this.getDB();
    await db.put('members', member);
  }

  // --- App Settings ---
  async getSetting<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    const row = await db.get('app_settings', key);
    return row ? row.value : null;
  }

  async setSetting(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    await db.put('app_settings', { key, value });
  }

  // Storage usage estimation
  async getStorageUsage(): Promise<{ usageBytes: number; quotaBytes: number }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usageBytes: estimate.usage || 0,
        quotaBytes: estimate.quota || 0,
      };
    }
    return { usageBytes: 0, quotaBytes: 0 };
  }
}

export const dbService = new DirectorDatabase();
