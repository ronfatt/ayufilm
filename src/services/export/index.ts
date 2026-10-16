/**
 * Export and Handover Engine for DIRECTOR OS
 * Produces structured project JSON, RFC-4180 UTF-8 BOM CSV, and Editor Handover Sheets.
 */

import { Project, Scene, Shot, Asset, MediaVersion, Task, ScriptVersion } from '@/types';

export interface FullProjectBundle {
  version: string;
  exportedAt: number;
  project: Project;
  scripts: ScriptVersion[];
  scenes: Scene[];
  assets: Asset[];
  shots: Shot[];
  tasks: Task[];
  mediaMetadata: Omit<MediaVersion, 'blob'>[];
}

// 1. JSON Export
export function exportProjectToJson(
  project: Project,
  scripts: ScriptVersion[],
  scenes: Scene[],
  assets: Asset[],
  shots: Shot[],
  tasks: Task[],
  media: MediaVersion[]
): string {
  const bundle: FullProjectBundle = {
    version: '1.0.0',
    exportedAt: Date.now(),
    project,
    scripts,
    scenes,
    assets,
    shots,
    tasks,
    mediaMetadata: media.map(m => {
      const { blob, ...meta } = m;
      return meta;
    }),
  };

  return JSON.stringify(bundle, null, 2);
}

// 2. Validate and Parse Imported JSON
export function validateAndParseProjectJson(jsonStr: string): FullProjectBundle {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.project || !data.project.name || !Array.isArray(data.shots)) {
      throw new Error('导入文件缺少必要的 project 或 shots 结构。');
    }
    return data as FullProjectBundle;
  } catch (err: any) {
    throw new Error(`JSON 解析失败: ${err.message}`);
  }
}

// Helper: Escape CSV cell safely
function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // Double-up quotes and wrap in quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

// 3. Storyboard CSV Export (with UTF-8 BOM for Excel/WPS Chinese compatibility)
export function exportStoryboardToCsv(
  project: Project,
  scenes: Scene[],
  shots: Shot[],
  assets: Asset[]
): string {
  const sceneMap = new Map<string, Scene>(scenes.map(s => [s.id, s]));
  const sortedShots = [...shots].sort((a, b) => a.shotNumber - b.shotNumber);

  const headers = [
    '序号',
    '镜头编号',
    '镜头名称',
    '场次',
    '制作方式',
    '当前状态',
    '目标时长(秒)',
    '景别',
    '运镜',
    '画面描述',
    '主体动作',
    '对白与声音',
    '叙事目的',
    '关联设定资产',
    '构图与角度',
    '灯光说明',
    '特效/合成备注'
  ];

  const rows: string[] = [];
  rows.push('\uFEFF' + headers.map(escapeCsvCell).join(',')); // UTF-8 BOM

  sortedShots.forEach((shot, index) => {
    const scene = sceneMap.get(shot.sceneId);
    const sceneLabel = scene ? `场次${scene.sceneNumber}: ${scene.heading}` : '未分类';
    const assetNames = shot.assetReferences.map(r => r.assetName).join('; ');

    const row = [
      index + 1,
      `Shot ${shot.shotNumber}`,
      shot.name,
      sceneLabel,
      shot.productionMethod === 'full_ai' ? '全AI' : shot.productionMethod === 'live_action' ? '实拍' : '实拍+AI',
      shot.status,
      shot.targetDurationSeconds,
      shot.directorDetails.shotSize || '',
      shot.cameraMovement || '',
      shot.visualDescription || '',
      shot.subjectAction || '',
      shot.soundAndDialogue || '',
      shot.narrativeGoal || '',
      assetNames,
      `${shot.directorDetails.cameraAngle || ''} ${shot.directorDetails.composition || ''}`.trim(),
      shot.directorDetails.lightingDirection || '',
      shot.directorDetails.vfxNotes || shot.hybridDetails?.whatToChange || ''
    ];

    rows.push(row.map(escapeCsvCell).join(','));
  });

  return rows.join('\r\n');
}

// 4. Editor Handover Table CSV (剪辑交接表)
export function exportEditHandoverCsv(
  project: Project,
  shots: Shot[],
  media: MediaVersion[]
): string {
  const mediaMap = new Map<string, MediaVersion>(media.map(m => [m.id, m]));
  const sortedShots = [...shots].sort((a, b) => a.shotNumber - b.shotNumber);

  const headers = [
    '剪辑顺序',
    '镜头编号',
    '已采用文件名/版本',
    '时长(秒)',
    '制作方式',
    '审核状态',
    '对白与音效指南',
    '实拍/AI改造指示',
    '剪辑衔接与导演备注'
  ];

  const rows: string[] = [];
  rows.push('\uFEFF' + headers.map(escapeCsvCell).join(','));

  sortedShots.forEach((shot, idx) => {
    const adopted = shot.adoptedMediaVersionId ? mediaMap.get(shot.adoptedMediaVersionId) : undefined;
    const fileName = adopted ? adopted.versionName : '【未锁定采用版本】';

    const row = [
      idx + 1,
      `Shot ${shot.shotNumber}`,
      fileName,
      shot.targetDurationSeconds,
      shot.productionMethod,
      shot.status,
      shot.soundAndDialogue,
      shot.hybridDetails ? `[混合] ${shot.hybridDetails.whatToChange}` : shot.liveActionDetails ? `[实拍] ${shot.liveActionDetails.shootingRequirements}` : '[全AI]',
      shot.directorDetails.continuityNotes || shot.narrativeGoal || ''
    ];

    rows.push(row.map(escapeCsvCell).join(','));
  });

  return rows.join('\r\n');
}

// 5. Download trigger helper in browser
export function triggerFileDownload(content: string, filename: string, mimeType: string = 'text/plain;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
