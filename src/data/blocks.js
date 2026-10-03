export const BLOCKS = [
  {
    "id": "p-core",
    "name": "P-Core",
    "group": "Hesap",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 2,
    "h": 2,
    "transistors": 1.6,
    "power": 9,
    "color": "#22d3ee",
    "stats": {
      "st": 10,
      "mt": 8
    },
    "desc": "Büyük, karmaşık performans çekirdeği. Yüksek IPC ve frekans; çok yer kaplar, çok güç harcar."
  },
  {
    "id": "e-core",
    "name": "E-Core",
    "group": "Hesap",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.4,
    "power": 2.5,
    "color": "#0ea5e9",
    "stats": {
      "st": 4,
      "mt": 5
    },
    "desc": "Küçük verimlilik çekirdeği. Bir P-Core'un yerine dört tane sığar; paralel işlerde alan başına çok daha verimli."
  },
  {
    "id": "lp-core",
    "name": "LP-E Core",
    "group": "Hesap",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.25,
    "power": 0.8,
    "color": "#38bdf8",
    "stats": {
      "st": 2,
      "mt": 2,
      "platform": 5
    },
    "desc": "Ayrı düşük güç adasında duran çekirdek. Sistem boştayken büyük çekirdekler tamamen kapanabilir — pil ömrünün sırrı."
  },
  {
    "id": "dense-core",
    "name": "Yoğun Sunucu Çekirdeği",
    "group": "Hesap",
    "types": [
      "CPU",
      "AI"
    ],
    "w": 1,
    "h": 2,
    "transistors": 0.9,
    "power": 4.5,
    "color": "#06b6d4",
    "stats": {
      "st": 7,
      "mt": 9
    },
    "desc": "Aynı mimarinin sıkıştırılmış hâli (Zen 5c benzeri). Daha düşük frekans, çok daha iyi alan verimliliği."
  },
  {
    "id": "sm",
    "name": "SM / CU Kümesi",
    "group": "Hesap",
    "types": [
      "GPU",
      "AI",
      "SOC"
    ],
    "w": 2,
    "h": 2,
    "transistors": 2.2,
    "power": 22,
    "color": "#a855f7",
    "stats": {
      "gfx": 14,
      "mt": 5,
      "ai": 3
    },
    "desc": "GPU'nun temel hesap bloğu. Yüzlerce basit çekirdek barındırır; paralel iş yüklerinin motoru."
  },
  {
    "id": "tensor",
    "name": "Matris / Tensor Birimi",
    "group": "Hesap",
    "types": [
      "GPU",
      "AI",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.9,
    "power": 7,
    "color": "#f472b6",
    "stats": {
      "ai": 26
    },
    "desc": "Matris çarpımı için özelleşmiş birim. Sinir ağlarında genel amaçlı çekirdeklerden onlarca kat verimli."
  },
  {
    "id": "rt",
    "name": "Işın İzleme Birimi",
    "group": "Hesap",
    "types": [
      "GPU"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.6,
    "power": 5,
    "color": "#fb923c",
    "stats": {
      "rt": 12,
      "gfx": 1
    },
    "desc": "Işın-üçgen kesişim hesabını donanımda yapar. Yazılımla yapıldığında çok daha yavaştır."
  },
  {
    "id": "rop",
    "name": "Raster / ROP Birimi",
    "group": "Hesap",
    "types": [
      "GPU"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.35,
    "power": 3,
    "color": "#c084fc",
    "stats": {
      "gfx": 6
    },
    "desc": "Üçgenleri piksellere çevirir ve son karıştırma işlemini yapar. Yüksek çözünürlükte darboğaz olabilir."
  },
  {
    "id": "tmu",
    "name": "Doku Birimi (TMU)",
    "group": "Hesap",
    "types": [
      "GPU"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.3,
    "power": 2.5,
    "color": "#d8b4fe",
    "stats": {
      "gfx": 5
    },
    "desc": "Dokuları örnekler ve filtreler. Doku çözünürlüğü arttıkça yükü hızla büyür."
  },
  {
    "id": "geometry",
    "name": "Geometri Motoru",
    "group": "Hesap",
    "types": [
      "GPU"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.5,
    "power": 4,
    "color": "#9333ea",
    "stats": {
      "gfx": 7
    },
    "desc": "Köşe işleme ve tessellation. Sahnedeki üçgen sayısı arttıkça belirleyici hâle gelir."
  },
  {
    "id": "npu",
    "name": "NPU",
    "group": "Hesap",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 2,
    "h": 2,
    "transistors": 1.3,
    "power": 5,
    "color": "#e879f9",
    "stats": {
      "ai": 22
    },
    "desc": "Düşük güçte sürekli çalışan AI motoru. GPU'dan yavaş ama watt başına çok daha verimli."
  },
  {
    "id": "igpu",
    "name": "Entegre GPU",
    "group": "Hesap",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 3,
    "h": 2,
    "transistors": 2.2,
    "power": 14,
    "color": "#8b5cf6",
    "stats": {
      "gfx": 12,
      "ai": 2
    },
    "desc": "CPU die'ına gömülü grafik bloğu. Harici kart gerektirmez; dizüstülerde neredeyse zorunlu."
  },
  {
    "id": "simd",
    "name": "Vektör / AMX Birimi",
    "group": "Hesap",
    "types": [
      "CPU",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.5,
    "power": 4,
    "color": "#7dd3fc",
    "stats": {
      "mt": 4,
      "ai": 9
    },
    "desc": "AVX-512 / AMX gibi geniş vektör ve matris uzantıları. CPU üzerinde AI çıkarımını mümkün kılar."
  },
  {
    "id": "fp64",
    "name": "FP64 Birimi",
    "group": "Hesap",
    "types": [
      "GPU",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.6,
    "power": 6,
    "color": "#67e8f9",
    "stats": {
      "mt": 6
    },
    "desc": "Çift hassasiyetli hesap birimi. Bilimsel simülasyon için şart, AI için gereksiz — B300 bunu bilinçli kırpmıştı."
  },
  {
    "id": "dsp",
    "name": "DSP Bloğu",
    "group": "Hesap",
    "types": [
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.3,
    "power": 1.5,
    "color": "#5eead4",
    "stats": {
      "ai": 5,
      "platform": 4
    },
    "desc": "Sinyal işleme birimi. Ses, sensör ve kamera akışlarını CPU'yu uyandırmadan işler."
  },
  {
    "id": "l1",
    "name": "L1 Cache",
    "group": "Bellek",
    "types": [
      "CPU",
      "SOC",
      "GPU",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.2,
    "power": 0.3,
    "color": "#fde047",
    "stats": {
      "cache": 3
    },
    "desc": "Çekirdeğin hemen yanındaki en hızlı bellek. Çok küçük ama erişimi neredeyse bedava."
  },
  {
    "id": "l2",
    "name": "L2 Cache",
    "group": "Bellek",
    "types": [
      "CPU",
      "SOC",
      "GPU",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.35,
    "power": 0.4,
    "color": "#f59e0b",
    "stats": {
      "cache": 4
    },
    "desc": "Çekirdeğe özel orta katman. L1 ile L3 arasındaki köprü."
  },
  {
    "id": "l3",
    "name": "L3 Cache",
    "group": "Bellek",
    "types": [
      "CPU",
      "SOC",
      "GPU",
      "AI"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.8,
    "power": 0.8,
    "color": "#eab308",
    "stats": {
      "cache": 8
    },
    "desc": "Çekirdekler arası paylaşımlı büyük önbellek. RAM'e gitme ihtiyacını azaltır."
  },
  {
    "id": "llc",
    "name": "Son Seviye / Infinity Cache",
    "group": "Bellek",
    "types": [
      "CPU",
      "GPU",
      "AI"
    ],
    "w": 2,
    "h": 2,
    "transistors": 1.8,
    "power": 1.6,
    "color": "#ca8a04",
    "stats": {
      "cache": 18,
      "mem": 50
    },
    "desc": "Çok büyük son seviye önbellek. Dar bellek arayüzünü telafi eder — RDNA'nın Infinity Cache'i gibi."
  },
  {
    "id": "v-cache",
    "name": "3D V-Cache Katmanı",
    "group": "Bellek",
    "types": [
      "CPU"
    ],
    "w": 2,
    "h": 1,
    "transistors": 2,
    "power": 1.4,
    "color": "#facc15",
    "stats": {
      "cache": 20
    },
    "desc": "Dikey istiflenen ek SRAM. Aynı taban alanına kat kat fazla cache sığdırır — ama ısı çıkarmayı zorlaştırır.",
    "stacked": true
  },
  {
    "id": "scratchpad",
    "name": "Paylaşımlı Bellek (Scratchpad)",
    "group": "Bellek",
    "types": [
      "GPU",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.3,
    "power": 0.4,
    "color": "#fbbf24",
    "stats": {
      "cache": 5,
      "ai": 3
    },
    "desc": "Yazılımın doğrudan yönettiği hızlı SRAM. Tensor birimlerinin veri beklemesini azaltır."
  },
  {
    "id": "mem-ctrl",
    "name": "Bellek Denetleyicisi (DDR/LPDDR)",
    "group": "Bellek",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.3,
    "power": 3.5,
    "color": "#34d399",
    "stats": {
      "mem": 60
    },
    "desc": "Sistem belleğini süren blok. Olmadan chip RAM'e hiç erişemez.",
    "essential": true
  },
  {
    "id": "mem-ctrl-g",
    "name": "Bellek Denetleyicisi (GDDR)",
    "group": "Bellek",
    "types": [
      "GPU"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.25,
    "power": 4,
    "color": "#10b981",
    "stats": {
      "mem": 110
    },
    "desc": "64-bit GDDR kanalı sürer. Dört tane = 256-bit arayüz.",
    "essential": true
  },
  {
    "id": "hbm",
    "name": "Bellek: HBM Yığını + PHY",
    "group": "Bellek",
    "types": [
      "AI",
      "GPU"
    ],
    "w": 1,
    "h": 3,
    "transistors": 1,
    "power": 14,
    "color": "#2dd4bf",
    "stats": {
      "mem": 900,
      "cache": 2
    },
    "desc": "Dikey istiflenmiş bellek. Arayüzü çok geniş olduğu için bant genişliği devasa; ama pahalı ve çok ısınır.",
    "essential": true
  },
  {
    "id": "mem-enc",
    "name": "Bellek Şifreleme Motoru",
    "group": "Bellek",
    "types": [
      "CPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.15,
    "power": 1,
    "color": "#059669",
    "stats": {
      "platform": 6
    },
    "desc": "RAM'e giden veriyi şifreler. Sanallaştırma ve gizli hesaplama (confidential computing) için gerekir."
  },
  {
    "id": "io",
    "name": "PCIe / I/O",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.25,
    "power": 3,
    "color": "#94a3b8",
    "stats": {
      "io": 4
    },
    "desc": "Ana bilgisayarla ve çevre birimlerle bağlantı. Olmadan chip dış dünyaya bağlanamaz.",
    "essential": true
  },
  {
    "id": "fabric",
    "name": "Yüksek Hızlı Bağlantı",
    "group": "Bağlantı",
    "types": [
      "AI",
      "GPU"
    ],
    "w": 1,
    "h": 2,
    "transistors": 0.4,
    "power": 9,
    "color": "#64748b",
    "stats": {
      "io": 10,
      "mem": 40
    },
    "desc": "Çoklu GPU sistemlerinde chip'ler arası bağlantı (NVLink / Infinity Fabric benzeri)."
  },
  {
    "id": "d2d",
    "name": "Die-to-Die Köprüsü",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 2,
    "transistors": 0.35,
    "power": 5,
    "color": "#475569",
    "stats": {
      "io": 6,
      "mem": 60
    },
    "desc": "Chiplet'leri birbirine bağlar. Aynı die içinde veri taşımak bedava, die'lar arasında değil."
  },
  {
    "id": "display",
    "name": "Ekran Motoru",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "GPU",
      "SOC"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.25,
    "power": 2,
    "color": "#cbd5e1",
    "stats": {
      "gfx": 2,
      "platform": 9
    },
    "desc": "DisplayPort / HDMI çıkışlarını sürer. Olmadan chip görüntü veremez — bir oyun GPU'sunda neredeyse zorunlu."
  },
  {
    "id": "media",
    "name": "Medya Motoru",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "GPU",
      "SOC"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.3,
    "power": 2,
    "color": "#e2e8f0",
    "stats": {
      "gfx": 1,
      "platform": 5
    },
    "desc": "AV1/H.265 donanım kodlayıcı ve çözücü. Video düzenleme, yayın ve pil dostu video oynatma."
  },
  {
    "id": "isp",
    "name": "Görüntü İşlemci (ISP)",
    "group": "Bağlantı",
    "types": [
      "SOC"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.4,
    "power": 2.5,
    "color": "#a5b4fc",
    "stats": {
      "platform": 8,
      "ai": 2
    },
    "desc": "Kamera sensöründen gelen ham veriyi görüntüye çevirir. Telefon fotoğraf kalitesinin asıl belirleyicisi."
  },
  {
    "id": "usb",
    "name": "USB / Thunderbolt",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.2,
    "power": 2,
    "color": "#818cf8",
    "stats": {
      "io": 3,
      "platform": 5
    },
    "desc": "Harici cihaz bağlantısı. Thunderbolt aynı kabloda PCIe ve görüntü taşır."
  },
  {
    "id": "nic",
    "name": "Ağ Arayüzü (NIC)",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "AI"
    ],
    "w": 1,
    "h": 2,
    "transistors": 0.35,
    "power": 4,
    "color": "#6366f1",
    "stats": {
      "io": 6,
      "platform": 6
    },
    "desc": "Ethernet denetleyicisi. Veri merkezinde düğümler arası iletişimin temeli."
  },
  {
    "id": "storage",
    "name": "Depolama Denetleyicisi",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.2,
    "power": 1.5,
    "color": "#a78bfa",
    "stats": {
      "io": 2,
      "platform": 5
    },
    "desc": "NVMe / UFS arayüzü. SSD'ye doğrudan bağlantı sağlar."
  },
  {
    "id": "modem",
    "name": "5G Modem",
    "group": "Bağlantı",
    "types": [
      "SOC"
    ],
    "w": 2,
    "h": 2,
    "transistors": 1,
    "power": 4,
    "color": "#f0abfc",
    "stats": {
      "platform": 12
    },
    "desc": "Hücresel bağlantı. Çok yer kaplar ve lisans maliyeti yüksektir — bu yüzden bazı SoC'lerde ayrı chip olarak durur."
  },
  {
    "id": "wireless",
    "name": "Wi-Fi / Bluetooth",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.25,
    "power": 1.2,
    "color": "#c4b5fd",
    "stats": {
      "platform": 7
    },
    "desc": "Kablosuz bağlantı bloğu. Analog devre ağırlıklı olduğu için küçültmeden pek fayda görmez."
  },
  {
    "id": "audio",
    "name": "Ses DSP",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "SOC"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.15,
    "power": 0.5,
    "color": "#ddd6fe",
    "stats": {
      "platform": 5
    },
    "desc": "Ses işleme ve gürültü engelleme. Düşük güçte sürekli çalışır, CPU'yu uyandırmaz."
  },
  {
    "id": "pll",
    "name": "Saat Üreteci (PLL)",
    "group": "Altyapı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.05,
    "power": 1,
    "color": "#fca5a5",
    "stats": {
      "platform": 12
    },
    "desc": "Chip'in kalp atışını üretir. Her senkron devre bir saat sinyaline ihtiyaç duyar — bu blok olmadan hiçbir şey çalışmaz."
  },
  {
    "id": "pmic",
    "name": "Güç Dağıtımı (IVR)",
    "group": "Altyapı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 2,
    "transistors": 0.1,
    "power": 2,
    "color": "#f87171",
    "stats": {
      "platform": 14
    },
    "desc": "Voltaj regülasyonu ve güç dağıtımı. DVFS'in donanım tarafı: hangi bloğa ne kadar voltaj gideceğini yönetir."
  },
  {
    "id": "thermal",
    "name": "Termal Sensör Dizisi",
    "group": "Altyapı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.02,
    "power": 0.2,
    "color": "#fdba74",
    "stats": {
      "platform": 7
    },
    "desc": "Die üzerine dağılmış sıcaklık sensörleri. Sıcak noktaları tespit edip termal kısıtlamayı tetikler."
  },
  {
    "id": "security",
    "name": "Güvenlik Bölgesi",
    "group": "Altyapı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.25,
    "power": 1,
    "color": "#fb7185",
    "stats": {
      "platform": 9
    },
    "desc": "İzole güvenli işlemci. Anahtarları saklar, güvenli önyüklemeyi doğrular; ana CPU ele geçse bile ayrı kalır."
  },
  {
    "id": "dft",
    "name": "Test Mantığı (DFT)",
    "group": "Altyapı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 1,
    "h": 1,
    "transistors": 0.08,
    "power": 0.3,
    "color": "#fecaca",
    "stats": {
      "platform": 6
    },
    "desc": "Scan chain ve JTAG. Üretimden çıkan her die'ın test edilmesini sağlar — binning bu blok sayesinde mümkün."
  },
  {
    "id": "pad",
    "name": "Pad Ring / Bağlantı Alanı",
    "group": "Bağlantı",
    "types": [
      "CPU",
      "GPU",
      "SOC",
      "AI"
    ],
    "w": 2,
    "h": 1,
    "transistors": 0.05,
    "power": 0.5,
    "color": "#fee2e2",
    "stats": {
      "io": 2,
      "platform": 6
    },
    "desc": "Die'ın dış dünyaya fiziksel temas noktaları. Küçültmeyle daralmaz — bazı chip'lerde alanı pad sayısı belirler."
  }
];

export const GRID_COLS = 16;
export const GRID_ROWS = 12;

export const CHIP_TYPES = [
  { id: "CPU", name: "İşlemci (CPU)", short: "CPU", color: "#22d3ee",
    powerBudget: 150, areaTarget: 260,
    weights: { st: 0.3, mt: 0.22, cache: 0.14, mem: 0.11, gfx: 0.04, ai: 0.03, platform: 0.08, efficiency: 0.08 },
    norms: { st: 14, mt: 110, gfx: 30, rt: 20, ai: 45, cache: 80, mem: 260, io: 10, platform: 55 } },
  { id: "GPU", name: "Ekran Kartı (GPU)", short: "GPU", color: "#a855f7",
    powerBudget: 400, areaTarget: 620,
    weights: { gfx: 0.32, rt: 0.14, mem: 0.2, cache: 0.09, ai: 0.07, io: 0.03, platform: 0.07, st: 0, mt: 0, efficiency: 0.08 },
    norms: { st: 14, mt: 60, gfx: 300, rt: 110, ai: 120, cache: 70, mem: 1600, io: 14, platform: 45 } },
  { id: "SOC", name: "Mobil SoC", short: "SoC", color: "#34d399",
    powerBudget: 45, areaTarget: 160,
    weights: { st: 0.17, mt: 0.12, gfx: 0.16, ai: 0.16, mem: 0.09, cache: 0.05, platform: 0.13, efficiency: 0.12 },
    norms: { st: 14, mt: 60, gfx: 45, rt: 20, ai: 60, cache: 40, mem: 280, io: 8, platform: 70 } },
  { id: "AI", name: "AI Hızlandırıcı", short: "AI", color: "#f472b6",
    powerBudget: 1000, areaTarget: 850,
    weights: { ai: 0.34, mem: 0.27, cache: 0.09, gfx: 0.05, io: 0.06, platform: 0.08, st: 0, mt: 0, efficiency: 0.11 },
    norms: { st: 14, mt: 60, gfx: 120, rt: 20, ai: 700, cache: 70, mem: 6000, io: 24, platform: 45 } },
];

export const NODES = [
  { id: "7nm", name: "7nm sınıfı", cellArea: 5.5, powerMul: 1.45, clockMul: 0.88, waferCost: 10000, defectDensity: 0.06,
    note: "Olgun ve ucuz. Yoğunluğu düşük ama verimi yüksek." },
  { id: "5nm", name: "5nm sınıfı", cellArea: 4.0, powerMul: 1.15, clockMul: 0.95, waferCost: 17000, defectDensity: 0.08,
    note: "Dengeli seçim. Bugünün çoğu ürünü bu sınıfta." },
  { id: "3nm", name: "3nm sınıfı", cellArea: 2.9, powerMul: 1.0, clockMul: 1.0, waferCost: 25000, defectDensity: 0.11,
    note: "Yüksek yoğunluk, yüksek maliyet. Amiral gemisi ürünler." },
  { id: "2nm", name: "2nm sınıfı", cellArea: 2.1, powerMul: 0.88, clockMul: 1.04, waferCost: 34000, defectDensity: 0.15,
    note: "En yeni ve en pahalı. Watt başına performans en iyi burada." },
];

export function getChipType(id) { return CHIP_TYPES.find((t) => t.id === id); }
export function getNode(id) { return NODES.find((n) => n.id === id) || NODES[1]; }
export function getBlock(id) { return BLOCKS.find((b) => b.id === id); }
export function blocksForType(typeId) { return BLOCKS.filter((b) => b.types.includes(typeId)); }
