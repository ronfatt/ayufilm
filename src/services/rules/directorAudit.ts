/**
 * Director Audit Rule Engine (Sistem Peraturan Pemeriksaan Keterusan Pengarah)
 * Inspects structural continuity, cinematography coherence, asset consistency, and production safety.
 * Clear separation between rule-based diagnostics and human directorial judgement.
 * Default Primary Language: Bahasa Melayu.
 */

import { Project, Shot, Asset, Task, DirectorAuditIssue } from '@/types';

export interface AuditCheckResult {
  issues: DirectorAuditIssue[];
  totalShots: number;
  totalDurationSeconds: number;
  targetDurationSeconds: number;
  hasOverDuration: boolean;
  missingNarrativeCount: number;
  unassignedAssetCount: number;
  humanChecklist: {
    category: string;
    items: { id: string; label: string; description: string }[];
  }[];
}

export function runDirectorAudit(
  project: Project,
  shots: Shot[],
  assets: Asset[],
  tasks: Task[],
  locale: string = 'ms'
): AuditCheckResult {
  const isZh = locale === 'zh';
  const issues: DirectorAuditIssue[] = [];
  const sortedShots = [...shots].sort((a, b) => a.shotNumber - b.shotNumber);

  // 1. Duration Check (Pemeriksaan Tempurung Syot)
  const totalDuration = sortedShots.reduce((acc, s) => acc + (s.targetDurationSeconds || 0), 0);
  const targetDuration = project.targetDurationSeconds || 120;
  if (totalDuration > targetDuration + 5) {
    issues.push({
      id: 'issue_duration_over',
      ruleKey: 'duration_over',
      severity: 'warning',
      title: isZh
        ? '镜头累计时长超出项目目标'
        : 'Jumlah Tempoh Syot Melebihi Sasaran Projek',
      affectedShotIds: sortedShots.map(s => s.id),
      reason: isZh
        ? `当前镜头累计时长为 ${totalDuration} 秒，超出项目设定的目标时长（${targetDuration} 秒）约 ${totalDuration - targetDuration} 秒。`
        : `Jumlah tempoh syot semasa ialah ${totalDuration} saat, melebihi sasaran siri (${targetDuration} saat) sebanyak ${totalDuration - targetDuration} saat.`,
      suggestion: isZh
        ? '建议在剪辑预演中排查中远景铺垫镜头，压缩非核心动作的停留时间。'
        : 'Disyorkan untuk menyemak syot penubuhan dan memendekkan jeda tindakan bukan teras dalam pratonton.',
    });
  }

  // 2. Missing Narrative Goal (Kekurangan Matlamat Naratif)
  const missingNarrativeShots = sortedShots.filter(s => !s.narrativeGoal || s.narrativeGoal.trim() === '');
  if (missingNarrativeShots.length > 0) {
    issues.push({
      id: 'issue_missing_narrative',
      ruleKey: 'missing_narrative',
      severity: 'warning',
      title: isZh
        ? '存在未明确叙事目的的镜头'
        : 'Terdapat Syot Tanpa Matlamat Naratif',
      affectedShotIds: missingNarrativeShots.map(s => s.id),
      reason: isZh
        ? `有 ${missingNarrativeShots.length} 个镜头缺少清晰的叙事目的（Narrative Goal）。每个镜头都应为故事发展或情绪推进提供明确作用。`
        : `Terdapat ${missingNarrativeShots.length} syot yang belum mempunyai matlamat naratif yang jelas (Narrative Goal). Setiap syot perlu memacu penceritaan atau emosi babak.`,
      suggestion: isZh
        ? '补充镜头的戏剧动机或视觉信息传递目标，避免出现无效镜头。'
        : 'Lengkapkan matlamat dramatik atau penyampaian maklumat visual bagi mengelakkan syot membazir.',
    });
  }

  // 3. Consecutive Similar Shot Size (3 Syot Saiz Serupa Berturut-turut)
  for (let i = 0; i < sortedShots.length - 2; i++) {
    const s1 = sortedShots[i];
    const s2 = sortedShots[i + 1];
    const s3 = sortedShots[i + 2];
    const size1 = s1.directorDetails.shotSize;
    const size2 = s2.directorDetails.shotSize;
    const size3 = s3.directorDetails.shotSize;

    if (size1 && size1 === size2 && size2 === size3) {
      issues.push({
        id: `issue_consecutive_size_${s1.id}_${s3.id}`,
        ruleKey: `consecutive_size_${s1.id}`,
        severity: 'info',
        title: isZh
          ? `连续 3 个镜头使用相同景别 (${size1})`
          : `3 Syot Berturut-turut Menggunakan Saiz Syot Serupa (${size1})`,
        affectedShotIds: [s1.id, s2.id, s3.id],
        reason: isZh
          ? `Shot ${s1.shotNumber}、Shot ${s2.shotNumber}、Shot ${s3.shotNumber} 均为「${size1}」景别。连续相同景别剪辑容易导致视觉停滞或跳剪（Jump Cut）。`
          : `Syot ${s1.shotNumber}, Syot ${s2.shotNumber}, dan Syot ${s3.shotNumber} semuanya menggunakan saiz syot "${size1}". Saiz syot serupa secara berterusan boleh menyebabkan genangan visual atau lompatan kasar (Jump Cut).`,
        suggestion: isZh
          ? '如非有意营造压抑同质感，建议插入反应特写或空间全景以调节视觉节奏。'
          : 'Jika bukan berniat mencipta suasana monotoni yang disengajakan, selitkan syot tindak balas (reaction shot) atau pandangan luas untuk menukar ritma visual.',
        isIntentional: !!s1.intentionalChoices?.[`consecutive_size_${s1.id}`],
        intentionalReason: s1.intentionalChoices?.[`consecutive_size_${s1.id}`],
      });
    }
  }

  // 4. Consecutive Similar Camera Movement (3 Syot Pergerakan Kamera Serupa)
  for (let i = 0; i < sortedShots.length - 2; i++) {
    const s1 = sortedShots[i];
    const s2 = sortedShots[i + 1];
    const s3 = sortedShots[i + 2];
    const mov1 = s1.cameraMovement;
    const mov2 = s2.cameraMovement;
    const mov3 = s3.cameraMovement;

    if (mov1 !== 'static' && mov1 === mov2 && mov2 === mov3) {
      issues.push({
        id: `issue_consecutive_movement_${s1.id}_${s3.id}`,
        ruleKey: `consecutive_movement_${s1.id}`,
        severity: 'info',
        title: isZh
          ? `连续 3 个镜头使用相同运镜 (${mov1})`
          : `3 Syot Berturut-turut Menggunakan Pergerakan Kamera Serupa (${mov1})`,
        affectedShotIds: [s1.id, s2.id, s3.id],
        reason: isZh
          ? `Shot ${s1.shotNumber} 至 Shot ${s3.shotNumber} 均为「${mov1}」运镜。相同动态可能削弱摄影机运动的戏剧重音。`
          : `Syot ${s1.shotNumber} hingga Syot ${s3.shotNumber} semuanya menggunakan pergerakan kamera "${mov1}". Dinamik serupa boleh mengurangkan penekanan dramatik pergerakan kamera.`,
        suggestion: isZh
          ? '检查是否有必要通过动静交替（例如以固定镜头承接推镜）增强落点分量。'
          : 'Pertimbangkan selang-seli syot statik dan bergerak untuk mengukuhkan impak dramatik titik penamat.',
        isIntentional: !!s1.intentionalChoices?.[`consecutive_movement_${s1.id}`],
        intentionalReason: s1.intentionalChoices?.[`consecutive_movement_${s1.id}`],
      });
    }
  }

  // 5. Sudden Screen Direction Reverse (Arah Pergerakan Watak Terbalik Tiba-tiba)
  for (let i = 0; i < sortedShots.length - 1; i++) {
    const s1 = sortedShots[i];
    const s2 = sortedShots[i + 1];
    const dir1 = s1.directorDetails.movementDirection;
    const dir2 = s2.directorDetails.movementDirection;

    if (
      (dir1 === 'left_to_right' && dir2 === 'right_to_left') ||
      (dir1 === 'right_to_left' && dir2 === 'left_to_right')
    ) {
      if (s1.sceneId === s2.sceneId) {
        issues.push({
          id: `issue_direction_reverse_${s1.id}_${s2.id}`,
          ruleKey: `direction_reverse_${s1.id}`,
          severity: 'info',
          title: isZh
            ? `相邻镜头人物运动方向突然反转`
            : `Arah Pergerakan Watak Terbalik Antara Syot Bersebelahan`,
          affectedShotIds: [s1.id, s2.id],
          reason: isZh
            ? `Shot ${s1.shotNumber} 为 ${dir1 === 'left_to_right' ? '从左向右' : '从右向左'}，而 Shot ${s2.shotNumber} 为 ${dir2 === 'left_to_right' ? '从左向右' : '从右向左'}。若为同一人物同方向追逃，可能产生空间折返错觉或越轴。`
            : `Syot ${s1.shotNumber} bergerak ${dir1 === 'left_to_right' ? 'dari kiri ke kanan' : 'dari kanan ke kiri'}, manakala Syot ${s2.shotNumber} bergerak ${dir2 === 'left_to_right' ? 'dari kiri ke kanan' : 'dari kanan ke kiri'}. Jika melibatkan watak yang sama, ini boleh mengelirukan orientasi ruang penonton atau melanggar garis paksi.`,
          suggestion: isZh
            ? '请核实是否为正反打交互、受阻折返，或在中段插入正面/背面中性过渡镜头。'
            : 'Sahkan sama ada ini adalah sudut bertentangan (shot/reverse shot), perubahan arah sengaja, atau selitkan syot neutral di antaranya.',
          isIntentional: !!s1.intentionalChoices?.[`direction_reverse_${s1.id}`],
          intentionalReason: s1.intentionalChoices?.[`direction_reverse_${s1.id}`],
        });
      }
    }
  }

  // 6. Missing Critical Asset Reference (Syot Tanpa Hubungan Aset)
  const unassignedShots = sortedShots.filter(s => s.assetReferences.length === 0);
  if (unassignedShots.length > 0) {
    issues.push({
      id: 'issue_missing_assets',
      ruleKey: 'missing_assets',
      severity: 'info',
      title: isZh
        ? '部分镜头未绑定视觉设定资产'
        : 'Sebahagian Syot Belum Dihubungkan dengan Aset Reka Bentuk Visual',
      affectedShotIds: unassignedShots.map(s => s.id),
      reason: isZh
        ? `有 ${unassignedShots.length} 个镜头尚未关联任何角色、场景、道具或风格设定。在 AI 生成与合成中可能导致视觉一致性失控。`
        : `Terdapat ${unassignedShots.length} syot yang belum dipautkan kepada watak, lokasi, prop atau gaya visual. Ini boleh menjejaskan ketekalan visual semasa penjanaan AI dan penggambaran.`,
      suggestion: isZh
        ? '为镜头添加对应的视觉设定资产，以便自动组装精确提示词并锁定版本。'
        : 'Hubungkan syot dengan aset reka bentuk visual yang berkaitan untuk menjana prompt tepat dan mengunci versi reka bentuk.',
    });
  }

  // 7. Wardrobe Version Continuity Mismatch (Ketidakkonsistenan Kostum Watak)
  const characterAssets = assets.filter(a => a.category === 'character');
  for (const charAsset of characterAssets) {
    const shotsByScene = new Map<string, Shot[]>();
    for (const shot of sortedShots) {
      if (!shotsByScene.has(shot.sceneId)) {
        shotsByScene.set(shot.sceneId, []);
      }
      shotsByScene.get(shot.sceneId)!.push(shot);
    }

    for (const [sceneId, sceneShots] of Array.from(shotsByScene.entries())) {
      const wardrobeUsed = new Set<string>();
      const shotsWithChar: Shot[] = [];

      for (const s of sceneShots) {
        const ref = s.assetReferences.find(r => r.assetId === charAsset.id);
        if (ref) {
          shotsWithChar.push(s);
          if (ref.subVersionId) {
            wardrobeUsed.add(ref.subVersionId);
          }
        }
      }

      if (wardrobeUsed.size > 1) {
        issues.push({
          id: `issue_wardrobe_mismatch_${charAsset.id}_${sceneId}`,
          ruleKey: `wardrobe_mismatch_${sceneId}`,
          severity: 'warning',
          title: isZh
            ? `同场戏中角色「${charAsset.name}」服装版本不一致`
            : `Ketidakkonsistenan Versi Kostum Watak "${charAsset.name}" Dalam Babak Sama`,
          affectedShotIds: shotsWithChar.map(s => s.id),
          reason: isZh
            ? `在当前场次中，角色「${charAsset.name}」引用了多个不同的服装版本（${Array.from(wardrobeUsed).join(', ')}）。`
            : `Dalam babak ini, watak "${charAsset.name}" merujuk kepada beberapa versi kostum yang berbeza (${Array.from(wardrobeUsed).join(', ')}).`,
          suggestion: isZh
            ? '如剧情未发生更衣或战损撕裂，请统一设定版本以避免连续性穿帮。'
            : 'Jika watak tidak menukar pakaian atau mengalami koyakan tempur dalam plot, selaraskan versi kostum untuk mengelakkan percanggahan keterusan visual.',
        });
      }
    }
  }

  // 8. Task Unfinished but Shot Approved (Syot Lulus Tetapi Tugasan Belum Siap)
  for (const shot of sortedShots) {
    if (shot.status === 'approved') {
      const shotTasks = tasks.filter(t => t.shotId === shot.id);
      const pendingTasks = shotTasks.filter(t => t.status !== 'completed');
      if (pendingTasks.length > 0) {
        issues.push({
          id: `issue_uncompleted_tasks_${shot.id}`,
          ruleKey: `uncompleted_tasks_${shot.id}`,
          severity: 'warning',
          title: isZh
            ? `Shot ${shot.shotNumber} 已标记批准，但仍有未完成任务`
            : `Syot ${shot.shotNumber} Ditandakan Lulus Tetapi Mempunyai Tugasan Belum Selesai`,
          affectedShotIds: [shot.id],
          reason: isZh
            ? `Shot ${shot.shotNumber} 处于「已批准」状态，但关联的 ${pendingTasks.length} 个任务（如：${pendingTasks.map(t => t.title).slice(0, 2).join('、')}）尚未标记为完成。`
            : `Syot ${shot.shotNumber} berstatus "Lulus (Approved)", tetapi terdapat ${pendingTasks.length} tugasan berkaitan yang belum siap (contoh: ${pendingTasks.map(t => t.title).slice(0, 2).join(', ')}).`,
          suggestion: isZh
            ? '请核实任务交付物是否已合入，或先将任务状态更新为完成。'
            : 'Sila semak sama ada penyerahan tugasan telah digabungkan, atau kemas kini status tugasan kepada selesai terlebih dahulu.',
        });
      }
    }
  }

  // Human Creative Checklist (Senarai Semakan Kreatif Manusia)
  const humanChecklist = isZh ? [
    {
      category: '叙事与戏剧弧 (Narrative & Dramatic Arc)',
      items: [
        { id: 'nar_1', label: '核心悬念设立', description: '故事前 15% 是否建立了吸引受众的戏剧疑问或危机？' },
        { id: 'nar_2', label: '角色动机一致', description: '角色行为是否源自清晰的内在欲望或迫在眉睫的外部威胁？' },
        { id: 'nar_3', label: '高潮时刻充分释放', description: '全片冲突最高点是否有足够的视听长度与情感共鸣？' },
      ],
    },
    {
      category: '视听覆盖与空间轴线 (Coverage & Spatial Axis)',
      items: [
        { id: 'cov_1', label: '轴线守恒 (180度法则)', description: '双人对话与对抗机位是否严格遵守轴线，避免空间方位颠倒？' },
        { id: 'cov_2', label: '安全切景储备', description: '是否有可供剪辑调节节奏的中性空镜、道具特写或反打素材？' },
        { id: 'cov_3', label: '视线匹配 (Eyeline Match)', description: '对视人物的眼神高低与朝向角度是否精准呼应？' },
      ],
    },
    {
      category: '视觉风格与制作可行性 (Style & Feasibility)',
      items: [
        { id: 'sty_1', label: '光影色调统一', description: 'AI 生成与实拍素材的色彩空间、暗部颗粒和高光衰减是否协调？' },
        { id: 'sty_2', label: '实拍+AI 边缘遮挡', description: '换景镜头的人物发丝与复杂运动轮廓是否具备高精度 Roto 交付件？' },
        { id: 'sty_3', label: '声音设计空间感', description: '对白混响是否真实反映了场景的声学物理特性（如机房混响/雨巷扩散）？' },
      ],
    },
  ] : [
    {
      category: 'Naratif & Arka Dramatik (Narrative & Dramatic Arc)',
      items: [
        { id: 'nar_1', label: 'Pembentukan Misteri Teras', description: 'Adakah 15% awal cerita telah membina krisis atau persoalan dramatik yang memikat penonton?' },
        { id: 'nar_2', label: 'Motivasi Watak Konsisten', description: 'Adakah tindakan watak berpunca daripada kehendak dalaman yang jelas atau ancaman luaran mendesak?' },
        { id: 'nar_3', label: 'Klimaks Bertenaga', description: 'Adakah titik konflik tertinggi mempunyai durasi audio-visual dan resonans emosi yang mencukupi?' },
      ],
    },
    {
      category: 'Liputan Visual & Paksi Ruang (Coverage & Spatial Axis)',
      items: [
        { id: 'cov_1', label: 'Peraturan 180 Darjah (180° Rule)', description: 'Adakah kedudukan kamera perbualan dan pertarungan mematuhi garis paksi bagi mengelakkan kekeliruan ruang?' },
        { id: 'cov_2', label: 'Rizab Syot Keselamatan (Cutaway)', description: 'Adakah terdapat syot persekitaran atau prop bebas untuk melaraskan ritma suntingan?' },
        { id: 'cov_3', label: 'Padanan Arah Pandang (Eyeline Match)', description: 'Adakah sudut dan ketinggian pandangan mata watak yang bersemuka sepadan dengan tepat?' },
      ],
    },
    {
      category: 'Gaya Visual & Kebolehlaksanaan Produksi (Style & Feasibility)',
      items: [
        { id: 'sty_1', label: 'Penyelarasan Tona Cahaya & Warna', description: 'Adakah ruang warna, butiran bayang dan sorotan cahaya antara bahan AI dan rakaman sebenar seimbang?' },
        { id: 'sty_2', label: 'Ketepatan Roto & Pengasingan Bahan Hibrid', description: 'Adakah siluet rambut watak dan pergerakan kompleks dalam syot hibrid mempunyai aset Roto berketepatan tinggi?' },
        { id: 'sty_3', label: 'Akustik Ruang & Reka Bentuk Bunyi', description: 'Adakah gema dialog mencerminkan sifat fizikal lokasi secara realistik (seperti dengungan bilik pelayan / pantulan lorong hujan)?' },
      ],
    },
  ];

  return {
    issues,
    totalShots: sortedShots.length,
    totalDurationSeconds: totalDuration,
    targetDurationSeconds: targetDuration,
    hasOverDuration: totalDuration > targetDuration,
    missingNarrativeCount: missingNarrativeShots.length,
    unassignedAssetCount: unassignedShots.length,
    humanChecklist,
  };
}
