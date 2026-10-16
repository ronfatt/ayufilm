/**
 * DIRECTOR OS - Core Data Models & Type Definitions
 */

export type ProductionMethod = 'full_ai' | 'live_action' | 'hybrid';

export type ShotStatus =
  | 'draft'               // 待制作
  | 'in_progress'         // 制作中
  | 'ready_for_review'    // 待审核
  | 'changes_requested'   // 需修改
  | 'approved';           // 已批准

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '2.39:1' | 'custom';

export type ShotSize =
  | 'extreme_wide'   // 大远景 ELS
  | 'wide'           // 远景/全景 WS
  | 'medium_wide'    // 中远景 MWS
  | 'medium'         // 中景 MS
  | 'medium_close'   // 中近景 MCU
  | 'close_up'       // 近景/特写 CU
  | 'extreme_close'; // 大特写 ECU

export type CameraAngle =
  | 'eye_level'      // 平视
  | 'low_angle'      // 仰角
  | 'high_angle'     // 俯角
  | 'bird_eye'       // 顶视/鸟瞰
  | 'dutch_angle';   // 荷兰角/倾斜

export type CameraMovement =
  | 'static'         // 固定镜头
  | 'pan'            // 摇镜头 Pan
  | 'tilt'           // 俯仰 Tilt
  | 'dolly_in'       // 推镜头 Dolly In
  | 'dolly_out'      // 拉镜头 Dolly Out
  | 'tracking'       // 移镜头 / 跟拍
  | 'crane'          // 升降镜头
  | 'handheld'       // 手持晃动
  | 'orbit'          // 环绕镜头
  | 'zoom';          // 变焦

export type EyelineDirection = 'screen_left' | 'screen_right' | 'direct_camera' | 'off_screen_up' | 'off_screen_down';
export type MovementDirection = 'left_to_right' | 'right_to_left' | 'towards_camera' | 'away_from_camera' | 'static';
export type AxisSide = 'left_of_axis' | 'right_of_axis' | 'neutral';

export interface Project {
  id: string;
  name: string;
  type: 'short_drama' | 'short_film' | 'commercial' | 'music_video' | 'custom';
  logline: string;
  targetDurationSeconds: number;
  aspectRatio: AspectRatio;
  customAspectRatio?: string;
  primaryLanguage: string;
  primaryProductionMethod: ProductionMethod;
  visualDirection: string;
  deadline?: string;
  createdAt: number;
  updatedAt: number;
  isDemo?: boolean;
}

export interface ScriptVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  title: string;
  content: string;
  notes?: string;
  createdAt: number;
  createdBy: string;
}

export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  heading: string; // e.g. "INT. 秘密基地 - NIGHT"
  location: string;
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk' | 'interior_unknown';
  characters: string[]; // Character names or IDs
  actionSummary: string;
  dialogueSummary: string;
  emotionalGoal: string; // 情绪目的
  estimatedDurationSeconds: number;
  order: number;
}

export type AssetCategory = 'character' | 'scene' | 'prop' | 'visual_style';

export interface AssetVersion {
  versionId: string;
  versionNumber: number;
  name: string;
  description: string;
  previewUrl?: string; // Blob URL or placeholder SVG
  isLocked: boolean;
  createdAt: number;
  parameters?: Record<string, any>;
}

export interface CharacterAssetDetails {
  identityRole: string; // 身份
  ageRange: string;     // 年龄范围
  appearance: string;   // 外形特征
  hairstyle: string;    // 发型
  wardrobeVersions: {   // 服装版本
    id: string;
    label: string;
    description: string;
    referenceUrl?: string;
  }[];
  voiceNotes: string;   // 声音备注
}

export interface SceneAssetDetails {
  spatialDescription: string; // 空间说明
  entrancesExits: string;     // 出入口
  keyLightSources: string;    // 主要光源
  stateVersions: {            // 状态版本 (如: 完好/损毁/日/夜)
    id: string;
    label: string;
    description: string;
    referenceUrl?: string;
  }[];
}

export interface PropAssetDetails {
  belongsToCharacter?: string; // 归属人物
  keyStates: {                 // 关键状态
    id: string;
    label: string;
    description: string;
    referenceUrl?: string;
  }[];
}

export interface VisualStyleAssetDetails {
  colorPalette: string;        // 色彩
  contrastRatio: string;       // 对比
  lightingMood: string;        // 光线
  cinematographyRef: string;   // 摄影参考
  aspectRatioRef: string;      // 画幅
  prohibitions: string;        // 禁止事项
}

export interface Asset {
  id: string;
  projectId: string;
  category: AssetCategory;
  name: string;
  summary: string;
  coverUrl?: string;
  currentVersionId: string;
  versions: AssetVersion[];
  details: CharacterAssetDetails | SceneAssetDetails | PropAssetDetails | VisualStyleAssetDetails;
  createdAt: number;
  updatedAt: number;
}

export interface ShotAssetReference {
  assetId: string;
  assetCategory: AssetCategory;
  assetName: string;
  assetVersionId: string;
  subVersionId?: string; // e.g. specific wardrobe or prop state ID
  subVersionLabel?: string;
}

export interface DirectorDetails {
  shotSize?: ShotSize;
  cameraAngle?: CameraAngle;
  lensFocalLength?: string;           // 焦段参考 e.g. "35mm", "85mm"
  composition?: string;               // 构图与主体位置 e.g. "三分构图，主体偏右"
  characterBlocking?: string;         // 人物调度
  eyelineDirection?: EyelineDirection;// 视线方向
  movementDirection?: MovementDirection; // 运动方向
  axisSide?: AxisSide;                // 轴线与摄影机所在侧
  actionStartEnd?: string;            // 动作起点与终点 e.g. "从站立到蹲伏掩护"
  lightingDirection?: string;         // 灯光方向 e.g. "侧逆光，硬光"
  emotionalIntensity?: number;        // 情绪强度 1-10
  inOutScreenState?: string;          // 入镜与出镜状态 e.g. "画外入镜，未出镜"
  continuityNotes?: string;           // 与前后镜头衔接
  frameRate?: string;                 // 帧率 e.g. "24fps", "60fps (慢动作)"
  vfxNotes?: string;                  // 特效、合成及拍摄备注
}

export interface HybridProductionDetails {
  whatToChange: string;               // 需要改变什么 (e.g. 背景换成科幻废墟)
  whatToPreserve: string;             // 必须保留什么 (e.g. 人物表演与运镜)
  preserveActingAndMotion: boolean;   // 人物表演与原始运镜是否保留
  taskTypes: ('replacement' | 'costume' | 'prop' | 'vfx')[];
  trackingNotes?: string;              // Nota penjejakan & komposit
}

export interface LiveActionDetails {
  shootingRequirements: string;       // 拍摄要求
  takeRecords: {
    takeNumber: number;
    description: string;
    isCircleTake: boolean; // 导演选定 Take
    timecode?: string;
    mediaVersionId?: string;
  }[];
}

export interface Shot {
  id: string;                         // 不可变内部 ID
  projectId: string;
  sceneId: string;
  shotNumber: number;                 // 显示编号，可重排
  name: string;
  narrativeGoal: string;              // 叙事目的
  visualDescription: string;          // 画面描述
  subjectAction: string;              // 主体动作
  cameraMovement: CameraMovement;     // 摄影机运动
  targetDurationSeconds: number;      // 目标时长
  soundAndDialogue: string;           // 声音与对白
  productionMethod: ProductionMethod; // 制作方式
  status: ShotStatus;                 // 制作状态
  
  // 关联设定
  assetReferences: ShotAssetReference[];

  // 导演细节展开面板
  directorDetails: DirectorDetails;

  // 混合/实拍特有属性
  hybridDetails?: HybridProductionDetails;
  liveActionDetails?: LiveActionDetails;

  // 媒体版本与当前采用版本
  adoptedMediaVersionId?: string;     // 当前采用版本 ID (至多一个)

  // 提示词
  currentPromptVersionId?: string;

  // 意图记录 (针对规则警告标为有意安排)
  intentionalChoices?: Record<string, string>; // ruleKey -> director's reasoning

  createdAt: number;
  updatedAt: number;
}

export interface PromptVersion {
  id: string;
  shotId: string;
  versionNumber: number;
  staticKeyframePromptZh: string;
  staticKeyframePromptEn: string;
  dynamicVideoPromptZh: string;
  dynamicVideoPromptEn: string;
  hybridInstructionsZh?: string;
  hybridInstructionsEn?: string;
  targetPlatformTag: string; // e.g. "Kling 1.5", "Runway Gen-3", "Midjourney v6", "Sora"
  referencedAssetVersionIds: string[];
  createdAt: number;
  createdBy: string;
}

export interface MediaVersion {
  id: string;
  shotId: string;
  versionNumber: number;
  versionName: string;
  mediaType: 'image' | 'video';
  blob?: Blob;             // IndexedDB raw Blob for uploaded images/videos
  url?: string;            // Created Blob URL (or SVG placeholder data URL)
  source: 'ai_generated' | 'live_take' | 'hybrid_comp';
  creatorName: string;
  toolTag: string;
  promptVersionId?: string;
  notes?: string;
  reviewStatus: ShotStatus;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  durationSeconds?: number;
  createdAt: number;
}

export interface TimecodedComment {
  id: string;
  reviewId: string;
  timestampSeconds: number; // 评论对应视频时间点
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: number;
}

export interface Review {
  id: string;
  shotId: string;
  mediaVersionId: string;
  reviewerName: string;
  decision: 'approve' | 'request_changes' | 'comment_only';
  feedbackNotes: string;
  timecodedComments: TimecodedComment[];
  createdAt: number;
}

export interface Task {
  id: string;
  projectId: string;
  shotId?: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  status: TaskStatus;
  deadline?: string;
  blockerReason?: string;
  dependencies?: string[]; // IDs of other tasks or assets required
  createdAt: number;
  updatedAt: number;
}

export interface Member {
  id: string;
  name: string;
  role: 'director' | 'ai_artist' | 'cinematographer' | 'producer' | 'editor';
  avatar?: string;
}

export interface DirectorAuditIssue {
  id: string;
  ruleKey: string;
  severity: 'warning' | 'info';
  title: string;
  affectedShotIds: string[];
  reason: string;
  suggestion: string;
  isIntentional?: boolean;
  intentionalReason?: string;
}

export interface AppConfig {
  brandName: string;
  language: 'zh-CN' | 'en' | 'ms';
  activeMemberId: string;
  storageEstimate?: {
    usageBytes: number;
    quotaBytes: number;
  };
}
