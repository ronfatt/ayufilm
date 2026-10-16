/**
 * Official Demonstration Project: NOD RAHSIA: Siri Musim 1
 * 27 Shots, 120s duration, 16:9 aspect ratio, Bahasa Melayu.
 * Demonstrates: Full AI, Live-action, and Hybrid (Live-action + AI) workflows.
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
  Member
} from '@/types';

// Helper to generate professional cinematic SVG storyboard placeholders
export function createCinematicSvg(params: {
  shotNumber: number;
  shotSize: string;
  cameraMovement: string;
  description: string;
  method: string;
  status: string;
  colorScheme?: string;
}): string {
  const { shotNumber, shotSize, cameraMovement, description, method, status } = params;
  
  let accentColor = '#00e5ff'; // cyan
  if (method === 'full_ai') accentColor = '#a855f7'; // purple
  if (method === 'live_action') accentColor = '#f59e0b'; // amber
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d1117" />
        <stop offset="50%" stop-color="#161b22" />
        <stop offset="100%" stop-color="#090d12" />
      </linearGradient>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#21262d" stroke-width="1.5" stroke-opacity="0.6"/>
      </pattern>
      <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.0" />
      </linearGradient>
    </defs>
    
    <!-- Background & Grid -->
    <rect width="1920" height="1080" fill="url(#bgGrad)"/>
    <rect width="1920" height="1080" fill="url(#grid)" />
    
    <!-- 16:9 Viewfinder Framing Guides -->
    <rect x="96" y="54" width="1728" height="972" fill="none" stroke="#30363d" stroke-width="2" stroke-dasharray="8 8"/>
    <!-- Center Crosshairs -->
    <line x1="930" y1="540" x2="990" y2="540" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>
    <line x1="960" y1="510" x2="960" y2="570" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>
    
    <!-- Corner Framing Marks -->
    <path d="M 120 180 L 120 120 L 180 120" fill="none" stroke="${accentColor}" stroke-width="4"/>
    <path d="M 1800 180 L 1800 120 L 1740 120" fill="none" stroke="${accentColor}" stroke-width="4"/>
    <path d="M 120 900 L 120 960 L 180 960" fill="none" stroke="${accentColor}" stroke-width="4"/>
    <path d="M 1800 900 L 1800 960 L 1740 960" fill="none" stroke="${accentColor}" stroke-width="4"/>
    
    <!-- Cinematic Stylized Silhouette / Scene Composition Graphic -->
    <circle cx="960" cy="500" r="160" fill="none" stroke="#30363d" stroke-width="3"/>
    <polygon points="960,340 1020,440 900,440" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.7"/>
    <rect x="880" y="470" width="160" height="240" rx="10" fill="#21262d" stroke="#30363d" stroke-width="2"/>
    <circle cx="960" cy="420" r="45" fill="#30363d"/>
    
    <!-- Top Metadata Bar -->
    <rect x="120" y="80" width="340" height="50" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1.5"/>
    <text x="140" y="113" fill="${accentColor}" font-family="monospace" font-size="22" font-weight="bold">SHOT ${String(shotNumber).padStart(2, '0')}</text>
    <text x="260" y="113" fill="#8b949e" font-family="sans-serif" font-size="18">${shotSize} | ${cameraMovement}</text>
    
    <!-- Method Badge -->
    <rect x="1560" y="80" width="240" height="50" rx="8" fill="#161b22" stroke="${accentColor}" stroke-width="1.5"/>
    <text x="1680" y="113" fill="${accentColor}" font-family="sans-serif" font-size="18" font-weight="600" text-anchor="middle">${method.toUpperCase().replace('_', ' ')}</text>
    
    <!-- Center Placeholder Notice -->
    <rect x="460" y="760" width="1000" height="180" rx="12" fill="#0d1117" fill-opacity="0.9" stroke="#30363d" stroke-width="2"/>
    <text x="960" y="810" fill="#f0f6fc" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">Ayu AiFilm Maker STORYBOARD PREVIEW</text>
    <text x="960" y="855" fill="#8b949e" font-family="sans-serif" font-size="20" text-anchor="middle">${description.slice(0, 70)}...</text>
    <text x="960" y="900" fill="${accentColor}" font-family="monospace" font-size="16" text-anchor="middle">STATUS: [ ${status.toUpperCase()} ] • PREVIEW VISUAL AID</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_MEMBERS: Member[] = [
  { id: 'mem_1', name: 'Aiman Hakim (Pengarah)', role: 'director' },
  { id: 'mem_2', name: 'Sarah Tan (Pengarah Visual AI)', role: 'ai_artist' },
  { id: 'mem_3', name: 'Zul Ariffin (Pengarah Sinematografi)', role: 'cinematographer' },
  { id: 'mem_4', name: 'Elena Roslan (Penerbit)', role: 'producer' },
  { id: 'mem_5', name: 'Ken Lim (Penyunting)', role: 'editor' },
];

export const DEMO_PROJECT_ID = 'demo_project_nod_rahsia';

export const DEMO_PROJECT: Project = {
  id: DEMO_PROJECT_ID,
  name: 'NOD RAHSIA: Siri Musim 1',
  type: 'short_drama',
  logline: 'Seorang ejen penyiasatan siber menyusup ke pangkalan rahsia untuk merampas data kripto, mencetuskan pemburuan dron berkelajuan tinggi di Cyberjaya sehingga membongkar portal pencerobohan dimensi asing.',
  targetDurationSeconds: 120, // 2 minit (Pratonton Episod 1)
  aspectRatio: '16:9',
  primaryLanguage: 'Bahasa Melayu (Utama) / Terjemahan Bahasa Cina',
  primaryProductionMethod: 'hybrid',
  visualDirection: 'Cyberpunk Noir Tropika, hujan lebat Kuala Lumpur, pantulan neon sinaran siber, kamera dinamik ARRI + VFX AI.',
  deadline: '2026-11-30',
  createdAt: Date.now() - 86400000 * 7,
  updatedAt: Date.now() - 3600000 * 2,
  isDemo: true,
};

export const DEMO_SCRIPT_VERSION: ScriptVersion = {
  id: 'script_v1',
  projectId: DEMO_PROJECT_ID,
  versionNumber: 1,
  title: 'NOD RAHSIA (Shooting Script Rev 1.2)',
  createdBy: 'Aiman Hakim',
  createdAt: Date.now() - 86400000 * 6,
  notes: 'Koreografi aksi silat dan jadual penggambaran lorong belakang KL telah disahkan.',
  content: `BABAK 1: INT. PUSAT PELAYAN BAWAH TANAH - MALAM
Siren berkedip merah lembut. Udara dingin berdesir.
RAZAK (30-an, memakai jaket taktikal kalis air) menyusup masuk melalui saluran pengudaraan.
Dia memasukkan pemacu data ke terminal utama, memuat turun fail sulit bertanda "NOD RAHSIA".
Lampu merah tiba-tiba menyala terang! Siren amaran berbunyi nyaring!
PENGAWAL (OS): "Penceroboh di sektor C! Tembak bila perlu!"
Razak merentap pemacu data, melompat melepasi meja kawalan dan meluru ke pintu keluar kecemasan.

BABAK 2: EXT. LORONG BELAKANG KUALA LUMPUR - BERTERUSAN
Hujan lebat mencurah. Lampu neon hijau neon memantul di lopak air.
Razak berlari laju. Dua pengawal mengejarnya.
Seorang pengawal menerpa. Razak melakukan teknik kunci silat, melumpuhkannya ke dinding batu bata.
Pengawal kedua mengangkat senjata—Razak melompat ke atas motosikal elektrik berhampiran dan memecut!

BABAK 3: EXT. LEBUHRAYA BERTINGKAT CYBERJAYA - MALAM
Motosikal Razak membelah hujan. Di belakangnya, dron tempur pengawal mengejar dengan pancaran laser merah.
Tembakan laser membakar asfalt. Razak menunduk rendah, memotong tajam masuk ke kawasan pembinaan terbengkalai.

BABAK 4: INT. GUDANG TERBIAR & PORTAL DIMENSI - MALAM
Razak tersandar di tiang konkrit berlumut, termengah-mengah. Dia membuka tablet holografik untuk membaca dokumen tersebut.
Hologram memaparkan lakaran anatomi raksasa asing dan peta koordinat bandar.
RAZAK (berbisik cemas): "Bukan senjata manusia... Ini portal pencerobohan."
Tiba-tiba, udara di tengah ruang bergetar. Satu pusaran nod ruang biru gelap mula terbuka, meniup habuk dan serpihan kaca ke udara!`,
};

export const DEMO_SCENES: Scene[] = [
  {
    id: 'scene_1',
    projectId: DEMO_PROJECT_ID,
    sceneNumber: 1,
    heading: 'INT. PUSAT PELAYAN BAWAH TANAH - MALAM',
    location: 'Bilik Kebal Kuantum Bawah Tanah KL',
    timeOfDay: 'night',
    characters: ['Razak', 'Pengawal Keselamatan'],
    actionSummary: 'Razak menyusup masuk memuat turun fail sulit, siren amaran berbunyi dan melarikan diri melepasi kawalan.',
    dialogueSummary: 'Pengawal melaungkan amaran kecemasan, Razak menggenggam erat pemacu kuantum.',
    emotionalGoal: 'Ketegangan senyap bertukar kepada panik dan pecutan kelajuan tinggi.',
    estimatedDurationSeconds: 30,
    order: 1,
  },
  {
    id: 'scene_2',
    projectId: DEMO_PROJECT_ID,
    sceneNumber: 2,
    heading: 'EXT. LORONG BELAKANG HUJAN LEBAT - MALAM',
    location: 'Lorong Sempit Warisan Kuala Lumpur',
    timeOfDay: 'night',
    characters: ['Razak', 'Dua Askar Upahan Berperisai'],
    actionSummary: 'Pertarungan silat berimpak tinggi dalam lopak air hujan, melumpuhkan musuh dan merampas motosikal elektrik.',
    dialogueSummary: 'Hembusan nafas kencang, dentuman hentaman tulang dan deruan hujan lebat.',
    emotionalGoal: 'Sensasi impak fizikal yang mendalam, lumpur dan keazaman melepaskan diri.',
    estimatedDurationSeconds: 35,
    order: 2,
  },
  {
    id: 'scene_3',
    projectId: DEMO_PROJECT_ID,
    sceneNumber: 3,
    heading: 'EXT. LEBUHRAYA BERTINGKAT CYBERJAYA - MALAM',
    location: 'Jejambat Lebuhraya Bertingkat Cyberjaya',
    timeOfDay: 'night',
    characters: ['Razak', 'Skuad Dron Otonomi Sentinel-X'],
    actionSummary: 'Motosikal elektrik memecut laju mengelak pancaran laser dron penyerang sebelum melencong ke gudang terbiar.',
    dialogueSummary: 'Deruan motor elektrik dan letupan frekuensi laser membelah jalan.',
    emotionalGoal: 'Dinamik kelajuan ekstrem dan tekanan pemburuan berteknologi tinggi.',
    estimatedDurationSeconds: 25,
    order: 3,
  },
  {
    id: 'scene_4',
    projectId: DEMO_PROJECT_ID,
    sceneNumber: 4,
    heading: 'INT. GUDANG TERBIAR & PORTAL DIMENSI - MALAM',
    location: 'Dewan Usang Bangunan Kolonial Terbiar',
    timeOfDay: 'night',
    characters: ['Razak', 'Portal Keretakan Dimensi Asing'],
    actionSummary: 'Razak menyahkod silinder data, mendedahkan koordinat pencerobohan makhluk asing apabila portal graviti kosmik terbuka.',
    dialogueSummary: 'Razak: "Ini bukan senjata manusia... Ini portal pencerobohan dimensi asing!"',
    emotionalGoal: 'Kengerian misteri terbongkar dan keajaiban anomali kosmik yang memukau.',
    estimatedDurationSeconds: 30,
    order: 4,
  },
];

export const DEMO_ASSETS: Asset[] = [
  {
    id: 'asset_char_razak',
    projectId: DEMO_PROJECT_ID,
    category: 'character',
    name: 'Razak (Ejen Utama)',
    summary: '32 tahun, bekas ejen operasi khas risikan tentera, pakar silat tempur jarak dekat & penyusupan siber.',
    coverUrl: '/demo/razak.jpg',
    currentVersionId: 'ver_razak_v2',
    versions: [
      {
        versionId: 'ver_razak_v1',
        versionNumber: 1,
        name: 'Konsep Awal (Jaket Kulit)',
        description: 'Jaket kulit taktikal hitam dengan ves kalis peluru moden.',
        previewUrl: '/demo/razak.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        versionId: 'ver_razak_v2',
        versionNumber: 2,
        name: 'Versi Akhir (Jaket Kalis Air Taktikal)',
        description: 'Jaket berhud kalis air kelabu grafit dengan earpiece bercahaya biru dan kesan kehausan.',
        previewUrl: '/demo/razak.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 2,
      },
    ],
    details: {
      identityRole: 'Penyiasat Bebas / Bekas Ejen Risikan Elit',
      ageRange: '30-35 tahun',
      appearance: 'Wajah kacukan Asia Tenggara, renungan tajam, parut kecil di tulang pipi kanan, susuk tubuh tegap tangkas.',
      hairstyle: 'Rambut pendek kemas basah sedikit oleh air hujan.',
      wardrobeVersions: [
        { id: 'w1', label: 'Jaket Taktikal Berhud (Kelabu Kalis Air)', description: 'Jaket berhud dengan poket tersembunyi dan pad siku bertetulang.', referenceUrl: '/demo/razak.jpg' },
        { id: 'w2', label: 'Kesan Tempur (Luka & Koyakan Bahu)', description: 'Bahu kiri terkoyak akibat tembakan, basah kuyup dengan lumpur.', referenceUrl: '/demo/shot_combat.jpg' },
      ],
      voiceNotes: 'Suara garau tenang, intonasi pantas dan tegas, bertutur Bahasa Melayu dengan istilah taktikal ketenteraan.',
    },
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'asset_char_maya',
    projectId: DEMO_PROJECT_ID,
    category: 'character',
    name: 'Maya (Ketua Penganalisis Siber)',
    summary: '28 tahun, jurutera perisikan siber pangkalan bersekutu, pengendali dron dan penyahsulit frekuensi kuantum.',
    coverUrl: '/demo/maya.jpg',
    currentVersionId: 'ver_maya_v1',
    versions: [
      {
        versionId: 'ver_maya_v1',
        versionNumber: 1,
        name: 'Peralatan Hab Kawalan Siber',
        description: 'Pakaian sut turtleneck taktikal dengan cuff telinga neural bercahaya sian di makmal siber.',
        previewUrl: '/demo/maya.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 4,
      },
    ],
    details: {
      identityRole: 'Ketua Jurutera Analisis Risikan Siber',
      ageRange: '26-30 tahun',
      appearance: 'Wanita Asia Tenggara berkulit cerah, pandangan fokus berkarisma, memakai peranti neural telinga bercahaya sian.',
      hairstyle: 'Rambut hitam lurus diikat kemas ke belakang bergaya korporat siber.',
      wardrobeVersions: [
        { id: 'my1', label: 'Turtleneck Taktikal Gelap', description: 'Fabrik nano tahan haba dengan peranti neural telinga.', referenceUrl: '/demo/maya.jpg' },
      ],
      voiceNotes: 'Nada analitikal tenang, berkeyakinan tinggi, sentiasa memberi amaran kiraan masa secara tepat.',
    },
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'asset_char_malik',
    projectId: DEMO_PROJECT_ID,
    category: 'character',
    name: 'Komander Malik (Ketua Keselamatan Korporat)',
    summary: '48 tahun, komander pertahanan pangkalan bawah tanah dengan mata siber bionik dan pengalaman perang gerila.',
    coverUrl: '/demo/malik.jpg',
    currentVersionId: 'ver_malik_v1',
    versions: [
      {
        versionId: 'ver_malik_v1',
        versionNumber: 1,
        name: 'Ves Tempur Berat Komander',
        description: 'Ves taktikal plat seramik hitam dengan lencana tentera dan alat komunikasi headset taktik.',
        previewUrl: '/demo/malik.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 4,
      },
    ],
    details: {
      identityRole: 'Komander Pasukan Tindak Khas Korporat',
      ageRange: '45-50 tahun',
      appearance: 'Wajah tegas berparut dengan janggut kemas beruban, mata tajam berpengalaman medan perang.',
      hairstyle: 'Potongan rambut ketenteraan pendek (buzzcut) dengan uban halus.',
      wardrobeVersions: [
        { id: 'm1', label: 'Ves Balistik Plat Seramik', description: 'Bersalut gentian karbon hitam matte dengan lencana komando.', referenceUrl: '/demo/malik.jpg' },
      ],
      voiceNotes: 'Suara berat garang, bergema dingin seperti logam, arahan tanpa belas kasihan.',
    },
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'asset_scene_bunker',
    projectId: DEMO_PROJECT_ID,
    category: 'scene',
    name: 'Pangkalan Pelayan Kuantum',
    summary: 'Pusat data kuantum rahsia terletak 30 meter di bawah tanah Kuala Lumpur, dilengkapi rak pelayan bercahaya sian.',
    coverUrl: '/demo/scene_bunker.jpg',
    currentVersionId: 'ver_bunker_v1',
    versions: [
      {
        versionId: 'ver_bunker_v1',
        versionNumber: 1,
        name: 'Keadaan Standard & Lampu Sian',
        description: 'Deretan rak pelayan gergasi bercahaya sian dengan wap penyejuk kriogenik dan lantai konkrit lembap.',
        previewUrl: '/demo/scene_bunker.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 4,
      },
    ],
    details: {
      spatialDescription: 'Dewan bersiling tinggi dengan tiang konkrit brutalis, lantai antistatik berkilat pantulan wap sejuk.',
      entrancesExits: 'Saluran pengudaraan siling dan pintu hidraulik kedap udara berperisai berat.',
      keyLightSources: 'Lajur optik sian pelayan, lampu amaran merah stroboskopik siling.',
      stateVersions: [
        { id: 's1', label: 'Mod Senyap Penyusupan', description: 'Lampu malap dengan hanya pancaran neon sian.', referenceUrl: '/demo/scene_bunker.jpg' },
        { id: 's2', label: 'Mod Amaran Pencerobohan', description: 'Strob merah berkelip garang dengan siren kecemasan.', referenceUrl: '/demo/scene_bunker.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'asset_scene_alley',
    projectId: DEMO_PROJECT_ID,
    category: 'scene',
    name: 'Lorong Basah Cyberpunk KL',
    summary: 'Lorong belakang sempit warisan Kuala Lumpur dalam hujan lebat monsun, pantulan neon hijau sian dan jingga.',
    coverUrl: '/demo/scene_alley.jpg',
    currentVersionId: 'ver_alley_v1',
    versions: [
      {
        versionId: 'ver_alley_v1',
        versionNumber: 1,
        name: 'Hujan Monsun Tropika & Neon',
        description: 'Asfalt basah dengan lopak air memantulkan papan tanda neon bercahaya, wap paip pendingin hawa.',
        previewUrl: '/demo/scene_alley.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 3,
      },
    ],
    details: {
      spatialDescription: 'Lebar 3 meter diapit dinding bata merah bertingkat dengan tangga besi karat dan kabel berselirat.',
      entrancesExits: 'Satu hujung bersambung ke jalan besar, hujung satu lagi laluan sempit ke lebuhraya bertingkat.',
      keyLightSources: 'Papan tanda neon dwi-bahasa (Melayu & Inggeris), lampu limpah motosikal, biasan cahaya bangunan tinggi.',
      stateVersions: [
        { id: 'al_1', label: 'Hujan Lebat Monsun', description: 'Titisan hujan lebat memercik di lopak asfalt.', referenceUrl: '/demo/scene_alley.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'asset_scene_highway',
    projectId: DEMO_PROJECT_ID,
    category: 'scene',
    name: 'Lebuhraya Bertingkat Cyberjaya',
    summary: 'Jejambat lebuhraya bertingkat moden di waktu malam, laluan kejar-mengejar dron dan motosikal berkelajuan tinggi.',
    coverUrl: '/demo/scene_highway.jpg',
    currentVersionId: 'ver_highway_v1',
    versions: [
      {
        versionId: 'ver_highway_v1',
        versionNumber: 1,
        name: 'Litar Lebuhraya Malam Basah',
        description: 'Jalan raya basah berkilat dengan garisan lampu laju dan pancaran grid imbasan laser merah dron.',
        previewUrl: '/demo/scene_highway.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 3,
      },
    ],
    details: {
      spatialDescription: 'Lebuhraya empat lorong bertingkat melintasi bangunan pencakar langit Cyberjaya dan Putrajaya.',
      entrancesExits: 'Susur keluar arah kawasan perindustrian dan susur masuk terowong kabel bawah tanah.',
      keyLightSources: 'Lampu jalan natrium oren, jejak laser merah dron peninjau, lampu depan motosikal.',
      stateVersions: [
        { id: 'hw_1', label: 'Kejar Mengejar Pantas', description: 'Kabus hujan berputar akibat kelajuan kenderaan.', referenceUrl: '/demo/scene_highway.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'asset_scene_portal',
    projectId: DEMO_PROJECT_ID,
    category: 'scene',
    name: 'Gudang Terbiar & Portal Dimensi',
    summary: 'Bangunan kedai dua tingkat kolonial yang ditinggalkan, di mana anomali graviti dan portal dimensi asing terbuka.',
    coverUrl: '/demo/scene_portal.jpg',
    currentVersionId: 'ver_portal_v1',
    versions: [
      {
        versionId: 'ver_portal_v1',
        versionNumber: 1,
        name: 'Keretakan Dimensi Kosmik',
        description: 'Pusaran lubang cacing ungu dan sian yang merobek ruang dewan dengan serpihan batu terapung tanpa graviti.',
        previewUrl: '/demo/scene_portal.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 3,
      },
    ],
    details: {
      spatialDescription: 'Dewan usang dengan tangga kayu melingkar reput, bumbung bocor membenarkan cahaya bulan dan hujan masuk.',
      entrancesExits: 'Pintu gerbang kayu bergembok yang telah dipecahkan, jendela tinggi berjeriji besi.',
      keyLightSources: 'Pancaran sinaran graviti sian dan violet dari pusat portal, kilauan partikel bercas tenaga.',
      stateVersions: [
        { id: 'pt_1', label: 'Pengaktifan Keretakan Dimensi', description: 'Gelombang tenaga memutarbalikkan graviti bilik.', referenceUrl: '/demo/scene_portal.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'asset_prop_dossier',
    projectId: DEMO_PROJECT_ID,
    category: 'prop',
    name: 'Silinder Kripto "NEURAL-KEY"',
    summary: 'Peranti silinder titanium biometrik berketumpatan tinggi yang memancarkan teras plasma sian dan kod holografik.',
    coverUrl: '/demo/prop_neural_key.jpg',
    currentVersionId: 'ver_prop_dossier_v1',
    versions: [
      {
        versionId: 'ver_prop_dossier_v1',
        versionNumber: 1,
        name: 'Mod Tayangan Hologram',
        description: 'Silinder titanium dengan cincin kod keselamatan holografik terapung yang mendedahkan koordinat makhluk asing.',
        previewUrl: '/demo/prop_neural_key.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 4,
      },
    ],
    details: {
      belongsToCharacter: 'Razak (Ejen Utama)',
      keyStates: [
        { id: 'p1', label: 'Mod Kunci Lengai', description: 'Silinder logam titanium hitam dengan sensor cap jari.', referenceUrl: '/demo/prop_neural_key.jpg' },
        { id: 'p2', label: 'Mod Pancaran Holografik', description: 'Pancaran peta bintang tiga dimensi dan biologi anomali.', referenceUrl: '/demo/prop_neural_key.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'asset_prop_drone',
    projectId: DEMO_PROJECT_ID,
    category: 'prop',
    name: 'Dron Tempur Otonomi "SENTINEL-X"',
    summary: 'Dron oktokopter stealth hitam matte dengan lensa sensor optik biru elektrik dan pemancar laser berkuasa tinggi.',
    coverUrl: '/demo/prop_drone.jpg',
    currentVersionId: 'ver_drone_v1',
    versions: [
      {
        versionId: 'ver_drone_v1',
        versionNumber: 1,
        name: 'Konfigurasi Rondaan Bandar',
        description: 'Badan gentian karbon aerodinamik dengan optik sensor biru dan pemancar grid laser merah.',
        previewUrl: '/demo/prop_drone.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 3,
      },
    ],
    details: {
      belongsToCharacter: 'Komander Malik & Sistem Pangkalan',
      keyStates: [
        { id: 'dr1', label: 'Mod Pengawasan Senyap', description: 'Penerbangan otonomi tanpa bunyi di waktu hujan.', referenceUrl: '/demo/prop_drone.jpg' },
        { id: 'dr2', label: 'Mod Penembakan Laser Berpandu', description: 'Grid merah menyala mengunci koordinat sasaran.', referenceUrl: '/demo/prop_drone.jpg' },
      ],
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'asset_style_cybernoir',
    projectId: DEMO_PROJECT_ID,
    category: 'visual_style',
    name: 'Rainy Cyber-Noir Tropika',
    summary: 'Pertembungan malam tropika Kuala Lumpur dengan teknologi ketenteraan beku, tekstur filem ARRI dan bayang gelap mendalam.',
    coverUrl: '/demo/series_cover.jpg',
    currentVersionId: 'ver_style_v1',
    versions: [
      {
        versionId: 'ver_style_v1',
        versionNumber: 1,
        name: 'Panduan Nada Utama Siri',
        description: 'Kontras tinggi, saturasi sederhana, pencahayaan dwi-suhu (Sian & Jingga Neon), tekstur butiran filem.',
        previewUrl: '/demo/series_cover.jpg',
        isLocked: true,
        createdAt: Date.now() - 86400000 * 6,
      },
    ],
    details: {
      colorPalette: 'Kelabu Sian (#1a2634), Hitam Asfalt (#0c0e12), Kuning Amber (#f59e0b), Biru Neon (#00e5ff)',
      contrastRatio: 'Kontras 8:1 dengan perincian bayang terpelihara, tiada flat crush.',
      lightingMood: 'Pencahayaan tepi (rim lighting) keras pada titisan hujan, sumber praktikal neon bandar.',
      cinematographyRef: 'Blade Runner 2049 + The Raid + Sicario (sinematografi Roger Deakins)',
      aspectRatioRef: 'Format Skrin Lebar 16:9 (Sesuai tontonan pawagam & televisyen pintar)',
      prohibitions: 'Dilarang menggunakan warna pastel kartun atau kesan silau cahaya berlebihan (over-bloom).',
    },
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6,
  },
];

// Generate 27 Complete Cinematic Shots across the 4 scenes
export function generateDemoShots(): Shot[] {
  const shots: Shot[] = [
    // --- BABAK 1: INT. PUSAT PELAYAN BAWAH TANAH (Syot 1 - 7) ---
    {
      id: 'shot_01',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 1,
      name: 'Tinjauan Saluran Pengudaraan',
      narrativeGoal: 'Membina suasana tegang penyusupan dan memperkenalkan skala kubu data pelayan yang dikawal ketat.',
      visualDescription: 'Sudut tinggi melalui jeriji besi meninjau dewan pelayan bercahaya sian, bayang Razak bergerak pantas di bukaan siling.',
      subjectAction: 'Razak membuka selak pengudaraan secara senyap dan meninjau ruang di bawah.',
      cameraMovement: 'tilt',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Dengungan kipas penyejuk pelayan kuantum dan geseran halus bolt logam.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2', subVersionId: 'w1', subVersionLabel: 'Jaket Taktikal Kalis Air' },
        { assetId: 'asset_scene_bunker', assetCategory: 'scene', assetName: 'Pangkalan Pelayan Kuantum', assetVersionId: 'ver_bunker_v1', subVersionId: 's1', subVersionLabel: 'Mod Senyap Penyusupan' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'high_angle',
        lensFocalLength: '24mm',
        composition: 'Garisan perspektif menumpu ke konsol utama di tengah, bingkai jeriji di latar depan.',
        characterBlocking: 'Menjenguk ke bawah dari saluran siling.',
        eyelineDirection: 'screen_left',
        movementDirection: 'towards_camera',
        axisSide: 'left_of_axis',
        actionStartEnd: 'Dari pemerhatian statik ke penurunan tali secara pantas.',
        lightingDirection: 'Cahaya sian dari lantai menyerlahkan siluet figura.',
        emotionalIntensity: 6,
        inOutScreenState: 'Figura masuk dari bahagian atas bingkai.',
        continuityNotes: 'Mendarat di lantai pada syot seterusnya dengan posisi melutut.',
        frameRate: '24fps',
        vfxNotes: 'Kabus wap sejuk dan habuk berterbangan di saluran udara.',
      },
      createdAt: Date.now() - 86400000 * 4,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'shot_02',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 2,
      name: 'Pendaratan Senyap di Lantai Server',
      narrativeGoal: 'Menunjukkan ketangkasan fizikal ejen dan mengekalkan rentak penyusupan yang senyap.',
      visualDescription: 'Syot dekat lantai aluminium berlubang, but taktikal mendarat tanpa sebarang bunyi hentakan.',
      subjectAction: 'Razak mendarat, bergolek ke posisi melutut sambil mengacukan pistol penyenyap bunyi.',
      cameraMovement: 'static',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Sentuhan lembut getah but pada lantai logam dan desiran kain jaket.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'close_up',
        cameraAngle: 'low_angle',
        lensFocalLength: '50mm',
        composition: 'But mendarat di sudut kanan bawah nisbah emas.',
        characterBlocking: 'Melutut di lantai, pistol menghala ke kiri untuk berjaga-jaga.',
        eyelineDirection: 'screen_left',
        movementDirection: 'towards_camera',
        axisSide: 'left_of_axis',
        actionStartEnd: 'Saat mencecah lantai hingga berhenti mengamati sekeliling.',
        lightingDirection: 'Pencahayaan malap dari lantai berlubang.',
        emotionalIntensity: 7,
        continuityNotes: 'Kamera menolak ke arah konsol utama dalam syot seterusnya.',
      },
      liveActionDetails: {
        shootingRequirements: 'Pelakon lagak ngeri melakukan pendaratan lembut dari ketinggian 2 meter dengan wayar keselamatan.',
        takeRecords: [
          { takeNumber: 1, description: 'Bunyi hentakan tapak kaki terlalu kuat', isCircleTake: false },
          { takeNumber: 2, description: 'Pendaratan sempurna, peralihan postur sangat stabil', isCircleTake: true, timecode: '00:00:04:12' },
        ],
      },
      createdAt: Date.now() - 86400000 * 4,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'shot_03',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 3,
      name: 'Penyambungan Terminal Data Kripto',
      narrativeGoal: 'Mencapai objektif misi: memulakan muat turun dokumen sulit NOD RAHSIA.',
      visualDescription: 'Syot sederhana dekat, Razak berdiri di konsol memasukkan silinder data titanium bercahaya.',
      subjectAction: 'Menaip pantas kod pintas pada papan kekunci kaca holografik.',
      cameraMovement: 'dolly_in',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Bunyi bip frekuensi tinggi dan dengungan modul pemindahan data.',
      productionMethod: 'hybrid',
      status: 'ready_for_review',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_prop_dossier', assetCategory: 'prop', assetName: 'Silinder Kripto "NEURAL-KEY"', assetVersionId: 'ver_prop_dossier_v1', subVersionId: 'p1', subVersionLabel: 'Mod Kunci Lengai' },
      ],
      directorDetails: {
        shotSize: 'medium_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '35mm',
        composition: 'Konsol di tengah bingkai, tangan Razak di bahagian bawah.',
        eyelineDirection: 'screen_right',
        lightingDirection: 'Cahaya skrin holografik biru menerangi wajah Razak.',
        emotionalIntensity: 8,
      },
      hybridDetails: {
        whatToChange: 'Gantikan prop silinder tangan akrilik kepada silinder prisma titanium bercahaya biru sejuk.',
        whatToPreserve: 'Pergerakan jari pelakon dan pantulan cahaya sebenar pada lengan baju.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx', 'replacement'],
        trackingNotes: 'Penjejakan 3D tangan pelakon untuk menyelaraskan modul pemacu kuantum.',
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_04',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 4,
      name: 'Penyahkodan Data Holografik',
      narrativeGoal: 'Mendedahkan secebis fail rahsia yang memaparkan koordinat anomali tidak dikenali.',
      visualDescription: 'Syot dekat melampau, pantulan kod cincin holografik terapung di mata Razak.',
      subjectAction: 'Razak tergamam melihat lakaran dimensi yang bukan buatan manusia.',
      cameraMovement: 'static',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Gema modulasi frekuensi digital bersuara rendah.',
      productionMethod: 'full_ai',
      status: 'ready_for_review',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_prop_dossier', assetCategory: 'prop', assetName: 'Silinder Kripto "NEURAL-KEY"', assetVersionId: 'ver_prop_dossier_v1', subVersionId: 'p2', subVersionLabel: 'Mod Pancaran Holografik' },
      ],
      directorDetails: {
        shotSize: 'extreme_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '85mm',
        composition: 'Anak mata memenuhi bahagian tengah bingkai dengan pantulan hologram.',
        eyelineDirection: 'direct_camera',
        lightingDirection: 'Cahaya biru berdenyut dari hologram data.',
        emotionalIntensity: 9,
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_05',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 5,
      name: 'Penggera Merah & Siren Berkedip',
      narrativeGoal: 'Krisis meletus: sistem pencerobohan dikesan, suasana bertukar daripada senyap kepada cemas.',
      visualDescription: 'Syot luas, lampu sian terpadam serta-merta, digantikan oleh lampu merah strob yang berkelip garang.',
      subjectAction: 'Razak merentap silinder data dan segera bersedia melarikan diri.',
      cameraMovement: 'pan',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Siren amaran kecemasan berbunyi nyaring bersulam arahan pengawal.',
      productionMethod: 'full_ai',
      status: 'changes_requested',
      assetReferences: [
        { assetId: 'asset_scene_bunker', assetCategory: 'scene', assetName: 'Pangkalan Pelayan Kuantum', assetVersionId: 'ver_bunker_v1', subVersionId: 's2', subVersionLabel: 'Mod Amaran Pencerobohan' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'eye_level',
        lensFocalLength: '24mm',
        composition: 'Lampu strob merah menyinari seluruh dewan secara berselang-seli.',
        lightingDirection: 'Cahaya merah stroboskopik berkelip kuat dari siling.',
        emotionalIntensity: 9,
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_06',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 6,
      name: 'Pencerobohan Pengawal Pangkalan',
      narrativeGoal: 'Pasukan keselamatan bersenjata berat menyerbu masuk, menyekat laluan keluar utama.',
      visualDescription: 'Sudut rendah, pintu hidraulik terbuka dan tiga pengawal komando menyerbu dengan senapang taktikal.',
      subjectAction: 'Pengawal melepaskan tembakan amaran ke arah konsol.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Dentuman pintu besi, tapak kasut askar dan bunyi kokangan senjata.',
      productionMethod: 'live_action',
      status: 'in_progress',
      assetReferences: [
        { assetId: 'asset_char_malik', assetCategory: 'character', assetName: 'Komander Malik', assetVersionId: 'ver_malik_v1', subVersionId: 'm1', subVersionLabel: 'Ves Balistik Plat Seramik' },
      ],
      directorDetails: {
        shotSize: 'medium_wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '28mm',
        composition: 'Tiga pengawal mara membentuk formasi baji dari pintu masuk.',
        lightingDirection: 'Lampu suluh taktikal senjata menerangi wap sejuk.',
        emotionalIntensity: 8,
      },
      liveActionDetails: {
        shootingRequirements: 'Latihan koreografi serbuan taktikal tentera dengan peluru kapur dan kesan asap.',
        takeRecords: [
          { takeNumber: 1, description: 'Langkah serbuan kurang seragam', isCircleTake: false },
        ],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_07',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_1',
      shotNumber: 7,
      name: 'Razak Merempuh Melepasi Konsol',
      narrativeGoal: 'Tindakan melepaskan diri secara dramatik melepasi kepungan musuh.',
      visualDescription: 'Kamera bergerak dinamik mengikut Razak melompat melepasi konsol kawalan ke pintu keluar kecemasan.',
      subjectAction: 'Razak menepis tembakan pengawal dan menendang pintu keluar ke lorong luar.',
      cameraMovement: 'pan',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Peluru menghentam kaca pelindung konsol, dentuman pintu keluar dirempuh.',
      productionMethod: 'hybrid',
      status: 'in_progress',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'eye_level',
        lensFocalLength: '35mm',
        composition: 'Pergerakan pepenjuru pantas dari kiri ke kanan bingkai.',
        lightingDirection: 'Percikan bunga api tembakan menerangi aksi lompatan.',
        emotionalIntensity: 9,
      },
      hybridDetails: {
        whatToChange: 'Tambah percikan peluru mengenai skrin kaca konsol dan serpihan api.',
        whatToPreserve: 'Aksi lompatan sebenar pelakon lagak ngeri.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx'],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },

    // --- BABAK 2: EXT. LORONG BELAKANG HUJAN LEBAT (Syot 8 - 14) ---
    {
      id: 'shot_08',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 8,
      name: 'Merempuh Keluar ke Lorong Hujan',
      narrativeGoal: 'Peralihan ruang: daripada bilik tertutup sejuk ke hujan lebat monsun malam Kuala Lumpur.',
      visualDescription: 'Syot luas, Razak meluru keluar ke lorong belakang yang basah kuyup dengan percikan air hujan lebat.',
      subjectAction: 'Razak berlari meredah lopak air dengan jaket berhud kalis air.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 5,
      soundAndDialogue: 'Deruan hujan monsun mencurah dan percikan air di bawah tapak kasut.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_scene_alley', assetCategory: 'scene', assetName: 'Lorong Basah Cyberpunk KL', assetVersionId: 'ver_alley_v1', subVersionId: 'al_1', subVersionLabel: 'Hujan Lebat Monsun' },
        { assetId: 'asset_style_cybernoir', assetCategory: 'visual_style', assetName: 'Rainy Cyber-Noir Tropika', assetVersionId: 'ver_style_v1' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '24mm',
        composition: 'Lorong sempit dengan bangunan tinggi di kiri dan kanan.',
        lightingDirection: 'Pantulan lampu neon hijau dan jingga pada permukaan jalan basah.',
        emotionalIntensity: 8,
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'shot_09',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 9,
      name: 'Renungan Razak Dalam Hujan',
      narrativeGoal: 'Mengekalkan fokus emosi watak utama di tengah-tengah kekacauan pemburuan.',
      visualDescription: 'Syot dekat, titisan hujan mengalir di pipi dan hud Razak, matanya mencari laluan keluar.',
      subjectAction: 'Razak menoleh pantas ke belakang memeriksa jarak musuh.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Nafas kencang berhembus dan dentuman guruh di kejauhan.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'close_up',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Wajah Razak di sebelah kanan bingkai, latar belakang kabur dengan neon.',
        lightingDirection: 'Cahaya sisi dari lampu papan tanda kedai.',
        emotionalIntensity: 8,
      },
      liveActionDetails: {
        shootingRequirements: 'Penggambaran malam sebenar dengan mesin hujan buatan dan lensa anamorfik.',
        takeRecords: [
          { takeNumber: 1, description: 'Tumpuan mata sedikit tersasar dari kamera', isCircleTake: false },
          { takeNumber: 2, description: 'Renungan tajam berkarisma, titisan air di wajah sangat sinematik', isCircleTake: true, timecode: '00:00:27:18' },
        ],
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'shot_10',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 10,
      name: 'Askar Upahan Mengunci Laluan',
      narrativeGoal: 'Dua askar upahan elit memintas dari hadapan dengan senjata renjatan elektrik.',
      visualDescription: 'Sudut rendah, figura dua askar bertopeng taktikal berdiri di bawah papan tanda neon jingga.',
      subjectAction: 'Askar mara serentak menghalang jalan keluar sempit.',
      cameraMovement: 'static',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Dengungan rod renjatan elektrik dan derap langkah berat askar.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_scene_alley', assetCategory: 'scene', assetName: 'Lorong Basah Cyberpunk KL', assetVersionId: 'ver_alley_v1' },
      ],
      directorDetails: {
        shotSize: 'medium_wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '35mm',
        composition: 'Dua figura membentuk halangan di bahagian tengah jalan.',
        lightingDirection: 'Lampu neon jingga memancar dari belakang figura musuh.',
        emotionalIntensity: 8,
      },
      liveActionDetails: {
        shootingRequirements: 'Dua pelakon aksi memakai kostum perisai hitam kalis air lengkap bersenjata.',
        takeRecords: [
          { takeNumber: 1, description: 'Ketegangan postur tubuh sangat meyakinkan', isCircleTake: true, timecode: '00:00:31:02' },
        ],
      },
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'shot_11',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 11,
      name: 'Pertarungan Silat Berimpak Tinggi',
      narrativeGoal: 'Koreografi tempur tangan kosong yang tulen dan mematikan.',
      visualDescription: 'Syot sederhana dekat, Razak mengelak serangan dan melakukan buah silat kunci sendi siku lawan.',
      subjectAction: 'Hentaman padu ke dinding bata merah, percikan air hujan berterbangan secara kinetik.',
      cameraMovement: 'handheld',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Hentaman tulang pada batu bata, erangan musuh dan libasan air.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'medium_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '40mm',
        composition: 'Aksi pertempuran di tengah bingkai dengan titisan air terhenti di udara.',
        lightingDirection: 'Cahaya neon dwi-warna biru dan kuning amber dari sisi.',
        emotionalIntensity: 9,
      },
      liveActionDetails: {
        shootingRequirements: 'Koreografer silat profesional menyelaraskan impak sentuhan fizikal selamat.',
        takeRecords: [
          { takeNumber: 1, description: 'Kelajuan kunci siku sedikit perlahan', isCircleTake: false },
          { takeNumber: 2, description: 'Impak pukulan sangat padu, percikan air sempurna', isCircleTake: true, timecode: '00:00:34:20' },
        ],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_12',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 12,
      name: 'Melumpuhkan Musuh Kedua',
      narrativeGoal: 'Menewaskan lawan terakhir untuk membuka laluan ke kenderaan melarikan diri.',
      visualDescription: 'Kamera berputar pantas merakam tendangan sapuan Razak yang menjatuhkan musuh ke lopak air.',
      subjectAction: 'Musuh rebah tidak sedarkan diri dalam lopak air berlumpur.',
      cameraMovement: 'handheld',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Percikan air deras dan bunyi hentakan badan ke atas jalan asfalt.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'low_angle',
        lensFocalLength: '35mm',
        composition: 'Sudut rendah merakam musuh jatuh ke lantai jalan.',
        lightingDirection: 'Lampu suluh yang tercampak ke tanah menyinari lopak air.',
        emotionalIntensity: 8,
      },
      liveActionDetails: {
        shootingRequirements: 'Pelakon aksi jatuh ke atas span keselamatan terlindung di dalam air.',
        takeRecords: [
          { takeNumber: 1, description: 'Sapuan kaki dan percikan air sangat kemas', isCircleTake: true, timecode: '00:00:38:05' },
        ],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_13',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 13,
      name: 'Menemui Motosikal Elektrik',
      narrativeGoal: 'Penyelesaian pengangkutan: menemui motosikal elektrik berprestasi tinggi di bawah tangga kecemasan.',
      visualDescription: 'Syot sederhana, motosikal hitam matte tersandar di bawah lampu neon hijau sian.',
      subjectAction: 'Razak melompat ke atas pelana dan mengaktifkan pengimbas cap jari.',
      cameraMovement: 'dolly_in',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Dengungan sistem elektrik motosikal hidup berserta lampu LED menyala.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Motosikal diletakkan menyerong menghala ke pintu keluar lorong.',
        lightingDirection: 'Lampu neon hijau sian menyinari badan gentian karbon motosikal.',
        emotionalIntensity: 7,
      },
      liveActionDetails: {
        shootingRequirements: 'Motosikal prop elektrik sebenar dengan pengaktifan lampu LED praktikal.',
        takeRecords: [
          { takeNumber: 1, description: 'Lompatan ke pelana dan butang hidup sangat pantas', isCircleTake: true, timecode: '00:00:41:14' },
        ],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_14',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_2',
      shotNumber: 14,
      name: 'Memecut Keluar Dari Lorong',
      narrativeGoal: 'Pelancaran fasa kedua: pecutan ekstrem menuju ke lebuhraya bertingkat.',
      visualDescription: 'Syot dari belakang motosikal memecut laju membelah lopak air, meninggalkan lorong gelap.',
      subjectAction: 'Motosikal membelok tajam ke tanjakan lebuhraya bertingkat.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Bunyi desiran motor elektrik berfrekuensi tinggi dan tayar mencengkam jalan basah.',
      productionMethod: 'hybrid',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '24mm',
        composition: 'Motosikal bergerak menjauhi kamera ke arah jalan raya bercahaya.',
        lightingDirection: 'Lampu merah belakang motosikal meninggalkan jejak cahaya.',
        emotionalIntensity: 8,
      },
      hybridDetails: {
        whatToChange: 'Tambah kabus air dan jejak cahaya lampu belakang menggunakan penggayaan visual AI.',
        whatToPreserve: 'Tunggangan motosikal sebenar di jalan basah.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx'],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },

    // --- BABAK 3: EXT. LEBUHRAYA BERTINGKAT CYBERJAYA (Syot 15 - 20) ---
    {
      id: 'shot_15',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 15,
      name: 'Kejar-mengejar di Lebuhraya Basah',
      narrativeGoal: 'Skala aksi diperluaskan ke laluan lebuhraya moden bertingkat pada waktu malam.',
      visualDescription: 'Syot luas bergerak laju, motosikal Razak membelah hujan di antara pencakar langit Cyberjaya.',
      subjectAction: 'Razak menyusup di celah tiang jejambat dengan kelajuan maksimum.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 5,
      soundAndDialogue: 'Deruan angin kencang, bunyi motor elektrik berdesir dan titisan hujan merempuh visor.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_scene_highway', assetCategory: 'scene', assetName: 'Lebuhraya Bertingkat Cyberjaya', assetVersionId: 'ver_highway_v1', subVersionId: 'hw_1', subVersionLabel: 'Kejar Mengejar Pantas' },
        { assetId: 'asset_style_cybernoir', assetCategory: 'visual_style', assetName: 'Rainy Cyber-Noir Tropika', assetVersionId: 'ver_style_v1' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'eye_level',
        lensFocalLength: '28mm',
        composition: 'Laluan lebuhraya melengkung dengan latar belakang lampu bandar raya.',
        lightingDirection: 'Lampu jalan natrium oren dan lampu limpah kenderaan.',
        emotionalIntensity: 8,
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_16',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 16,
      name: 'Dron Sentinel-X Mengunci Sasaran',
      narrativeGoal: 'Ancaman udara tiba: dron pemburu AI menjejak motosikal dari langit malam.',
      visualDescription: 'Sudut tinggi, optik biru Dron Sentinel-X memancarkan grid imbasan merah ke atas motosikal.',
      subjectAction: 'Dron menjunam laju dari celah awan hujan.',
      cameraMovement: 'crane',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Desiran baling-baling lapan bilah dan amaran sistem penguncian berfrekuensi tinggi.',
      productionMethod: 'full_ai',
      status: 'in_progress',
      assetReferences: [
        { assetId: 'asset_prop_drone', assetCategory: 'prop', assetName: 'Dron Tempur Otonomi "SENTINEL-X"', assetVersionId: 'ver_drone_v1', subVersionId: 'dr2', subVersionLabel: 'Mod Penembakan Laser Berpandu' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'high_angle',
        lensFocalLength: '24mm',
        composition: 'Dron di latar depan atas, motosikal kecil di bahagian bawah jalan.',
        lightingDirection: 'Pancaran grid laser merah dari dron menerangi asfalt.',
        emotionalIntensity: 9,
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_17',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 17,
      name: 'Tembakan Laser Dron ke Atas Asfalt',
      narrativeGoal: 'Peningkatan bahaya maut: laser membelah jalan raya berhampiran tayar motosikal.',
      visualDescription: 'Syot dekat paras jalan, pancaran laser merah membakar permukaan asfalt dan meletupkan wap air.',
      subjectAction: 'Motosikal melompat sedikit mengelak rekahan api laser.',
      cameraMovement: 'tracking',
      targetDurationSeconds: 3,
      soundAndDialogue: 'Dentuman tenaga terma laser membakar air dan letupan serpihan batu jalan.',
      productionMethod: 'hybrid',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_scene_highway', assetCategory: 'scene', assetName: 'Lebuhraya Bertingkat Cyberjaya', assetVersionId: 'ver_highway_v1' },
      ],
      directorDetails: {
        shotSize: 'close_up',
        cameraAngle: 'low_angle',
        lensFocalLength: '50mm',
        composition: 'Letupan wap dan api kecil di sebelah tayar belakang motosikal.',
        lightingDirection: 'Kilauan merah terang daripada letupan laser.',
        emotionalIntensity: 9,
      },
      hybridDetails: {
        whatToChange: 'Sintesis letupan laser berfrekuensi tinggi pada permukaan jalan basah.',
        whatToPreserve: 'Pergerakan fizikal tayar motosikal sebenar.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx'],
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_18',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 18,
      name: 'Motosikal Mengelak Tembakan Laser',
      narrativeGoal: 'Kemahiran menunggang luar biasa mengelak serangan bertubi-tubi.',
      visualDescription: 'Kamera dari sisi motosikal condong rapat ke permukaan jalan semasa mengambil selekoh tajam.',
      subjectAction: 'Razak membelok agresif menuruni susur keluar ke zon perindustrian lama.',
      cameraMovement: 'pan',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Geseran tayar berdecit pada permukaan basah dan ledakan laser di latar belakang.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_scene_highway', assetCategory: 'scene', assetName: 'Lebuhraya Bertingkat Cyberjaya', assetVersionId: 'ver_highway_v1' },
      ],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'low_angle',
        lensFocalLength: '35mm',
        composition: 'Motosikal condong pada sudut ekstrem 45 darjah.',
        lightingDirection: 'Pantulan lampu neon jalan pada pakaian kalis air Razak.',
        emotionalIntensity: 8,
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_19',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 19,
      name: 'Maya Menggodam Sistem Navigasi Dron',
      narrativeGoal: 'Bantuan sekutu: Maya mengganggu sensor dron dari jarak jauh untuk memberi ruang melarikan diri.',
      visualDescription: 'Syot sederhana dekat, Maya di makmal siber menekan kekunci dengan pantas, skrin memaparkan OVERRIDE.',
      subjectAction: 'Maya mengalihkan trajektori penerbangan dron secara elektromagnetik.',
      cameraMovement: 'static',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Maya berbisik tegas: Dron terganggu selama lima saat, masuk ke gudang terbiar sekarang!',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_maya', assetCategory: 'character', assetName: 'Maya', assetVersionId: 'ver_maya_v1', subVersionId: 'my1', subVersionLabel: 'Turtleneck Taktikal Gelap' },
      ],
      directorDetails: {
        shotSize: 'medium_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Wajah fokus Maya diapit skrin kaca lutsinar bercahaya sian.',
        lightingDirection: 'Cahaya biru sejuk dari terminal komputer makmal.',
        emotionalIntensity: 8,
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_20',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_3',
      shotNumber: 20,
      name: 'Melencong Masuk ke Kawasan Terbiar',
      narrativeGoal: 'Motosikal memecut masuk ke dalam kompleks gudang kolonial terbiar untuk berlindung.',
      visualDescription: 'Syot luas, motosikal menerobos pintu pagar berkarat dan hilang ke dalam kegelapan gudang usang.',
      subjectAction: 'Dron yang hilang sasaran berlegar di luar dalam hujan lebat.',
      cameraMovement: 'tilt',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Brek motosikal ditekan kuat, pintu pagar berayun dan deruan hujan mereda.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_scene_highway', assetCategory: 'scene', assetName: 'Lebuhraya Bertingkat Cyberjaya', assetVersionId: 'ver_highway_v1' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'high_angle',
        lensFocalLength: '24mm',
        composition: 'Pintu gerbang gudang usang menelan kenderaan ke dalam bayang.',
        lightingDirection: 'Lampu depan motosikal menyapu dinding usang yang berlumut.',
        emotionalIntensity: 7,
      },
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },

    // --- BABAK 4: INT. GUDANG TERBIAR & PORTAL DIMENSI (Syot 21 - 27) ---
    {
      id: 'shot_21',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 21,
      name: 'Memasuki Dewan Gudang Terbiar',
      narrativeGoal: 'Membina suasana sunyi dan misteri sebelum kebenaran sebenar terbongkar.',
      visualDescription: 'Syot luas, dewan usang dengan lantai kayu reput dan pancaran cahaya bulan masuk melalui bumbung bocor.',
      subjectAction: 'Razak menanggalkan topi keledar dan melangkah perlahan ke tengah dewan.',
      cameraMovement: 'pan',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Derap but di atas lantai kayu reput dan bunyi titisan air hujan menitis perlahan.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_style_cybernoir', assetCategory: 'visual_style', assetName: 'Rainy Cyber-Noir Tropika', assetVersionId: 'ver_style_v1' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'eye_level',
        lensFocalLength: '24mm',
        composition: 'Tiang-tiang kayu besar membingkai dewan yang luas dan sunyi.',
        lightingDirection: 'Cahaya bulan keperakan menembusi rekahan siling bocor.',
        emotionalIntensity: 5,
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_22',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 22,
      name: 'Razak Merawat Kecederaan Bahu',
      narrativeGoal: 'Menyerlahkan keletihan fizikal dan keazaman emosi watak utama.',
      visualDescription: 'Syot sederhana dekat, Razak bersandar pada tiang konkrit memeriksa luka tembakan di bahu kiri.',
      subjectAction: 'Mengetatkan ikatan kain untuk menghentikan pendarahan sambil menahan sakit.',
      cameraMovement: 'static',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Keluhan nafas menahan pedih dan geseran kain pembalut luka.',
      productionMethod: 'live_action',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2', subVersionId: 'w2', subVersionLabel: 'Kesan Tempur (Luka & Koyakan Bahu)' },
      ],
      directorDetails: {
        shotSize: 'medium_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Razak duduk bersandar di tiang, cahaya menampakkan wajah berpeluh.',
        lightingDirection: 'Cahaya sisi lembut menyerlahkan tekstur luka dan titisan peluh.',
        emotionalIntensity: 7,
      },
      liveActionDetails: {
        shootingRequirements: 'Penggambaran di lokasi bangunan lama dengan solekan kesan khas luka tembakan realistik.',
        takeRecords: [
          { takeNumber: 1, description: 'Balutan kain sedikit longgar', isCircleTake: false },
          { takeNumber: 2, description: 'Ekspresi kesakitan dan pernafasan sangat meyakinkan', isCircleTake: true, timecode: '00:01:31:05' },
        ],
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_23',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 23,
      name: 'Hologram Silinder Data Terbuka',
      narrativeGoal: 'Penyahkodan data utama: mendedahkan isi sebenar fail NOD RAHSIA.',
      visualDescription: 'Syot dekat, silinder kripto titanium berpusing dan memancarkan cahaya biru terang ke udara.',
      subjectAction: 'Razak membuka kunci biometrik pada permukaan silinder.',
      cameraMovement: 'dolly_in',
      targetDurationSeconds: 5,
      soundAndDialogue: 'Dengungan tenaga kuantum yang mendalam dan bunyi denyutan frekuensi.',
      productionMethod: 'hybrid',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_prop_dossier', assetCategory: 'prop', assetName: 'Silinder Kripto "NEURAL-KEY"', assetVersionId: 'ver_prop_dossier_v1', subVersionId: 'p2', subVersionLabel: 'Mod Pancaran Holografik' },
      ],
      directorDetails: {
        shotSize: 'close_up',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Silinder di tapak tangan memancarkan cahaya kon ke atas.',
        lightingDirection: 'Pancaran biru pekat dari teras silinder menerangi seluruh bilik.',
        emotionalIntensity: 8,
      },
      hybridDetails: {
        whatToChange: 'Cipta pancaran hologram 3D terapung yang memaparkan data anatomi asing.',
        whatToPreserve: 'Tangan pelakon yang memegang peranti dan reaksi mata.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx'],
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_24',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 24,
      name: 'Pendedahan Rahsia Dimensi Asing',
      narrativeGoal: 'Titik perubahan plot: fail ini bukan dokumen tentera biasa tetapi pelan pencerobohan makhluk asing.',
      visualDescription: 'Syot sederhana, hologram memaparkan struktur biologi gergasi dan peta ruang angkasa terapung.',
      subjectAction: 'Mata Razak membesar tidak percaya dengan apa yang disaksikan.',
      cameraMovement: 'static',
      targetDurationSeconds: 4,
      soundAndDialogue: 'Razak berbisik cemas: Ini bukan senjata manusia... Ini portal pencerobohan dimensi asing!',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_prop_dossier', assetCategory: 'prop', assetName: 'Silinder Kripto "NEURAL-KEY"', assetVersionId: 'ver_prop_dossier_v1' },
      ],
      directorDetails: {
        shotSize: 'medium',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Lakaran holografik terapung mengelilingi Razak di udara.',
        lightingDirection: 'Cahaya biru dan emas daripada peta bintang holografik.',
        emotionalIntensity: 9,
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_25',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 25,
      name: 'Gelombang Dimensi Mula Merobek Ruang',
      narrativeGoal: 'Kemunculan fenomena anomali fizik: graviti bilik mula terganggu.',
      visualDescription: 'Syot luas, habuk, serpihan batu dan titisan air mula terapung ke atas tanpa graviti.',
      subjectAction: 'Razak berundur perlahan sambil melindungi matanya dari sinaran tenaga.',
      cameraMovement: 'crane',
      targetDurationSeconds: 5,
      soundAndDialogue: 'Dengungan gelombang graviti frekuensi rendah yang menggetarkan seluruh dewan.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_scene_portal', assetCategory: 'scene', assetName: 'Gudang Terbiar & Portal Dimensi', assetVersionId: 'ver_portal_v1', subVersionId: 'pt_1', subVersionLabel: 'Pengaktifan Keretakan Dimensi' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '24mm',
        composition: 'Pusat dewan mula berputar dengan serpihan terapung.',
        lightingDirection: 'Kilauan cahaya ungu dan biru berdenyut dari titik tengah.',
        emotionalIntensity: 9,
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_26',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 26,
      name: 'Portal Antara Dimensi Terbuka Sepenuhnya',
      narrativeGoal: 'Klimaks visual mutlak: keretakan kosmik terbuka di tengah gudang kolonial.',
      visualDescription: 'Syot luas ekstrem, lubang cacing bercahaya violet dan sian berputar ganas merobek ruang dewan.',
      subjectAction: 'Razak berdiri tegak mendepani pusaran kosmik dengan jaket berkibar ditiup angin graviti.',
      cameraMovement: 'crane',
      targetDurationSeconds: 6,
      soundAndDialogue: 'Deruan seolah-olah lohong hitam menyedut udara, gema misteri dari dimensi asing bersahutan.',
      productionMethod: 'hybrid',
      status: 'in_progress',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_style_cybernoir', assetCategory: 'visual_style', assetName: 'Rainy Cyber-Noir Tropika', assetVersionId: 'ver_style_v1' },
      ],
      directorDetails: {
        shotSize: 'wide',
        cameraAngle: 'low_angle',
        lensFocalLength: '20mm',
        composition: 'Pusaran portal gergasi di tengah, figura Razak kecil di hadapannya.',
        eyelineDirection: 'direct_camera',
        lightingDirection: 'Sinaran kosmik violet dan sian menyinari seluruh ruang dewan.',
        emotionalIntensity: 10,
        vfxNotes: 'Pelakon beraksi di hadapan kipas angin kuat dan lampu interaktif, latar belakang digantikan dengan portal 3D.',
      },
      hybridDetails: {
        whatToChange: 'Gantikan bahagian tengah gudang kepada lubang cacing anomali graviti dinamik.',
        whatToPreserve: 'Postur fizikal pelakon menahan tolakan angin kencang.',
        preserveActingAndMotion: true,
        taskTypes: ['vfx', 'replacement'],
        trackingNotes: 'Penjejakan penuh dewan di bawah herotan kanta graviti tinggi.',
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'shot_27',
      projectId: DEMO_PROJECT_ID,
      sceneId: 'scene_4',
      shotNumber: 27,
      name: 'Razak Melangkah Masuk ke Dalam Portal',
      narrativeGoal: 'Penamat dramatik bersambung: keberanian menghadapi misteri yang tidak diketahui.',
      visualDescription: 'Syot sederhana dekat, Razak mengukir tekad di wajahnya dan melangkah ke dalam cahaya portal.',
      subjectAction: 'Figura Razak diselubungi cahaya terang benderang sebelum skrin terpadam menjadi gelap.',
      cameraMovement: 'dolly_in',
      targetDurationSeconds: 5,
      soundAndDialogue: 'Semua bunyi tiba-tiba senyap seketika sebaik sahaja langkah diambil. POTONG KE GELAP. Keluar tajuk NOD RAHSIA.',
      productionMethod: 'full_ai',
      status: 'approved',
      assetReferences: [
        { assetId: 'asset_char_razak', assetCategory: 'character', assetName: 'Razak', assetVersionId: 'ver_razak_v2' },
        { assetId: 'asset_style_cybernoir', assetCategory: 'visual_style', assetName: 'Rainy Cyber-Noir Tropika', assetVersionId: 'ver_style_v1' },
      ],
      directorDetails: {
        shotSize: 'medium_close',
        cameraAngle: 'eye_level',
        lensFocalLength: '50mm',
        composition: 'Figura Razak bergerak ke tengah pusaran cahaya terang.',
        eyelineDirection: 'direct_camera',
        movementDirection: 'towards_camera',
        lightingDirection: 'Cahaya putih terang benderang membutakan dari arah depan.',
        emotionalIntensity: 10,
      },
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
  ];

  return shots;
}

// Generate prompt versions for the shots
export function generateDemoPrompts(shots: Shot[]): PromptVersion[] {
  const prompts: PromptVersion[] = [];

  for (const shot of shots) {
    let tag = 'Kling 1.5 Pro';
    if (shot.productionMethod === 'full_ai') tag = 'Runway Gen-3 Alpha';
    if (shot.productionMethod === 'hybrid') tag = 'ComfyUI + ControlNet v1.5';

    prompts.push({
      id: `prompt_${shot.id}`,
      shotId: shot.id,
      versionNumber: 1,
      staticKeyframePromptZh: `${shot.name}. ${shot.visualDescription}. Komposisi sinematik, saiz syot ${shot.directorDetails.shotSize || 'sederhana'}, pencahayaan ${shot.directorDetails.lightingDirection || 'tepi'}, resolusi 8k, tekstur kamera ARRI Alexa, nada noir cyberpunk.`,
      staticKeyframePromptEn: `Cinematic frame of ${shot.name}. ${shot.visualDescription}. Shot size ${shot.directorDetails.shotSize || 'medium'}, ${shot.directorDetails.cameraAngle || 'eye level'}, cinematic lighting, 8k resolution, Arri Alexa raw texture, cyberpunk noir aesthetic, 16:9 aspect ratio, anamorphic lens flare.`,
      dynamicVideoPromptZh: `Kamera bergerak dinamik ${shot.cameraMovement}, bermula dari ${shot.directorDetails.actionStartEnd || 'posisi awal'}. Tindakan subjek: ${shot.subjectAction}. Ketekalan ciri watak dan perincian pakaian stabil, simulasi titisan hujan lancar.`,
      dynamicVideoPromptEn: `Camera executing smooth ${shot.cameraMovement} motion. Subject action: ${shot.subjectAction}. Consistent character features, realistic rain drops and fog drift, high frame consistency, cinematic motion blur.`,
      hybridInstructionsZh: shot.hybridDetails ? `Arahan Ubah Suai Hibrid: Gantikan: ${shot.hybridDetails.whatToChange}; Kekalkan: ${shot.hybridDetails.whatToPreserve}. Penjejakan & Komposit: ${shot.hybridDetails.trackingNotes}` : undefined,
      hybridInstructionsEn: shot.hybridDetails ? `Live-action revamp instructions: Replace: ${shot.hybridDetails.whatToChange}; Preserve: ${shot.hybridDetails.whatToPreserve}. Tracking & comp: ${shot.hybridDetails.trackingNotes}` : undefined,
      targetPlatformTag: tag,
      referencedAssetVersionIds: shot.assetReferences.map(r => r.assetVersionId),
      createdAt: shot.createdAt,
      createdBy: 'Sarah Tan (Pengarah Visual AI)',
    });
  }

  return prompts;
}

// Generate tasks & dependencies
export function generateDemoTasks(shots: Shot[]): Task[] {
  return [
    {
      id: 'task_01',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_01',
      title: 'Jana Bingkai Utama Saluran Pengudaraan (Syot 01)',
      description: 'Gunakan Runway / Midjourney untuk menjana pandangan atas louvre saluran pengudaraan, memadankan pencahayaan sian bilik pelayan.',
      assigneeId: 'mem_2',
      assigneeName: 'Sarah Tan',
      status: 'completed',
      deadline: '2026-10-20',
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'task_02',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_03',
      title: 'Penjejakan CGI Silinder Data Kripto (Syot 03)',
      description: 'Import Take 2 lakonan langsung, lakukan penjejakan 3D model akrilik tangan dan gantikan dengan prisma kuantum bercahaya.',
      assigneeId: 'mem_2',
      assigneeName: 'Sarah Tan',
      status: 'in_progress',
      deadline: '2026-10-25',
      dependencies: ['task_01'],
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'task_03',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_05',
      title: 'Pelarasan Strob Cahaya Merah Kecemasan (Syot 05)',
      description: 'Maklum balas pengarah: Kurangkan ketepuan cahaya merah dan pertingkatkan perincian bayang pada rak pelayan.',
      assigneeId: 'mem_2',
      assigneeName: 'Sarah Tan',
      status: 'in_progress',
      deadline: '2026-10-24',
      blockerReason: 'Menunggu pengesahan nilai rujukan kromatik merah oleh pengarah',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'task_04',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_06',
      title: 'Transkod Bahan ARRI RAW & Suntingan Kasar (Syot 06)',
      description: 'Transkod bahan mentah ARRI RAW ke ProRes 422HQ dan selaraskan trek audio mikrofon persekitaran.',
      assigneeId: 'mem_5',
      assigneeName: 'Ken Lim',
      status: 'in_progress',
      deadline: '2026-10-26',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'task_05',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_16',
      title: 'Simulasi Fizik Letupan Laser di Asfalt (Syot 16)',
      description: 'Kiraan serpihan batu dan asap Houdini, perlu menunggu penguncian lengkung trajektori dron.',
      assigneeId: 'mem_2',
      assigneeName: 'Sarah Tan',
      status: 'blocked',
      deadline: '2026-10-28',
      blockerReason: 'Menunggu pengesahan sudut junaman akhir dron Sentinel-X dalam Syot 15',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'task_06',
      projectId: DEMO_PROJECT_ID,
      shotId: 'shot_26',
      title: 'Komposit Kanta Graviti Portal Dimensi (Syot 26)',
      description: 'Komposit tahap tinggi: menggabungkan bahan skrin hijau pelakon dalam ribut dengan pusaran graviti dimensi asing.',
      assigneeId: 'mem_2',
      assigneeName: 'Sarah Tan',
      status: 'todo',
      deadline: '2026-11-05',
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
  ];
}

// Generate Initial Media Versions for Shots so each shot has a visual presentation
export function generateDemoMedia(shots: Shot[]): { media: MediaVersion[]; reviews: Review[] } {
  const mediaList: MediaVersion[] = [];
  const reviews: Review[] = [];

  const shotImages: Record<number, string> = {
    1: '/demo/scene_bunker.jpg',    // Shot 01: Saluran pengudaraan pecutan
    2: '/demo/scene_bunker.jpg',    // Shot 02: Pendaratan dalam bilik server
    3: '/demo/prop_neural_key.jpg', // Shot 03: Memasukkan pemacu data kripto
    4: '/demo/maya.jpg',            // Shot 04: Maya mengesahkan muat turun data
    5: '/demo/scene_bunker.jpg',    // Shot 05: Lampu amaran kecemasan berkedip
    6: '/demo/malik.jpg',           // Shot 06: Komander Malik mengarahkan serbuan
    7: '/demo/razak.jpg',           // Shot 07: Razak melepasi konsol kawalan
    8: '/demo/scene_alley.jpg',     // Shot 08: Merempuh keluar ke lorong hujan
    9: '/demo/razak.jpg',           // Shot 09: Razak berlari dalam hujan lebat
    10: '/demo/scene_alley.jpg',    // Shot 10: Askar upahan mengejar
    11: '/demo/shot_combat.jpg',    // Shot 11: Pertarungan silat berimpak tinggi
    12: '/demo/shot_combat.jpg',    // Shot 12: Melumpuhkan musuh kedua
    13: '/demo/scene_alley.jpg',    // Shot 13: Menemui motosikal elektrik
    14: '/demo/shot_bike_chase.jpg',// Shot 14: Memecut keluar dari lorong
    15: '/demo/shot_bike_chase.jpg',// Shot 15: Motosikal di lebuhraya basah Cyberjaya
    16: '/demo/prop_drone.jpg',     // Shot 16: Dron Sentinel-X mengunci sasaran
    17: '/demo/scene_highway.jpg',  // Shot 17: Tembakan laser dron ke atas jalan raya
    18: '/demo/shot_bike_chase.jpg',// Shot 18: Motosikal mengelak tembakan laser
    19: '/demo/maya.jpg',           // Shot 19: Maya menggodam sistem navigasi dron
    20: '/demo/scene_highway.jpg',  // Shot 20: Melencong masuk ke kawasan terbiar
    21: '/demo/scene_portal.jpg',   // Shot 21: Memasuki dewan gudang terbiar
    22: '/demo/razak.jpg',          // Shot 22: Razak merawat kecederaan bahu
    23: '/demo/prop_neural_key.jpg',// Shot 23: Hologram silinder data terbuka
    24: '/demo/prop_neural_key.jpg',// Shot 24: Pendedahan rahsia dimensi asing
    25: '/demo/scene_portal.jpg',   // Shot 25: Gelombang dimensi mula merobek ruang
    26: '/demo/scene_portal.jpg',   // Shot 26: Portal antara dimensi terbuka sepenuhnya
    27: '/demo/series_cover.jpg',   // Shot 27: Razak melangkah ke dalam cahaya portal
  };

  for (const shot of shots) {
    // Primary URL is real generated production film still, with SVG as visual fallback
    const previewUrl = shotImages[shot.shotNumber] || createCinematicSvg({
      shotNumber: shot.shotNumber,
      shotSize: shot.directorDetails.shotSize || 'MS',
      cameraMovement: shot.cameraMovement,
      description: shot.visualDescription,
      method: shot.productionMethod,
      status: shot.status,
    });

    const mediaId = `media_${shot.id}_v1`;
    const mediaItem: MediaVersion = {
      id: mediaId,
      shotId: shot.id,
      versionNumber: 1,
      versionName: `v1.0_${shot.productionMethod === 'live_action' ? 'Take02_ARRI' : shot.productionMethod === 'hybrid' ? 'Comp_Rev1' : 'Gen_Draft'}`,
      mediaType: 'image',
      url: previewUrl,
      source: shot.productionMethod === 'live_action' ? 'live_take' : shot.productionMethod === 'hybrid' ? 'hybrid_comp' : 'ai_generated',
      creatorName: shot.productionMethod === 'live_action' ? 'Zul Ariffin (DP)' : 'Sarah Tan (AI Visual Director)',
      toolTag: shot.productionMethod === 'live_action' ? 'ARRI Alexa Mini LF' : shot.productionMethod === 'hybrid' ? 'ComfyUI + Nuke' : 'Runway Gen-3 Alpha',
      promptVersionId: `prompt_${shot.id}`,
      notes: `Tangkapan Syot ${shot.shotNumber}: Rendisi visual rasmi untuk siri NOD RAHSIA.`,
      reviewStatus: shot.status,
      createdAt: shot.createdAt + 3600000,
    };

    mediaList.push(mediaItem);

    // If status is approved or changes_requested or ready_for_review, add review record and adopt media
    if (shot.status === 'approved' || shot.status === 'changes_requested' || shot.status === 'ready_for_review') {
      shot.adoptedMediaVersionId = mediaId;

      const reviewId = `rev_${shot.id}_1`;
      const review: Review = {
        id: reviewId,
        shotId: shot.id,
        mediaVersionId: mediaId,
        reviewerName: 'Aiman Hakim (Pengarah)',
        decision: shot.status === 'approved' ? 'approve' : shot.status === 'changes_requested' ? 'request_changes' : 'comment_only',
        feedbackNotes: shot.status === 'approved'
          ? 'Pencahayaan dwi-suhu dan komposisi sinematik menepati visi pengarah. Diluluskan sebagai piawaian produksi.'
          : shot.status === 'changes_requested'
          ? 'Kilauan lampu amaran terlalu tepu, kurangkan sedikit pendedahan dan pertingkatkan perincian bayang.'
          : 'Prafail visual awal yang sangat kukuh, menunggu penyelarasan grading warna akhir.',
        timecodedComments: [
          {
            id: `tc_${shot.id}_1`,
            reviewId: reviewId,
            timestampSeconds: 1.5,
            authorName: 'Aiman Hakim',
            authorRole: 'director',
            content: shot.status === 'changes_requested' ? 'Perhatikan pendedahan berlebihan pada 00:01:12, kurangkan 20%' : 'Pecutan gerakan kamera dan dinamik titisan air sangat realistik',
            createdAt: shot.createdAt + 7200000,
          },
        ],
        createdAt: shot.createdAt + 7200000,
      };

      reviews.push(review);
    }
  }

  return { media: mediaList, reviews };
}
