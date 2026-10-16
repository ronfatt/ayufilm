/**
 * Rule-based Script Breakdown Engine (基础规则剧本拆解器)
 * NOTE: Explicitly rule-based parsing (regular expressions & syntax heuristics).
 * Never fakes AI understanding; provides transparent breakdown for director manual review.
 */

import { Scene } from '@/types';

export interface ParsedSceneDraft {
  sceneNumber: number;
  heading: string;
  location: string;
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk' | 'interior_unknown';
  characters: string[];
  actionSummary: string;
  dialogueSummary: string;
  emotionalGoal: string;
  estimatedDurationSeconds: number;
}

export function parseScriptByRules(
  scriptContent: string,
  projectId: string,
  knownCharacterNames: string[] = ['Razak', 'Malik', 'Pengawal']
): Scene[] {
  const lines = scriptContent.split(/\r?\n/);
  const scenes: Scene[] = [];

  let currentHeading = '';
  let currentLines: string[] = [];
  let sceneIndex = 1;

  const flushScene = () => {
    if (!currentHeading && currentLines.length === 0) return;

    const blockText = currentLines.join('\n');
    
    // Extract Time of Day
    let timeOfDay: Scene['timeOfDay'] = 'night';
    const upperText = (currentHeading + ' ' + blockText).toUpperCase();
    if (upperText.includes('DAY') || upperText.includes('SIANG') || upperText.includes('日')) {
      timeOfDay = 'day';
    } else if (upperText.includes('DAWN') || upperText.includes('SUBUH') || upperText.includes('清晨')) {
      timeOfDay = 'dawn';
    } else if (upperText.includes('DUSK') || upperText.includes('SENJA') || upperText.includes('黄昏')) {
      timeOfDay = 'dusk';
    } else if (upperText.includes('NIGHT') || upperText.includes('MALAM') || upperText.includes('夜')) {
      timeOfDay = 'night';
    }

    // Extract Location from Heading
    let location = 'Lokasi Belum Ditetapkan';
    const headingParts = currentHeading.split(/[-–—:]/);
    if (headingParts.length > 1) {
      location = headingParts[1].replace(/INT\.|EXT\./i, '').trim();
    } else if (currentHeading) {
      location = currentHeading.replace(/SCENE \d+:?/i, '').replace(/BABAK \d+:?/i, '').replace(/INT\.|EXT\./i, '').trim();
    }

    // Extract Characters
    const detectedCharacters: string[] = [];
    for (const name of knownCharacterNames) {
      const reg = new RegExp(`\\b${name}\\b`, 'i');
      if (reg.test(blockText) || reg.test(currentHeading)) {
        detectedCharacters.push(name);
      }
    }
    // Also look for uppercase name cues like "PENGAWAL:" or "RAZAK:"
    const speakerMatches = blockText.match(/^[A-Z\u4e00-\u9fa5]{2,15}(?=\s*(\([A-Z]+\))?\s*[:：])/gm);
    if (speakerMatches) {
      speakerMatches.forEach(sp => {
        const cleanName = sp.trim();
        if (!detectedCharacters.includes(cleanName) && cleanName.length > 1) {
          detectedCharacters.push(cleanName);
        }
      });
    }

    // Extract Dialogue vs Action
    const dialogueLines: string[] = [];
    const actionLines: string[] = [];

    currentLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (/^[A-Z\u4e00-\u9fa5]{2,15}\s*(\([A-Z]+\))?\s*[:：]/.test(trimmed) || trimmed.startsWith('"') || trimmed.startsWith('“')) {
        dialogueLines.push(trimmed);
      } else {
        actionLines.push(trimmed);
      }
    });

    scenes.push({
      id: `scene_${projectId}_${Date.now()}_${sceneIndex}`,
      projectId,
      sceneNumber: sceneIndex,
      heading: currentHeading || `Babak ${sceneIndex}`,
      location: location || 'Lokasi Penggambaran',
      timeOfDay,
      characters: detectedCharacters.length > 0 ? detectedCharacters : ['Watak Belum Ditentukan'],
      actionSummary: actionLines.slice(0, 3).join(' ') || 'Huraian tindakan perlu dilengkapkan',
      dialogueSummary: dialogueLines.slice(0, 2).join(' ') || 'Babak ini bertumpu pada suasana dan aksi fizikal',
      emotionalGoal: '[Nilai Lalai Analisis Peraturan] Memacu ketegangan plot dan konflik fizikal. Sila sahkan matlamat emosi bersama pengarah.',
      estimatedDurationSeconds: Math.max(15, Math.min(60, currentLines.length * 4)),
      order: sceneIndex,
    });

    sceneIndex++;
    currentLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    // Match scene headings e.g. "SCENE 1:", "BABAK 1:", "INT.", "EXT."
    const isHeading =
      /^(SCENE\s+\d+|BABAK\s+\d+|INT\.|EXT\.|场次\s*\d+|第[一二三四五六七八九十0-9]+场)/i.test(trimmed);

    if (isHeading) {
      flushScene();
      currentHeading = trimmed;
    } else {
      currentLines.push(line);
    }
  }

  flushScene();

  return scenes;
}
