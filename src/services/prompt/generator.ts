/**
 * Prompt Assembler Engine for Ayu AiFilm Maker
 * Assembles production instructions and AI prompts based on confirmed shots and visual assets.
 * Default Primary Language: Bahasa Melayu & English.
 */

import { Shot, Asset, PromptVersion } from '@/types';

export function assemblePromptForShot(
  shot: Shot,
  referencedAssets: (Asset | { asset: Asset; versionId?: string })[],
  targetPlatformTag: string = 'Runway Gen-3'
): PromptVersion {
  // Extract asset prompt fragments
  let charDesc = '';
  let sceneDesc = '';
  let charDescEn = '';
  let sceneDescEn = '';

  referencedAssets.forEach(rawItem => {
    const asset = 'asset' in rawItem ? rawItem.asset : rawItem;
    if (asset.category === 'character') {
      charDesc += `[Watak: ${asset.name}] ${asset.summary}. `;
      charDescEn += `[Character: ${asset.name}], consistent facial features and wardrobe. `;
    } else if (asset.category === 'scene') {
      sceneDesc += `[Lokasi: ${asset.name}] ${asset.summary}. `;
      sceneDescEn += `[Environment: ${asset.name}], architectural details and atmospheric depth. `;
    }
  });

  // Camera specs
  const shotSize = shot.directorDetails.shotSize || 'Sederhana (MS)';
  const cameraAngle = shot.directorDetails.cameraAngle || 'Paras Mata (Eye level)';
  const lens = shot.directorDetails.lensFocalLength || '35mm';
  const lighting = shot.directorDetails.lightingDirection || 'Pencahayaan Semulajadi Sinematik';

  // 1. Static Keyframe Prompt
  const staticMs = `${shot.name}. Paparan visual: ${shot.visualDescription}. ${charDesc}${sceneDesc}Saiz syot: ${shotSize}, Sudut kamera: ${cameraAngle}, Jarak fokus: ${lens}, Pencahayaan: ${lighting}. Perincian tinggi, tekstur filem ARRI Alexa, resolusi 8K.`;
  const staticEn = `Cinematic still frame of ${shot.name}. Scene description: ${shot.visualDescription}. ${charDescEn}${sceneDescEn}Framing: ${shotSize}, Camera angle: ${cameraAngle}, Lens: ${lens}, Lighting: ${lighting}, 8k resolution, Arri Alexa raw texture, masterpiece photography, 16:9 ratio.`;

  // 2. Dynamic Video Prompt
  const dynamicMs = `[Pergerakan Kamera]: ${shot.cameraMovement}, bergerak lancar. [Tindakan Subjek]: ${shot.subjectAction}, permulaan hingga penamat: ${shot.directorDetails.actionStartEnd || 'pergerakan berterusan'}. [Dinamik Persekitaran]: Percikan air hujan dan kabus asap mengalir semulajadi, pencahayaan beralih licin. [Keadaan Penamat]: Kamera berhenti stabil pada titik gubahan akhir. Ketekalan identiti watak dipelihara, tiada artifak berkelip.`;
  const dynamicEn = `[Camera Movement]: ${shot.cameraMovement} smooth tracking motion. [Subject Action]: ${shot.subjectAction}. Action progression: ${shot.directorDetails.actionStartEnd || 'continuous natural motion'}. Realistic fluid dynamics, rain mist and lighting coherence. Stable character identity, no morphing, no artifacts.`;

  // 3. Live-Action + AI Revamp Instruction
  let hybridMs: string | undefined = undefined;
  let hybridEn: string | undefined = undefined;
  if (shot.productionMethod === 'hybrid' && shot.hybridDetails) {
    hybridMs = `[Arahan Ubah Suai Hibrid]\n- Sasaran Gantian: ${shot.hybridDetails.whatToChange}\n- Unsur Wajib Dikekalkan: ${shot.hybridDetails.whatToPreserve} (${shot.hybridDetails.preserveActingAndMotion ? 'Kekalkan lakonan asal, ekspresi wajah dan pergerakan kamera secara ketat' : 'Pelarasan kecil dibenarkan'})\n- Skop VFX: ${shot.hybridDetails.taskTypes.join(', ')}\n- Nota Penjejakan & Komposit: ${shot.hybridDetails.trackingNotes}`;
    hybridEn = `[Live-action Revamp Directive]\n- Replacement Target: ${shot.hybridDetails.whatToChange}\n- Strict Preservation: ${shot.hybridDetails.whatToPreserve} (${shot.hybridDetails.preserveActingAndMotion ? 'Preserve original actor performance, facial expressions, and camera trajectory strictly' : 'Minor adjustments allowed'})\n- VFX Scope: ${shot.hybridDetails.taskTypes.join(', ')}\n- Tracking & Comp Notes: ${shot.hybridDetails.trackingNotes}`;
  }

  return {
    id: `prompt_${shot.id}_${Date.now()}`,
    shotId: shot.id,
    versionNumber: 1,
    staticKeyframePromptZh: staticMs,
    staticKeyframePromptEn: staticEn,
    dynamicVideoPromptZh: dynamicMs,
    dynamicVideoPromptEn: dynamicEn,
    hybridInstructionsZh: hybridMs,
    hybridInstructionsEn: hybridEn,
    targetPlatformTag,
    referencedAssetVersionIds: shot.assetReferences.map(r => r.assetVersionId),
    createdAt: Date.now(),
    createdBy: 'Ayu AiFilm Maker Prompt Engine',
  };
}

export const assemblePromptsForShot = assemblePromptForShot;
