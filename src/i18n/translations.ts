/**
 * Centralized Internationalization (i18n) Engine for DIRECTOR OS
 * Primary Language: Bahasa Melayu (Malay)
 * Secondary / Translation Option: Bahasa Cina (Chinese)
 * Supports:
 * - 'ms': Bahasa Melayu (Utama / Primary)
 * - 'ms_zh': Bahasa Melayu + Terjemahan Bahasa Cina (Bilingual Mode)
 * - 'zh': 中文 (Bahasa Cina)
 */

export type Locale = 'ms' | 'ms_zh' | 'zh';

export interface TranslationDictionary {
  brand: {
    tagline: string;
    localDemoNotice: string;
    proBadge: string;
    localSandbox: string;
  };
  nav: {
    overview: string;
    overviewSub: string;
    story: string;
    storySub: string;
    bible: string;
    bibleSub: string;
    shots: string;
    shotsSub: string;
    production: string;
    productionSub: string;
    delivery: string;
    deliverySub: string;
  };
  status: {
    draft: string;
    in_progress: string;
    ready_for_review: string;
    changes_requested: string;
    approved: string;
    all: string;
  };
  methods: {
    full_ai: string;
    live_action: string;
    hybrid: string;
    all: string;
  };
  overview: {
    whatImMaking: string;
    whatNeedsConfirm: string;
    whereIsBlocked: string;
    whatToDoNext: string;
    resumeWork: string;
    stageProgress: string;
    stageSubtitle: string;
    recentTasks: string;
    nextSteps: string;
    nextStepsSubtitle: string;
    viewAllShots: string;
    approvedRate: string;
    durationBudget: string;
    blockedTasks: string;
    pendingReviews: string;
    pendingReviewPill: string;
    reviewNow: string;
    noPendingReview: string;
    jumpToShots: string;
    targetDuration: string;
    actualDuration: string;
    overDuration: string;
    underDuration: string;
    exactDuration: string;
    loglineLabel: string;
    visualDirectionLabel: string;
  };
  story: {
    scriptEditorTitle: string;
    saveNewVersion: string;
    breakdownScript: string;
    breakdownSubtitle: string;
    savedNotice: string;
    wordCount: string;
    versionCount: string;
    scenesList: string;
    addSceneManual: string;
    actionSummary: string;
    dialogueSummary: string;
    emotionalGoal: string;
    estimatedDuration: string;
    linkedShotsCount: string;
    dayScene: string;
    nightScene: string;
    breakdownModalTitle: string;
    breakdownRuleBadge: string;
    breakdownDesc: string;
    confirmMerge: string;
    cancel: string;
  };
  bible: {
    character: string;
    scene: string;
    prop: string;
    visual_style: string;
    newAsset: string;
    lockedVersion: string;
    structuredParams: string;
    roleIdentity: string;
    ageRange: string;
    appearance: string;
    hairstyle: string;
    voiceNotes: string;
    wardrobeVersions: string;
    spatialDescription: string;
    entrancesExits: string;
    keyLightSources: string;
    belongsToChar: string;
    propStates: string;
    colorPalette: string;
    contrastRatio: string;
    cinematographyRef: string;
    prohibitions: string;
    versionHistory: string;
    currentAdopted: string;
    impactModalTitle: string;
    impactModalDesc: string;
    strategy1Title: string;
    strategy1Desc: string;
    strategy2Title: string;
    strategy2Desc: string;
    cancelUpdate: string;
  };
  workbench: {
    shotList: string;
    cardsView: string;
    tableView: string;
    sequenceView: string;
    searchPlaceholder: string;
    undoDelete: string;
    newShot: string;
    shotNumber: string;
    adoptedVersion: string;
    markAdopted: string;
    screenReview: string;
    promptTab: string;
    workflowTab: string;
    compareTab: string;
    aspectRatio: string;
    fitModeContain: string;
    fitModeCover: string;
    noMedia: string;
    uploadMedia: string;
    uploadNewVersion: string;
    mediaVersions: string;
    directorComments: string;
    approveShot: string;
    requestChanges: string;
    submitComment: string;
    commentPlaceholder: string;
    cinematographyDetails: string;
    shotName: string;
    narrativeGoal: string;
    visualDescription: string;
    subjectAction: string;
    cameraMovement: string;
    targetDurationSec: string;
    soundAndDialogue: string;
    shotSize: string;
    cameraAngle: string;
    lensFocalLength: string;
    eyelineDirection: string;
    movementDirection: string;
    composition: string;
    lightingDirection: string;
    emotionalIntensity: string;
    continuityNotes: string;
    vfxNotes: string;
    timelineStrip: string;
    collapseTimeline: string;
    sideBySideTitle: string;
    backToSingle: string;
    versionA: string;
    versionB: string;
  };
  prompts: {
    title: string;
    subtitle: string;
    regenerate: string;
    staticKeyframe: string;
    dynamicVideo: string;
    hybridInstructions: string;
    copyEnglish: string;
    copied: string;
  };
  production: {
    kanbanView: string;
    listView: string;
    memberFilter: string;
    allMembers: string;
    createTask: string;
    colTodo: string;
    colInProgress: string;
    colBlocked: string;
    colCompleted: string;
    blockerReason: string;
    linkedShot: string;
    generalProjectTask: string;
    taskModalTitle: string;
    taskTitle: string;
    taskDesc: string;
    assignee: string;
    confirmCreate: string;
    cancel: string;
  };
  delivery: {
    title: string;
    subtitle: string;
    previsualNotice: string;
    shotCount: string;
    prevShot: string;
    nextShot: string;
    playContinuous: string;
    pausePreview: string;
    restartStart: string;
    adoptedMediaRatio: string;
    checklistTitle: string;
    unapprovedShots: string;
    missingMediaShots: string;
    exportHandoverCsv: string;
    exportHandoverCsvDesc: string;
    exportStoryboardCsv: string;
    exportStoryboardCsvDesc: string;
    printStoryboardPdf: string;
    printStoryboardPdfDesc: string;
    exportFullJson: string;
    exportFullJsonDesc: string;
  };
  audit: {
    modalTitle: string;
    modalSubtitle: string;
    ruleAlertsTab: string;
    checklistTab: string;
    intentionalBadge: string;
    unverifiedBadge: string;
    reasonLabel: string;
    suggestionLabel: string;
    affectedShotsLabel: string;
    intentionalReasonPlaceholder: string;
    markIntentionalBtn: string;
    intentionalDirectorNote: string;
    allPassedTitle: string;
    allPassedDesc: string;
    footerDisclaimer: string;
    closeBtn: string;
  };
  settings: {
    title: string;
    subtitle: string;
    brandLabel: string;
    brandDesc: string;
    updateBrandBtn: string;
    savedBadge: string;
    sandboxTitle: string;
    sandboxStatus: string;
    usedStorage: string;
    availableQuota: string;
    sandboxDesc: string;
    resetDemoBtn: string;
    backupTitle: string;
    exportJsonBtn: string;
    importJsonBtn: string;
    architectureTitle: string;
    architectureDesc: string;
    languageLabel: string;
  };
  common: {
    saveSuccess: string;
    saving: string;
    saveFailed: string;
    demoTag: string;
    proTag: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    complete: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  // 1. BAHASA MELAYU (UTAMA / PRIMARY)
  ms: {
    brand: {
      tagline: 'Meja Kerja Pengarahan Filem & AI Profesional',
      localDemoNotice: 'Mod Demo Tempatan • Data disimpan selamat dalam IndexedDB pelayar',
      proBadge: 'PRO',
      localSandbox: 'Kotak Pasir Tempatan',
    },
    nav: {
      overview: 'Gambaran Keseluruhan',
      overviewSub: 'Overview',
      story: 'Cerita & Skrip',
      storySub: 'Story & Script',
      bible: 'Alkitab Visual',
      bibleSub: 'Visual Bible',
      shots: 'Meja Kerja Syot',
      shotsSub: 'Shot Workbench',
      production: 'Produksi & Tugas',
      productionSub: 'Production Tasks',
      delivery: 'Siap & Serahan',
      deliverySub: 'Cut & Delivery',
    },
    status: {
      draft: 'Draf',
      in_progress: 'Dalam Proses',
      ready_for_review: 'Untuk Semakan',
      changes_requested: 'Perlu Pindaan',
      approved: 'Diluluskan',
      all: 'Semua Status',
    },
    methods: {
      full_ai: 'AI Sepenuhnya',
      live_action: 'Penggambaran Langsung',
      hybrid: 'Hibrid (Langsung + AI)',
      all: 'Semua Kaedah',
    },
    overview: {
      whatImMaking: 'Apakah yang sedang saya hasilkan?',
      whatNeedsConfirm: 'Apakah yang memerlukan pengesahan saya?',
      whereIsBlocked: 'Di manakah produksi sedang tersekat?',
      whatToDoNext: 'Apakah langkah seterusnya?',
      resumeWork: 'Sambung Kerja Terakhir',
      stageProgress: 'Kemajuan Masa Nyata Fasa Produksi',
      stageSubtitle: 'Data dijana dari status syot & tugasan sebenar. Klik warna untuk penapisan segera.',
      recentTasks: 'Tugasan Penting Terkini',
      nextSteps: 'Cadangan Langkah Seterusnya oleh Pengarah',
      nextStepsSubtitle: 'Cadangan tindakan operasi berpandukan kemajuan dan pergantungan semasa',
      viewAllShots: 'Lihat Semua Syot',
      approvedRate: 'Kadar Kelulusan Akhir',
      durationBudget: 'Perakaunan Belanjawan Durasi',
      blockedTasks: 'Tugasan Tersekat',
      pendingReviews: 'Syot Menunggu Semakan',
      pendingReviewPill: 'Pintu Masuk Segera Syot Menunggu Semakan',
      reviewNow: 'Semak Sekarang',
      noPendingReview: 'Tiada syot menunggu semakan pada masa ini. Semua output telah diproses.',
      jumpToShots: 'Klik untuk melihat syot berkaitan',
      targetDuration: 'Sasaran',
      actualDuration: 'Terkumpul',
      overDuration: 'Melebihi sasaran',
      underDuration: 'Baki sasaran',
      exactDuration: 'Sempurna menepati durasi sasaran',
      loglineLabel: 'Satu Ayat Cerita (Logline)',
      visualDirectionLabel: 'Arah Visual & Nada',
    },
    story: {
      scriptEditorTitle: 'Skrip Penggambaran Utama',
      saveNewVersion: 'Simpan Versi Baru',
      breakdownScript: 'Pecahkan Skrip (Analisis Peraturan)',
      breakdownSubtitle: 'Kenal pasti babak, watak dan masa mengikut peraturan sintaks',
      savedNotice: 'Skrip berjaya disimpan sebagai versi baru. Syot berkaitan tidak akan diubah secara senyap.',
      wordCount: 'Jumlah Huruf',
      versionCount: 'Versi Sejarah',
      scenesList: 'Senarai Babak',
      addSceneManual: 'Tambah Babak Manual',
      actionSummary: 'Ringkasan Aksi (Action)',
      dialogueSummary: 'Fokus Dialog (Dialogue)',
      emotionalGoal: 'Matlamat Emosi Babak (Emotional Goal)',
      estimatedDuration: 'Anggaran Durasi',
      linkedShotsCount: 'Syot Berkait',
      dayScene: 'Babak Siang (DAY)',
      nightScene: 'Babak Malam (NIGHT)',
      breakdownModalTitle: 'Hasil Pecahan Skrip (Analisis Peraturan)',
      breakdownRuleBadge: 'Berasaskan Peraturan • Bukan Model AI Sebenar',
      breakdownDesc: 'Sistem menganalisis skrip menggunakan peraturan format (penanda kepala babak dan tatabahasa tanda baca). Sila semak dan sahkan:',
      confirmMerge: 'Sahkan & Masukkan ke Senarai Babak',
      cancel: 'Batal',
    },
    bible: {
      character: 'Watak',
      scene: 'Lokasi / Latar',
      prop: 'Alat / Prop',
      visual_style: 'Gaya Visual',
      newAsset: 'Cipta Aset Baru',
      lockedVersion: 'Versi Terkunci',
      structuredParams: 'Definisi Parameter Berstruktur',
      roleIdentity: 'Identiti / Peranan',
      ageRange: 'Lingkungan Umur',
      appearance: 'Ciri-ciri Fizikal & Rupa',
      hairstyle: 'Gaya & Tekstur Rambut',
      voiceNotes: 'Nota Suara & Sebutan',
      wardrobeVersions: 'Versi Pakaian & Kostum',
      spatialDescription: 'Keterangan Ruang',
      entrancesExits: 'Pintu Masuk & Keluar',
      keyLightSources: 'Sumber Cahaya Utama',
      belongsToChar: 'Milik Watak',
      propStates: 'Keadaan Penting Prop',
      colorPalette: 'Palet Warna',
      contrastRatio: 'Nisbah Kontras',
      cinematographyRef: 'Rujukan Sinematografi',
      prohibitions: 'Larangan Gaya',
      versionHistory: 'Sejarah Versi',
      currentAdopted: 'Sedang Digunakan',
      impactModalTitle: 'Aset ini dirujuk oleh beberapa syot. Sila pilih strategi kemas kini versi',
      impactModalDesc: 'Untuk mengelakkan tetapan syot yang telah diluluskan diubah secara senyap, sistem memerlukan pengesahan jelas:',
      strategy1Title: 'Strategi 1: Cipta Versi Baru Sahaja (Disyorkan)',
      strategy1Desc: 'Syot sedia ada mengekalkan versi lama, mengekalkan konsistensi papan cerita dan arahan prompt.',
      strategy2Title: 'Strategi 2: Kemas kini Semua Syot Terjejas ke Versi Baru',
      strategy2Desc: 'Segerakkan nombor versi aset yang dirujuk oleh semua syot yang terlibat.',
      cancelUpdate: 'Batal Pengubahsuaian',
    },
    workbench: {
      shotList: 'Senarai Syot',
      cardsView: 'Kad Papan Cerita',
      tableView: 'Jadual Boleh Edit',
      sequenceView: 'Pratonton Urutan',
      searchPlaceholder: 'Cari nombor syot, huraian visual...',
      undoDelete: 'Buat Asal Padam',
      newShot: 'Syot Baru',
      shotNumber: 'SYOT',
      adoptedVersion: 'Versi Diterima',
      markAdopted: 'Tandakan Sebagai Versi Diterima',
      screenReview: 'Semakan Visual',
      promptTab: 'Pemasangan Prompt',
      workflowTab: 'Aliran Produksi',
      compareTab: 'Perbandingan Sebelah-ke-Sebelah',
      aspectRatio: 'Nisbah Aspek',
      fitModeContain: 'Muat Bekas',
      fitModeCover: 'Penuh Skrin',
      noMedia: 'Tiada media untuk syot ini lagi',
      uploadMedia: 'Muat Naik Imej atau Video Pertama',
      uploadNewVersion: 'Muat Naik Versi Media Baru',
      mediaVersions: 'Sejarah Versi Media',
      directorComments: 'Ulasan & Anotasi Pengarah mengikut Garis Masa',
      approveShot: 'Luluskan (Approve)',
      requestChanges: 'Minta Pindaan (Revise)',
      submitComment: 'Hantar Ulasan',
      commentPlaceholder: 'Tambah ulasan pada titik masa semasa...',
      cinematographyDetails: 'Butiran Sinematografi Pengarah',
      shotName: 'Nama Syot',
      narrativeGoal: 'Matlamat Naratif (Narrative Goal)',
      visualDescription: 'Keterangan Visual (Visual Description)',
      subjectAction: 'Tindakan Subjek',
      cameraMovement: 'Pergerakan Kamera',
      targetDurationSec: 'Sasaran Durasi (saat)',
      soundAndDialogue: 'Bunyi & Dialog (Sound & Dialogue)',
      shotSize: 'Saiz Syot (Shot Size)',
      cameraAngle: 'Sudut Kamera (Camera Angle)',
      lensFocalLength: 'Rujukan Panjang Fokus (Lens)',
      eyelineDirection: 'Arah Garis Pandang',
      movementDirection: 'Arah Pergerakan',
      composition: 'Komposisi & Kedudukan Subjek',
      lightingDirection: 'Arah & Kualiti Pencahayaan',
      emotionalIntensity: 'Keamatan Emosi (1-10)',
      continuityNotes: 'Kesinambungan Syot (Continuity)',
      vfxNotes: 'Nota VFX, Komposisi & Penggambaran',
      timelineStrip: 'Jalur Garis Masa Syot Berterusan',
      collapseTimeline: 'Tutup Garis Masa',
      sideBySideTitle: 'Perbandingan Dua Versi Sebelah-ke-Sebelah',
      backToSingle: 'Kembali ke Pandangan Tunggal',
      versionA: 'Versi A',
      versionB: 'Versi B',
    },
    prompts: {
      title: 'Ruang Kerja Prompt (Structured Prompts)',
      subtitle: 'Dipasang automatik berdasarkan sudut kamera, lampu dan alkitab visual yang disahkan',
      regenerate: 'Pasang Semula Mengikut Tetapan Semasa',
      staticKeyframe: '1. Prompt Bingkai Kunci Pegun (Static Keyframe)',
      dynamicVideo: '2. Prompt Penjanaan Video Dinamik (Dynamic Video)',
      hybridInstructions: '3. Arahan Pengubahsuaian Penggambaran Langsung + AI',
      copyEnglish: 'Salin Prompt Bahasa Inggeris',
      copied: 'Disalin ✓',
    },
    production: {
      kanbanView: 'Paparan Papan (Kanban)',
      listView: 'Paparan Senarai (List)',
      memberFilter: 'Tapis Ahli:',
      allMembers: 'Semua Tugasan Pasukan',
      createTask: 'Cipta Tugasan Produksi',
      colTodo: 'Untuk Dilakukan (To Do)',
      colInProgress: 'Dalam Proses (In Progress)',
      colBlocked: 'Tersekat (Blocked)',
      colCompleted: 'Selesai (Completed)',
      blockerReason: 'Punca Sekatan:',
      linkedShot: 'Syot Berkait',
      generalProjectTask: 'Tugasan Projek Umum',
      taskModalTitle: 'Cipta Tugasan Produksi Filem Baru',
      taskTitle: 'Tajuk Tugasan',
      taskDesc: 'Keterangan Tugasan',
      assignee: 'Pelaksana',
      confirmCreate: 'Sahkan Cipta',
      cancel: 'Batal',
    },
    delivery: {
      title: 'Penyerahan Filem & Eksport Data (Export & Delivery)',
      subtitle: 'Menyediakan jadual serahan industri, CSV papan cerita dan sandaran data projek',
      previsualNotice: 'Mod Pratonton Pra-Visual — Mainan urutan mengikut durasi sasaran syot untuk rentak pengarah, bukan output perisian penyuntingan akhir.',
      shotCount: 'Syot',
      prevShot: 'Syot Sebelum',
      nextShot: 'Syot Seterusnya',
      playContinuous: 'Main Urutan',
      pausePreview: 'Jeda Pratonton',
      restartStart: 'Mula Semula dari Awal',
      adoptedMediaRatio: 'Kadar Media Diterima:',
      checklistTitle: 'Senarai Semak Pra-Penyerahan:',
      unapprovedShots: 'Syot Belum Diluluskan',
      missingMediaShots: 'Syot Hilang Media Sepenuhnya',
      exportHandoverCsv: 'Eksport Jadual Serahan Suntingan (CSV)',
      exportHandoverCsvDesc: 'Mengandungi susunan syot, nama fail, durasi, dialog dan nota VFX',
      exportStoryboardCsv: 'Eksport Papan Cerita Penuh (CSV)',
      exportStoryboardCsvDesc: 'Pengekodan UTF-8 BOM, serasi penuh dengan Excel & WPS',
      printStoryboardPdf: 'Cetak / Eksport Manual Papan Cerita (PDF)',
      printStoryboardPdfDesc: 'Panggil enjin cetakan pelayar untuk menghasilkan dokumen fizikal standard',
      exportFullJson: 'Eksport Projek Penuh JSON',
      exportFullJsonDesc: 'Mengandungi skrip, alkitab aset, syot dan semua metadata untuk pemindahan',
    },
    audit: {
      modalTitle: 'Pemeriksaan Pengarah & Audit Kesinambungan (Director Continuity Audit)',
      modalSubtitle: 'Analisis berasaskan peraturan berstruktur medan yang boleh dijelaskan • Bukan penilaian kotak hitam AI',
      ruleAlertsTab: 'Peringatan Peraturan',
      checklistTab: 'Senarai Semak Kreatif Pengarah',
      intentionalBadge: '✓ Pengarah Ditandakan: Pilihan Sengaja',
      unverifiedBadge: 'Perlu Pengesahan',
      reasonLabel: 'Punca Cetusan:',
      suggestionLabel: 'Cadangan Tindakan:',
      affectedShotsLabel: 'Syot Terlibat:',
      intentionalReasonPlaceholder: 'Jika ini pilihan artistik khusus, masukkan sebab pengarah (cth: tolak kamera berturut-turut untuk rasa lemas)...',
      markIntentionalBtn: 'Tandakan Sebagai Pilihan Sengaja',
      intentionalDirectorNote: 'Nota Alasan Pengarah:',
      allPassedTitle: 'Semua Pemeriksaan Kesinambungan Berjaya!',
      allPassedDesc: 'Urutan syot semasa tidak mencetuskan sebarang anomali struktur, peralihan saiz syot dan durasi adalah seimbang.',
      footerDisclaimer: 'Melanggar garis paksi dan perubahan arah mungkin mengandungi niat dramatik yang mendalam. Keputusan artistik muktamad adalah milik pengarah.',
      closeBtn: 'Selesai & Tutup',
    },
    settings: {
      title: 'Tetapan Sistem & Penyesuaian Jenama (Settings)',
      subtitle: 'Nama jenama, kotak pasir storan tempatan dan palam perkhidmatan awan',
      brandLabel: 'Nama Jenama Meja Kerja (Brand Name Configuration)',
      brandDesc: 'Dinamakan "Ayu AiFilm Maker", boleh ditukar secara bebas mengikut syarikat produksi atau studio pengarah.',
      updateBrandBtn: 'Kemas Kini Jenama',
      savedBadge: 'Disimpan ✓',
      sandboxTitle: 'Kotak Pasir Storan Tempatan (IndexedDB)',
      sandboxStatus: 'Beroperasi Normal',
      usedStorage: 'Ruang Digunakan',
      availableQuota: 'Had Kuota Pelayar',
      sandboxDesc: 'Bahan muat naik disimpan sebagai Blob binari mentah dalam IndexedDB, tanpa sekatan localStorage.',
      resetDemoBtn: 'Set Semula Projek Demo',
      backupTitle: 'Pemindahan & Sandaran Data Projek (JSON Import & Export)',
      exportJsonBtn: 'Eksport Projek JSON Semasa',
      importJsonBtn: 'Import Fail Projek JSON',
      architectureTitle: 'Seni Bina Perkhidmatan Luaran (Future Service Architecture)',
      architectureDesc: 'Projek ini telah membungkus antara muka akses data dan penjanaan (terletak di @/services/storage/interfaces.ts).',
      languageLabel: 'Pilihan Bahasa (Language Selection)',
    },
    common: {
      saveSuccess: 'Disimpan automatik',
      saving: 'Menyimpan...',
      saveFailed: 'Gagal disimpan',
      demoTag: 'DEMO',
      proTag: 'PRO',
      cancel: 'Batal',
      confirm: 'Sahkan',
      delete: 'Padam',
      edit: 'Edit',
      complete: 'Selesai',
    },
  },

  // 2. BILINGUAL MODE: BAHASA MELAYU + TERJEMAHAN CINA
  ms_zh: {
    brand: {
      tagline: 'Meja Kerja Pengarahan Filem & AI Profesional (专业 AI 影视制作工作台)',
      localDemoNotice: 'Mod Demo Tempatan • Data disimpan dalam IndexedDB (本地演示模式 • 数据安全保存在 IndexedDB)',
      proBadge: 'PRO',
      localSandbox: 'Kotak Pasir Tempatan (本地沙盒)',
    },
    nav: {
      overview: 'Gambaran Keseluruhan (项目总览)',
      overviewSub: 'Overview',
      story: 'Cerita & Skrip (故事与剧本)',
      storySub: 'Story & Script',
      bible: 'Alkitab Visual (视觉设定)',
      bibleSub: 'Visual Bible',
      shots: 'Meja Kerja Syot (镜头工作台)',
      shotsSub: 'Shot Workbench',
      production: 'Produksi & Tugas (制作与任务)',
      productionSub: 'Production Tasks',
      delivery: 'Siap & Serahan (成片与交付)',
      deliverySub: 'Cut & Delivery',
    },
    status: {
      draft: 'Draf (待制作)',
      in_progress: 'Dalam Proses (制作中)',
      ready_for_review: 'Untuk Semakan (待审核)',
      changes_requested: 'Perlu Pindaan (需修改)',
      approved: 'Diluluskan (已批准)',
      all: 'Semua Status (所有状态)',
    },
    methods: {
      full_ai: 'AI Sepenuhnya (全 AI 生成)',
      live_action: 'Penggambaran Langsung (真人实拍)',
      hybrid: 'Hibrid: Langsung + AI (混合实拍+AI)',
      all: 'Semua Kaedah (所有制作方式)',
    },
    overview: {
      whatImMaking: 'Apakah yang sedang saya hasilkan? (我正在制作什么？)',
      whatNeedsConfirm: 'Apakah yang memerlukan pengesahan saya? (哪些内容需要我确认？)',
      whereIsBlocked: 'Di manakah produksi sedang tersekat? (当前制作卡在哪里？)',
      whatToDoNext: 'Apakah langkah seterusnya? (下一步做什么？)',
      resumeWork: 'Sambung Kerja Terakhir (继续上次工作)',
      stageProgress: 'Kemajuan Fasa Produksi (制作阶段实时进度)',
      stageSubtitle: 'Data dijana dari status syot & tugasan sebenar (数据源自真实镜头与任务状态)',
      recentTasks: 'Tugasan Penting Terkini (近期紧要任务)',
      nextSteps: 'Cadangan Langkah Seterusnya (导演下一步操作建议)',
      nextStepsSubtitle: 'Cadangan tindakan operasi berpandukan kemajuan semasa (依据当前进度推导)',
      viewAllShots: 'Lihat Semua Syot (查看全部镜头)',
      approvedRate: 'Kadar Kelulusan Akhir (已批准定板率)',
      durationBudget: 'Perakaunan Belanjawan Durasi (时长预算核算)',
      blockedTasks: 'Tugasan Tersekat (项任务受阻)',
      pendingReviews: 'Syot Menunggu Semakan (个镜头待审核)',
      pendingReviewPill: 'Pintu Masuk Segera Semakan (待审核镜头快捷入口)',
      reviewNow: 'Semak Sekarang (即刻审核)',
      noPendingReview: 'Tiada syot menunggu semakan pada masa ini (当前没有待审核镜头)',
      jumpToShots: 'Klik untuk melihat syot (点击查看对应镜头)',
      targetDuration: 'Sasaran (目标)',
      actualDuration: 'Terkumpul (累计)',
      overDuration: 'Melebihi sasaran (超出目标)',
      underDuration: 'Baki sasaran (尚余)',
      exactDuration: 'Sempurna menepati durasi sasaran (完美契合目标时长)',
      loglineLabel: 'Satu Ayat Cerita / Logline (一句话故事)',
      visualDirectionLabel: 'Arah Visual (视觉方向)',
    },
    story: {
      scriptEditorTitle: 'Skrip Penggambaran Utama (主拍摄剧本)',
      saveNewVersion: 'Simpan Versi Baru (保存新版本)',
      breakdownScript: 'Pecahkan Skrip / Analisis Peraturan (拆解剧本)',
      breakdownSubtitle: 'Kenal pasti babak mengikut peraturan (基于规则解析场次)',
      savedNotice: 'Skrip berjaya disimpan (剧本已保存，关联镜头不会被静默修改)',
      wordCount: 'Jumlah Huruf (字数)',
      versionCount: 'Versi Sejarah (历史版本)',
      scenesList: 'Senarai Babak (场次列表)',
      addSceneManual: 'Tambah Babak Manual (手动添加场次)',
      actionSummary: 'Ringkasan Aksi / Action (动作梗概)',
      dialogueSummary: 'Fokus Dialog / Dialogue (对白重点)',
      emotionalGoal: 'Matlamat Emosi / Emotional Goal (本场情绪目的)',
      estimatedDuration: 'Anggaran Durasi (预计时长)',
      linkedShotsCount: 'Syot Berkait (已关联镜头)',
      dayScene: 'Babak Siang / DAY (日戏)',
      nightScene: 'Babak Malam / NIGHT (夜戏)',
      breakdownModalTitle: 'Hasil Pecahan Skrip / Analisis Peraturan (剧本规则解析结果)',
      breakdownRuleBadge: 'Berasaskan Peraturan • Bukan AI (基础规则解析 • 非真实AI)',
      breakdownDesc: 'Sistem menganalisis skrip menggunakan peraturan format (系统通过格式规则提取场次):',
      confirmMerge: 'Sahkan & Masukkan (确认合入场次列表)',
      cancel: 'Batal (取消)',
    },
    bible: {
      character: 'Watak (角色设定)',
      scene: 'Lokasi (场景设定)',
      prop: 'Alat / Prop (核心道具)',
      visual_style: 'Gaya Visual (视觉风格)',
      newAsset: 'Cipta Aset Baru (新建设定)',
      lockedVersion: 'Versi Terkunci (当前锁定版本)',
      structuredParams: 'Parameter Berstruktur (结构化参数定义)',
      roleIdentity: 'Identiti (身份设定)',
      ageRange: 'Umur (年龄范围)',
      appearance: 'Rupa & Fizikal (外形特征)',
      hairstyle: 'Gaya Rambut (发型)',
      voiceNotes: 'Nota Suara (声音备注)',
      wardrobeVersions: 'Versi Pakaian (服装与造型版本)',
      spatialDescription: 'Keterangan Ruang (空间说明)',
      entrancesExits: 'Pintu Masuk & Keluar (出入口与通道)',
      keyLightSources: 'Sumber Cahaya (主要光源)',
      belongsToChar: 'Milik Watak (归属人物)',
      propStates: 'Keadaan Penting (道具关键状态)',
      colorPalette: 'Palet Warna (色彩基调)',
      contrastRatio: 'Nisbah Kontras (明暗对比度)',
      cinematographyRef: 'Rujukan Sinematografi (摄影参考作品)',
      prohibitions: 'Larangan Gaya (风格禁止事项)',
      versionHistory: 'Sejarah Versi (历史版本追溯)',
      currentAdopted: 'Sedang Digunakan (当前采用)',
      impactModalTitle: 'Aset dirujuk syot, pilih strategi kemas kini (设定已被镜头引用，请选择版本策略)',
      impactModalDesc: 'Untuk mengelakkan syot diluluskan diubah senyap (防止已批准镜头被静默修改):',
      strategy1Title: 'Strategi 1: Cipta Versi Baru Sahaja / Disyorkan (仅建立新版本)',
      strategy1Desc: 'Syot sedia ada kekal versi lama (原镜头保留旧设定，不破坏已有分镜)',
      strategy2Title: 'Strategi 2: Kemas kini Semua Syot Terjejas (将受影响镜头更新到新版本)',
      strategy2Desc: 'Segerakkan nombor versi ke semua syot (同步更新涉及镜头的版本号)',
      cancelUpdate: 'Batal (取消修改)',
    },
    workbench: {
      shotList: 'Senarai Syot (镜头列表)',
      cardsView: 'Kad Papan Cerita (分镜卡片)',
      tableView: 'Jadual Boleh Edit (表格编辑)',
      sequenceView: 'Pratonton Urutan (顺序预演)',
      searchPlaceholder: 'Cari syot, huraian... (搜索镜头、描述...)',
      undoDelete: 'Buat Asal Padam (撤销删除)',
      newShot: 'Syot Baru (新建镜头)',
      shotNumber: 'SYOT (镜头)',
      adoptedVersion: 'Versi Diterima (当前采用版本)',
      markAdopted: 'Tandakan Sebagai Diterima (标记为采用版本)',
      screenReview: 'Semakan Visual (画面审阅)',
      promptTab: 'Pemasangan Prompt (提示词组装)',
      workflowTab: 'Aliran Produksi (制作路径)',
      compareTab: 'Bandingan Sebelah (并排对比)',
      aspectRatio: 'Nisbah Aspek (画幅)',
      fitModeContain: 'Muat Bekas (适应容器)',
      fitModeCover: 'Penuh Skrin (充满画面)',
      noMedia: 'Tiada media untuk syot ini (当前镜头暂无素材)',
      uploadMedia: 'Muat Naik Media Pertama (上传首版图片/视频)',
      uploadNewVersion: 'Muat Naik Versi Baru (上传新素材版本)',
      mediaVersions: 'Versi Media (素材版本历史)',
      directorComments: 'Ulasan & Anotasi Pengarah (导演审阅意见与时间点批注)',
      approveShot: 'Luluskan / Approve (核准定板)',
      requestChanges: 'Minta Pindaan / Revise (要求修改)',
      submitComment: 'Hantar Ulasan (提交评论)',
      commentPlaceholder: 'Tambah ulasan pada titik masa... (添加修改或定板反馈...)',
      cinematographyDetails: 'Butiran Sinematografi Pengarah (导演细节展开面板)',
      shotName: 'Nama Syot (镜头名称)',
      narrativeGoal: 'Matlamat Naratif / Narrative Goal (叙事目的)',
      visualDescription: 'Keterangan Visual / Visual Description (画面描述)',
      subjectAction: 'Tindakan Subjek (主体动作)',
      cameraMovement: 'Pergerakan Kamera (摄影机运动)',
      targetDurationSec: 'Sasaran Durasi / Saat (目标时长)',
      soundAndDialogue: 'Bunyi & Dialog (声音与对白)',
      shotSize: 'Saiz Syot / Shot Size (景别)',
      cameraAngle: 'Sudut Kamera / Camera Angle (机位角度)',
      lensFocalLength: 'Panjang Fokus / Lens (焦段参考)',
      eyelineDirection: 'Garis Pandang (视线方向)',
      movementDirection: 'Arah Gerakan (运动方向)',
      composition: 'Komposisi Subjek (构图与主体位置)',
      lightingDirection: 'Arah Pencahayaan (灯光方向与质感)',
      emotionalIntensity: 'Keamatan Emosi 1-10 (情绪强度)',
      continuityNotes: 'Kesinambungan Syot (与前后镜头衔接)',
      vfxNotes: 'Nota VFX & Komposisi (特效合成与拍摄备注)',
      timelineStrip: 'Jalur Garis Masa Syot (连续镜头时间线预演条)',
      collapseTimeline: 'Tutup Garis Masa (收起时间线)',
      sideBySideTitle: 'Perbandingan Sebelah-ke-Sebelah (并排双版本对照)',
      backToSingle: 'Kembali ke Tunggal (返回单视窗)',
      versionA: 'Versi A (版本 A)',
      versionB: 'Versi B (版本 B)',
    },
    prompts: {
      title: 'Ruang Kerja Prompt (提示词工作区)',
      subtitle: 'Dipasang automatik berpandukan tetapan disahkan (基于确认设定自动组装)',
      regenerate: 'Pasang Semula Prompt (根据设定重新组装)',
      staticKeyframe: '1. Prompt Bingkai Kunci Pegun / Static (静态关键帧提示词)',
      dynamicVideo: '2. Prompt Video Dinamik / Dynamic (动态视频生成提示词)',
      hybridInstructions: '3. Arahan Hibrid: Langsung + AI (实拍改造与合成指示)',
      copyEnglish: 'Salin Bahasa Inggeris (复制英文提示词)',
      copied: 'Disalin ✓ (已复制)',
    },
    production: {
      kanbanView: 'Papan / Kanban (看板视图)',
      listView: 'Senarai / List (列表视图)',
      memberFilter: 'Tapis Ahli (成员筛选):',
      allMembers: 'Semua Tugasan (全员任务)',
      createTask: 'Cipta Tugasan (创建制作任务)',
      colTodo: 'Untuk Dilakukan (待处理)',
      colInProgress: 'Dalam Proses (制作中)',
      colBlocked: 'Tersekat (受阻阻塞)',
      colCompleted: 'Selesai (已完成)',
      blockerReason: 'Punca Sekatan (阻塞原因):',
      linkedShot: 'Syot Berkait (关联镜头)',
      generalProjectTask: 'Tugasan Projek Umum (通用项目任务)',
      taskModalTitle: 'Cipta Tugasan Produksi Baru (新建影视制作任务)',
      taskTitle: 'Tajuk Tugasan (任务标题)',
      taskDesc: 'Keterangan Tugasan (任务描述)',
      assignee: 'Pelaksana (执行人)',
      confirmCreate: 'Sahkan Cipta (确认创建)',
      cancel: 'Batal (取消)',
    },
    delivery: {
      title: 'Penyerahan Filem & Eksport (成片交付与数据导出)',
      subtitle: 'Jadual serahan industri & sandaran projek (工业交接表与工程数据备份)',
      previsualNotice: 'Mod Pratonton Pra-Visual (制作预演模式) — Mainan simulasi mengikut durasi syot, bukan perisian suntingan akhir (非剪辑软件).',
      shotCount: 'Syot (镜头)',
      prevShot: 'Sebelum (上一镜头)',
      nextShot: 'Seterusnya (下一镜头)',
      playContinuous: 'Main Urutan (连续播放)',
      pausePreview: 'Jeda (暂停预演)',
      restartStart: 'Mula Semula (从头开始)',
      adoptedMediaRatio: 'Kadar Media Diterima (已采用素材率):',
      checklistTitle: 'Senarai Semak Pra-Penyerahan (交付前自检清单):',
      unapprovedShots: 'Syot Belum Lulus (未定板镜头)',
      missingMediaShots: 'Syot Hilang Media (完全缺失素材镜头)',
      exportHandoverCsv: 'Eksport Jadual Serahan Suntingan CSV (导出剪辑交接表)',
      exportHandoverCsvDesc: 'Susunan syot, nama fail, durasi, dialog & nota VFX (含序号、文件名、时长与特效)',
      exportStoryboardCsv: 'Eksport Papan Cerita CSV (导出完整分镜清单)',
      exportStoryboardCsvDesc: 'Pengekodan UTF-8 BOM, serasi Excel & WPS (UTF-8 BOM 中文无乱码)',
      printStoryboardPdf: 'Cetak / Eksport PDF (打印 / 导出 PDF 分镜手册)',
      printStoryboardPdfDesc: 'Panggil enjin cetakan pelayar (生成标准纸质分镜版面)',
      exportFullJson: 'Eksport Projek Penuh JSON (导出项目完整工程 JSON)',
      exportFullJsonDesc: 'Semua skrip, aset, syot & metadata (全量工程备份供异地迁移)',
    },
    audit: {
      modalTitle: 'Audit Kesinambungan Pengarah (导演检查与视听连续性核验)',
      modalSubtitle: 'Analisis peraturan berstruktur medan boleh dijelaskan (可解释规则分析 • 非黑盒 AI)',
      ruleAlertsTab: 'Peringatan Peraturan (规则诊断提示)',
      checklistTab: 'Senarai Semak Kreatif (导演人工创作核验清单)',
      intentionalBadge: '✓ Pilihan Sengaja Pengarah (导演已标记：有意安排)',
      unverifiedBadge: 'Perlu Pengesahan (待核验)',
      reasonLabel: 'Punca Cetusan (触发原因):',
      suggestionLabel: 'Cadangan Tindakan (建议动作):',
      affectedShotsLabel: 'Syot Terlibat (涉及镜头):',
      intentionalReasonPlaceholder: 'Masukkan sebab pengarah (输入导演艺术创作理由)...',
      markIntentionalBtn: 'Tandakan Pilihan Sengaja (标记为有意安排)',
      intentionalDirectorNote: 'Nota Alasan Pengarah (导演批注理由):',
      allPassedTitle: 'Semua Pemeriksaan Kesinambungan Berjaya (连续性检查全部通过)',
      allPassedDesc: 'Urutan syot semasa tidak mencetuskan sebarang anomali (未触发结构性异常)',
      footerDisclaimer: 'Pelanggaran paksi mungkin mengandungi niat dramatik. Keputusan artistik muktamad milik pengarah (最终艺术决定权属于导演).',
      closeBtn: 'Selesai & Tutup (完成核验并关闭)',
    },
    settings: {
      title: 'Tetapan Sistem & Jenama (系统设置与品牌定制)',
      subtitle: 'Nama jenama, storan tempatan dan palam perkhidmatan awan',
      brandLabel: 'Nama Jenama Meja Kerja (工作台品牌名称配置)',
      brandDesc: 'Dinamakan "Ayu AiFilm Maker", boleh ditukar secara bebas (可按制作公司自由更换)',
      updateBrandBtn: 'Kemas Kini Jenama (更新品牌名)',
      savedBadge: 'Disimpan ✓ (已保存)',
      sandboxTitle: 'Kotak Pasir Storan Tempatan IndexedDB (本地存储沙盒)',
      sandboxStatus: 'Beroperasi Normal (运行正常)',
      usedStorage: 'Ruang Digunakan (已占用存储空间)',
      availableQuota: 'Had Kuota Pelayar (浏览器可用配额)',
      sandboxDesc: 'Bahan disimpan sebagai Blob binari dalam IndexedDB (上传素材作为原始二进制 Blob 存储)',
      resetDemoBtn: 'Set Semula Projek Demo (一键重置演示项目)',
      backupTitle: 'Pemindahan & Sandaran Data JSON (工程数据迁移与备份)',
      exportJsonBtn: 'Eksport Projek JSON (导出当前项目 JSON)',
      importJsonBtn: 'Import Fail Projek JSON (导入工程 JSON 文件)',
      architectureTitle: 'Seni Bina Perkhidmatan Luaran (外部服务解耦架构)',
      architectureDesc: 'Antara muka data & penjanaan terletak di @/services/storage/interfaces.ts',
      languageLabel: 'Pilihan Bahasa (语言选择 / Language)',
    },
    common: {
      saveSuccess: 'Disimpan automatik (已自动保存)',
      saving: 'Menyimpan... (保存中...)',
      saveFailed: 'Gagal disimpan (存储失败)',
      demoTag: 'DEMO',
      proTag: 'PRO',
      cancel: 'Batal (取消)',
      confirm: 'Sahkan (确认)',
      delete: 'Padam (删除)',
      edit: 'Edit (编辑)',
      complete: 'Selesai (完成)',
    },
  },

  // 3. BAHASA CINA (中文)
  zh: {
    brand: {
      tagline: '专业 AI 影视制作工作台 / Film & AI Director Studio',
      localDemoNotice: '本地演示模式 • 数据安全保存在当前浏览器 IndexedDB',
      proBadge: 'PRO',
      localSandbox: '本地存储沙盒',
    },
    nav: {
      overview: '项目总览',
      overviewSub: 'Overview',
      story: '故事工作区',
      storySub: 'Story & Script',
      bible: '视觉设定库',
      bibleSub: 'Visual Bible',
      shots: '镜头工作台',
      shotsSub: 'Shot Workbench',
      production: '制作与任务',
      productionSub: 'Production Tasks',
      delivery: '成片与交付',
      deliverySub: 'Cut & Delivery',
    },
    status: {
      draft: '待制作',
      in_progress: '制作中',
      ready_for_review: '待审核',
      changes_requested: '需修改',
      approved: '已批准',
      all: '所有状态',
    },
    methods: {
      full_ai: '全 AI 生成',
      live_action: '真人实拍',
      hybrid: '实拍 + AI',
      all: '所有制作方式',
    },
    overview: {
      whatImMaking: '我正在制作什么？',
      whatNeedsConfirm: '哪些内容需要我确认？',
      whereIsBlocked: '当前制作卡在哪里？',
      whatToDoNext: '下一步做什么？',
      resumeWork: '继续上次工作 (Shot 工作台)',
      stageProgress: '制作阶段实时进度 (Stage Breakdown)',
      stageSubtitle: '数据基于实际镜头状态与任务完成度，点击对应色块可直接下钻筛选',
      recentTasks: '近期紧要任务',
      nextSteps: '导演下一步建议 (Next Steps)',
      nextStepsSubtitle: '根据当前进度与依赖关系推导的操作建议',
      viewAllShots: '查看全部镜头',
      approvedRate: '已批准定板率',
      durationBudget: '时长预算核算',
      blockedTasks: '项任务受阻',
      pendingReviews: '个镜头待审核',
      pendingReviewPill: '待审核镜头快捷入口',
      reviewNow: '即刻审核',
      noPendingReview: '当前没有待审核的镜头，所有产出均已处理完毕。',
      jumpToShots: '点击可直接进入对应镜头列表',
      targetDuration: '目标',
      actualDuration: '累计',
      overDuration: '超出目标',
      underDuration: '尚余',
      exactDuration: '完美契合目标时长',
      loglineLabel: '一句话故事 (Logline)',
      visualDirectionLabel: '视觉方向',
    },
    story: {
      scriptEditorTitle: '主拍摄剧本',
      saveNewVersion: '保存新版本',
      breakdownScript: '拆解剧本 (规则解析)',
      breakdownSubtitle: '根据格式规则识别场次、人物与时间',
      savedNotice: '剧本已成功保存为新版本。关联镜头不会被静默修改。',
      wordCount: '字数',
      versionCount: '历史版本',
      scenesList: '场次列表',
      addSceneManual: '手动添加场次',
      actionSummary: '动作梗概 (Action)',
      dialogueSummary: '对白重点 (Dialogue)',
      emotionalGoal: '本场情绪目的 (Emotional Goal)',
      estimatedDuration: '预计时长',
      linkedShotsCount: '已关联镜头',
      dayScene: '日戏 (DAY)',
      nightScene: '夜戏 (NIGHT)',
      breakdownModalTitle: '剧本规则解析结果 (Rule-based Breakdown)',
      breakdownRuleBadge: '基础规则解析 • 非真实 AI 模型',
      breakdownDesc: '系统通过剧本格式规则（标头识别与标点语法）解析出以下场次，请人工复核：',
      confirmMerge: '确认并合入场次列表',
      cancel: '取消',
    },
    bible: {
      character: '角色设定',
      scene: '场景设定',
      prop: '核心道具',
      visual_style: '视觉风格',
      newAsset: '新建设定资产',
      lockedVersion: '当前锁定版本',
      structuredParams: '结构化参数定义',
      roleIdentity: '身份设定 (Role/Identity)',
      ageRange: '年龄范围 (Age Range)',
      appearance: '外形特征 (Appearance)',
      hairstyle: '发型与质感 (Hairstyle)',
      voiceNotes: '声音与台词备注 (Voice Notes)',
      wardrobeVersions: '服装与造型版本 (Wardrobe Versions)',
      spatialDescription: '空间说明 (Spatial Description)',
      entrancesExits: '出入口与通道 (Entrances & Exits)',
      keyLightSources: '主要光源与色温 (Key Light Sources)',
      belongsToChar: '归属人物 (Belongs to Character)',
      propStates: '道具关键状态 (Key States)',
      colorPalette: '色彩基调 (Color Palette)',
      contrastRatio: '明暗对比 (Contrast Ratio)',
      cinematographyRef: '摄影参考 (Cinematography Reference)',
      prohibitions: '风格禁止事项 (Prohibitions)',
      versionHistory: '历史版本追溯 (Version History)',
      currentAdopted: '当前采用',
      impactModalTitle: '设定已被镜头引用，请选择版本更新策略',
      impactModalDesc: '为防止已批准分镜设定被静默修改，系统要求对修改行为进行明确确认：',
      strategy1Title: '策略 1：仅建立新版本 (推荐)',
      strategy1Desc: '原引用镜头继续保留旧设定版本，不破坏已有分镜与提示词。',
      strategy2Title: '策略 2：将所有受影响镜头更新到新版本',
      strategy2Desc: '同步更新所有引用此设定的镜头的版本编号。',
      cancelUpdate: '取消修改',
    },
    workbench: {
      shotList: '镜头列表',
      cardsView: '分镜卡片',
      tableView: '表格编辑',
      sequenceView: '顺序预演',
      searchPlaceholder: '搜索镜头编号、画面描述...',
      undoDelete: '撤销删除',
      newShot: '新建镜头',
      shotNumber: '镜头',
      adoptedVersion: '当前采用版本',
      markAdopted: '标记为采用版本',
      screenReview: '画面审阅',
      promptTab: '提示词组装',
      workflowTab: '制作路径',
      compareTab: '并排对比',
      aspectRatio: '画幅',
      fitModeContain: '适应容器',
      fitModeCover: '充满画面',
      noMedia: '当前镜头暂无已上传素材',
      uploadMedia: '上传首版图片或视频',
      uploadNewVersion: '上传新素材版本',
      mediaVersions: '素材版本历史',
      directorComments: '导演审阅意见与时间点批注',
      approveShot: '核准定板 (Approve)',
      requestChanges: '要求修改 (Revise)',
      submitComment: '提交评论',
      commentPlaceholder: '添加导演修改或定板反馈...',
      cinematographyDetails: '导演细节展开面板 (Cinematography)',
      shotName: '镜头名称',
      narrativeGoal: '叙事目的 (Narrative Goal)',
      visualDescription: '画面描述 (Visual Description)',
      subjectAction: '主体动作',
      cameraMovement: '摄影机运动',
      targetDurationSec: '目标时长 (秒)',
      soundAndDialogue: '声音与对白 (Sound & Dialogue)',
      shotSize: '景别 (Shot Size)',
      cameraAngle: '机位角度 (Camera Angle)',
      lensFocalLength: '焦段参考',
      eyelineDirection: '视线方向',
      movementDirection: '运动方向',
      composition: '构图与主体位置',
      lightingDirection: '灯光方向与质感',
      emotionalIntensity: '情绪强度 (1-10)',
      continuityNotes: '与前后镜头的衔接 (Continuity)',
      vfxNotes: '特效、合成与实拍备注',
      timelineStrip: '连续镜头时间线预演条',
      collapseTimeline: '收起时间线',
      sideBySideTitle: '并排双版本对照 (Side-by-Side Comparison)',
      backToSingle: '返回单视窗',
      versionA: '版本 A',
      versionB: '版本 B',
    },
    prompts: {
      title: '提示词工作区 (Structured Prompts)',
      subtitle: '基于已确认的镜头机位、灯光与视觉设定库自动组装，包含中英文对照',
      regenerate: '根据当前设定重新组装',
      staticKeyframe: '1. 静态关键帧提示词 (Static Keyframe)',
      dynamicVideo: '2. 动态视频生成提示词 (Dynamic Video)',
      hybridInstructions: '3. 实拍改造与合成指示 (Live + AI Revamp)',
      copyEnglish: '复制英文提示词',
      copied: '已复制 ✓',
    },
    production: {
      kanbanView: '看板视图',
      listView: '列表视图',
      memberFilter: '成员筛选:',
      allMembers: '全员任务',
      createTask: '创建制作任务',
      colTodo: '待处理 (To Do)',
      colInProgress: '进行中 (In Progress)',
      colBlocked: '受阻阻塞 (Blocked)',
      colCompleted: '已完成 (Completed)',
      blockerReason: '阻塞原因:',
      linkedShot: '关联镜头',
      generalProjectTask: '通用项目任务',
      taskModalTitle: '新建影视制作任务',
      taskTitle: '任务标题',
      taskDesc: '任务描述',
      assignee: '执行人',
      confirmCreate: '确认创建',
      cancel: '取消',
    },
    delivery: {
      title: '成片交付与数据导出 (Export & Delivery)',
      subtitle: '提供可验证的工业交接表、分镜 CSV 与工程数据备份',
      previsualNotice: '【制作预演模式】按镜头设定时长顺序模拟播放，供导演把握叙事节奏与接戏，非剪辑调色输出。',
      shotCount: '镜头',
      prevShot: '上一镜头',
      nextShot: '下一镜头',
      playContinuous: '连续播放',
      pausePreview: '暂停预演',
      restartStart: '重新从头开始',
      adoptedMediaRatio: '已采用素材率:',
      checklistTitle: '交付前自检清单:',
      unapprovedShots: '未定板镜头',
      missingMediaShots: '完全缺失素材镜头',
      exportHandoverCsv: '导出剪辑交接表 (CSV)',
      exportHandoverCsvDesc: '含镜头序号、文件名、时长、对白与特效备注',
      exportStoryboardCsv: '导出完整分镜表 (CSV)',
      exportStoryboardCsvDesc: 'UTF-8 BOM 编码，完美兼容 Excel / WPS 中文表格',
      printStoryboardPdf: '打印 / 导出 PDF 分镜手册',
      printStoryboardPdfDesc: '调用浏览器打印引擎，生成标准纸质分镜版面',
      exportFullJson: '导出项目完整 JSON 工程',
      exportFullJsonDesc: '包含剧本、设定库、镜头及全部元数据，供异地迁移',
    },
    audit: {
      modalTitle: '导演检查与视听连续性核验 (Director Continuity Audit)',
      modalSubtitle: '基于镜头结构化字段的可解释规则分析 • 绝非黑盒 AI 判定',
      ruleAlertsTab: '规则诊断提示',
      checklistTab: '导演人工创作核验清单',
      intentionalBadge: '✓ 导演已标记：有意安排',
      unverifiedBadge: '待核验',
      reasonLabel: '触发原因：',
      suggestionLabel: '建议动作：',
      affectedShotsLabel: '涉及镜头:',
      intentionalReasonPlaceholder: '如属艺术特例，请输入导演创作理由（如：通过连续推镜营造压迫窒息感）...',
      markIntentionalBtn: '标记为有意安排',
      intentionalDirectorNote: '导演批注理由:',
      allPassedTitle: '连续性规范检查全部通过',
      allPassedDesc: '当前镜头序列未触发任何结构性异常，景别交替与时长配合良好。',
      footerDisclaimer: '越轴与方向突变可能包含深刻的戏剧意味，系统仅提供中立提示，最终艺术决定权属于导演。',
      closeBtn: '完成核验并关闭',
    },
    settings: {
      title: '系统设置与品牌定制 (Settings)',
      subtitle: '品牌名称、本地存储沙盒与云端接入接口',
      brandLabel: '工作台品牌名称 (Brand Name Configuration)',
      brandDesc: '默认品牌「Ayu AiFilm Maker」，可按制作公司或导演工作室名称自由更换。',
      updateBrandBtn: '更新品牌名',
      savedBadge: '已保存 ✓',
      sandboxTitle: '本地演示模式存储沙盒 (IndexedDB)',
      sandboxStatus: '运行正常',
      usedStorage: '已占用存储空间',
      availableQuota: '浏览器可用配额',
      sandboxDesc: '上传素材作为原始二进制 Blob 存储在 IndexedDB 中，不使用 localStorage 编码。',
      resetDemoBtn: '一键重置演示项目',
      backupTitle: '工程数据迁移与备份 (JSON Import & Export)',
      exportJsonBtn: '导出当前项目 JSON',
      importJsonBtn: '导入工程 JSON 文件',
      architectureTitle: '外部服务解耦架构 (Future Service Architecture)',
      architectureDesc: '本项目已全面完成数据访问与生成服务接口封装（位于 @/services/storage/interfaces.ts）。',
      languageLabel: '平台主语言 / 翻译选项 (Platform Language)',
    },
    common: {
      saveSuccess: '已自动保存',
      saving: '保存中...',
      saveFailed: '存储失败',
      demoTag: 'DEMO',
      proTag: 'PRO',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      complete: '完成',
    },
  },
};
