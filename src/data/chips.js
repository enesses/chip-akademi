export const chips = [
  {
    "id": "nvidia-blackwell-ultra-b300",
    "name": "NVIDIA Blackwell Ultra B300",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC 4NP (4nm sınıfı)",
    "transistor_count": "208 milyar (çift die)",
    "die_size": "~1600 mm² (toplam çift die)",
    "image": "blackwell-b200.png",
    "image_credit": "Temsilî görsel — Blackwell ailesi",
    "key_specs": {
      "architecture": "Blackwell Ultra (iki reticle boyutlu die, NV-HBI ile bağlı)",
      "cuda_cores": 20480,
      "compute_units": "160 SM (SM başına 128 CUDA core)",
      "tensor_cores": "5. nesil (NVFP4, FP6, FP8)",
      "vram": "288 GB HBM3E (8 adet 12-Hi yığın)",
      "memory_bandwidth": "8 TB/s",
      "memory_interface": "8192-bit (16 × 512-bit denetleyici)",
      "fp4_tflops": "15 PFLOPS (yoğun NVFP4)",
      "fp64_tflops": "~1.2 TFLOPS (kasıtlı olarak düşürüldü)",
      "l2_cache": "40 MB Tensor Memory (SM başına 256 KB TMEM)",
      "nvlink": "NVLink 5.0, 1.8 TB/s çift yönlü",
      "pcie": "PCIe 6.0 x16 (256 GB/s)",
      "tdp": "1400W (GB300 yapılandırması)",
      "form_factor": "SXM / GB300 modülü"
    },
    "architecture_highlights": [
      "B200'ün 8 katmanlı HBM3E yığınları 12 katmanlıya çıkarıldı: 192 GB → 288 GB. Bant genişliği aynı kaldı (8 TB/s), değişen tek şey kapasite — bu da çıkarımda kritik",
      "SM sayısı 144'ten 160'a çıktı; toplam 20.480 CUDA core. Transistör sayısı B200 ile aynı (208 milyar), yani kazanç mimari düzenlemeden geliyor",
      "NVFP4: FP8 (E4M3) mikro-blok ölçekleme ile 16 değerlik bloklar + FP32 tensor ölçekleme. FP8'e yakın doğruluk, ~1.8x daha az depolama",
      "Her SM'de 256 KB Tensor Memory (TMEM), GPU başına toplam 40 MB — tensor çekirdeklerinin veri beklemesini azaltıyor",
      "PCIe 5.0 → 6.0 geçişi ana bilgisayar bant genişliğini 128 GB/s'den 256 GB/s'ye çıkarıyor",
      "FP64 performansı bilinçli olarak kırpıldı (B200'de 37 TFLOPS → B300'de ~1.2 TFLOPS): bu chip HPC değil, saf AI çıkarımı için optimize edildi"
    ],
    "die_regions": [
      {
        "name": "GPC/SM Kümeleri (Die 1)",
        "description": "80 SM barındıran ilk die; CUDA core'lar, 5. nesil Tensor Core'lar ve TMEM burada",
        "position": {
          "x_pct": 5,
          "y_pct": 10,
          "width_pct": 43,
          "height_pct": 48
        }
      },
      {
        "name": "GPC/SM Kümeleri (Die 2)",
        "description": "İkinci 80 SM'lik die; yazılım açısından tek GPU olarak görünür",
        "position": {
          "x_pct": 52,
          "y_pct": 10,
          "width_pct": 43,
          "height_pct": 48
        }
      },
      {
        "name": "NV-HBI Die-to-Die Köprüsü",
        "description": "İki die'ı 10 TB/s ile bağlayan bağlantı; bu sayede işletim sistemi tek bir GPU görür",
        "position": {
          "x_pct": 46,
          "y_pct": 18,
          "width_pct": 8,
          "height_pct": 32
        }
      },
      {
        "name": "HBM3E 12-Hi Yığınları (x8)",
        "description": "Her biri 36 GB olan 8 yığın; 12 katmanlı istifleme ile toplam 288 GB",
        "position": {
          "x_pct": 4,
          "y_pct": 62,
          "width_pct": 92,
          "height_pct": 20
        }
      },
      {
        "name": "Bellek Denetleyicileri (16 × 512-bit)",
        "description": "8192-bit toplam arayüzü süren denetleyiciler; 8 TB/s'lik akışı yönetir",
        "position": {
          "x_pct": 4,
          "y_pct": 56,
          "width_pct": 92,
          "height_pct": 6
        }
      },
      {
        "name": "NVLink 5.0 / PCIe 6.0 PHY",
        "description": "GPU-GPU ve GPU-CPU haberleşmesinin fiziksel katmanı; chip kenarında konumlanır",
        "position": {
          "x_pct": 0,
          "y_pct": 84,
          "width_pct": 100,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "Çok büyük dil modellerinin tek GPU'da çıkarımı: 288 GB sayesinde 400B+ parametreli modeller FP4'te tek karta sığar",
      "Uzun bağlam (long-context) çıkarımı: büyük KV cache'leri bellekte tutarak sharding maliyetini ortadan kaldırır",
      "Akıl yürüten (reasoning) modellerin servis edilmesi — Hopper nesline göre kat kat yüksek token verimi",
      "GB300 NVL72 raf ölçekli sistemler: 72 GPU'luk tek NVLink alanı ile exascale seviyesinde FP4 hesap"
    ],
    "comparison_notes": "B200'e göre bellek %50 arttı (192 → 288 GB), yoğun FP4 hesabı yaklaşık 1.5 katına çıktı ve PCIe Gen6'ya geçildi. Buna karşılık güç bütçesi 1000W'tan 1400W'a yükseldi ve FP64 performansı neredeyse tamamen feda edildi. Yani B300 bir 'daha hızlı B200' değil, çıkarıma göre yeniden dengelenmiş bir türev.",
    "is_announced": true,
    "rumored": null,
    "tagline": "288 GB'lık bellek devi — çıkarım için yeniden dengelenmiş Blackwell"
  },
  {
    "id": "nvidia-blackwell-rtx-5080",
    "name": "NVIDIA GeForce RTX 5080",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC 4N (özel 4nm)",
    "transistor_count": "45.6 milyar (GB203)",
    "die_size": "378 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — GeForce RTX 50 serisi",
    "key_specs": {
      "architecture": "Blackwell (GB203)",
      "cuda_cores": 10752,
      "compute_units": "84 SM",
      "tensor_cores": "336 adet (5. nesil)",
      "ray_tracing_cores": "84 adet (4. nesil)",
      "vram": "16 GB GDDR7",
      "vram_speed": "30 Gbps",
      "memory_interface": "256-bit",
      "memory_bandwidth": "960 GB/s",
      "boost_clock": "2617 MHz",
      "l2_cache": "64 MB",
      "tdp": "360W",
      "pcie": "PCIe 5.0 x16"
    },
    "architecture_highlights": [
      "GB203 die'ı RTX 5090'ın GB202'sinin yarısı kadar: 378 mm²'ye karşılık 750 mm², 45.6 milyara karşılık 92.2 milyar transistör",
      "30 Gbps GDDR7 ile 256-bit arayüzden 960 GB/s çekiyor — RTX 4080 Super'ın 736 GB/s'sine göre %30 artış",
      "DLSS 4 Multi Frame Generation desteği: 5. nesil Tensor Core'lar sayesinde tek gerçek kareden 3'e kadar yapay kare",
      "4. nesil RT Core'lar ile Mega Geometry desteği; sahnedeki üçgen sayısı arttıkça avantaj büyüyor",
      "64 MB L2 cache, bellek arayüzü darlığını kısmen telafi eden büyük bir tampon görevi görüyor",
      "360W TDP ile RTX 5090'ın 575W'ından çok daha ılımlı — tek 12V-2x6 konnektörü yeterli"
    ],
    "die_regions": [
      {
        "name": "GPC Kümeleri / SM'ler",
        "description": "84 SM ve 10.752 CUDA core; die alanının büyük kısmını kaplayan hesap bölgesi",
        "position": {
          "x_pct": 6,
          "y_pct": 6,
          "width_pct": 62,
          "height_pct": 68
        }
      },
      {
        "name": "L2 Cache (64 MB)",
        "description": "Bellek gecikmesini gizleyen büyük önbellek; SM kümeleri arasına dağıtılmış",
        "position": {
          "x_pct": 70,
          "y_pct": 6,
          "width_pct": 24,
          "height_pct": 38
        }
      },
      {
        "name": "GDDR7 Bellek Denetleyicileri",
        "description": "4 adet 64-bit kanal, toplam 256-bit; 30 Gbps PAM3 sinyalleşmesini sürer",
        "position": {
          "x_pct": 6,
          "y_pct": 78,
          "width_pct": 88,
          "height_pct": 12
        }
      },
      {
        "name": "Video Encode/Decode (NVENC/NVDEC)",
        "description": "AV1, H.265 ve H.264 donanım kodlayıcı/çözücüleri — yayın ve video düzenleme için",
        "position": {
          "x_pct": 70,
          "y_pct": 48,
          "width_pct": 24,
          "height_pct": 22
        }
      },
      {
        "name": "PCIe 5.0 PHY ve Görüntü Motoru",
        "description": "Ana bilgisayar bağlantısı ve DisplayPort 2.1b çıkış denetleyicileri",
        "position": {
          "x_pct": 0,
          "y_pct": 91,
          "width_pct": 100,
          "height_pct": 9
        }
      }
    ],
    "use_cases": [
      "4K oyun: DLSS 4 ile yüksek yenileme hızında ray tracing açık oynanış",
      "İçerik üretimi: AV1 donanım kodlama ile hızlı video render ve yayın",
      "Yerel AI çalıştırma: 16 GB VRAM orta boy dil modelleri ve görüntü üretimi için yeterli",
      "VR ve yüksek çözünürlüklü çoklu monitör kurulumları"
    ],
    "comparison_notes": "RTX 4080 Super'a göre bellek bant genişliği %30 arttı ve DLSS 4 kare üretimi eklendi; ham raster performansı ise çok daha ölçülü bir artış gösteriyor (yaklaşık %10-15). Asıl fark yapay zekâ destekli kare üretiminde ortaya çıkıyor. RTX 5090 ile arasındaki uçurum ise büyük: yarı yarıya CUDA core ve yarı bellek bant genişliği.",
    "is_announced": true,
    "rumored": null,
    "tagline": "RTX 50 serisinin dengeli amiral gemisi — 5090'ın yarısı, üçte iki fiyatına"
  },
  {
    "id": "nvidia-hopper-h200",
    "name": "NVIDIA Hopper H200",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC 4N (özel 4nm)",
    "transistor_count": "80 milyar (GH100)",
    "die_size": "814 mm²",
    "image": "h100.png",
    "image_credit": "Temsilî görsel — Hopper ailesi",
    "key_specs": {
      "architecture": "Hopper (GH100 — H100 ile aynı die)",
      "cuda_cores": 16896,
      "compute_units": "132 SM",
      "tensor_cores": "528 adet (4. nesil)",
      "vram": "141 GB HBM3E",
      "memory_bandwidth": "4.8 TB/s",
      "memory_interface": "6144-bit",
      "fp8_tflops": "~3958 TFLOPS (seyrek)",
      "fp16_tflops": "~1979 TFLOPS (seyrek)",
      "fp64_tflops": "34 TFLOPS (Tensor Core)",
      "l2_cache": "50 MB",
      "nvlink": "NVLink 4.0, 900 GB/s",
      "tdp": "700W (SXM)",
      "form_factor": "SXM5 / HGX H200"
    },
    "architecture_highlights": [
      "H100 ile birebir aynı GH100 die'ını kullanır — değişen tek şey bellek: HBM3 yerine HBM3E, 80 GB yerine 141 GB",
      "Bant genişliği 3.35 TB/s'den 4.8 TB/s'ye çıktı (%43 artış); hesap gücü ise aynı kaldı",
      "Bu, 'aynı silikon + daha iyi bellek' stratejisinin ders kitabı örneği: çıkarım bellek sınırlı bir iş yükü olduğu için kazanç büyük",
      "Transformer Engine ve FP8 desteği Hopper nesliyle geldi; Blackwell'deki FP4'ün öncülü",
      "Thread Block Cluster ve Distributed Shared Memory: SM'ler arası doğrudan veri paylaşımına izin verir",
      "141 GB kapasite, 70B parametreli bir modelin FP16'da tek GPU'ya sığması anlamına gelir"
    ],
    "die_regions": [
      {
        "name": "GPC/SM Kümeleri",
        "description": "132 SM, 16.896 CUDA core ve 528 Tensor Core'un bulunduğu ana hesap alanı",
        "position": {
          "x_pct": 8,
          "y_pct": 8,
          "width_pct": 84,
          "height_pct": 46
        }
      },
      {
        "name": "L2 Cache (50 MB)",
        "description": "İki parçaya bölünmüş büyük önbellek; SM'ler ile HBM arasındaki tampon",
        "position": {
          "x_pct": 8,
          "y_pct": 54,
          "width_pct": 84,
          "height_pct": 8
        }
      },
      {
        "name": "HBM3E Yığınları (x6)",
        "description": "6 adet HBM3E yığını, toplam 141 GB ve 4.8 TB/s bant genişliği",
        "position": {
          "x_pct": 4,
          "y_pct": 64,
          "width_pct": 92,
          "height_pct": 20
        }
      },
      {
        "name": "NVLink 4.0 Arabirimi",
        "description": "900 GB/s GPU-GPU bağlantısı; NVSwitch üzerinden 256 GPU'ya kadar ölçeklenir",
        "position": {
          "x_pct": 4,
          "y_pct": 86,
          "width_pct": 92,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Orta ve büyük ölçekli LLM çıkarımı: 141 GB ile 70B parametreli modeller tek GPU'da",
      "Bilimsel hesaplama ve HPC: 34 TFLOPS FP64 ile Blackwell'in aksine hâlâ güçlü çift hassasiyet",
      "AI eğitimi: Transformer Engine ve FP8 ile büyük ölçekli eğitim işleri",
      "Bulut sağlayıcılarında en yaygın kiralanabilir AI hızlandırıcılardan biri"
    ],
    "comparison_notes": "H100'e göre hesap gücü aynı, bellek %76 daha fazla ve %43 daha hızlı. Bellek sınırlı çıkarım işlerinde ~1.4-1.9x hızlanma sağlar, hesap sınırlı eğitimde ise fark çok küçüktür. B200 ile karşılaştırıldığında hesapta geride kalır ama FP64 gerektiren HPC işlerinde hâlâ B300'den çok daha uygundur.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Aynı die, daha iyi bellek — çıkarımda H100'ü ikiye katlayan ara nesil"
  },
  {
    "id": "amd-cdna4-instinct-mi355x",
    "name": "AMD Instinct MI355X (CDNA 4)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N3P (hesap die'ları) + N6 (I/O die'ları)",
    "transistor_count": "185 milyar (8 XCD + 2 IOD)",
    "die_size": "Çoklu die paketi (chiplet)",
    "image": "mi300x.png",
    "image_credit": "Temsilî görsel — Instinct ailesi",
    "key_specs": {
      "architecture": "CDNA 4 (8 Accelerator Complex Die + 2 I/O Die)",
      "compute_units": "256 CU (XCD başına 32)",
      "stream_processors": 16384,
      "tensor_cores": "1024 Matrix Core",
      "vram": "288 GB HBM3E (8 × 12-Hi yığın)",
      "memory_bandwidth": "8 TB/s",
      "memory_interface": "8192-bit",
      "boost_clock": "2400 MHz",
      "fp4_tflops": "~10.1 PFLOPS (MXFP4, seyrek)",
      "fp8_tflops": "~10.1 PFLOPS (seyrek)",
      "fp16_tflops": "~5.0 PFLOPS (seyrek)",
      "fp32_tflops": "157.3 TFLOPS (vektör)",
      "fp64_tflops": "78.6 TFLOPS (vektör)",
      "pcie": "PCIe 5.0 x16",
      "tdp": "1400W (sıvı soğutmalı)",
      "form_factor": "OAM (OCP Accelerator Module)"
    },
    "architecture_highlights": [
      "8 adet hesap die'ı (XCD) TSMC N3P'de, 2 adet I/O die'ı N6'da üretiliyor — farklı süreç düğümlerini tek pakette birleştiren tipik chiplet yaklaşımı",
      "CDNA 4 ile Matrix Core motorları elden geçirildi: MXFP4, MXFP6 ve MXFP8 mikro-ölçekleme formatları donanımda destekleniyor",
      "288 GB HBM3E kapasitesi NVIDIA B300 ile aynı; AMD'nin geleneksel bellek kapasitesi avantajı bu nesilde eşitlendi",
      "78.6 TFLOPS FP64 ile NVIDIA'nın çıkarıma odaklanan B300'ünün aksine bilimsel hesaplama gücünü koruyor",
      "MI350X ile aynı silikon; fark sadece soğutma ve saat hızı — MI355X sıvı soğutmayla 1400W'ta 2.4 GHz'e çıkıyor, MI350X hava soğutmayla 1000W'ta 2.2 GHz",
      "4. nesil Infinity Fabric ile 7 bağlantı, her biri 153 GB/s"
    ],
    "die_regions": [
      {
        "name": "Accelerator Complex Die'lar (8 × XCD)",
        "description": "TSMC N3P'de üretilen hesap chiplet'leri; her birinde 32 CU, toplam 256 CU",
        "position": {
          "x_pct": 22,
          "y_pct": 12,
          "width_pct": 56,
          "height_pct": 46
        }
      },
      {
        "name": "I/O Die'lar (2 × IOD)",
        "description": "TSMC N6'da üretilen taban die'lar; bellek denetleyicileri ve Infinity Cache burada",
        "position": {
          "x_pct": 18,
          "y_pct": 58,
          "width_pct": 64,
          "height_pct": 12
        }
      },
      {
        "name": "HBM3E Yığınları (x8)",
        "description": "12 katmanlı yığınlar; toplam 288 GB, 8 TB/s bant genişliği",
        "position": {
          "x_pct": 4,
          "y_pct": 12,
          "width_pct": 14,
          "height_pct": 58
        }
      },
      {
        "name": "HBM3E Yığınları (karşı taraf)",
        "description": "Paketin diğer kenarındaki yığınlar; simetrik yerleşim ısı dağılımını dengeler",
        "position": {
          "x_pct": 82,
          "y_pct": 12,
          "width_pct": 14,
          "height_pct": 58
        }
      },
      {
        "name": "Infinity Fabric Bağlantıları",
        "description": "GPU'lar arası 7 bağlantı, her biri 153 GB/s; çok GPU'lu düğümlerde ölçeklenme sağlar",
        "position": {
          "x_pct": 4,
          "y_pct": 74,
          "width_pct": 92,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Büyük dil modeli eğitimi: 288 GB ile 400B parametreye kadar minimum bölümlemeyle",
      "Karma AI + HPC iş yükleri: yüksek FP64 sayesinde iklim, CFD ve fizik simülasyonları",
      "Bulut ölçeğinde çıkarım: Oracle Cloud gibi sağlayıcılarda on binlerce GPU'luk kümeler",
      "ROCm tabanlı açık kaynak AI altyapısı kurmak isteyen kuruluşlar"
    ],
    "comparison_notes": "MI300X'e göre bellek 192 GB'dan 288 GB'a, bant genişliği 5.3 TB/s'den 8 TB/s'ye çıktı ve FP4/FP6 desteği eklendi. NVIDIA B200'ün doğrudan rakibi olarak konumlandırılıyor: bellek kapasitesi ve bant genişliği eşit, FP64'te AMD açık ara önde, yazılım ekosisteminde (CUDA vs ROCm) ise NVIDIA hâlâ avantajlı.",
    "is_announced": true,
    "rumored": null,
    "tagline": "8 chiplet, 185 milyar transistör — AMD'nin FP4 çağına cevabı"
  },
  {
    "id": "amd-rdna4-rx-9060xt",
    "name": "AMD Radeon RX 9060 XT (RDNA 4)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N4P (4nm)",
    "transistor_count": "~29.7 milyar (Navi 44)",
    "die_size": "199 mm²",
    "image": "rx-9070xt.png",
    "image_credit": "Temsilî görsel — Radeon RX 9000 serisi",
    "key_specs": {
      "architecture": "RDNA 4 (Navi 44)",
      "compute_units": "32 CU",
      "stream_processors": 2048,
      "ray_tracing_cores": "32 adet (3. nesil Ray Accelerator)",
      "vram": "8 GB veya 16 GB GDDR6",
      "vram_speed": "20 Gbps",
      "memory_interface": "128-bit",
      "memory_bandwidth": "320 GB/s",
      "boost_clock": "3130 MHz",
      "tdp": "160W",
      "pcie": "PCIe 5.0 x16"
    },
    "architecture_highlights": [
      "Navi 44 die'ı sadece 199 mm² — RX 9070 XT'nin Navi 48'inin (357 mm²) yaklaşık yarısı",
      "3.13 GHz boost saat hızı, RDNA 4'ün yüksek frekans odaklı tasarımının sonucu",
      "3. nesil Ray Accelerator'lar RDNA 3'e göre ışın izlemede kayda değer sıçrama sağlıyor",
      "FSR 4 desteği: RDNA 4 ile gelen makine öğrenmesi tabanlı yeniden ölçekleme",
      "8 GB ve 16 GB versiyonları aynı isimle satılıyor — 1440p ve modern oyunlarda bu fark belirleyici olabiliyor",
      "128-bit arayüz dar görünse de Infinity Cache bunu büyük ölçüde telafi ediyor"
    ],
    "die_regions": [
      {
        "name": "Shader Engine'ler / CU'lar",
        "description": "32 hesap birimi ve 2048 stream işlemcisi; die'ın merkez bölgesi",
        "position": {
          "x_pct": 10,
          "y_pct": 10,
          "width_pct": 58,
          "height_pct": 62
        }
      },
      {
        "name": "Infinity Cache",
        "description": "Dar 128-bit bellek arayüzünü telafi eden büyük yonga içi önbellek",
        "position": {
          "x_pct": 70,
          "y_pct": 10,
          "width_pct": 22,
          "height_pct": 34
        }
      },
      {
        "name": "GDDR6 Bellek Denetleyicileri",
        "description": "2 adet 64-bit kanal, toplam 128-bit; 20 Gbps GDDR6'yı sürer",
        "position": {
          "x_pct": 10,
          "y_pct": 76,
          "width_pct": 82,
          "height_pct": 12
        }
      },
      {
        "name": "Medya Motoru ve Görüntü Çıkışı",
        "description": "AV1 kodlama/çözme ve DisplayPort 2.1a denetleyicileri",
        "position": {
          "x_pct": 70,
          "y_pct": 48,
          "width_pct": 22,
          "height_pct": 24
        }
      }
    ],
    "use_cases": [
      "1080p ve 1440p oyun: modern başlıklarda yüksek ayarlarda akıcı performans",
      "Bütçe dostu ışın izleme: RDNA 4'ün RT iyileştirmeleriyle önceki nesle göre çok daha kullanılabilir",
      "Kompakt sistemler: 160W TDP küçük kasalar ve zayıf güç kaynakları için uygun",
      "Video düzenleme ve yayın: AV1 donanım kodlama desteği"
    ],
    "comparison_notes": "RX 9070 XT'ye göre yarı yarıya CU ve yarı bellek bant genişliği sunuyor, buna karşılık güç tüketimi 304W'tan 160W'a düşüyor. Önceki neslin RX 7600 XT'sine kıyasla özellikle ışın izleme ve FSR 4 desteğiyle öne çıkıyor. 8 GB versiyonunu tercih ederken dikkatli olmak gerekir — bazı 2025 sonrası oyunlar 1440p'de bu kapasiteyi zorluyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "199 mm²'de 3.1 GHz — RDNA 4'ün orta segment temsilcisi"
  },
  {
    "id": "amd-zen5-ryzen-7-9800x3d",
    "name": "AMD Ryzen 7 9800X3D (Zen 5 + 3D V-Cache)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N4P (CCD) + N6 (IOD)",
    "transistor_count": "~8.6 milyar (CCD) + IOD",
    "die_size": "70.6 mm² (CCD) + 122 mm² (IOD)",
    "image": "ryzen-9950x.png",
    "image_credit": "Temsilî görsel — Ryzen 9000 serisi",
    "key_specs": {
      "architecture": "Zen 5 + 2. nesil 3D V-Cache",
      "cores": 8,
      "threads": 16,
      "base_clock": "4.7 GHz",
      "boost_clock": "5.2 GHz",
      "l2_cache": "8 MB (çekirdek başına 1 MB)",
      "l3_cache": "96 MB (32 MB + 64 MB 3D V-Cache)",
      "socket": "AM5",
      "tdp": "120W",
      "pcie": "PCIe 5.0, 24 hat",
      "igpu": "2 çekirdekli RDNA 2",
      "memory_speed": "DDR5-5600 (JEDEC)"
    },
    "architecture_highlights": [
      "2. nesil 3D V-Cache'in kilit yeniliği: cache katmanı artık hesap die'ının ÜSTÜNDE değil ALTINDA — bu sayede çekirdekler doğrudan soğutucuya bakıyor",
      "Bu yerleşim değişikliği 7800X3D'de mümkün olmayan tam overclock desteğini getirdi ve saat hızlarını serbest bıraktı",
      "Toplam 96 MB L3 cache: 32 MB temel + 64 MB dikey istiflenmiş SRAM katmanı",
      "Oyunlarda kazanç frekanstan değil cache'ten geliyor: oyun verisi büyük ölçüde L3'e sığdığında RAM'e gitme ihtiyacı ortadan kalkıyor",
      "Aynı iş yükünde 9700X'e göre oyun performansı belirgin şekilde yüksek, üretkenlik işlerinde ise fark çok küçük",
      "TSV (Through-Silicon Via) teknolojisiyle iki die arasında binlerce dikey bağlantı kuruluyor"
    ],
    "die_regions": [
      {
        "name": "Zen 5 Çekirdek Kompleksi (CCD)",
        "description": "8 adet Zen 5 çekirdeği; 3D V-Cache yerleşimi sayesinde doğrudan soğutucuya bakar",
        "position": {
          "x_pct": 12,
          "y_pct": 14,
          "width_pct": 44,
          "height_pct": 42
        }
      },
      {
        "name": "3D V-Cache Katmanı (64 MB)",
        "description": "CCD'nin altına dikey olarak bağlanan ek SRAM; TSV'lerle bağlanır",
        "position": {
          "x_pct": 12,
          "y_pct": 58,
          "width_pct": 44,
          "height_pct": 16
        }
      },
      {
        "name": "Temel L3 Cache (32 MB)",
        "description": "CCD üzerindeki standart L3; 3D katmanla birleşerek 96 MB'a ulaşır",
        "position": {
          "x_pct": 12,
          "y_pct": 8,
          "width_pct": 44,
          "height_pct": 6
        }
      },
      {
        "name": "I/O Die (IOD)",
        "description": "Bellek denetleyicisi, PCIe hatları ve entegre RDNA 2 GPU; N6 sürecinde üretilir",
        "position": {
          "x_pct": 60,
          "y_pct": 14,
          "width_pct": 30,
          "height_pct": 46
        }
      },
      {
        "name": "Infinity Fabric",
        "description": "CCD ile IOD arasındaki veri yolu; gecikmesi Ryzen performansında kritik rol oynar",
        "position": {
          "x_pct": 56,
          "y_pct": 20,
          "width_pct": 4,
          "height_pct": 34
        }
      }
    ],
    "use_cases": [
      "Yüksek yenileme hızlı oyun: cache'e duyarlı oyunlarda (simülasyon, strateji, MMO) belirgin fark",
      "Rekabetçi e-spor: 1080p düşük ayarlarda CPU sınırlı senaryolarda en yüksek kare hızları",
      "Oyun + yayın birlikte: 16 iş parçacığı arka planda kodlamaya yeterli",
      "Simülasyon iş yükleri: büyük çalışma kümesi L3'e sığdığında dramatik hızlanma"
    ],
    "comparison_notes": "9700X'e göre oyunlarda ortalama %15-20 önde, üretkenlik uygulamalarında ise neredeyse eşit. 7800X3D'ye göre en önemli fark, cache katmanının altta olması sayesinde gelen daha yüksek saat hızı ve overclock serbestliği. 16 çekirdekli 9950X ile kıyaslandığında: oyunda 9800X3D, render ve derleme gibi çok çekirdekli işlerde 9950X kazanır.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Cache'in frekansı yendiği yer — oyun için tasarlanmış 8 çekirdek"
  },
  {
    "id": "intel-panther-lake-x9-388h",
    "name": "Intel Core Ultra X9 388H (Panther Lake)",
    "manufacturer": "Intel",
    "category": "CPU",
    "release_year": 2026,
    "process_node": "Intel 18A (hesap tile) + TSMC N3E (GPU tile)",
    "transistor_count": "Açıklanmadı (çoklu tile)",
    "die_size": "Foveros 3D paket, çoklu tile",
    "image": "core-ultra-285k.png",
    "image_credit": "Temsilî görsel — Intel Core Ultra ailesi",
    "key_specs": {
      "architecture": "Panther Lake (Cougar Cove P-core + Darkmont E-core)",
      "cores": "16 (4 P + 8 E + 4 LP-E)",
      "threads": 16,
      "p_cores": "4 × Cougar Cove, 5.1 GHz'e kadar",
      "e_cores": "8 × Darkmont + 4 × Darkmont LP-E",
      "l3_cache": "18 MB",
      "igpu": "Intel Arc B390 — 12 Xe3 çekirdeği, 2.5 GHz'e kadar",
      "npu": "NPU 5",
      "npu_tops": "50 TOPS (INT8)",
      "memory_speed": "LPDDR5X-9600, 96 GB'a kadar",
      "pcie": "PCIe 5.0 x4 + PCIe 4.0 x8"
    },
    "architecture_highlights": [
      "Intel'in 18A sürecinde seri üretilen ilk mobil işlemcisi — RibbonFET (gate-all-around) ve PowerVia (arkadan güç dağıtımı) burada devreye giriyor",
      "Üç kademeli çekirdek yapısı: performans için Cougar Cove P-core, verim için Darkmont E-core, boşta kalma için ayrı düşük güçlü LP-E kümesi",
      "GPU tile'ı TSMC N3E'de üretiliyor: Intel kendi sürecini CPU'da, TSMC'yi grafikte kullanan karma bir strateji izliyor",
      "Arc B390 iGPU'daki 12 Xe3 çekirdeği, giriş seviyesi harici ekran kartlarıyla yarışabilecek seviyede",
      "NPU 5 ile 50 TOPS INT8; Copilot+ PC gereksinimlerinin (40 TOPS) üzerinde",
      "Foveros 3D paketleme sayesinde farklı süreçlerde üretilen tile'lar tek pakette birleşiyor — her blok kendi için en uygun düğümde üretilebiliyor"
    ],
    "die_regions": [
      {
        "name": "Hesap Tile (Intel 18A)",
        "description": "4 P-core, 8 E-core ve 4 LP-E core; RibbonFET ve PowerVia teknolojileriyle üretilir",
        "position": {
          "x_pct": 10,
          "y_pct": 12,
          "width_pct": 42,
          "height_pct": 48
        }
      },
      {
        "name": "GPU Tile (TSMC N3E)",
        "description": "12 Xe3 çekirdekli Arc B390; ışın izleme ve XeSS 3 kare üretimi destekler",
        "position": {
          "x_pct": 54,
          "y_pct": 12,
          "width_pct": 34,
          "height_pct": 48
        }
      },
      {
        "name": "NPU 5",
        "description": "50 TOPS INT8 sinirsel işlem birimi; arka planda AI görevlerini düşük güçle çalıştırır",
        "position": {
          "x_pct": 10,
          "y_pct": 62,
          "width_pct": 24,
          "height_pct": 14
        }
      },
      {
        "name": "Platform Controller Tile",
        "description": "12 PCIe hattı, 4× Thunderbolt 4, Wi-Fi 7 ve Bluetooth 6.0 denetleyicileri",
        "position": {
          "x_pct": 36,
          "y_pct": 62,
          "width_pct": 30,
          "height_pct": 14
        }
      },
      {
        "name": "Foveros Taban Die'ı",
        "description": "Tüm tile'ları birbirine bağlayan aktif ara katman; dikey bağlantıları yönetir",
        "position": {
          "x_pct": 6,
          "y_pct": 80,
          "width_pct": 88,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "Yüksek performanslı ultrabook'lar: harici ekran kartı olmadan güçlü grafik",
      "Copilot+ AI PC senaryoları: yerel dil modeli çalıştırma, gerçek zamanlı çeviri ve görüntü işleme",
      "Mobil içerik üretimi: Xe3 iGPU ile video düzenleme ve hafif 3D iş akışları",
      "İş dizüstüleri: vPro yönetim özellikleri ve uzun pil ömrü"
    ],
    "comparison_notes": "Arrow Lake H (Core Ultra 9 285H) ile karşılaştırıldığında asıl atılım grafik ve verimlilikte: Xe3 iGPU önceki nesle göre belirgin şekilde güçlü ve 18A süreci daha iyi performans/watt sunuyor. Snapdragon X2 Elite Extreme ile kıyaslandığında ise çok çekirdekli CPU ve NPU testlerinde geride kalıyor; buna karşılık x86 uyumluluğu ve oyun desteği Intel'in avantajı olmaya devam ediyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Intel 18A'nın ilk seri üretim ürünü — RibbonFET ve PowerVia sahada"
  },
  {
    "id": "intel-lunar-lake-288v",
    "name": "Intel Core Ultra 9 288V (Lunar Lake)",
    "manufacturer": "Intel",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3B (hesap tile) + N6 (platform tile)",
    "transistor_count": "~17.8 milyar (paket toplamı)",
    "die_size": "~140 mm² (hesap + platform tile)",
    "image": "core-ultra-285k.png",
    "image_credit": "Temsilî görsel — Intel Core Ultra ailesi",
    "key_specs": {
      "architecture": "Lunar Lake (Lion Cove P-core + Skymont E-core)",
      "cores": "8 (4 P + 4 E)",
      "threads": 8,
      "p_cores": "4 × Lion Cove, 5.1 GHz'e kadar",
      "e_cores": "4 × Skymont",
      "l3_cache": "12 MB",
      "igpu": "Intel Arc 140V — 8 Xe2 çekirdeği, 2.05 GHz",
      "npu": "NPU 4",
      "npu_tops": "48 TOPS (INT8)",
      "memory_speed": "Paket üstü LPDDR5X-8533, 32 GB",
      "tdp": "17-37W"
    },
    "architecture_highlights": [
      "Hyper-Threading kaldırıldı: 8 çekirdek = 8 iş parçacığı. Intel, alan ve güç bütçesinin daha çok çekirdeğe harcanmasının daha verimli olduğuna karar verdi",
      "RAM paketin üzerinde (on-package LPDDR5X): gecikme düşüyor, güç tüketimi azalıyor — ama bellek yükseltilemiyor",
      "Skymont E-core'lar önceki neslin P-core'larına yakın IPC sunuyor; bu, hibrit mimarinin dengesini kökten değiştirdi",
      "Xe2 tabanlı Arc 140V iGPU, ilk kez Intel'in mobil grafiğini gerçek anlamda oyun oynanabilir seviyeye taşıdı",
      "48 TOPS NPU + GPU + CPU birleşimiyle platform toplamı ~120 TOPS",
      "Intel'in kendi fabrikası yerine TSMC N3B kullanması, o dönemde Intel süreç yol haritasının gecikmesinin doğrudan sonucuydu"
    ],
    "die_regions": [
      {
        "name": "Hesap Tile (TSMC N3B)",
        "description": "4 Lion Cove P-core, 4 Skymont E-core ve paylaşımlı 12 MB L3 cache",
        "position": {
          "x_pct": 10,
          "y_pct": 14,
          "width_pct": 40,
          "height_pct": 44
        }
      },
      {
        "name": "Arc 140V iGPU (Xe2)",
        "description": "8 Xe2 çekirdeği, ışın izleme ve XMX matris birimleri ile",
        "position": {
          "x_pct": 52,
          "y_pct": 14,
          "width_pct": 32,
          "height_pct": 44
        }
      },
      {
        "name": "NPU 4",
        "description": "48 TOPS sinirsel işlem birimi; Copilot+ özelliklerinin donanım temeli",
        "position": {
          "x_pct": 10,
          "y_pct": 60,
          "width_pct": 26,
          "height_pct": 14
        }
      },
      {
        "name": "Paket Üstü LPDDR5X (32 GB)",
        "description": "Anakart yerine paketin üzerinde bulunan bellek; kısa yollar düşük gecikme ve güç demek",
        "position": {
          "x_pct": 6,
          "y_pct": 78,
          "width_pct": 88,
          "height_pct": 16
        }
      },
      {
        "name": "Platform Controller Tile (N6)",
        "description": "Thunderbolt 4, Wi-Fi 7 ve PCIe denetleyicileri; ucuz süreçte üretilen I/O bloğu",
        "position": {
          "x_pct": 38,
          "y_pct": 60,
          "width_pct": 46,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "İnce ve hafif dizüstüler: 17W'ta bile makul performans, çok uzun pil ömrü",
      "Copilot+ PC: 48 TOPS NPU ile yerel AI özellikleri",
      "Hafif oyun: Arc 140V ile 1080p düşük-orta ayarlarda oynanabilir kare hızları",
      "Seyahat ve mobil çalışma: paket üstü bellek sayesinde düşük boşta güç tüketimi"
    ],
    "comparison_notes": "Meteor Lake'e göre pil ömründe büyük sıçrama sağladı ve iGPU performansını neredeyse ikiye katladı. Hyper-Threading'in kaldırılması çok çekirdekli senaryolarda bir miktar kayıp anlamına geliyor, ama verimlilikte kazanç bunu telafi ediyor. Apple M4 ve Snapdragon X Elite ile aynı sınıfta yarışan ilk gerçekten rekabetçi Intel mobil chip'i olarak görülüyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Hyper-Threading'siz 8 çekirdek ve paket üstü RAM — Intel'in verimlilik dönüşü"
  },
  {
    "id": "qualcomm-snapdragon-x2-elite",
    "name": "Qualcomm Snapdragon X2 Elite Extreme",
    "manufacturer": "Qualcomm",
    "category": "CPU",
    "release_year": 2026,
    "process_node": "TSMC N3 (3nm)",
    "transistor_count": "Açıklanmadı",
    "die_size": "Açıklanmadı",
    "image": "snapdragon-x-elite.png",
    "image_credit": "Temsilî görsel — Snapdragon X ailesi",
    "key_specs": {
      "architecture": "3. nesil Oryon (ARM), 12 Prime + 6 Performance",
      "cores": 18,
      "threads": 18,
      "p_cores": "12 × Prime, 4.4 GHz (tüm çekirdek) / 5.0 GHz (çift çekirdek boost)",
      "e_cores": "6 × Performance, 3.6 GHz",
      "l2_cache": "53 MB toplam cache",
      "igpu": "Adreno X2-90, 1.85 GHz",
      "npu": "Hexagon NPU",
      "npu_tops": "80 TOPS",
      "memory_speed": "LPDDR5X, 228 GB/s (192-bit)",
      "capacity": "48 GB'a kadar paket üstü bellek"
    },
    "architecture_highlights": [
      "5.0 GHz boost ile bir ARM dizüstü çekirdeğinin ulaştığı en yüksek saat hızlarından biri",
      "18 çekirdek: 12 Prime + 6 Performance. Dikkat — burada 'küçük verimlilik çekirdeği' yok, ikisi de tam performans sınıfı",
      "80 TOPS Hexagon NPU, önceki neslin 45 TOPS'una göre neredeyse iki katı; Copilot+ eşiğinin (40 TOPS) çok üzerinde",
      "228 GB/s LPDDR5X bant genişliği, x86 rakiplerinin tipik 120-150 GB/s değerlerinin belirgin şekilde üzerinde",
      "Adreno X2-90 GPU önceki nesle göre 2.3 kat performans/watt iyileştirmesi getiriyor",
      "53 MB toplam cache — ARM tabanlı bir dizüstü SoC'si için oldukça cömert"
    ],
    "die_regions": [
      {
        "name": "Prime Çekirdek Kümesi (12 × Oryon)",
        "description": "5.0 GHz'e boost yapabilen ana performans çekirdekleri; ağır iş yüklerini üstlenir",
        "position": {
          "x_pct": 8,
          "y_pct": 12,
          "width_pct": 46,
          "height_pct": 40
        }
      },
      {
        "name": "Performance Çekirdek Kümesi (6 × Oryon)",
        "description": "3.6 GHz'de çalışan ikinci küme; paralel iş yüklerinde verimliliği artırır",
        "position": {
          "x_pct": 8,
          "y_pct": 54,
          "width_pct": 46,
          "height_pct": 20
        }
      },
      {
        "name": "Adreno X2-90 GPU",
        "description": "Dilimlenmiş (sliced) yürütme ve HPM cache ile yeniden tasarlanan grafik motoru",
        "position": {
          "x_pct": 56,
          "y_pct": 12,
          "width_pct": 34,
          "height_pct": 40
        }
      },
      {
        "name": "Hexagon NPU (80 TOPS)",
        "description": "Yerel AI çıkarımının yapıldığı blok; dil modelleri ve görüntü işleme buradan geçer",
        "position": {
          "x_pct": 56,
          "y_pct": 54,
          "width_pct": 34,
          "height_pct": 20
        }
      },
      {
        "name": "Paylaşımlı Cache ve Bellek Denetleyicisi",
        "description": "53 MB toplam cache ve 192-bit LPDDR5X arayüzü; 228 GB/s bant genişliği sağlar",
        "position": {
          "x_pct": 8,
          "y_pct": 78,
          "width_pct": 82,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "Uzun pil ömrü öncelikli premium Windows dizüstüler",
      "Yerel AI iş akışları: 80 TOPS ile cihaz üstü dil modeli ve görüntü üretimi",
      "Hareket hâlinde çalışma: entegre 5G modem seçeneği ile her yerde bağlantı",
      "Geliştirici ve ofis iş yükleri: ARM64 native uygulamalarda çok yüksek verim"
    ],
    "comparison_notes": "Snapdragon X Elite'e göre 6 ek çekirdek, daha yüksek saat hızları ve neredeyse iki katı NPU gücü getiriyor. Bağımsız testlerde çok çekirdekli CPU ve NPU ölçümlerinde Intel Panther Lake'in üzerinde sonuçlar veriyor. Zayıf noktası hâlâ ekosistem: x86 uygulamaların emülasyonla çalışması ve oyun uyumluluğu ARM tarafının kalıcı sorunu.",
    "is_announced": true,
    "rumored": null,
    "tagline": "18 çekirdek, 5 GHz ARM ve 80 TOPS — Windows'ta x86'ya en ciddi meydan okuma"
  },
  {
    "id": "apple-m5-pro-max",
    "name": "Apple M5 Pro / M5 Max",
    "manufacturer": "Apple",
    "category": "CPU",
    "release_year": 2026,
    "process_node": "TSMC 3. nesil 3nm (N3P sınıfı)",
    "transistor_count": "Açıklanmadı",
    "die_size": "İki die'lı 'Fusion' paketi (SoIC-mH sınıfı paketleme)",
    "image": "apple-m4-pro-max.png",
    "image_credit": "Temsilî görsel — Apple M serisi",
    "key_specs": {
      "architecture": "Apple Fusion Architecture — ayrı hesap ve grafik die'ları tek pakette",
      "cores": "18 (M5 Max: 6 S-core + 12 P-core)",
      "threads": 18,
      "boost_clock": "4.6 GHz'e kadar",
      "l2_cache": "32 MB",
      "l3_cache": "24 MB",
      "igpu": "M5 Max: 32 veya 40 çekirdekli GPU · M5 Pro: 16 veya 20 çekirdekli GPU",
      "npu": "16 çekirdekli Neural Engine + her GPU çekirdeğinde Neural Accelerator",
      "capacity": "M5 Max 128 GB'a kadar · M5 Pro 64 GB'a kadar birleşik bellek"
    },
    "architecture_highlights": [
      "Apple ilk kez hesap ve grafik bloklarını ayrı die'lara bölüp gelişmiş paketlemeyle birleştirdi — buna 'Fusion Architecture' diyor",
      "Her GPU çekirdeğine Neural Accelerator eklendi: AI hesabı artık sadece Neural Engine'de değil, GPU boyunca dağıtık",
      "Apple'a göre AI için tepe GPU hesabı önceki nesle kıyasla 4 katından fazla",
      "Işın izleme kullanan uygulamalarda M4 Pro/Max'e göre %35'e varan grafik artışı",
      "Çekirdek adlandırması değişti: klasik P/E ayrımı yerine 6 'S-core' (4.6 GHz) + 12 P-core (4.4 GHz)",
      "Birleşik bellek mimarisi korunuyor: CPU, GPU ve Neural Engine aynı fiziksel bellek havuzunu paylaşır, kopyalama yok"
    ],
    "die_regions": [
      {
        "name": "CPU Kümesi (Hesap Die'ı)",
        "description": "6 S-core ve 12 P-core; 4.6 GHz'e kadar çıkan performans çekirdekleri",
        "position": {
          "x_pct": 8,
          "y_pct": 14,
          "width_pct": 38,
          "height_pct": 40
        }
      },
      {
        "name": "GPU Kümesi (Grafik Die'ı)",
        "description": "40 çekirdeğe kadar GPU; her çekirdekte ayrı bir Neural Accelerator bulunur",
        "position": {
          "x_pct": 50,
          "y_pct": 14,
          "width_pct": 40,
          "height_pct": 40
        }
      },
      {
        "name": "Neural Engine (16 çekirdek)",
        "description": "Düşük güçte sürekli çalışan AI motoru; Apple Intelligence özelliklerinin temeli",
        "position": {
          "x_pct": 8,
          "y_pct": 56,
          "width_pct": 26,
          "height_pct": 14
        }
      },
      {
        "name": "Birleşik Bellek Denetleyicisi",
        "description": "CPU, GPU ve NPU'nun ortak eriştiği bellek havuzunu yöneten blok",
        "position": {
          "x_pct": 36,
          "y_pct": 56,
          "width_pct": 54,
          "height_pct": 14
        }
      },
      {
        "name": "LPDDR5X Paketleri",
        "description": "128 GB'a kadar birleşik bellek; SoC paketinin kenarlarında konumlanır",
        "position": {
          "x_pct": 6,
          "y_pct": 74,
          "width_pct": 88,
          "height_pct": 18
        }
      }
    ],
    "use_cases": [
      "Profesyonel video düzenleme: DaVinci Resolve'da M4 Max'e göre kat kat hızlı efekt render'ı",
      "Yerel AI geliştirme: 128 GB birleşik bellekle büyük modelleri dizüstüde çalıştırma",
      "3D ve görselleştirme: donanım ışın izleme ile Blender, Cinema 4D iş akışları",
      "Yazılım geliştirme: yüksek tek çekirdek performansı ve sessiz çalışma"
    ],
    "comparison_notes": "M4 Pro/Max ile aynı GPU çekirdek sayısını korumasına rağmen, çekirdek başına eklenen Neural Accelerator'lar sayesinde AI iş yüklerinde çok daha hızlı. Genel CPU performansında M4 Max'e göre yaklaşık %20 artış bildiriliyor. Asıl mimari kırılma ise tek monolitik die'dan iki die'lı paketlemeye geçiş — Apple da nihayet AMD ve Intel'in yıllardır kullandığı chiplet yoluna girdi.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Apple'ın ilk çift die'lı M chip'i — her GPU çekirdeğinde AI hızlandırıcı"
  },
  {
    "id": "intel-xeon-6-6980p",
    "name": "Intel Xeon 6 6980P (Granite Rapids)",
    "manufacturer": "Intel",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "Intel 3 (hesap die'ları) + Intel 7 (I/O die'ları)",
    "transistor_count": "Açıklanmadı (5 die'lı paket)",
    "die_size": "3 hesap + 2 I/O die",
    "image": "epyc-9965.png",
    "image_credit": "Temsilî görsel — sunucu işlemcisi",
    "key_specs": {
      "architecture": "Granite Rapids (Redwood Cove P-core), 3 hesap + 2 I/O die",
      "cores": 128,
      "threads": 256,
      "base_clock": "2.0 GHz",
      "boost_clock": "3.9 GHz",
      "l3_cache": "504 MB",
      "socket": "LGA7529 (Socket E2)",
      "tdp": "500W",
      "pcie": "96 hat PCIe 5.0 / CXL 2.0",
      "memory_speed": "12 kanal DDR5-6400 (MRDIMM ile 8800 MT/s)"
    },
    "architecture_highlights": [
      "128 P-core: AMD EPYC'in aksine Intel burada yalnızca tam performanslı çekirdek kullanıyor (E-core versiyonu ayrı bir ürün ailesi)",
      "12 bellek kanalı ve MRDIMM desteği — MRDIMM, iki DIMM sırasını birleştirerek etkin bant genişliğini artıran bir tekniktir",
      "504 MB L3 cache, veri merkezi iş yüklerinde bellek trafiğini ciddi ölçüde azaltır",
      "AMX (Advanced Matrix Extensions) birimleri sayesinde CPU üzerinde AI çıkarımı yapılabiliyor",
      "Chiplet yaklaşımı: 3 hesap die'ı Intel 3'te, 2 I/O die'ı daha olgun Intel 7 sürecinde üretiliyor",
      "96 PCIe 5.0 hattı ve CXL 2.0 desteği ile bellek genişletme ve hızlandırıcı bağlama esnekliği"
    ],
    "die_regions": [
      {
        "name": "Hesap Die'ları (3 adet, Intel 3)",
        "description": "Toplam 128 Redwood Cove P-core; AMX matris birimleri her çekirdekte bulunur",
        "position": {
          "x_pct": 20,
          "y_pct": 10,
          "width_pct": 60,
          "height_pct": 50
        }
      },
      {
        "name": "I/O Die'ları (2 adet, Intel 7)",
        "description": "PCIe 5.0, CXL 2.0 ve UPI bağlantıları; olgun ve ucuz süreçte üretilir",
        "position": {
          "x_pct": 6,
          "y_pct": 10,
          "width_pct": 12,
          "height_pct": 50
        }
      },
      {
        "name": "Bellek Denetleyicileri (12 kanal)",
        "description": "DDR5-6400 ve MRDIMM-8800 destekleyen denetleyiciler; paketin kenarlarına dağıtılmış",
        "position": {
          "x_pct": 6,
          "y_pct": 62,
          "width_pct": 88,
          "height_pct": 14
        }
      },
      {
        "name": "L3 Cache Dilimleri (504 MB)",
        "description": "Hesap die'ları boyunca dağıtılmış devasa paylaşımlı önbellek",
        "position": {
          "x_pct": 20,
          "y_pct": 78,
          "width_pct": 60,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Sanallaştırma ve bulut: yüksek çekirdek yoğunluğuyla sunucu başına çok sayıda sanal makine",
      "Veri tabanı ve in-memory analitik: 12 kanal bellek ve 504 MB cache ile yüksek verim",
      "AI çıkarımı: AMX birimleri sayesinde küçük ve orta modeller için GPU'suz çözüm",
      "HPC: bilimsel simülasyonlarda yüksek bellek bant genişliği gerektiren kodlar"
    ],
    "comparison_notes": "AMD EPYC Turin 9965 (192 Zen 5c çekirdek) ile karşılaştırıldığında Intel daha az ama daha güçlü çekirdek sunuyor: tek iş parçacığı performansı ve AMX destekli AI işlerinde avantajlı, saf çok çekirdekli verimde ise EPYC önde. Bellek tarafında 12 kanal + MRDIMM ile Intel bant genişliği avantajı yakalıyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "128 tam performans çekirdeği ve 12 bellek kanalı — Intel'in sunucu karşılığı"
  },
  {
    "id": "ram-hbm4",
    "name": "HBM4 (Yüksek Bant Genişlikli Bellek 4)",
    "manufacturer": "JEDEC",
    "category": "RAM",
    "release_year": 2026,
    "process_node": "1b/1c nm sınıfı DRAM + mantık taban die'ı (ör. TSMC 12nm)",
    "transistor_count": "Yığın başına yüz milyarlarca hücre",
    "die_size": "16 katmana kadar dikey istifleme, 775 µm yükseklik sınırı",
    "image": "hbm3e.png",
    "image_credit": "Temsilî görsel — HBM ailesi",
    "key_specs": {
      "standard": "JEDEC JESD270-4 (Nisan 2025)",
      "memory_interface": "Yığın başına 2048-bit (HBM3E'nin iki katı)",
      "bandwidth": "Yığın başına ~2 TB/s (8 Gbps/pin taban spesifikasyonu)",
      "data_rate": "8 Gbps/pin (JEDEC) — üreticiler 10 Gbps üzerini hedefliyor",
      "capacity_per_module": "Yığın başına 64 GB'a kadar (16-Hi, 32 Gb die)",
      "voltage": "Düşürülmüş çalışma voltajı, %40+ güç verimliliği iyileştirmesi",
      "modulation": "NRZ"
    },
    "architecture_highlights": [
      "En büyük değişiklik arayüz genişliği: yığın başına 1024-bit'ten 2048-bit'e çıktı. Bant genişliği artışı hızdan değil, paralellikten geliyor",
      "Kanal sayısı 16'dan 32'ye yükseldi — AI iş yüklerinin düzensiz bellek erişim desenlerinde bu, ham bant genişliğinden bile önemli",
      "Taban die (base die) artık bir mantık chip'i: SK hynix bunu TSMC'nin 12nm mantık sürecinde ürettiriyor. Bu, belleğin müşteriye özel uyarlanabilmesi anlamına geliyor",
      "16 katmanlı yığında her DRAM wafer'ı 30 µm inceliğine kadar taşlanıyor; JEDEC'in 775 µm toplam yükseklik sınırına sığmak için zorunlu",
      "NVIDIA Rubin, AMD Instinct MI400 serisi ve Intel Jaguar Shores HBM4 kullanacak açıklanan ilk platformlar",
      "Seri üretim 2026 başında başladı; Samsung ve SK hynix neredeyse eşzamanlı üretime geçti"
    ],
    "die_regions": [
      {
        "name": "DRAM Katmanları (16-Hi'ye kadar)",
        "description": "Üst üste istiflenmiş bellek die'ları; her biri 30 µm inceliğinde taşlanır",
        "position": {
          "x_pct": 15,
          "y_pct": 12,
          "width_pct": 70,
          "height_pct": 40
        }
      },
      {
        "name": "Mantık Taban Die'ı",
        "description": "Yığının 'beyni' — artık DRAM değil mantık sürecinde üretiliyor, özelleştirilebilir",
        "position": {
          "x_pct": 15,
          "y_pct": 54,
          "width_pct": 70,
          "height_pct": 12
        }
      },
      {
        "name": "TSV (Through-Silicon Via) Dizileri",
        "description": "Katmanları dikey olarak delip geçen binlerce bağlantı; 2048-bit arayüzü mümkün kılar",
        "position": {
          "x_pct": 15,
          "y_pct": 12,
          "width_pct": 8,
          "height_pct": 54
        }
      },
      {
        "name": "Silikon Interposer",
        "description": "HBM yığınlarını GPU/hızlandırıcı die'ına bağlayan taşıyıcı katman",
        "position": {
          "x_pct": 8,
          "y_pct": 68,
          "width_pct": 84,
          "height_pct": 12
        }
      },
      {
        "name": "Isı Yayıcı ve MR-MUF Dolgu",
        "description": "16 katmanlı yığında ısıyı dışarı taşıyan malzeme; en zorlu mühendislik sorunu",
        "position": {
          "x_pct": 8,
          "y_pct": 82,
          "width_pct": 84,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Yeni nesil AI hızlandırıcıları: NVIDIA Rubin ve AMD MI400 serisinin bellek temeli",
      "Trilyon parametreli model eğitimi: kapasite ve bant genişliği birlikte artıyor",
      "Uzun bağlamlı çıkarım: büyük KV cache'leri tek hızlandırıcıda tutabilme",
      "Özelleştirilmiş bellek: mantık taban die'ı sayesinde müşteriye özel HBM tasarımları"
    ],
    "comparison_notes": "HBM3E'ye göre arayüz genişliği ikiye katlandı (1024 → 2048 bit) ve kanal sayısı 16'dan 32'ye çıktı. Yığın başına bant genişliği ~1.2 TB/s'den ~2 TB/s'ye yükseldi, kapasite ise 36 GB'dan 64 GB'a çıkabiliyor. Asıl kavramsal fark, taban die'ın mantık sürecine taşınmasıyla HBM'in standart bir bileşenden özelleştirilebilir bir alt sisteme dönüşmesi.",
    "is_announced": true,
    "rumored": null,
    "tagline": "2048-bit arayüz ve mantık taban die'ı — belleğin özelleştirilebilir hâli"
  },
  {
    "id": "ram-gddr6",
    "name": "GDDR6 (6. Nesil Grafik DDR Belleği)",
    "manufacturer": "JEDEC",
    "category": "RAM",
    "release_year": 2018,
    "process_node": "1x/1y nm sınıfı DRAM",
    "transistor_count": "Chip başına milyarlarca hücre",
    "die_size": "Chip başına ~8-16 Gb yoğunluk",
    "image": "gddr7.png",
    "image_credit": "Temsilî görsel — GDDR ailesi",
    "key_specs": {
      "standard": "JEDEC JESD250",
      "data_rate": "14-20 Gbps/pin",
      "modulation": "NRZ (2 seviyeli sinyalleşme)",
      "bus_width": "Chip başına 32-bit (2 × 16-bit kanal)",
      "capacity_per_module": "Chip başına 8-16 Gb",
      "voltage": "1.35V",
      "bandwidth": "128-bit arayüzde ~320 GB/s (20 Gbps ile)"
    },
    "architecture_highlights": [
      "Chip başına iki bağımsız 16-bit kanal: aynı fiziksel chip'ten iki ayrı erişim yapılabiliyor, bu da gecikmeyi gizliyor",
      "NRZ sinyalleşme kullanır — her sinyal çevriminde 1 bit taşır. GDDR7'nin PAM3'ü ise çevrim başına daha fazla bilgi taşıyabilir",
      "GDDR6X (NVIDIA'ya özel, Micron üretimi) PAM4 kullanarak aynı frekansta iki katı veri taşır; ama daha çok güç harcar ve daha çok ısınır",
      "Bugün hâlâ orta segment ekran kartlarında yaygın: RX 9060 XT, RTX 4060 ve birçok mobil GPU GDDR6 kullanır",
      "DDR5'e göre çok daha yüksek pin hızı sunar ama gecikmesi daha yüksektir — GPU'lar gecikmeyi paralellikle gizlediği için bu bir sorun değildir",
      "Lehimli olarak PCB'ye monte edilir; DIMM gibi takılıp çıkarılamaz"
    ],
    "die_regions": [
      {
        "name": "Bellek Hücre Dizileri",
        "description": "Verinin kapasitörlerde saklandığı ana alan; chip yüzeyinin çoğunu kaplar",
        "position": {
          "x_pct": 10,
          "y_pct": 12,
          "width_pct": 80,
          "height_pct": 44
        }
      },
      {
        "name": "Kanal 0 / Kanal 1 Ayrımı",
        "description": "İki bağımsız 16-bit kanal; aynı chip'e paralel iki erişim sağlar",
        "position": {
          "x_pct": 48,
          "y_pct": 12,
          "width_pct": 4,
          "height_pct": 44
        }
      },
      {
        "name": "Satır/Sütun Kod Çözücüler",
        "description": "Hangi hücreye erişileceğini belirleyen adresleme mantığı",
        "position": {
          "x_pct": 10,
          "y_pct": 58,
          "width_pct": 80,
          "height_pct": 10
        }
      },
      {
        "name": "I/O Arayüzü (32-bit)",
        "description": "NRZ sinyalleşmeyle 14-20 Gbps/pin veri gönderen çıkış katmanı",
        "position": {
          "x_pct": 10,
          "y_pct": 72,
          "width_pct": 80,
          "height_pct": 16
        }
      }
    ],
    "use_cases": [
      "Orta ve giriş segment ekran kartları: maliyet/performans dengesi hâlâ çok iyi",
      "Oyun konsolları: PlayStation 5 ve Xbox Series X/S GDDR6 kullanır",
      "Mobil ve dizüstü GPU'lar: GDDR7'ye göre daha düşük güç ve ısı",
      "Ağ ekipmanı ve otomotiv: yüksek bant genişliği gereken gömülü sistemler"
    ],
    "comparison_notes": "GDDR7'ye göre pin başına yaklaşık yarı hız sunar (20 vs 32+ Gbps) çünkü NRZ yerine PAM3 kullanmaz. Buna karşılık daha olgun, daha ucuz ve daha az ısınır. DDR5 ile karşılaştırıldığında pin hızı çok daha yüksek ama gecikme daha kötüdür — bu, GPU ve CPU'nun bellekten farklı şeyler istemesinin doğrudan sonucudur.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Hâlâ her yerde — orta segmentin çalışkan grafik belleği"
  },
  {
    "id": "ram-ddr4",
    "name": "DDR4 RAM (JEDEC Standardı)",
    "manufacturer": "JEDEC",
    "category": "RAM",
    "release_year": 2014,
    "process_node": "2x/1x nm sınıfı DRAM",
    "transistor_count": "Modül başına on milyarlarca hücre",
    "die_size": "Chip başına 4-16 Gb yoğunluk",
    "image": "ddr5.png",
    "image_credit": "Temsilî görsel — DDR ailesi",
    "key_specs": {
      "standard": "JEDEC JESD79-4",
      "data_rate": "1600-3200 MT/s (JEDEC) — XMP ile 4000+ MT/s",
      "voltage": "1.2V",
      "bus_width": "Modül başına 64-bit (tek kanal)",
      "capacity_per_module": "4-32 GB",
      "bandwidth": "~25.6 GB/s (DDR4-3200, tek kanal)",
      "pin_count": "288 pin (DIMM) / 260 pin (SO-DIMM)"
    },
    "architecture_highlights": [
      "8n prefetch: bellek çekirdeği bir istekte 8 bit'lik blok getirir, arayüz bunu seri olarak dışarı akıtır",
      "Bank Group kavramı DDR4 ile geldi: bankalar gruplara ayrılarak arka arkaya erişimlerde bekleme süresi azaltıldı",
      "DDR3'ün 1.5V'undan 1.2V'a düşen çalışma voltajı, aynı performansta belirgin güç tasarrufu sağladı",
      "Modül başına tek 64-bit kanal — DDR5'te bu iki adet 32-bit kanala bölündü",
      "Güç yönetimi anakart üzerindedir; DDR5'te bu iş modülün üzerindeki PMIC'e taşındı",
      "2014'ten 2021'e kadar masaüstü ve sunucunun standardıydı; hâlâ milyarlarca cihazda çalışıyor"
    ],
    "die_regions": [
      {
        "name": "DRAM Chip'leri (8-16 adet)",
        "description": "Modül üzerindeki bellek yongaları; her biri veriyi kapasitörlerde saklar",
        "position": {
          "x_pct": 8,
          "y_pct": 20,
          "width_pct": 84,
          "height_pct": 34
        }
      },
      {
        "name": "Bank Group Yapısı",
        "description": "Bankaların gruplara ayrılması, ardışık erişimlerde gecikmeyi azaltır",
        "position": {
          "x_pct": 8,
          "y_pct": 56,
          "width_pct": 84,
          "height_pct": 12
        }
      },
      {
        "name": "SPD Chip'i",
        "description": "Modülün zamanlama bilgilerini tutan küçük EEPROM; BIOS bunu okur",
        "position": {
          "x_pct": 44,
          "y_pct": 10,
          "width_pct": 12,
          "height_pct": 8
        }
      },
      {
        "name": "288 Pin Konnektör",
        "description": "Anakartla temas noktası; çentik konumu DDR3 ile karışmayı önler",
        "position": {
          "x_pct": 4,
          "y_pct": 74,
          "width_pct": 92,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "Mevcut sistemlerin yükseltilmesi: 2015-2021 arası milyonlarca masaüstü ve dizüstü",
      "Bütçe sistemleri: DDR5'e göre modül başına belirgin şekilde ucuz",
      "Sunucu ikinci el pazarı: eski nesil EPYC ve Xeon platformları",
      "Gömülü sistemler ve endüstriyel bilgisayarlar: uzun tedarik ömrü"
    ],
    "comparison_notes": "DDR5 ile karşılaştırıldığında en temel fark kanal yapısı: DDR4'te modül başına tek 64-bit kanal varken DDR5'te iki adet 32-bit kanal bulunur — bu, aynı frekansta bile daha iyi paralellik demektir. DDR5 ayrıca ECC'yi chip içine taşıdı ve güç yönetimini modüle aldı. Buna karşılık DDR4'ün mutlak gecikmesi (nanosaniye cinsinden) birçok senaryoda hâlâ rekabetçidir.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Bir neslin standardı — DDR5'i anlamak için önce burayı anlamak gerek"
  },
  {
    "id": "nvidia-rubin-r200",
    "name": "NVIDIA Rubin R200",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2026,
    "process_node": "TSMC N3 sınıfı (3nm)",
    "transistor_count": "~336 milyar (çift chiplet)",
    "die_size": "İki reticle boyutlu chiplet, tek GPU soketi",
    "image": "blackwell-b200.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi GPU'su",
    "key_specs": {
      "architecture": "Rubin (çift chiplet, tek GPU olarak görünür)",
      "vram": "288 GB HBM4 (8 yığın)",
      "memory_bandwidth": "~22 TB/s",
      "memory_interface": "HBM4, yığın başına 2048-bit",
      "fp4_tflops": "50 PFLOPS NVFP4 (çıkarım) · ~35 PFLOPS (eğitim)",
      "nvlink": "NVLink 6",
      "pcie": "PCIe 6.0",
      "form_factor": "VR200 NVL72 raf sistemi / HGX Rubin NVL8"
    },
    "architecture_highlights": [
      "Rubin, HBM4'ü kullanan ilk büyük ölçekli platform: bant genişliği Blackwell'in 8 TB/s'sinden ~22 TB/s'ye, yani yaklaşık 2.75 katına çıkıyor",
      "Kapasite 288 GB ile B300 ile aynı kaldı — bu nesilde kazanç kapasiteden değil, tamamen bant genişliğinden geliyor",
      "NVIDIA, Rubin'i tek bir chip değil altı chip'lik bir platform olarak konumlandırıyor: Rubin GPU, Vera CPU, NVLink 6 switch, ConnectX-9, BlueField-4 ve Spectrum-6",
      "Vera Rubin 'superchip' bir Vera CPU ile iki Rubin GPU'yu tek pakette birleştiriyor",
      "Hedef iş yükü açıkça belirtiliyor: akıl yürüten modeller, uzun bağlamlı çıkarım ve Mixture-of-Experts eğitimi",
      "Haziran 2026'da tam üretime geçti; ortak sistemlerin 2026'nın ikinci yarısında gelmesi bekleniyor"
    ],
    "die_regions": [
      {
        "name": "Rubin Chiplet 1",
        "description": "İlk hesap chiplet'i; NVFP4 destekli tensor birimleri burada",
        "position": {
          "x_pct": 6,
          "y_pct": 12,
          "width_pct": 42,
          "height_pct": 46
        }
      },
      {
        "name": "Rubin Chiplet 2",
        "description": "İkinci hesap chiplet'i; yazılım iki chiplet'i tek GPU olarak görür",
        "position": {
          "x_pct": 52,
          "y_pct": 12,
          "width_pct": 42,
          "height_pct": 46
        }
      },
      {
        "name": "HBM4 Yığınları (x8)",
        "description": "2048-bit arayüzlü yeni nesil bellek; toplam 288 GB ve ~22 TB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 62,
          "width_pct": 92,
          "height_pct": 20
        }
      },
      {
        "name": "NVLink 6 / PCIe 6.0 Arabirimi",
        "description": "Raf ölçeğinde 72 GPU'yu tek alanda birleştiren bağlantı katmanı",
        "position": {
          "x_pct": 4,
          "y_pct": 84,
          "width_pct": 92,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Mixture-of-Experts modellerin eğitimi: NVIDIA'ya göre Blackwell'e kıyasla 4 kat daha az GPU ile",
      "Uzun bağlamlı, düşük gecikmeli çıkarım — bant genişliğinin belirleyici olduğu senaryolar",
      "Ajan tabanlı (agentic) AI sistemleri: çok adımlı akıl yürütme iş yükleri",
      "Gerçek zamanlı üretken video ve çok modlu modeller"
    ],
    "comparison_notes": "B300 ile aynı bellek kapasitesini (288 GB) sunuyor ama HBM4 sayesinde bant genişliği yaklaşık 2.75 katına çıkıyor. Transistör sayısı 208 milyardan ~336 milyara yükseldi. Bu, 'kapasite değil bant genişliği' nesli: bellek sınırlı çıkarımda kazanç büyük, ama modelin boyutu açısından B300'e göre yeni bir kapı açmıyor. Kapasite artışı için Rubin Ultra beklenecek.",
    "is_announced": true,
    "rumored": null,
    "tagline": "HBM4'ün ilk büyük platformu — 22 TB/s ile bant genişliği sıçraması"
  },
  {
    "id": "nvidia-ampere-a100",
    "name": "NVIDIA A100 80GB (Ampere)",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2020,
    "process_node": "TSMC N7 (7nm)",
    "transistor_count": "54.2 milyar (GA100)",
    "die_size": "826 mm²",
    "image": "h100.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi GPU'su",
    "key_specs": {
      "architecture": "Ampere (GA100)",
      "cuda_cores": 6912,
      "compute_units": "108 SM",
      "tensor_cores": "432 adet (3. nesil)",
      "vram": "80 GB HBM2e",
      "memory_bandwidth": "2039 GB/s",
      "memory_interface": "5120-bit",
      "l2_cache": "40 MB",
      "fp16_tflops": "624 TFLOPS (seyrek)",
      "fp32_tflops": "19.5 TFLOPS",
      "fp64_tflops": "9.7 TFLOPS (19.5 Tensor Core ile)",
      "nvlink": "NVLink 3.0, 600 GB/s",
      "tdp": "400W (SXM4)"
    },
    "architecture_highlights": [
      "Modern AI çağını başlatan chip: GPT-3'ten Stable Diffusion'a kadar 2020-2023 arasındaki modellerin çoğu A100 kümelerinde eğitildi",
      "3. nesil Tensor Core'lar ile TF32 formatı tanıtıldı — kod değişikliği gerektirmeden FP32 iş yüklerini hızlandıran akıllı bir ara çözüm",
      "Yapısal seyreklik (structured sparsity) desteği: ağırlıkların yarısı sıfırsa verim iki katına çıkıyor",
      "MIG (Multi-Instance GPU): tek bir A100 donanım düzeyinde 7 bağımsız GPU'ya bölünebiliyor — bulut sağlayıcıları için devrimsel",
      "826 mm² die, o dönem için üretilebilirlik sınırının neredeyse tamamını kullanıyordu",
      "Bugün hâlâ ikinci el ve bulut pazarında yaygın — birçok iş yükü için fiyat/performans olarak mantıklı"
    ],
    "die_regions": [
      {
        "name": "GPC / SM Kümeleri",
        "description": "108 SM ve 6912 CUDA core; 3. nesil Tensor Core'lar SM içinde konumlanır",
        "position": {
          "x_pct": 8,
          "y_pct": 10,
          "width_pct": 84,
          "height_pct": 44
        }
      },
      {
        "name": "L2 Cache (40 MB)",
        "description": "İki bölgeye ayrılmış paylaşımlı önbellek",
        "position": {
          "x_pct": 8,
          "y_pct": 54,
          "width_pct": 84,
          "height_pct": 8
        }
      },
      {
        "name": "HBM2e Yığınları (x5)",
        "description": "5 yığın, toplam 80 GB ve 2039 GB/s bant genişliği",
        "position": {
          "x_pct": 4,
          "y_pct": 64,
          "width_pct": 92,
          "height_pct": 20
        }
      },
      {
        "name": "NVLink 3.0 Arabirimi",
        "description": "600 GB/s GPU-GPU bağlantısı; DGX A100 sistemlerinin temeli",
        "position": {
          "x_pct": 4,
          "y_pct": 86,
          "width_pct": 92,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Tarihsel referans: bugünkü AI altyapısının nasıl şekillendiğini anlamak için",
      "Bulutta uygun maliyetli eğitim ve çıkarım — H100'e göre çok daha ucuz saatlik fiyat",
      "MIG ile çoklu kiracı senaryoları: tek kart, yedi izole iş yükü",
      "FP64 gerektiren bilimsel hesaplama — Blackwell'in aksine hâlâ dengeli"
    ],
    "comparison_notes": "H100 ile karşılaştırıldığında yaklaşık üçte bir hesap gücü ve yarı bellek bant genişliği sunuyor. Ama A100'ün asıl değeri karşılaştırma tablosunda değil: bu chip, bir mimarinin (Tensor Core + HBM + NVLink) endüstri standardını nasıl belirlediğinin en net örneği. Bugünkü B300 ve Rubin, A100'ün kurduğu şablonun üzerine inşa edildi.",
    "is_announced": true,
    "rumored": null,
    "tagline": "AI çağını başlatan chip — bugünkü her şeyin şablonu"
  },
  {
    "id": "nvidia-blackwell-rtx-5070",
    "name": "NVIDIA GeForce RTX 5070",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC 4N (özel 4nm)",
    "transistor_count": "31.1 milyar (GB205)",
    "die_size": "263 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — GeForce RTX 50 serisi",
    "key_specs": {
      "architecture": "Blackwell (GB205)",
      "cuda_cores": 6144,
      "compute_units": "48 SM",
      "tensor_cores": "192 adet (5. nesil)",
      "ray_tracing_cores": "48 adet (4. nesil)",
      "vram": "12 GB GDDR7",
      "vram_speed": "28 Gbps",
      "memory_interface": "192-bit",
      "memory_bandwidth": "672 GB/s",
      "boost_clock": "2512 MHz",
      "tdp": "250W",
      "pcie": "PCIe 5.0 x16"
    },
    "architecture_highlights": [
      "GB205 die'ı 263 mm² — GB202'nin (RTX 5090) yaklaşık üçte biri, ama transistör yoğunluğu benzer",
      "192-bit arayüz ve 12 GB VRAM, bu segmentin en tartışmalı noktası: 1440p'de bazı modern oyunlar bu kapasiteyi zorluyor",
      "DLSS 4 Multi Frame Generation desteği tam — etkin performansta ham güçten daha belirleyici olabiliyor",
      "250W TDP ile 650W güç kaynağıyla çalışabiliyor; sistem yükseltmesi gerektirmiyor",
      "Aynı die, RTX 5070'in altındaki modellerde kesilmiş haliyle kullanılıyor (binning)"
    ],
    "die_regions": [
      {
        "name": "GPC / SM Kümeleri",
        "description": "48 SM ve 6144 CUDA core; die yüzeyinin çoğunluğu",
        "position": {
          "x_pct": 8,
          "y_pct": 8,
          "width_pct": 60,
          "height_pct": 66
        }
      },
      {
        "name": "L2 Cache",
        "description": "192-bit arayüzün darlığını telafi eden önbellek bloğu",
        "position": {
          "x_pct": 70,
          "y_pct": 8,
          "width_pct": 24,
          "height_pct": 36
        }
      },
      {
        "name": "GDDR7 Bellek Denetleyicileri",
        "description": "3 adet 64-bit kanal, toplam 192-bit; 28 Gbps PAM3",
        "position": {
          "x_pct": 8,
          "y_pct": 78,
          "width_pct": 86,
          "height_pct": 12
        }
      },
      {
        "name": "Medya ve Görüntü Motoru",
        "description": "AV1 kodlama/çözme ve DisplayPort 2.1b çıkışları",
        "position": {
          "x_pct": 70,
          "y_pct": 48,
          "width_pct": 24,
          "height_pct": 24
        }
      }
    ],
    "use_cases": [
      "1440p oyun: DLSS 4 ile yüksek ayarlarda akıcı performans",
      "1080p ışın izleme: bu segmentte RT artık gerçekten kullanılabilir",
      "İçerik üretimi: AV1 kodlama ile yayın ve video düzenleme",
      "Yükseltme senaryosu: RTX 3060/3070 sahipleri için doğrudan hedef"
    ],
    "comparison_notes": "RTX 5080'e göre yaklaşık %57 CUDA core ve %70 bellek bant genişliği sunuyor, güç tüketimi ise 360W'tan 250W'a düşüyor. Asıl tartışma 12 GB VRAM: bugünün 1440p oyunlarında yeterli ama kartın ömrü boyunca yeterli kalacağı garanti değil. Bu, spec okurken 'bugün mü, üç yıl sonra mı?' sorusunu sormanın klasik örneği.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Orta segmentin merkezi — ve VRAM tartışmasının tam ortası"
  },
  {
    "id": "amd-rdna3-rx-7900xtx",
    "name": "AMD Radeon RX 7900 XTX (RDNA 3)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2022,
    "process_node": "TSMC N5 (GCD) + N6 (MCD'ler)",
    "transistor_count": "57.7 milyar (1 GCD + 6 MCD)",
    "die_size": "300 mm² (GCD) + 6 × 37 mm² (MCD)",
    "image": "rx-9070xt.png",
    "image_credit": "Temsilî görsel — Radeon ailesi",
    "key_specs": {
      "architecture": "RDNA 3 (Navi 31 — chiplet tabanlı)",
      "compute_units": "96 CU",
      "stream_processors": 6144,
      "ray_tracing_cores": "96 adet (2. nesil Ray Accelerator)",
      "vram": "24 GB GDDR6",
      "vram_speed": "20 Gbps",
      "memory_interface": "384-bit",
      "memory_bandwidth": "960 GB/s",
      "l3_cache": "96 MB Infinity Cache",
      "boost_clock": "2500 MHz",
      "tdp": "355W",
      "pcie": "PCIe 4.0 x16"
    },
    "architecture_highlights": [
      "Chiplet mimarisini tüketici GPU'suna taşıyan ilk ürün: 1 grafik die'ı (GCD) + 6 bellek die'ı (MCD)",
      "Bellek denetleyicileri ve Infinity Cache, ayrı MCD'lere taşındı ve daha ucuz N6 sürecinde üretildi — analog bloklar zaten iyi küçülmediği için mantıklı bir ayrım",
      "24 GB VRAM, çıktığı dönemde tüketici segmentinde en yüksek kapasiteydi; yerel AI çalıştırmak isteyenler için hâlâ cazip",
      "96 MB Infinity Cache, 384-bit arayüzün etkin bant genişliğini önemli ölçüde artırıyor",
      "Deneyimden çıkan ders: chiplet CPU'da temiz çalıştı ama GPU'da die'lar arası gecikme beklenen kazancı sınırladı — AMD RDNA 4'te monolitik tasarıma geri döndü"
    ],
    "die_regions": [
      {
        "name": "Graphics Compute Die (GCD)",
        "description": "96 CU ve tüm hesap mantığı; TSMC N5'te üretilen merkez die",
        "position": {
          "x_pct": 26,
          "y_pct": 20,
          "width_pct": 48,
          "height_pct": 46
        }
      },
      {
        "name": "Memory Cache Die'lar (6 × MCD)",
        "description": "Bellek denetleyicileri ve Infinity Cache; ucuz N6 sürecinde üretilir",
        "position": {
          "x_pct": 6,
          "y_pct": 20,
          "width_pct": 18,
          "height_pct": 46
        }
      },
      {
        "name": "MCD'ler (karşı taraf)",
        "description": "Simetrik yerleşim; toplam 6 MCD, 384-bit arayüzü oluşturur",
        "position": {
          "x_pct": 76,
          "y_pct": 20,
          "width_pct": 18,
          "height_pct": 46
        }
      },
      {
        "name": "Infinity Fabric Bağlantıları",
        "description": "GCD ile MCD'ler arasındaki yüksek hızlı köprüler",
        "position": {
          "x_pct": 6,
          "y_pct": 70,
          "width_pct": 88,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "4K oyun: 24 GB VRAM ile yüksek doku ayarlarında rahat",
      "Yerel AI: büyük VRAM kapasitesi, ROCm ile model çalıştırmak isteyenler için",
      "İçerik üretimi ve 3D: geniş bellek gerektiren sahneler",
      "Chiplet mimarisini incelemek: tüketici GPU'sunda bu yaklaşımın tek büyük örneği"
    ],
    "comparison_notes": "RX 9070 XT (RDNA 4) ile karşılaştırıldığında ham raster performansında yakın, ışın izleme ve FSR 4 desteğinde ise belirgin şekilde geride. Ama 24 GB VRAM'i hâlâ 9070 XT'nin 16 GB'ından fazla. Asıl öğretici yanı mimari: AMD chiplet'i GPU'ya taşıdı, kazanç beklendiği kadar olmayınca bir sonraki nesilde geri adım attı. Her mimari deneme başarıya ulaşmıyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Tüketici GPU'sunda chiplet denemesi — ve neden geri adım atıldı"
  },
  {
    "id": "intel-battlemage-arc-b570",
    "name": "Intel Arc B570 (Battlemage)",
    "manufacturer": "Intel",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N5 (5nm)",
    "transistor_count": "~19.6 milyar (BMG-G21)",
    "die_size": "272 mm²",
    "image": "arc-b580.png",
    "image_credit": "Temsilî görsel — Intel Arc B serisi",
    "key_specs": {
      "architecture": "Xe2 (Battlemage, BMG-G21)",
      "compute_units": "18 Xe2 çekirdeği",
      "ray_tracing_cores": "18 adet (2. nesil RTU)",
      "vram": "10 GB GDDR6",
      "vram_speed": "19 Gbps",
      "memory_interface": "160-bit",
      "memory_bandwidth": "380 GB/s",
      "boost_clock": "2500 MHz",
      "tdp": "150W",
      "pcie": "PCIe 4.0 x8",
      "npu_tops": "XMX matris birimleri (XeSS 2 için)"
    },
    "architecture_highlights": [
      "B580'in bir kademe altı: 20 yerine 18 Xe2 çekirdeği ve 12 GB yerine 10 GB VRAM — klasik bir binning ürünü",
      "160-bit gibi alışılmadık bir bellek arayüzü; NVIDIA ve AMD'nin 128/192/256-bit standardının dışına çıkıyor",
      "XMX matris birimleri XeSS 2'yi donanımda çalıştırıyor — Intel'in DLSS karşılığı",
      "PCIe 4.0 x8 arayüzü: eski PCIe 3.0 sistemlerde bant genişliği darboğazı yaratabiliyor, satın alırken dikkat edilmesi gereken bir detay",
      "150W TDP ve giriş segment fiyatıyla bütçe sistemleri hedefliyor"
    ],
    "die_regions": [
      {
        "name": "Xe2 Çekirdek Kümeleri",
        "description": "18 Xe2 çekirdeği, vektör motorları ve XMX matris birimleri",
        "position": {
          "x_pct": 10,
          "y_pct": 12,
          "width_pct": 56,
          "height_pct": 58
        }
      },
      {
        "name": "L2 Cache",
        "description": "Paylaşımlı önbellek; 160-bit arayüzü destekleyen tampon",
        "position": {
          "x_pct": 68,
          "y_pct": 12,
          "width_pct": 24,
          "height_pct": 32
        }
      },
      {
        "name": "GDDR6 Bellek Denetleyicileri",
        "description": "160-bit arayüz; 5 adet 32-bit kanal",
        "position": {
          "x_pct": 10,
          "y_pct": 74,
          "width_pct": 82,
          "height_pct": 14
        }
      },
      {
        "name": "Medya Motoru",
        "description": "AV1 kodlama/çözme; Intel'in geleneksel olarak güçlü olduğu alan",
        "position": {
          "x_pct": 68,
          "y_pct": 48,
          "width_pct": 24,
          "height_pct": 22
        }
      }
    ],
    "use_cases": [
      "1080p oyun: bütçe sistemlerde orta-yüksek ayarlar",
      "Video düzenleme ve yayın: Intel'in AV1 kodlayıcısı bu fiyat segmentinde güçlü",
      "Ev sunucusu / medya merkezi: düşük güç ve iyi kod çözme desteği",
      "İlk sistem kurulumu: giriş seviyesi fiyat noktası"
    ],
    "comparison_notes": "Arc B580'e göre yaklaşık %10 daha az hesap birimi ve %17 daha az bellek bant genişliği sunuyor. Intel'in bu segmentteki asıl silahı fiyat: benzer performanstaki NVIDIA ve AMD kartlarının altında konumlanıyor. Zayıf noktası sürücü olgunluğu — özellikle eski DirectX 11 oyunlarında performans değişkenlik gösterebiliyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Giriş segmentinde üçüncü oyuncu — 160-bit gibi alışılmadık tercihlerle"
  },
  {
    "id": "amd-zen5-ryzen-9-9950x3d",
    "name": "AMD Ryzen 9 9950X3D (Zen 5 + 3D V-Cache)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2025,
    "process_node": "TSMC N4P (CCD'ler) + N6 (IOD)",
    "transistor_count": "~2 × 8.6 milyar (CCD) + IOD",
    "die_size": "2 × 70.6 mm² (CCD) + 122 mm² (IOD)",
    "image": "ryzen-9950x.png",
    "image_credit": "Temsilî görsel — Ryzen 9000 serisi",
    "key_specs": {
      "architecture": "Zen 5, iki CCD — biri 3D V-Cache'li",
      "cores": 16,
      "threads": 32,
      "base_clock": "4.3 GHz",
      "boost_clock": "5.7 GHz",
      "l2_cache": "16 MB",
      "l3_cache": "128 MB (64 MB + 64 MB 3D V-Cache)",
      "socket": "AM5",
      "tdp": "170W",
      "pcie": "PCIe 5.0, 24 hat",
      "igpu": "2 çekirdekli RDNA 2"
    },
    "architecture_highlights": [
      "Asimetrik tasarım: iki CCD'den sadece birinde 3D V-Cache var. Diğer CCD daha yüksek frekansa çıkabiliyor",
      "Bu asimetri bir zamanlama problemi yaratıyor: Windows'un oyunu cache'li CCD'ye, render işini frekans CCD'sine yönlendirmesi gerekiyor",
      "Yönlendirme yazılım tarafında çözülüyor (AMD sürücüsü + Xbox Game Bar); yanlış çalıştığında performans beklenenin altında kalabiliyor",
      "9800X3D'ye göre iki katı çekirdek ama oyunda benzer performans — çünkü oyun zaten cache'li CCD'de çalışıyor",
      "Toplam 144 MB cache (L2 + L3), masaüstü segmentinde rekor seviyede",
      "İkinci nesil 3D V-Cache yerleşimi burada da geçerli: cache altta, çekirdekler soğutucuya bakıyor"
    ],
    "die_regions": [
      {
        "name": "CCD 0 (3D V-Cache'li)",
        "description": "8 Zen 5 çekirdeği + 64 MB dikey cache; oyun iş yükleri buraya yönlendirilir",
        "position": {
          "x_pct": 10,
          "y_pct": 12,
          "width_pct": 34,
          "height_pct": 40
        }
      },
      {
        "name": "CCD 1 (standart)",
        "description": "8 Zen 5 çekirdeği, daha yüksek frekansa çıkabiliyor; render ve derleme için",
        "position": {
          "x_pct": 10,
          "y_pct": 54,
          "width_pct": 34,
          "height_pct": 30
        }
      },
      {
        "name": "3D V-Cache Katmanı",
        "description": "CCD 0'ın altına TSV'lerle bağlanan 64 MB ek SRAM",
        "position": {
          "x_pct": 10,
          "y_pct": 46,
          "width_pct": 34,
          "height_pct": 8
        }
      },
      {
        "name": "I/O Die (IOD)",
        "description": "Bellek denetleyicisi, 24 PCIe 5.0 hattı ve entegre RDNA 2 GPU",
        "position": {
          "x_pct": 50,
          "y_pct": 12,
          "width_pct": 40,
          "height_pct": 72
        }
      }
    ],
    "use_cases": [
      "Oyun + üretkenlik birlikte: tek sistemde hem yüksek kare hızı hem render gücü",
      "Yayıncılık: oyun cache'li CCD'de, kodlama diğer CCD'de",
      "İş istasyonu: 16 çekirdek ile derleme, simülasyon ve 3D render",
      "Tek makine ile her şeyi yapmak isteyenler için 'uzlaşma' seçeneği"
    ],
    "comparison_notes": "9800X3D ile oyun performansı neredeyse aynı, ama çok çekirdekli işlerde iki katı hızlı. 9950X ile çok çekirdekli performans benzer, ama oyunda belirgin şekilde önde. Bedeli: fiyat ve zamanlayıcının doğru çalışmasına bağımlılık. Sadece oyun oynayacaksan 9800X3D daha mantıklı bir tercih.",
    "is_announced": true,
    "rumored": null,
    "tagline": "İki CCD, tek 3D cache — ve işletim sistemine düşen zor karar"
  },
  {
    "id": "amd-strix-halo-ai-max-395",
    "name": "AMD Ryzen AI Max+ 395 (Strix Halo)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2025,
    "process_node": "TSMC N4 (hesap die'ları) + N6 (I/O die)",
    "transistor_count": "Açıklanmadı (çoklu die)",
    "die_size": "Büyük APU paketi, chiplet tabanlı",
    "image": "ryzen-9950x.png",
    "image_credit": "Temsilî görsel — AMD APU",
    "key_specs": {
      "architecture": "Zen 5 CPU + RDNA 3.5 GPU + XDNA 2 NPU, birleşik bellek",
      "cores": 16,
      "threads": 32,
      "boost_clock": "5.1 GHz'e kadar",
      "l3_cache": "64 MB",
      "igpu": "Radeon 8060S — 40 CU RDNA 3.5",
      "npu": "XDNA 2",
      "npu_tops": "50 TOPS",
      "memory_speed": "LPDDR5X-8000, 256-bit",
      "capacity": "128 GB'a kadar birleşik bellek",
      "bandwidth": "~256 GB/s",
      "tdp": "55-120W (yapılandırılabilir)"
    },
    "architecture_highlights": [
      "x86 dünyasında Apple tarzı birleşik belleği uygulayan ilk büyük ürün: CPU, GPU ve NPU aynı 128 GB havuzu paylaşıyor",
      "256-bit LPDDR5X arayüzü, tipik dizüstü işlemcilerin 128-bit'inin iki katı",
      "40 CU'luk Radeon 8060S, entegre grafik olarak alışılmadık derecede büyük — orta segment harici kartlarla yarışıyor",
      "Yerel AI için kritik avantaj: 70B+ parametreli modeller GPU belleğine sığıyor. Hiçbir tüketici harici GPU'su bunu yapamıyor",
      "Kritik sınır bant genişliği: 256 GB/s, RTX 5090'ın 1792 GB/s'sinin yanında düşük kalıyor. Yani büyük modeller çalışıyor ama yavaş üretiyor",
      "Küçük modellerde (32B altı) harici bir GPU hâlâ belirgin şekilde hızlı — bu chip'in kazandığı yer kapasite, hız değil"
    ],
    "die_regions": [
      {
        "name": "Zen 5 CCD'leri (2 × 8 çekirdek)",
        "description": "16 Zen 5 çekirdeği; masaüstü Ryzen ile aynı hesap die'ları",
        "position": {
          "x_pct": 8,
          "y_pct": 12,
          "width_pct": 34,
          "height_pct": 40
        }
      },
      {
        "name": "Radeon 8060S GPU (40 CU)",
        "description": "RDNA 3.5 tabanlı büyük entegre grafik; paketin en geniş bloğu",
        "position": {
          "x_pct": 46,
          "y_pct": 12,
          "width_pct": 44,
          "height_pct": 40
        }
      },
      {
        "name": "XDNA 2 NPU (50 TOPS)",
        "description": "Düşük güçlü AI hızlandırıcı; Copilot+ eşiğinin üzerinde",
        "position": {
          "x_pct": 8,
          "y_pct": 56,
          "width_pct": 26,
          "height_pct": 14
        }
      },
      {
        "name": "256-bit LPDDR5X Arayüzü",
        "description": "128 GB'a kadar birleşik belleği süren geniş bellek denetleyicisi",
        "position": {
          "x_pct": 8,
          "y_pct": 74,
          "width_pct": 82,
          "height_pct": 16
        }
      }
    ],
    "use_cases": [
      "Yerel büyük dil modeli çalıştırma: 70B-200B parametreli modeller tek makinede",
      "Kompakt iş istasyonları: harici GPU olmadan ciddi grafik ve hesap gücü",
      "Gizlilik odaklı AI geliştirme: bulut kullanmadan, tamamen çevrimdışı",
      "Oyun destekli mini PC'ler: 40 CU iGPU ile 1080p-1440p oyun"
    ],
    "comparison_notes": "Apple M4 Max ile aynı fikri uyguluyor ama farklı noktada duruyor: kapasite benzer, bant genişliği (256 GB/s vs 546 GB/s) belirgin şekilde düşük, fiyat ise çok daha uygun. RTX 5090 ile karşılaştırma ise doğrudan yapılamaz — 5090 çok daha hızlı ama 32 GB'a sığmayan modelleri hiç çalıştıramaz. Bu chip, 'kapasite mi hız mı' ödünleşiminin en net örneği.",
    "is_announced": true,
    "rumored": null,
    "tagline": "x86'nın birleşik bellek cevabı — 128 GB, ama 256 GB/s"
  },
  {
    "id": "nvidia-grace-cpu",
    "name": "NVIDIA Grace CPU",
    "manufacturer": "NVIDIA",
    "category": "CPU",
    "release_year": 2023,
    "process_node": "TSMC 4N (4nm)",
    "transistor_count": "Açıklanmadı",
    "die_size": "Tek die + paket üstü LPDDR5X",
    "image": "epyc-9965.png",
    "image_credit": "Temsilî görsel — sunucu işlemcisi",
    "key_specs": {
      "architecture": "72 × ARM Neoverse V2",
      "cores": 72,
      "threads": 72,
      "base_clock": "~3.1 GHz",
      "l3_cache": "117 MB",
      "memory_speed": "LPDDR5X (ECC destekli), 480 GB'a kadar",
      "bandwidth": "~500 GB/s",
      "nvlink": "NVLink-C2C, 900 GB/s (GPU'ya bağlantı)",
      "tdp": "~500W (Grace Hopper superchip paketi)"
    },
    "architecture_highlights": [
      "NVIDIA'nın kendi CPU'su: amaç genel amaçlı sunucu pazarı değil, GPU'ya en iyi hizmet eden yardımcı işlemci olmak",
      "NVLink-C2C ile GPU'ya 900 GB/s bağlantı — PCIe 5.0'ın yaklaşık 7 katı. Bu, CPU ve GPU belleğinin tutarlı (coherent) paylaşımını mümkün kılıyor",
      "Sunucu CPU'larının aksine DDR5 DIMM değil, paket üstü LPDDR5X kullanıyor: daha az esneklik, ama watt başına çok daha iyi bant genişliği",
      "GB200 ve GB300 sistemlerinde her karta 1-2 Grace CPU düşüyor; GPU'ları besleme ve veri hazırlama işini üstleniyor",
      "72 Neoverse V2 çekirdeği ile ARM sunucu ekosisteminin en görünür örneklerinden biri"
    ],
    "die_regions": [
      {
        "name": "Neoverse V2 Çekirdek Dizisi",
        "description": "72 ARM çekirdeği, ölçeklenebilir tutarlı bir ağ üzerinde bağlı",
        "position": {
          "x_pct": 12,
          "y_pct": 12,
          "width_pct": 62,
          "height_pct": 50
        }
      },
      {
        "name": "L3 Cache (117 MB)",
        "description": "Çekirdekler arasında paylaşılan büyük önbellek",
        "position": {
          "x_pct": 12,
          "y_pct": 64,
          "width_pct": 62,
          "height_pct": 12
        }
      },
      {
        "name": "NVLink-C2C Arabirimi",
        "description": "GPU'ya 900 GB/s tutarlı bağlantı; Grace'in varlık sebebi",
        "position": {
          "x_pct": 78,
          "y_pct": 12,
          "width_pct": 14,
          "height_pct": 64
        }
      },
      {
        "name": "Paket Üstü LPDDR5X",
        "description": "480 GB'a kadar ECC destekli bellek; DIMM yerine lehimli",
        "position": {
          "x_pct": 8,
          "y_pct": 80,
          "width_pct": 84,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "GB200/GB300 sistemlerinde GPU'ları besleyen ana işlemci",
      "Büyük veri kümelerinin ön işlenmesi ve GPU'ya aktarılması",
      "Tutarlı bellek gerektiren AI iş akışları: CPU ve GPU aynı veriyi kopyalamadan görüyor",
      "ARM tabanlı HPC: enerji verimliliğinin öncelikli olduğu bilimsel hesaplama"
    ],
    "comparison_notes": "AMD EPYC veya Intel Xeon ile doğrudan karşılaştırmak yanıltıcı olur — Grace genel amaçlı sunucu işi için tasarlanmadı. 72 çekirdeği EPYC Turin'in 192'sinin çok altında ve DIMM esnekliği yok. Ama GPU'ya 900 GB/s ile bağlanabilen tek CPU o. Bu, 'chip'i neye göre değerlendiriyorsun' sorusunun ders kitabı örneği.",
    "is_announced": true,
    "rumored": null,
    "tagline": "GPU'ya hizmet için tasarlanmış CPU — 900 GB/s ile bağlı"
  },
  {
    "id": "ram-sram",
    "name": "SRAM (Cache Belleğin Kendisi)",
    "manufacturer": "JEDEC",
    "category": "RAM",
    "release_year": 1963,
    "process_node": "Chip ile aynı süreçte, die üzerinde üretilir",
    "transistor_count": "Bit başına 6 transistör (6T hücre)",
    "die_size": "Modern chip'lerde die alanının %30-50'si",
    "image": "ryzen-9950x.png",
    "image_credit": "Temsilî görsel — SRAM chip üzerinde yer alır",
    "key_specs": {
      "standard": "Standart bir modül değil — işlemci die'ının parçası",
      "architecture": "6 transistörlü hücre (6T), geri beslemeli kilitleyici",
      "speed": "Erişim ~1-2 nanosaniye (L1)",
      "capacity": "L1'de 32-64 KB, L3'te 500 MB'a kadar",
      "voltage": "Chip çekirdek voltajıyla aynı",
      "bandwidth": "Terabayt/saniye seviyesinde (çekirdek içi)"
    },
    "architecture_highlights": [
      "DRAM bir bit'i tek transistör + tek kapasitörde saklar; SRAM ise altı transistörde. Bu yüzden SRAM aynı kapasite için ~20 kat fazla alan kaplar",
      "SRAM'in tazelenmesi gerekmez — 'statik' olmasının sebebi bu. Güç verildiği sürece veri kendini korur",
      "Karşılığında dramatik bir hız farkı var: SRAM'e erişim nanosaniyeler, DRAM'e erişim onlarca nanosaniye sürer",
      "Kritik sorun: SRAM artık süreç düğümleriyle küçülmüyor. TSMC N5'ten N3'e geçişte mantık devreleri belirgin şekilde küçüldü ama SRAM neredeyse hiç küçülmedi",
      "Bu 'SRAM ölçekleme duvarı', cache'in her nesilde die alanının daha büyük bir yüzdesini kaplaması demek — ve 3D V-Cache gibi dikey çözümlerin çıkış sebebi",
      "Bir chip'in fiyatının nereye gittiğini anlamak istiyorsan: modern bir CPU die'ında cache genellikle çekirdeklerden fazla yer kaplar"
    ],
    "die_regions": [
      {
        "name": "L1 Cache (çekirdek içi)",
        "description": "Her çekirdeğin kendi 32-64 KB'lık en hızlı belleği; ~4 çevrim erişim",
        "position": {
          "x_pct": 12,
          "y_pct": 14,
          "width_pct": 20,
          "height_pct": 16
        }
      },
      {
        "name": "L2 Cache (çekirdeğe özel)",
        "description": "Çekirdek başına 0.5-2 MB; L1 ile L3 arasındaki köprü",
        "position": {
          "x_pct": 12,
          "y_pct": 32,
          "width_pct": 32,
          "height_pct": 20
        }
      },
      {
        "name": "L3 Cache Dilimleri (paylaşımlı)",
        "description": "Tüm çekirdeklerin eriştiği büyük havuz; die alanının önemli kısmı",
        "position": {
          "x_pct": 12,
          "y_pct": 54,
          "width_pct": 76,
          "height_pct": 26
        }
      },
      {
        "name": "6T Hücre Dizisi",
        "description": "Her bit için 6 transistör; yoğunluk düşük ama hız çok yüksek",
        "position": {
          "x_pct": 12,
          "y_pct": 82,
          "width_pct": 76,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "İşlemci cache'leri: L1, L2, L3 — tamamı SRAM'dir",
      "GPU'lardaki paylaşımlı bellek ve register dosyaları",
      "AMD 3D V-Cache: dikey olarak istiflenen ek SRAM katmanı",
      "Ağ ekipmanı ve gömülü sistemlerdeki hızlı tamponlar"
    ],
    "comparison_notes": "DRAM ile karşılaştırma bir ödünleşim dersi: SRAM ~20 kat fazla alan kaplar ve çok daha pahalıdır, ama onlarca kat hızlıdır ve tazeleme gerektirmez. Bu yüzden SRAM gigabaytlarca değil megabaytlarca kullanılır. Bir chip'in spec sayfasında '96 MB L3' gördüğünde, aslında die'ın önemli bir bölümünün ve maliyetinin nereye gittiğini okuyorsun.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Spec sayfasındaki 'cache' satırının arkasındaki gerçek"
  },
  {
    "id": "ram-hbm3",
    "name": "HBM3 (Yüksek Bant Genişlikli Bellek 3)",
    "manufacturer": "JEDEC",
    "category": "RAM",
    "release_year": 2022,
    "process_node": "1a/1b nm sınıfı DRAM",
    "transistor_count": "Yığın başına milyarlarca hücre",
    "die_size": "8-12 katman dikey istifleme",
    "image": "hbm3e.png",
    "image_credit": "Temsilî görsel — HBM ailesi",
    "key_specs": {
      "standard": "JEDEC JESD238 (2022)",
      "memory_interface": "Yığın başına 1024-bit",
      "data_rate": "6.4 Gbps/pin",
      "bandwidth": "Yığın başına ~819 GB/s",
      "capacity_per_module": "Yığın başına 24 GB'a kadar (12-Hi)",
      "voltage": "1.1V",
      "modulation": "NRZ"
    },
    "architecture_highlights": [
      "H100'ün ilk sürümünde kullanılan bellek: 5 yığın ile 80 GB ve 3.35 TB/s",
      "HBM2e'ye göre pin hızı 3.6'dan 6.4 Gbps'ye çıktı — yığın başına bant genişliği neredeyse iki katına",
      "Kanal sayısı 8'den 16'ya çıkarıldı; her kanal iki sözde-kanala (pseudo-channel) bölünüyor",
      "16 bağımsız kanal, AI iş yüklerinin düzensiz erişim desenlerinde ham bant genişliğinden bile önemli",
      "HBM3E ile aynı arayüz genişliği (1024-bit) korunurken pin hızı 9.6 Gbps'ye çıkarıldı — HBM4'e kadar arayüz sabit kaldı"
    ],
    "die_regions": [
      {
        "name": "DRAM Katmanları (8-12 Hi)",
        "description": "Üst üste istiflenmiş bellek die'ları; toplam 24 GB'a kadar",
        "position": {
          "x_pct": 16,
          "y_pct": 14,
          "width_pct": 68,
          "height_pct": 40
        }
      },
      {
        "name": "Taban Die (Base Die)",
        "description": "Yığının denetleyicisi; HBM4'ün aksine hâlâ DRAM sürecinde üretilir",
        "position": {
          "x_pct": 16,
          "y_pct": 56,
          "width_pct": 68,
          "height_pct": 12
        }
      },
      {
        "name": "TSV Dizileri",
        "description": "1024-bit arayüzü mümkün kılan dikey bağlantılar",
        "position": {
          "x_pct": 16,
          "y_pct": 14,
          "width_pct": 8,
          "height_pct": 54
        }
      },
      {
        "name": "Silikon Interposer",
        "description": "Yığını GPU die'ına bağlayan taşıyıcı katman",
        "position": {
          "x_pct": 8,
          "y_pct": 70,
          "width_pct": 84,
          "height_pct": 16
        }
      }
    ],
    "use_cases": [
      "NVIDIA H100 80GB: HBM3'ün en yaygın uygulaması",
      "AMD Instinct MI300X: 192 GB kapasiteyle HBM3 kullanan diğer büyük platform",
      "FPGA ve özel AI hızlandırıcıları",
      "HPC sistemleri: yüksek bant genişliği gerektiren bilimsel kodlar"
    ],
    "comparison_notes": "HBM3E'ye göre pin hızı 6.4'e karşı 9.6 Gbps ve yığın kapasitesi 24'e karşı 36 GB. HBM4 ile kıyaslandığında ise en temel fark arayüz genişliği: HBM3 ve HBM3E 1024-bit kullanırken HBM4 bunu 2048-bit'e çıkarıyor. Yani HBM3 → HBM3E bir hız artışı, HBM3E → HBM4 ise yapısal bir değişim.",
    "is_announced": true,
    "rumored": null,
    "tagline": "H100'ü besleyen nesil — 1024-bit arayüzün olgunluk noktası"
  },
  {
    "id": "ram-gddr6x",
    "name": "GDDR6X (PAM4 Modülasyonlu Grafik Belleği)",
    "manufacturer": "Micron",
    "category": "RAM",
    "release_year": 2020,
    "process_node": "1x nm sınıfı DRAM",
    "transistor_count": "Chip başına milyarlarca hücre",
    "die_size": "Chip başına 8-16 Gb yoğunluk",
    "image": "gddr7.png",
    "image_credit": "Temsilî görsel — GDDR ailesi",
    "key_specs": {
      "standard": "JEDEC standardı değil — Micron ve NVIDIA ortak geliştirmesi",
      "data_rate": "19-24 Gbps/pin",
      "modulation": "PAM4 (4 seviyeli sinyalleşme)",
      "bus_width": "Chip başına 32-bit",
      "capacity_per_module": "Chip başına 8-16 Gb",
      "voltage": "1.35V",
      "bandwidth": "384-bit arayüzde ~1 TB/s"
    },
    "architecture_highlights": [
      "PAM4 kullanır: her sinyal çevriminde dört farklı voltaj seviyesi ile 2 bit taşır. GDDR6'nın NRZ'si ise 1 bit taşır",
      "Sonuç: aynı sinyal frekansında iki katı veri. Ama bedeli ağır — dört seviye arasındaki fark küçüldüğü için gürültüye çok daha duyarlı",
      "Isı sorunu bu kartların tanımlayıcı özelliği oldu: RTX 3080/3090'da bellek sıcaklıkları 100°C'yi aşabiliyordu",
      "JEDEC standardı değil, tek kaynaklı (Micron) bir üründü — bu, tedarik zinciri açısından risk anlamına geliyor",
      "GDDR7 dersi çıkardı: PAM4 yerine PAM3 (üç seviye) seçildi. Daha az bit ama çok daha iyi sinyal bütünlüğü ve ısı davranışı"
    ],
    "die_regions": [
      {
        "name": "Bellek Hücre Dizileri",
        "description": "Verinin saklandığı ana alan",
        "position": {
          "x_pct": 10,
          "y_pct": 12,
          "width_pct": 80,
          "height_pct": 42
        }
      },
      {
        "name": "PAM4 Kodlayıcı / Kod Çözücü",
        "description": "Dört voltaj seviyesini üreten ve okuyan devre; GDDR6'da bulunmaz",
        "position": {
          "x_pct": 10,
          "y_pct": 56,
          "width_pct": 80,
          "height_pct": 12
        }
      },
      {
        "name": "Sinyal Bütünlüğü Devreleri",
        "description": "PAM4'ün gürültü hassasiyetini telafi eden denkleştirme mantığı",
        "position": {
          "x_pct": 10,
          "y_pct": 70,
          "width_pct": 80,
          "height_pct": 10
        }
      },
      {
        "name": "I/O Arayüzü (32-bit)",
        "description": "19-24 Gbps efektif veri hızı",
        "position": {
          "x_pct": 10,
          "y_pct": 82,
          "width_pct": 80,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "RTX 30 ve RTX 40 serisinin üst modelleri",
      "Yüksek çözünürlüklü oyun: 4K ve üzeri bant genişliği ihtiyacı",
      "Workstation kartları: büyük sahne ve doku verileri",
      "Mimari ders: agresif sinyalleşmenin sınırlarını görmek için"
    ],
    "comparison_notes": "GDDR6'ya göre aynı frekansta iki katı veri taşır, ama ısı ve güç tüketimi belirgin şekilde yüksektir. GDDR7'nin PAM3'ü ise ikisi arasında bilinçli bir orta yol: PAM4 kadar agresif değil, ama NRZ'den fazla bilgi taşıyor. Bu üçlü, mühendislikte 'en agresif çözüm her zaman kazanmaz' ilkesinin somut örneği.",
    "is_announced": true,
    "rumored": null,
    "tagline": "PAM4 denemesi — ve neden GDDR7 daha ölçülü bir yol seçti"
  },
  {
    "id": "nvidia-ada-l40s",
    "name": "NVIDIA L40S",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2023,
    "process_node": "TSMC 4N (özel 4nm)",
    "transistor_count": "76.3 milyar (AD102)",
    "die_size": "609 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi kartı",
    "key_specs": {
      "architecture": "Ada Lovelace (AD102)",
      "cuda_cores": 18176,
      "tensor_cores": "568 adet (4. nesil)",
      "vram": "48 GB GDDR6 ECC",
      "memory_bandwidth": "864 GB/s",
      "memory_interface": "384-bit",
      "fp8_tflops": "~733 TFLOPS (seyrek)",
      "l2_cache": "96 MB",
      "tdp": "350W",
      "form_factor": "PCIe çift yuva"
    },
    "architecture_highlights": [
      "HBM yerine GDDR6 kullanan bir veri merkezi kartı: bant genişliği düşük ama maliyet ve güç çok daha uygun",
      "Çıkarım ve medya iş yükleri için tasarlandı; üç adet NVENC kodlayıcısıyla video işlemede güçlü",
      "48 GB kapasite, orta boy modelleri tek kartta çalıştırmaya yetiyor — kiralama tarafında en çok tercih edilen dengeli seçeneklerden",
      "Eğitim için değil çıkarım için: FP64 performansı kasıtlı olarak çok düşük tutulmuş"
    ],
    "use_cases": [
      "Orta ölçekli dil modeli çıkarımı",
      "Video kodlama ve akış hizmetleri",
      "Görüntü üretimi (Stable Diffusion vb.)"
    ],
    "die_regions": [],
    "comparison_notes": "H100'e göre bant genişliği beşte biri kadar ama fiyatı da öyle. Bellek sınırlı olmayan çıkarım işlerinde watt ve dolar başına daha verimli olabiliyor.",
    "is_announced": true,
    "rumored": false,
    "tagline": "HBM'siz veri merkezi kartı — bant genişliğinden feragat, maliyetten kazanç"
  },
  {
    "id": "nvidia-ada-l4",
    "name": "NVIDIA L4",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2023,
    "process_node": "TSMC 4N (özel 4nm)",
    "transistor_count": "35.8 milyar (AD104)",
    "die_size": "294 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi kartı",
    "key_specs": {
      "architecture": "Ada Lovelace (AD104)",
      "cuda_cores": 7680,
      "vram": "24 GB GDDR6",
      "memory_bandwidth": "300 GB/s",
      "memory_interface": "192-bit",
      "tdp": "72W",
      "form_factor": "Tek yuva, düşük profil, ek güç kablosu gerektirmez"
    },
    "architecture_highlights": [
      "72W'lık güç bütçesi bu kartın tüm tasarımını belirliyor: ek güç konnektörü yok, tek yuva kaplıyor",
      "Bu sayede standart sunuculara yoğun şekilde yerleştirilebiliyor — raf başına kart sayısı, kart başına performanstan önemli hale geliyor",
      "Düşük gecikmeli, yüksek hacimli çıkarım için tasarlandı; eğitim hedef kitlesi değil",
      "Watt başına performansın neden bir tasarım hedefi olduğunun en net örneklerinden"
    ],
    "use_cases": [
      "Yüksek hacimli çıkarım servisleri",
      "Video akışı ve transkodlama",
      "Kenar (edge) veri merkezleri"
    ],
    "die_regions": [],
    "comparison_notes": "T4'ün yerine geçen kart: aynı 70-72W sınıfında ama üç kat fazla bellek ve çok daha güçlü Tensor Core'lar.",
    "is_announced": true,
    "rumored": false,
    "tagline": "72 watt'lık veri merkezi kartı — yoğunluk, performanstan önce gelir"
  },
  {
    "id": "nvidia-ampere-a10",
    "name": "NVIDIA A10",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2021,
    "process_node": "Samsung 8N (8nm)",
    "transistor_count": "28.3 milyar (GA102)",
    "die_size": "628 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi kartı",
    "key_specs": {
      "architecture": "Ampere (GA102)",
      "cuda_cores": 9216,
      "vram": "24 GB GDDR6",
      "memory_bandwidth": "600 GB/s",
      "memory_interface": "384-bit",
      "tdp": "150W",
      "form_factor": "Tek yuva PCIe"
    },
    "architecture_highlights": [
      "RTX 3090 ile aynı GA102 die'ını kullanır ama tek yuvaya ve 150W'a sığdırılmış",
      "Aynı silikonun tüketici ve veri merkezi ürünü olarak nasıl farklı paketlendiğinin örneği",
      "Grafik ve çıkarım karışık iş yükleri için konumlandırıldı"
    ],
    "use_cases": [
      "Sanal masaüstü (VDI)",
      "Orta ölçekli çıkarım",
      "Bulut oyun ve render"
    ],
    "die_regions": [],
    "comparison_notes": "RTX 3090 ile aynı die'ı paylaşır; fark paketleme, güç zarfı ve ECC bellek desteğinde.",
    "is_announced": true,
    "rumored": false,
    "tagline": "RTX 3090'ın die'ı, veri merkezi kılığında"
  },
  {
    "id": "nvidia-turing-t4",
    "name": "NVIDIA T4",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2018,
    "process_node": "TSMC 12nm FFN",
    "transistor_count": "13.6 milyar (TU104)",
    "die_size": "545 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi kartı",
    "key_specs": {
      "architecture": "Turing (TU104)",
      "cuda_cores": 2560,
      "tensor_cores": "320 adet (2. nesil)",
      "vram": "16 GB GDDR6",
      "memory_bandwidth": "320 GB/s",
      "memory_interface": "256-bit",
      "tdp": "70W",
      "form_factor": "Tek yuva, düşük profil"
    },
    "architecture_highlights": [
      "Tensor Core'lu ilk yaygın çıkarım kartı; INT8 ve INT4 desteğiyle kuantalanmış modelleri popülerleştirdi",
      "70W'lık zarf, onu yıllarca bulut sağlayıcılarının varsayılan çıkarım kartı yaptı",
      "Bugün mimari olarak eski ama kiralama listelerinde hâlâ çok yaygın — düşük fiyatı sayesinde"
    ],
    "use_cases": [
      "Küçük model çıkarımı",
      "Video analitiği",
      "Uygun maliyetli bulut GPU'su"
    ],
    "die_regions": [],
    "comparison_notes": "Bugün L4 tarafından geçildi, ama kiralama fiyatı çok düşük kaldığı için küçük işlerde hâlâ ekonomik.",
    "is_announced": true,
    "rumored": false,
    "tagline": "Bir neslin varsayılan çıkarım kartı"
  },
  {
    "id": "nvidia-volta-v100",
    "name": "NVIDIA Tesla V100",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2017,
    "process_node": "TSMC 12nm FFN",
    "transistor_count": "21.1 milyar (GV100)",
    "die_size": "815 mm²",
    "image": "h100.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi ailesi",
    "key_specs": {
      "architecture": "Volta (GV100)",
      "cuda_cores": 5120,
      "tensor_cores": "640 adet (1. nesil)",
      "vram": "16 GB / 32 GB HBM2",
      "memory_bandwidth": "900 GB/s",
      "memory_interface": "4096-bit",
      "fp64_tflops": "7.8 TFLOPS",
      "fp16_tflops": "125 TFLOPS (Tensor Core)",
      "tdp": "300W (SXM2)",
      "form_factor": "SXM2 / PCIe"
    },
    "architecture_highlights": [
      "Tensor Core'u tanıtan mimari — bugünkü AI hızlandırıcılarının başlangıç noktası",
      "815 mm² ile zamanının en büyük die'ıydı; retikül sınırına dayanmanın ilk örneklerinden",
      "Güçlü FP64 performansı sayesinde bilimsel hesaplamada hâlâ kullanılıyor",
      "Modern kartlarla kıyaslandığında yavaş, ama kiralama fiyatı çok düşük olduğu için öğrenme amaçlı hâlâ mantıklı"
    ],
    "use_cases": [
      "Bilimsel simülasyon",
      "Eski model eğitimi",
      "Düşük bütçeli deneyler"
    ],
    "die_regions": [],
    "comparison_notes": "A100'ün öncülü. FP64 gücü A100'ün yarısı kadar; modern AI iş yüklerinde ise Tensor Core nesli çok geride.",
    "is_announced": true,
    "rumored": false,
    "tagline": "Tensor Core'un doğduğu yer"
  },
  {
    "id": "amd-cdna3-instinct-mi325x",
    "name": "AMD Instinct MI325X",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC N5 + N6 (chiplet)",
    "transistor_count": "153 milyar (toplam, çoklu die)",
    "die_size": "8 XCD + 4 IOD (çoklu die paket)",
    "image": "mi300x.png",
    "image_credit": "Temsilî görsel — AMD Instinct ailesi",
    "key_specs": {
      "architecture": "CDNA 3",
      "compute_units": "304 CU",
      "vram": "256 GB HBM3E",
      "memory_bandwidth": "6 TB/s",
      "fp8_tflops": "~2615 TFLOPS (seyrek)",
      "fp16_tflops": "~1307 TFLOPS (seyrek)",
      "infinity_cache": "256 MB",
      "tdp": "1000W",
      "form_factor": "OAM"
    },
    "architecture_highlights": [
      "MI300X'in bellek yükseltilmiş sürümü: aynı CDNA 3 hesap yapısı, 192 GB yerine 256 GB HBM3E",
      "Tek kartta en yüksek bellek kapasitesi — büyük modelleri bölmeden çalıştırmayı hedefliyor",
      "H200'e karşı konumlandırıldı; kapasite avantajı var, yazılım ekosisteminde CUDA'nın gerisinde",
      "'Aynı silikon + daha iyi bellek' stratejisinin AMD tarafındaki karşılığı"
    ],
    "use_cases": [
      "Büyük model çıkarımı",
      "Tek kartta 100B+ parametre",
      "HPC"
    ],
    "die_regions": [],
    "comparison_notes": "MI300X ile aynı hesap yapısı, 64 GB fazla bellek. H200'ün 141 GB'ına karşı 256 GB sunuyor.",
    "is_announced": true,
    "rumored": false,
    "tagline": "Tek kartta en çok bellek — kapasiteyle kazanma stratejisi"
  },
  {
    "id": "nvidia-grace-blackwell-gb200",
    "name": "NVIDIA GB200 Grace Blackwell Superchip",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC 4NP (GPU) + TSMC 4N (CPU)",
    "transistor_count": "416 milyar (2 × 208 milyar GPU) + Grace CPU",
    "die_size": "Çoklu die paketi — 4 GPU die + 1 CPU die",
    "image": "blackwell-b200.png",
    "image_credit": "Temsilî görsel — Blackwell ailesi",
    "kiralama_birimi": {
      "gpu_sayisi": 2,
      "not": "Kiralama fiyatları GPU başına; bu kayıt 2 Blackwell GPU'lu süper chip birimini anlatıyor."
    },
    "key_specs": {
      "architecture": "Grace Blackwell (1 Grace CPU + 2 Blackwell GPU)",
      "cpu": "72 çekirdekli Arm Neoverse V2 (Grace)",
      "vram": "384 GB HBM3e (GPU) + 480 GB LPDDR5X (CPU)",
      "memory_bandwidth": "16 TB/s (GPU tarafı, 2 × 8 TB/s)",
      "nvlink": "NVLink 5, 1.8 TB/s GPU-GPU",
      "interconnect": "NVLink-C2C 900 GB/s CPU-GPU",
      "fp4_tflops": "20 PFLOPS (seyrek, 2 GPU toplamı)",
      "form_factor": "GB200 NVL72 rafında 36 superchip",
      "tdp": "~2700W (superchip başına)"
    },
    "architecture_highlights": [
      "Tek bir modül içinde CPU ve iki GPU: Grace, Blackwell'lere NVLink-C2C ile 900 GB/s hızında bağlı — PCIe'den yaklaşık yedi kat hızlı",
      "CPU'nun 480 GB LPDDR5X belleği GPU tarafından doğrudan adreslenebiliyor; model ağırlıkları HBM'e sığmadığında taşma yolu bu",
      "NVL72 rafında 72 GPU tek bir NVLink alanında birleşiyor ve yazılım açısından dev tek bir GPU gibi görünüyor",
      "Raf başına güç yoğunluğu sıvı soğutmayı zorunlu kılıyor — hava soğutma bu sınıfta artık mümkün değil"
    ],
    "die_regions": [
      {
        "name": "Blackwell GPU #1 (2 die)",
        "description": "İki retiküle sığdırılmış die, 10 TB/s NV-HBI köprüsüyle tek GPU gibi çalışıyor",
        "position": {
          "x_pct": 4,
          "y_pct": 6,
          "width_pct": 44,
          "height_pct": 40
        }
      },
      {
        "name": "Blackwell GPU #2 (2 die)",
        "description": "İkinci Blackwell paketi; ikisi birlikte 384 GB HBM3e sunuyor",
        "position": {
          "x_pct": 52,
          "y_pct": 6,
          "width_pct": 44,
          "height_pct": 40
        }
      },
      {
        "name": "Grace CPU",
        "description": "72 Arm Neoverse V2 çekirdeği ve 480 GB LPDDR5X birleşik bellek",
        "position": {
          "x_pct": 20,
          "y_pct": 52,
          "width_pct": 60,
          "height_pct": 24
        }
      },
      {
        "name": "NVLink-C2C Köprüsü",
        "description": "CPU ile GPU'lar arasında 900 GB/s tutarlı bellek bağlantısı",
        "position": {
          "x_pct": 8,
          "y_pct": 80,
          "width_pct": 84,
          "height_pct": 14
        }
      }
    ],
    "use_cases": [
      "Trilyon parametreli modellerin eğitimi — NVL72 rafı tek bellek alanı gibi davranıyor",
      "Uzun bağlamlı çıkarım: KV önbelleği HBM'i aştığında Grace'in LPDDR5X'i devreye giriyor",
      "CPU ve GPU'nun sıkı çalıştığı veri hazırlama ve grafik analitiği iş yükleri"
    ],
    "comparison_notes": "Tek başına B200 ile karşılaştırmak yanıltıcı olur: GB200 bir chip değil, bir sistem tasarımı. Asıl fark hesap gücünde değil, CPU belleğinin GPU'ya bu hızda açılmasında. Kiralama piyasasında GPU başına saatlik en pahalı seçeneklerden biri.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Chip değil sistem: CPU ve GPU tek modülde, tek bellek alanında"
  },
  {
    "id": "nvidia-grace-hopper-gh200",
    "name": "NVIDIA GH200 Grace Hopper Superchip",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2023,
    "process_node": "TSMC 4N",
    "transistor_count": "80 milyar (H100 die) + Grace CPU",
    "die_size": "814 mm² (GH100) + Grace die",
    "image": "h100.png",
    "image_credit": "Temsilî görsel — Hopper ailesi",
    "key_specs": {
      "architecture": "Grace Hopper (1 Grace CPU + 1 H100 GPU)",
      "cpu": "72 çekirdekli Arm Neoverse V2 (Grace)",
      "vram": "96 GB HBM3 (GPU) + 480 GB LPDDR5X (CPU)",
      "memory_bandwidth": "4 TB/s (HBM3)",
      "interconnect": "NVLink-C2C 900 GB/s CPU-GPU",
      "fp16_tflops": "990 TFLOPS (seyrek)",
      "fp64_tflops": "34 TFLOPS",
      "tdp": "450W - 1000W (yapılandırmaya göre)"
    },
    "architecture_highlights": [
      "GB200'ün öncülü: aynı fikrin tek GPU'lu ilk uygulaması",
      "GPU, CPU'nun 480 GB LPDDR5X belleğini kendi belleğiymiş gibi adresleyebiliyor — toplam 576 GB tutarlı bellek",
      "Bellek kapasitesinin bant genişliğinden önce tükendiği iş yüklerinde H100'e belirgin üstünlük sağlıyor",
      "Kiralama piyasasında az sağlayıcı listeliyor; bu yüzden medyan fiyatı oynak"
    ],
    "die_regions": [
      {
        "name": "Hopper GPU (GH100)",
        "description": "132 SM, 4. nesil Tensor Core, Transformer Engine",
        "position": {
          "x_pct": 6,
          "y_pct": 8,
          "width_pct": 88,
          "height_pct": 40
        }
      },
      {
        "name": "HBM3 Yığınları (96 GB)",
        "description": "4 TB/s bant genişliği",
        "position": {
          "x_pct": 6,
          "y_pct": 50,
          "width_pct": 88,
          "height_pct": 14
        }
      },
      {
        "name": "Grace CPU + LPDDR5X",
        "description": "72 Arm çekirdeği ve 480 GB düşük güçlü bellek",
        "position": {
          "x_pct": 10,
          "y_pct": 68,
          "width_pct": 80,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "Bellek kapasitesi sınırlayıcı olan büyük model çıkarımı",
      "Bilimsel hesaplama: 34 TFLOPS FP64 ile HPC iş yükleri",
      "Graf analitiği ve öneri sistemleri gibi CPU-GPU trafiği yoğun uygulamalar"
    ],
    "comparison_notes": "H100 ile aynı GPU die'ını kullanır; fark tamamen Grace CPU'nun eklenmesinden gelir. Saf hesap gücü arıyorsan H100 daha ucuz; 96 GB'ı aşan modeller çalıştıracaksan GH200'ün birleşik belleği fark yaratır.",
    "is_announced": true,
    "rumored": null,
    "tagline": "H100'e 480 GB CPU belleği eklendiğinde ne oluyor"
  },
  {
    "id": "nvidia-ampere-a40",
    "name": "NVIDIA A40",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2020,
    "process_node": "Samsung 8N (8nm)",
    "transistor_count": "28.3 milyar (GA102)",
    "die_size": "628 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA profesyonel GPU",
    "key_specs": {
      "architecture": "Ampere (GA102)",
      "cuda_cores": 10752,
      "compute_units": "84 SM",
      "tensor_cores": "336 adet (3. nesil)",
      "rt_cores": "84 adet (2. nesil)",
      "vram": "48 GB GDDR6 (ECC)",
      "memory_bandwidth": "696 GB/s",
      "memory_interface": "384-bit",
      "l2_cache": "6 MB",
      "fp32_tflops": "37.4 TFLOPS",
      "tdp": "300W"
    },
    "architecture_highlights": [
      "Veri merkezi için pasif soğutmalı, çift genişlikli kart — sunucu kasasının hava akışına güvenir",
      "48 GB GDDR6, HBM'e göre çok daha ucuz; kapasite gerektiren ama bant genişliği gerektirmeyen işler için mantıklı",
      "RT Core'ları sayesinde render çiftliklerinde ve sanal masaüstünde de kullanılıyor — saf AI kartı değil",
      "Kiralama piyasasında saatlik yaklaşık yarım dolar; giriş seviyesi veri merkezi seçeneklerinden biri"
    ],
    "die_regions": [
      {
        "name": "GPC / SM Kümeleri",
        "description": "84 SM, 10752 CUDA core, 336 Tensor Core",
        "position": {
          "x_pct": 6,
          "y_pct": 8,
          "width_pct": 88,
          "height_pct": 52
        }
      },
      {
        "name": "L2 Cache (6 MB)",
        "description": "Paylaşımlı önbellek",
        "position": {
          "x_pct": 6,
          "y_pct": 62,
          "width_pct": 88,
          "height_pct": 8
        }
      },
      {
        "name": "GDDR6 Denetleyicileri",
        "description": "384-bit arayüz, 48 GB ECC bellek, 696 GB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 74,
          "width_pct": 92,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "Orta ölçekli model çıkarımı — 48 GB birçok modeli tek kartta tutuyor",
      "Render ve görselleştirme çiftlikleri",
      "Sanal masaüstü altyapısı (VDI)"
    ],
    "comparison_notes": "L40 ile aynı sınıfta ama bir nesil geride: aynı 48 GB kapasiteye karşılık L40 daha yüksek bant genişliği ve çok daha fazla hesap gücü sunuyor. A40'ın avantajı fiyatı.",
    "is_announced": true,
    "rumored": null,
    "tagline": "48 GB kapasite, HBM fiyatı olmadan"
  },
  {
    "id": "nvidia-ada-l40",
    "name": "NVIDIA L40",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2022,
    "process_node": "TSMC 4N (5nm sınıfı)",
    "transistor_count": "76.3 milyar (AD102)",
    "die_size": "609 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — NVIDIA profesyonel GPU",
    "key_specs": {
      "architecture": "Ada Lovelace (AD102)",
      "cuda_cores": 18176,
      "compute_units": "142 SM",
      "tensor_cores": "568 adet (4. nesil)",
      "rt_cores": "142 adet (3. nesil)",
      "vram": "48 GB GDDR6 (ECC)",
      "memory_bandwidth": "864 GB/s",
      "memory_interface": "384-bit",
      "l2_cache": "96 MB",
      "fp32_tflops": "90.5 TFLOPS",
      "tdp": "300W"
    },
    "architecture_highlights": [
      "96 MB L2 cache — Ada mimarisinin en belirgin değişimi; dar GDDR6 arayüzünü büyük önbellekle telafi ediyor",
      "300W'ta 90 TFLOPS FP32: watt başına performansta A40'ın iki katından fazlası",
      "Medya motorları sayesinde video kodlama ve yayın iş yüklerinde de tercih ediliyor",
      "L40S kardeşi AI için daha agresif ayarlanmış; L40 grafik ve karma iş yüklerine bakıyor"
    ],
    "die_regions": [
      {
        "name": "GPC / SM Kümeleri",
        "description": "142 SM, 18176 CUDA core, 4. nesil Tensor Core",
        "position": {
          "x_pct": 6,
          "y_pct": 8,
          "width_pct": 88,
          "height_pct": 46
        }
      },
      {
        "name": "L2 Cache (96 MB)",
        "description": "Ada'nın büyük önbelleği — bellek erişimini ciddi biçimde azaltıyor",
        "position": {
          "x_pct": 6,
          "y_pct": 56,
          "width_pct": 88,
          "height_pct": 12
        }
      },
      {
        "name": "GDDR6 Denetleyicileri",
        "description": "384-bit arayüz, 48 GB ECC, 864 GB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 70,
          "width_pct": 92,
          "height_pct": 16
        }
      },
      {
        "name": "Medya Motorları",
        "description": "Donanımsal video kodlayıcı ve çözücü birimleri",
        "position": {
          "x_pct": 4,
          "y_pct": 88,
          "width_pct": 92,
          "height_pct": 8
        }
      }
    ],
    "use_cases": [
      "Çıkarım ve ince ayar — 48 GB ile orta boy modeller tek kartta",
      "Video kodlama, yayın ve bulut oyun altyapısı",
      "Grafik ve AI'ın birlikte çalıştığı üretim hatları"
    ],
    "comparison_notes": "A40'ın doğrudan halefi: aynı kapasite ve güç bütçesinde yaklaşık iki buçuk kat hesap gücü. 96 MB L2 sayesinde bant genişliği farkının hissedilenden büyük olduğu iş yükleri var.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Ada'nın 96 MB önbelleği dar bellek arayüzünü nasıl kurtarıyor"
  },
  {
    "id": "nvidia-ampere-a30",
    "name": "NVIDIA A30",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2021,
    "process_node": "TSMC N7 (7nm)",
    "transistor_count": "54.2 milyar (GA100)",
    "die_size": "826 mm²",
    "image": "h100.png",
    "image_credit": "Temsilî görsel — NVIDIA veri merkezi GPU'su",
    "key_specs": {
      "architecture": "Ampere (GA100, kırpılmış)",
      "cuda_cores": 3804,
      "compute_units": "56 SM",
      "tensor_cores": "224 adet (3. nesil)",
      "vram": "24 GB HBM2",
      "memory_bandwidth": "933 GB/s",
      "memory_interface": "3072-bit",
      "l2_cache": "24 MB",
      "fp16_tflops": "165 TFLOPS (seyrek)",
      "fp64_tflops": "5.2 TFLOPS (10.3 Tensor Core ile)",
      "mig": "4 örneğe kadar bölünebilir",
      "tdp": "165W"
    },
    "architecture_highlights": [
      "A100 ile aynı GA100 die'ını kullanıyor ama büyük ölçüde kırpılmış — binning'in ders kitabı örneği",
      "165W ile veri merkezi GPU'ları arasında en düşük güç bütçelerinden biri",
      "HBM2 sayesinde 24 GB'lık kapasitesine göre yüksek bant genişliği: 933 GB/s",
      "MIG desteği ile tek kart dört izole örneğe bölünebiliyor"
    ],
    "die_regions": [
      {
        "name": "Etkin SM Kümeleri",
        "description": "56 SM etkin; kalan bloklar kırpılmış durumda",
        "position": {
          "x_pct": 8,
          "y_pct": 10,
          "width_pct": 84,
          "height_pct": 40
        }
      },
      {
        "name": "L2 Cache (24 MB)",
        "description": "Paylaşımlı önbellek",
        "position": {
          "x_pct": 8,
          "y_pct": 54,
          "width_pct": 84,
          "height_pct": 10
        }
      },
      {
        "name": "HBM2 Yığınları (24 GB)",
        "description": "3072-bit arayüz, 933 GB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 68,
          "width_pct": 92,
          "height_pct": 24
        }
      }
    ],
    "use_cases": [
      "Düşük güç bütçeli sunucularda çıkarım",
      "MIG ile çoklu kiracı senaryoları",
      "FP64 gerektiren orta ölçekli bilimsel hesaplama"
    ],
    "comparison_notes": "A100'ün küçük kardeşi: aynı die, yaklaşık yarısı kadar etkin SM ve üçte biri kadar bellek. Bant genişliği/kapasite oranı yüksek olduğu için küçük modellerin çıkarımında beklenenden iyi.",
    "is_announced": true,
    "rumored": null,
    "tagline": "A100 ile aynı die, 165 watt — binning'in ne demek olduğu"
  },
  {
    "id": "amd-cdna2-instinct-mi250",
    "name": "AMD Instinct MI250 (CDNA 2)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2021,
    "process_node": "TSMC N6 (6nm)",
    "transistor_count": "58.2 milyar (2 × 29.1 milyar)",
    "die_size": "Çoklu die — 2 × 724 mm²",
    "image": "mi300x.png",
    "image_credit": "Temsilî görsel — AMD Instinct ailesi",
    "key_specs": {
      "architecture": "CDNA 2 (Aldebaran, çift die)",
      "compute_units": "208 CU (2 × 104)",
      "stream_processors": 13312,
      "vram": "128 GB HBM2e",
      "memory_bandwidth": "3276 GB/s",
      "memory_interface": "8192-bit",
      "fp16_tflops": "362 TFLOPS",
      "fp32_tflops": "45.3 TFLOPS",
      "fp64_tflops": "45.3 TFLOPS (vektör)",
      "interconnect": "Infinity Fabric",
      "tdp": "500W"
    },
    "architecture_highlights": [
      "AMD'nin ilk çift die veri merkezi GPU'su: iki ayrı die tek kartta, Infinity Fabric ile bağlı",
      "FP64 performansı FP32 ile eşit — bilimsel hesaplama için tasarlanmış, AI için değil",
      "Frontier süperbilgisayarının temelini oluşturan mimari",
      "Yazılım tarafında ROCm olgunlaşmadan önceki dönem; bu yüzden AI'da yaygınlaşamadı"
    ],
    "die_regions": [
      {
        "name": "Hesap Die #1 (104 CU)",
        "description": "Aldebaran die, 6656 stream processor",
        "position": {
          "x_pct": 4,
          "y_pct": 12,
          "width_pct": 44,
          "height_pct": 46
        }
      },
      {
        "name": "Hesap Die #2 (104 CU)",
        "description": "İkinci die; ikisi Infinity Fabric ile bağlı",
        "position": {
          "x_pct": 52,
          "y_pct": 12,
          "width_pct": 44,
          "height_pct": 46
        }
      },
      {
        "name": "HBM2e Yığınları (128 GB)",
        "description": "8192-bit toplam arayüz, 3.2 TB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 62,
          "width_pct": 92,
          "height_pct": 22
        }
      },
      {
        "name": "Infinity Fabric",
        "description": "Die'lar arası ve kartlar arası bağlantı",
        "position": {
          "x_pct": 4,
          "y_pct": 86,
          "width_pct": 92,
          "height_pct": 10
        }
      }
    ],
    "use_cases": [
      "Bilimsel hesaplama ve simülasyon — FP64 gücü bu sınıfta rakipsizdi",
      "Süperbilgisayar düğümleri",
      "Bugün ikinci el ve niş bulut sağlayıcılarında uygun fiyatlı HPC seçeneği"
    ],
    "comparison_notes": "AI için MI300X'in çok gerisinde ama FP64 gerektiren işlerde hâlâ anlamlı. A100 ile karşılaştırıldığında çift die yaklaşımı ham gücü artırıyor; asıl fark yazılım ekosisteminde.",
    "is_announced": true,
    "rumored": null,
    "tagline": "AMD'nin çift die denemesi — AI için değil, bilim için"
  },
  {
    "id": "amd-cdna2-instinct-mi210",
    "name": "AMD Instinct MI210 (CDNA 2)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2022,
    "process_node": "TSMC N6 (6nm)",
    "transistor_count": "29.1 milyar",
    "die_size": "724 mm²",
    "image": "mi300x.png",
    "image_credit": "Temsilî görsel — AMD Instinct ailesi",
    "key_specs": {
      "architecture": "CDNA 2 (Aldebaran, tek die)",
      "compute_units": "104 CU",
      "stream_processors": 6656,
      "vram": "64 GB HBM2e",
      "memory_bandwidth": "1638 GB/s",
      "memory_interface": "4096-bit",
      "fp16_tflops": "181 TFLOPS",
      "fp32_tflops": "22.6 TFLOPS",
      "fp64_tflops": "22.6 TFLOPS (vektör)",
      "form_factor": "PCIe, çift genişlik",
      "tdp": "300W"
    },
    "architecture_highlights": [
      "MI250'nin tek die'lı, PCIe formundaki sürümü — standart sunuculara takılabiliyor",
      "300W güç bütçesi ile OAM gerektirmeyen tek AMD veri merkezi seçeneklerinden biri",
      "FP64 = FP32 oranı korunuyor; HPC odağı devam ediyor",
      "Kiralama piyasasında çok az sağlayıcı listeliyor"
    ],
    "die_regions": [
      {
        "name": "Hesap Birimleri (104 CU)",
        "description": "6656 stream processor, matris çekirdekleri dahil",
        "position": {
          "x_pct": 6,
          "y_pct": 10,
          "width_pct": 88,
          "height_pct": 48
        }
      },
      {
        "name": "Infinity Cache / L2",
        "description": "Paylaşımlı önbellek katmanı",
        "position": {
          "x_pct": 6,
          "y_pct": 62,
          "width_pct": 88,
          "height_pct": 8
        }
      },
      {
        "name": "HBM2e Yığınları (64 GB)",
        "description": "4096-bit arayüz, 1.6 TB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 74,
          "width_pct": 92,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "PCIe sunucularda HPC iş yükleri",
      "FP64 ağırlıklı mühendislik simülasyonları",
      "AMD ekosistemine düşük maliyetli giriş"
    ],
    "comparison_notes": "MI250'nin yarısı: tek die, yarı bellek, yarı bant genişliği, yaklaşık yarı güç. A30 ile aynı segmentte ama çok daha fazla FP64 sunuyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "MI250'nin yarısı, standart sunucuya sığan hâli"
  },
  {
    "id": "amd-cdna4-instinct-mi350x",
    "name": "AMD Instinct MI350X (CDNA 4)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N3P + N6 (chiplet)",
    "transistor_count": "185 milyar",
    "die_size": "Çoklu die — 8 XCD + 2 IOD",
    "image": "mi300x.png",
    "image_credit": "Temsilî görsel — AMD Instinct ailesi",
    "key_specs": {
      "architecture": "CDNA 4",
      "compute_units": "256 CU",
      "vram": "288 GB HBM3E",
      "memory_bandwidth": "8 TB/s",
      "fp4_tflops": "18.5 PFLOPS (seyrek)",
      "fp8_tflops": "9.2 PFLOPS",
      "fp16_tflops": "4.6 PFLOPS",
      "cooling": "Hava soğutmalı",
      "tdp": "1000W"
    },
    "architecture_highlights": [
      "MI355X ile aynı silikon; fark soğutmada — MI350X hava soğutmalı 1000W, MI355X sıvı soğutmalı 1400W",
      "288 GB HBM3E ile Blackwell B300'e kapasitede eşit, bant genişliğinde de yakın",
      "Standart hava soğutmalı raflara takılabilmesi, sıvı soğutma altyapısı olmayan veri merkezleri için belirleyici",
      "Aynı chip'in iki farklı güç zarfında satılması, termal kısıtın ürün stratejisine dönüşmesinin örneği"
    ],
    "die_regions": [
      {
        "name": "XCD Hesap Chiplet'leri (8 adet)",
        "description": "TSMC N3P ile üretilen 256 CU; matris çekirdekleri burada",
        "position": {
          "x_pct": 6,
          "y_pct": 8,
          "width_pct": 88,
          "height_pct": 42
        }
      },
      {
        "name": "IOD Taban Die'ları (2 adet)",
        "description": "N6 ile üretilen giriş/çıkış ve Infinity Cache katmanı",
        "position": {
          "x_pct": 6,
          "y_pct": 54,
          "width_pct": 88,
          "height_pct": 16
        }
      },
      {
        "name": "HBM3E Yığınları (288 GB)",
        "description": "8 yığın, 8 TB/s toplam bant genişliği",
        "position": {
          "x_pct": 4,
          "y_pct": 74,
          "width_pct": 92,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "Hava soğutmalı mevcut veri merkezlerinde büyük model çıkarımı",
      "288 GB kapasite sayesinde tek kartta çalışan büyük modeller",
      "NVIDIA'ya alternatif arayan bulut sağlayıcıları"
    ],
    "comparison_notes": "MI355X ile aynı chip olmasına rağmen 400W daha düşük güç zarfında çalışıyor; buna karşılık tepe performansı da düşük. Kiralama piyasasında MI355X'in yaklaşık yarı fiyatına listeleniyor — sıvı soğutma altyapısı gerektirmemesi bu farkın bir kısmını açıklıyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "MI355X ile aynı silikon, hava soğutmalı 1000 watt sürümü"
  },
  {
    "id": "nvidia-blackwell-b200",
    "name": "NVIDIA Blackwell B200",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC N4P (4nm)",
    "transistor_count": "208 milyar (çift die, iki GB100)",
    "die_size": "~1600 mm² (toplam çift die)",
    "image": "blackwell-b200.png",
    "key_specs": {
      "architecture": "Blackwell (GB100 çift die)",
      "vram": "192 GB HBM3E (180 GB kullanılabilir)",
      "memory_bandwidth": "8 TB/s",
      "memory_interface": "8192-bit",
      "tensor_cores": "5. nesil (FP4, FP8 destekli)",
      "fp4_tflops": "20 PFLOPS (seyrek)",
      "fp8_tflops": "9 PFLOPS (seyrek)",
      "fp16_tflops": "Yaklaşık 4.5 PFLOPS",
      "nvlink": "NVLink 5.0, 1.8 TB/s çift yönlü",
      "tdp": "700W (SXM)",
      "form_factor": "SXM (HGX B200 kartı)"
    },
    "architecture_highlights": [
      "208 milyar transistörlü çift GB100 die tasarımı; 10 TB/s die-to-die bant genişliğiyle bağlı iki tam reticle boyutlu chip",
      "5. nesil Tensor Core'lar FP4 ve FP8 hassasiyetini destekler; H100'e kıyasla çıkarım veriminde ~5x artış",
      "Transformer Engine 2. nesil: FP4 aritmetiği ile büyük dil modellerinde dinamik hassasiyet ayarı",
      "NVLink 5.0 ile 1.8 TB/s çift yönlü bant genişliği; 576 GPU'ya kadar NVLink domain desteği",
      "8 adet HBM3E yığını ile 192 GB VRAM ve 8 TB/s toplam bellek bant genişliği; H100'ün 2.4 katı kapasite",
      "NVSwitch entegrasyonu paket üzerinde (on-package); AI fabrikası ölçeğinde düşük gecikmeli GPU-GPU haberleşmesi"
    ],
    "die_regions": [
      {
        "name": "GPC/SM Kümeleri (Die 1)",
        "description": "İlk GB100 die'ının temel hesaplama bölgesi; SM'ler, Tensor Core'lar ve CUDA core'ları barındırır",
        "position": {
          "x_pct": 5,
          "y_pct": 10,
          "width_pct": 45,
          "height_pct": 50
        }
      },
      {
        "name": "GPC/SM Kümeleri (Die 2)",
        "description": "İkinci GB100 die'ının temel hesaplama bölgesi; paralel çalışır",
        "position": {
          "x_pct": 52,
          "y_pct": 10,
          "width_pct": 45,
          "height_pct": 50
        }
      },
      {
        "name": "HBM3E Yığınları (x8)",
        "description": "Her die'ın yanında 4'er adet HBM3E yığını bulunur; toplam 8 yığın, 192 GB",
        "position": {
          "x_pct": 5,
          "y_pct": 65,
          "width_pct": 90,
          "height_pct": 20
        }
      },
      {
        "name": "Die-to-Die Interconnect",
        "description": "İki GB100 die'ını birbirine bağlayan 10 TB/s NVLink-C2C köprüsü bölgesi",
        "position": {
          "x_pct": 45,
          "y_pct": 20,
          "width_pct": 10,
          "height_pct": 30
        }
      },
      {
        "name": "Bellek Denetleyicileri ve L2 Cache",
        "description": "HBM3E arayüz denetleyicileri ve büyük L2 önbellek dilimleri her die'da dağıtılmış",
        "position": {
          "x_pct": 5,
          "y_pct": 60,
          "width_pct": 90,
          "height_pct": 10
        }
      },
      {
        "name": "NVLink/PCIe Arabirimi",
        "description": "NVLink 5.0 ve PCIe 5.0 fiziksel katman denetleyicileri; chip'in kenar bölgelerinde",
        "position": {
          "x_pct": 0,
          "y_pct": 85,
          "width_pct": 100,
          "height_pct": 15
        }
      }
    ],
    "use_cases": [
      "Büyük dil modeli (LLM) eğitimi ve çıkarımı: GPT-4 ölçeğindeki modeller için birincil platform",
      "Yapay zeka veri merkezi altyapısı: DGX B200 ve HGX B200 sistemleri ile entegre",
      "Bilimsel simülasyon ve HPC: FP64 ve TF32 hassasiyetiyle iklim, ilaç keşfi, fizik simülasyonları",
      "Gerçek zamanlı AI çıkarım hizmetleri: yüksek verimli token üretimi gerektiren bulut uygulamaları"
    ],
    "comparison_notes": "H100 SXM'e kıyasla FP4 çıkarımda yaklaşık 5x, eğitimde yaklaşık 4x daha hızlı; bellek kapasitesi 80 GB'dan 192 GB'a çıkarılmış, bant genişliği 3.35 TB/s'den 8 TB/s'ye yükselmiş. NVLink 5.0 ile ağ bant genişliği de iki katına çıkmış.",
    "is_announced": null,
    "rumored": null,
    "tagline": "AI veri merkezinin yeni amiral gemisi — 208 milyar transistörlü çift-die canavar"
  },
  {
    "id": "nvidia-blackwell-rtx-5090",
    "name": "NVIDIA GeForce RTX 5090",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N4 (özel 4nm, '4N' adlandırması)",
    "transistor_count": "92.2 milyar (GB202)",
    "die_size": "750 mm²",
    "image": "rtx-5090.png",
    "key_specs": {
      "architecture": "Blackwell (GB202)",
      "cuda_cores": 21760,
      "tensor_cores": "680 adet (5. nesil)",
      "ray_tracing_cores": "170 adet (4. nesil)",
      "vram": "32 GB GDDR7",
      "vram_speed": "28 Gbps",
      "memory_interface": "512-bit",
      "memory_bandwidth": "1792 GB/s",
      "boost_clock": "2407 MHz",
      "base_clock": "2017 MHz",
      "l2_cache": "98 MB",
      "tdp": "575W",
      "pcie": "PCIe 5.0 x16",
      "fp32_tflops": "~104 TFLOPS"
    },
    "architecture_highlights": [
      "GB202 die: 92.2 milyar transistör, 750 mm² — Ada Lovelace AD102'ye göre (~76.3B) daha fazla transistör ama 33% daha fazla CUDA core",
      "5. nesil Tensor Core'lar: FP4 ve FP8 desteği ile tüketici GPU'larında ilk kez yapay zeka hassasiyet kademeleri",
      "İlk tüketici GDDR7 GPU'su: 28 Gbps hızlı bellek, 512-bit arayüzle 1792 GB/s bant genişliği",
      "DLSS 4 Multi Frame Generation: tek bir gerçek kare yerine 3'e kadar yapay kare üretimi",
      "PCIe 5.0 x16 arayüzü ve DisplayPort 2.1b desteği (8K@165Hz)",
      "98 MB L2 cache (RTX 4090'ın 72 MB L2'sine kıyasla %36 artış); bellek gecikmesini önemli ölçüde azaltır"
    ],
    "die_regions": [
      {
        "name": "GPC Kümeleri / CUDA SM'ler",
        "description": "170 SM barındıran 10 GPC, toplam 21.760 CUDA core; die yüzeyinin büyük çoğunluğunu kaplar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 65,
          "height_pct": 70
        }
      },
      {
        "name": "L2 Cache Dilimleri",
        "description": "98 MB L2 cache; GPC kümeleri arasına dağılmış; yüksek verimli bellek geçici deposu",
        "position": {
          "x_pct": 70,
          "y_pct": 5,
          "width_pct": 25,
          "height_pct": 40
        }
      },
      {
        "name": "Bellek Denetleyicileri",
        "description": "8 adet 64-bit GDDR7 bellek kanalı denetleyicisi, chip'in çevresine dağıtılmış",
        "position": {
          "x_pct": 5,
          "y_pct": 78,
          "width_pct": 90,
          "height_pct": 12
        }
      },
      {
        "name": "Video Encode/Decode Motor",
        "description": "AV1, H.265, H.264 donanım kodlama/kod çözme motorları",
        "position": {
          "x_pct": 70,
          "y_pct": 50,
          "width_pct": 25,
          "height_pct": 20
        }
      },
      {
        "name": "NVLink ve PCIe PHY",
        "description": "PCIe 5.0 arayüzü ve NVLink birleşik bağlantı katmanı",
        "position": {
          "x_pct": 70,
          "y_pct": 75,
          "width_pct": 25,
          "height_pct": 15
        }
      }
    ],
    "use_cases": [
      "Üst düzey oyun: 4K ve 8K çözünürlükte DLSS 4 Multi Frame Generation ile maksimum FPS",
      "İçerik oluşturma ve 3D render: Blender, DaVinci Resolve, Unreal Engine gibi araçlarda profesyonel performans",
      "AI destekli yerel çıkarım: 32 GB VRAM ile orta büyüklükte LLM modellerini doğrudan iş istasyonunda çalıştırma",
      "VR/AR geliştirme: yüksek kare hızı ve düşük gecikme gerektiren gerçek zamanlı render iş yükleri"
    ],
    "comparison_notes": "RTX 4090'a kıyasla CUDA core sayısı %33 artmış (16.384'ten 21.760'a), bellek bant genişliği 1.008 GB/s'den 1.792 GB/s'ye yükselmiş. GDDR7, GDDR6X'e göre aynı bus genişliğinde ~%77 daha fazla bant genişliği sunar. Rasterizasyon performansı yaklaşık %30, AI/tensor iş yüklerinde ise çok daha büyük artışlar rapor ediliyor.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Tüketici GPU'ları için ilk GDDR7 ve FP4 destekli amiral gemisi"
  },
  {
    "id": "nvidia-hopper-h100",
    "name": "NVIDIA Hopper H100",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2022,
    "process_node": "TSMC N4 (4nm özel)",
    "transistor_count": "80 milyar",
    "die_size": "814 mm²",
    "image": "h100.png",
    "key_specs": {
      "architecture": "Hopper (GH100)",
      "cuda_cores": 16896,
      "tensor_cores": "528 adet (4. nesil, FP8 destekli)",
      "streaming_multiprocessors": 132,
      "vram_sxm": "80 GB HBM3",
      "vram_nvl": "94 GB HBM3",
      "memory_bandwidth_sxm": "3.35 TB/s",
      "memory_bandwidth_nvl": "3.9 TB/s",
      "memory_interface": "5120-bit",
      "fp16_tflops": "1979 TFLOPS (sparsity ile)",
      "fp8_tflops": "3958 TFLOPS (sparsity ile)",
      "fp64_tflops": "67 TFLOPS",
      "nvlink": "NVLink 4.0, 900 GB/s",
      "tdp_sxm": "700W",
      "pcie": "PCIe 5.0 x16",
      "multi_instance_gpu": "7 MIG @ 10 GB"
    },
    "architecture_highlights": [
      "Transformer Engine (ilk kez): FP8 hassasiyetine dinamik geçişle GPT-3 (175B) eğitiminde önceki nesle göre 4x hız artışı",
      "4. nesil Tensor Core'lar FP64, TF32, FP32, FP16, BF16, INT8 ve FP8'i destekler",
      "DPX talimatları: Smith-Waterman DNA hizalama gibi dinamik programlama algoritmalarında A100'e göre 7x artış",
      "NVLink 4.0 ile 900 GB/s GPU-GPU bant genişliği; NVSwitch ile 256 GPU'ya kadar birleşik küme",
      "Geniş kapsamlı HBM3 belleği: 5120-bit geniş arayüz ve 3.35 TB/s bant genişliği; A100 HBM2e'ye göre %50 artış",
      "Multi-Instance GPU (MIG): tek GPU'yu 7 bağımsız örneğe bölme; bulut çok kiracılılık için kritik özellik"
    ],
    "die_regions": [
      {
        "name": "SM Kümeleri (GPC'ler)",
        "description": "132 SM'den oluşan 8 GPC; Tensor Core'lar ve CUDA core'larını barındıran ana hesaplama bölgesi",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 60,
          "height_pct": 60
        }
      },
      {
        "name": "L2 Cache",
        "description": "50 MB birleşik L2 önbellek; GPC'lerin etrafına dağıtılmış bellek tampon bölgesi",
        "position": {
          "x_pct": 65,
          "y_pct": 5,
          "width_pct": 30,
          "height_pct": 40
        }
      },
      {
        "name": "HBM3 Bellek Denetleyicileri",
        "description": "5120-bit HBM3 arayüzünü yöneten 5 adet 1024-bit bellek denetleyicisi bloğu",
        "position": {
          "x_pct": 5,
          "y_pct": 70,
          "width_pct": 90,
          "height_pct": 15
        }
      },
      {
        "name": "NVLink/NVSwitch PHY",
        "description": "NVLink 4.0 fiziksel katman; GPU-GPU 900 GB/s bant genişliği sağlayan bağlantı birimi",
        "position": {
          "x_pct": 65,
          "y_pct": 50,
          "width_pct": 30,
          "height_pct": 20
        }
      },
      {
        "name": "Transformer Engine",
        "description": "FP8↔FP16 dinamik dönüşüm mantığını içeren özel donanım birimi; SM içinde dağıtılmış",
        "position": {
          "x_pct": 20,
          "y_pct": 20,
          "width_pct": 40,
          "height_pct": 30
        }
      }
    ],
    "use_cases": [
      "Büyük dil modeli (LLM) eğitimi: GPT, LLaMA ve Gemini ölçeğindeki modellerin veri merkezi kümelerinde eğitimi",
      "HPC ve bilimsel hesaplama: iklim simülasyonu, ilaç molekülü modelleme, fizik simülasyonları (FP64 hassasiyetiyle)",
      "Bulut AI çıkarımı: MIG özelliği sayesinde çok kiracılı ortamlarda verimli GPU paylaşımı",
      "Genomik ve biyoinformatik: DPX talimatları ile DNA dizileme algoritmalarında 40x CPU üstünlüğü"
    ],
    "comparison_notes": "A100'e kıyasla FP16 tensor veriminde ~3x, FP64'te 3x, bellek bant genişliğinde %50 artış. Transformer Engine ve FP8 desteği, GPT-3 ölçeği eğitimde pratik olarak en önemli atılımdır. Hopper, büyük veri merkezi AI iş yüklerinde standart referans platform konumuna gelmiştir.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Transformer Engine ile büyük dil modeli devrini başlatan GPU"
  },
  {
    "id": "amd-rdna4-rx-9070xt",
    "name": "AMD Radeon RX 9070 XT (RDNA 4)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC N4P (4nm)",
    "transistor_count": "53.9 milyar",
    "die_size": "356.5 mm²",
    "image": "rx-9070xt.png",
    "key_specs": {
      "architecture": "RDNA 4 (Navi 48)",
      "compute_units": 64,
      "stream_processors": 4096,
      "rt_accelerators": "64 adet (3. nesil, 2x önceki nesil hızı)",
      "ai_accelerators": "128 adet (2. nesil)",
      "vram": "16 GB GDDR6",
      "vram_speed": "20 Gbps",
      "memory_interface": "256-bit",
      "memory_bandwidth": "640 GB/s",
      "boost_clock": "2970 MHz",
      "fp32_tflops": "48.7 TFLOPS",
      "fp16_ai_tops": "1557 TOPS (INT4, sparsity ile)",
      "tdp": "304W",
      "pcie": "PCIe 5.0"
    },
    "architecture_highlights": [
      "RDNA 4 çekirdek başına IPC artışı: yeniden tasarlanan Compute Unit ile daha yüksek IPC ve önemli frekans artışı (2970 MHz)",
      "3. nesil RT akseleratörleri: üçgen ve ışın-kutu kesişim hızı iki katına çıkmış; RDNA 3'teki 96 RT birimine denk verim 64 birimle elde edildi",
      "Büyük ölçüde genişletilmiş AI donanımı: 2. nesil AI akseleratörler ile INT4 TOPS değeri RDNA 3'e göre ~12x artış",
      "FSR 4 desteği: makine öğrenmesi tabanlı birinci nesil ölçekleme; yalnızca RDNA 4 GPU'larında yerel donanım hızlandırma",
      "Tek monolitik die tasarımı: RDNA 3'ün chiplet MCD+GCD yaklaşımından vazgeçilmiş, daha düşük gecikme",
      "PCIe 5.0 arayüzü ve 2. nesil Radiance Display Engine; DP 2.1 ve HDMI 2.1a desteği"
    ],
    "die_regions": [
      {
        "name": "Compute Unit Kümeleri (CU'lar)",
        "description": "64 RDNA 4 CU; her biri 64 shader işlemcisi, RT akseleratör ve AI akseleratörlerden oluşur; die'ın merkezi",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 70,
          "height_pct": 65
        }
      },
      {
        "name": "Infinity Cache / L2 Cache",
        "description": "64 MB L2 cache; bellek bant genişliği ihtiyacını azaltmak için GDDR6 arabirimini önbelleğe alır",
        "position": {
          "x_pct": 75,
          "y_pct": 5,
          "width_pct": 20,
          "height_pct": 40
        }
      },
      {
        "name": "GDDR6 Bellek Denetleyicileri",
        "description": "4 adet 64-bit GDDR6 kanalı, chip'in alt kenarına dizilmiş; 640 GB/s toplam bant genişliği",
        "position": {
          "x_pct": 5,
          "y_pct": 75,
          "width_pct": 90,
          "height_pct": 15
        }
      },
      {
        "name": "Medya ve Görüntü Motorları",
        "description": "AV1/H.265 donanım encode/decode ve Radiance Display Engine; PCIe ve ekran çıkış arabirimi",
        "position": {
          "x_pct": 75,
          "y_pct": 50,
          "width_pct": 20,
          "height_pct": 30
        }
      }
    ],
    "use_cases": [
      "1440p ve 4K oyun: RTX 4070 Ti Super ile rekabetçi fiyat-performans, 599 USD başlangıç fiyatıyla",
      "Işın izleme (Ray Tracing): yeniden tasarlanan RT birimleriyle RDNA 3'e göre %50'nin üzerinde RT performans artışı",
      "AI destekli yükseltme: FSR 4 ile makine öğrenmesi tabanlı kaliteli görüntü ölçekleme (DLSS 3'e yakın kalite)",
      "İçerik oluşturma ve video encode: geliştirilmiş AV1 encode motoru ile hızlı medya işleme"
    ],
    "comparison_notes": "RX 7900 XTX'e kıyasla daha küçük die (356 mm² vs 300+225 mm²) ve daha az VRAM (16 GB vs 24 GB) ama rasterizasyonda yakın performans. RDNA 3'ün chiplet tasarımından vazgeçilerek monolitik TSMC N4P'ye geçiş yapılmış; RT ve AI performansı dramatik biçimde iyileştirilmiş.",
    "is_announced": null,
    "rumored": null,
    "tagline": "RDNA 4 ile gelen verimli, 1440p odaklı yeni nesil oyun GPU'su"
  },
  {
    "id": "amd-cdna3-instinct-mi300x",
    "name": "AMD Instinct MI300X (CDNA 3)",
    "manufacturer": "AMD",
    "category": "GPU",
    "release_year": 2023,
    "process_node": "TSMC N5 + N6 FinFET (çok die)",
    "transistor_count": "153 milyar (toplam paket)",
    "die_size": "Bilgi yok (çok chiplet paketi)",
    "image": "mi300x.png",
    "key_specs": {
      "architecture": "CDNA 3 (MI300X)",
      "xcd_count": "8 adet GPU XCD (her biri 38 CU)",
      "total_compute_units": 304,
      "stream_processors": 19456,
      "vram": "192 GB HBM3",
      "memory_interface": "8192-bit",
      "memory_bandwidth": "5.3 TB/s",
      "fp16_tflops": "1307 TFLOPS",
      "fp8_tflops": "2614 TOPS",
      "fp64_tflops": "163.4 TFLOPS",
      "infinity_fabric_bandwidth": "896 GB/s",
      "tdp": "750W",
      "form_factor": "OAM"
    },
    "architecture_highlights": [
      "8 adet XCD (Accelerator Complex Die) + 1 adet IOD (I/O Die) çok chiplet paketi; toplam 153 milyar transistör",
      "192 GB HBM3: her XCD yanında 24 GB'lık yığınlar; tek GPU'da en yüksek VRAM kapasitesi (piyasaya çıktığında)",
      "5.3 TB/s bellek bant genişliği: 8192-bit geniş HBM3 arayüzü ile LLM çıkarımında bellek darboğazını giderir",
      "CDNA 3 matrix core: FP8 ve FP16 hassasiyetinde büyük yapay zeka matris çarpım işlemlerini hızlandırır",
      "İnfinity Fabric 3.0: çip içi 896 GB/s bant genişliği ile XCD'ler arası düşük gecikmeli iletişim",
      "CPU'suz saf GPU tasarımı (MI300A ile karşılaştırıldığında): yalnızca AI/HPC hesaplama için optimize edilmiş"
    ],
    "die_regions": [
      {
        "name": "XCD Hesaplama Kümeleri (x8)",
        "description": "8 adet Accelerator Complex Die (XCD); her biri 38 CU, Matrix Core ve L2 cache içerir",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 70,
          "height_pct": 60
        }
      },
      {
        "name": "I/O Die (IOD)",
        "description": "Merkezi IOD; HBM3 denetleyicilerini, PCIe, Infinity Fabric ve güç yönetimini barındırır; 6nm",
        "position": {
          "x_pct": 75,
          "y_pct": 25,
          "width_pct": 20,
          "height_pct": 30
        }
      },
      {
        "name": "HBM3 Yığınları (x8)",
        "description": "XCD'lerin çevresine yerleştirilmiş 8 adet 24 GB HBM3 yığını; silicon interposer üzerinde",
        "position": {
          "x_pct": 5,
          "y_pct": 70,
          "width_pct": 90,
          "height_pct": 20
        }
      },
      {
        "name": "Infinity Fabric Ağı",
        "description": "XCD'leri IOD'a ve birbirine bağlayan yüksek bant genişlikli on-package ağ",
        "position": {
          "x_pct": 5,
          "y_pct": 60,
          "width_pct": 90,
          "height_pct": 10
        }
      }
    ],
    "use_cases": [
      "Büyük dil modeli çıkarımı: 192 GB VRAM ile 100B+ parametreli modelleri tek GPU'da çalıştırma (örn. LLaMA 70B tam hassasiyet)",
      "LLM eğitimi ve fine-tuning: kurum içi AI modeli geliştirme için NVIDIA H100'e karşı maliyet avantajlı alternatif",
      "HPC bilimsel hesaplama: FP64 çift hassasiyet ile simülasyon ve CFD uygulamaları",
      "Çok GPU AI kümesi: ROCm yazılım yığını ve Infinity Fabric ile ölçeklenebilir AI altyapısı"
    ],
    "comparison_notes": "H100 SXM'in 80 GB HBM3'üne kıyasla 2.4x daha fazla VRAM ve yakın bellek bant genişliği (5.3 TB/s vs 3.35 TB/s). CDNA 3 chiplet yaklaşımı, monolitik alternatiflere kıyasla çok daha yüksek bellek kapasitesi sağlar. ROCm yazılım desteği CUDA'ya göre daha sınırlıdır.",
    "is_announced": null,
    "rumored": null,
    "tagline": "192 GB HBM3 ile NVIDIA'ya en güçlü rakip AI hızlandırıcı"
  },
  {
    "id": "intel-battlemage-arc-b580",
    "name": "Intel Arc B580 (Battlemage / Xe2)",
    "manufacturer": "Intel",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC N5 (5nm)",
    "transistor_count": "19.6 milyar",
    "die_size": "272 mm²",
    "image": "arc-b580.png",
    "key_specs": {
      "architecture": "Xe2 (Battlemage, BGM-G21)",
      "xe2_cores": 20,
      "xmx_engines": 160,
      "vector_engines": 160,
      "ray_tracing_units": 20,
      "vram": "12 GB GDDR6",
      "vram_speed": "19 Gbps",
      "memory_interface": "192-bit",
      "memory_bandwidth": "456 GB/s",
      "l2_cache": "18 MB",
      "boost_clock": "2670 MHz",
      "tdp": "190W",
      "pcie": "PCIe 4.0 x8"
    },
    "architecture_highlights": [
      "Xe2 2. nesil Xe-core: önceki Xe HPG (Alchemist) ile karşılaştırıldığında core başına %70 daha fazla performans, %50 daha iyi güç verimliliği",
      "2. nesil ray tracing birimleri: %26 daha hızlı RT performansı; yalnızca 20 RT birimi ile A770'in 32 birimini geçen pratik verim",
      "18 MB L2 cache: Alchemist (A750/A770) 16 MB'a kıyasla artış; dar bellek bus'ının etkisini azaltır",
      "XeSS 2 desteği: Frame Generation ve AI ölçeklemeyi birleştirerek 3.9x kare hızı artışı (F1 24 testi)",
      "Yerel HDMI 2.1 VRR desteği ve DisplayPort 2.1 UHBR13.5; Alchemist'in adaptör gerektiren HDMI 2.1'ine göre avantaj",
      "AV1 dahil çoklu format donanım encode/decode desteği ile medya işleme kabiliyeti"
    ],
    "die_regions": [
      {
        "name": "Xe2 Core Kümeleri",
        "description": "20 adet Xe2 core; her biri 16 vektör motoru ve XMX AI motoru içerir; die'ın büyük bölümünü kaplar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 65,
          "height_pct": 60
        }
      },
      {
        "name": "L2 Cache Havuzu",
        "description": "18 MB birleşik L2 önbellek; dar GDDR6 bus'ını telafi eden büyük yerel önbellek",
        "position": {
          "x_pct": 70,
          "y_pct": 5,
          "width_pct": 25,
          "height_pct": 40
        }
      },
      {
        "name": "Bellek Denetleyicileri",
        "description": "192-bit GDDR6 arayüzü; 3 adet 64-bit kanal; chip'in alt kenarında",
        "position": {
          "x_pct": 5,
          "y_pct": 72,
          "width_pct": 75,
          "height_pct": 12
        }
      },
      {
        "name": "Medya Motor / Display Engine",
        "description": "Xe Media Engine; AV1, H.265 encode/decode ve DP 2.1 / HDMI 2.1 display kontrolcüsü",
        "position": {
          "x_pct": 70,
          "y_pct": 50,
          "width_pct": 25,
          "height_pct": 35
        }
      }
    ],
    "use_cases": [
      "Bütçe dostu 1440p oyun: 250-300 USD fiyat segmentinde RTX 4060 ve RX 7600 ile rekabetçi alternatif",
      "AI destekli medya işleme: XMX motorları ile yerel AI ölçekleme ve video transcode",
      "Yaratıcı içerik üretimi: 12 GB VRAM kapasitesi ile bu fiyat segmentinde en yüksek bellek miktarı",
      "Kompakt iş istasyonu kurulumları: tek 8-pin güç konektörü ve makul TDP ile mini-ITX uyumluluğu"
    ],
    "comparison_notes": "Alchemist Arc A770'e kıyasla özellik bazında genel görünümde daha düşük (20 vs 32 Xe-core), ancak pratikte 1440p oyunda %24 daha hızlı. TSMC N5 süreci ve yeniden tasarlanan Xe2 mimarisi core verimliliğini dramatik biçimde artırdı. Intel'in GPU pazarında güven inşa eden ilk gerçek anlamda rekabetçi ürünü.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Xe2 mimarisi ile bütçe segmentinde rekabeti kızıştıran GPU"
  },
  {
    "id": "apple-m4-max-gpu",
    "name": "Apple M4 Max GPU (40 Çekirdek)",
    "manufacturer": "Apple",
    "category": "GPU",
    "release_year": 2024,
    "process_node": "TSMC N3E (3nm 2. nesil)",
    "transistor_count": "Bilgi yok (M4 Max SoC'un parçası; yaklaşık 90+ milyar SoC geneli)",
    "die_size": "Bilgi yok",
    "image": "m4-max.png",
    "key_specs": {
      "architecture": "Apple GPU (entegre, unified memory)",
      "gpu_cores": 40,
      "ray_tracing_cores": "40 (donanım hızlandırmalı)",
      "memory_type": "LPDDR5X-8533 (Unified Memory)",
      "memory_bandwidth": "546 GB/s",
      "max_unified_memory": "128 GB",
      "gpu_tdp_approx": "~75W (GPU alt sistemi)",
      "api_support": "Metal 3, MetalFX, DirectX 12 (Game Porting Toolkit ile)"
    },
    "architecture_highlights": [
      "Apple Silicon GPU: CPU ve GPU'nun aynı LPDDR5X belleği paylaştığı birleşik bellek mimarisi; sıfır bellek kopyalama",
      "40 çekirdekli GPU; M3 Max 40 çekirdekli GPU'ya göre rasterizasyonda ~1.9x, M1 Max'e göre ise belirgin artış",
      "Donanım hızlandırmalı ışın izleme: her GPU çekirdeği içinde özel RT hızlandırma birimi",
      "546 GB/s bellek bant genişliği: aynı fiyat segmentindeki ayrık GPU'ların çoğunu geçen birleşik bellek bant genişliği",
      "Metal 3 ve MetalFX Upscaling (AMD FSR/DLSS benzeri Apple çözümü); hardware accelerated mesh shading",
      "Thunderbolt 5 desteği (M4 Pro/Max): 120 Gb/s harici bant genişliği ile harici GPU veya depolama bağlantısı"
    ],
    "die_regions": [
      {
        "name": "GPU Şerit Kümeleri",
        "description": "40 GPU core bloğu; SoC'un büyük bölümünü kaplayan yüksek yoğunluklu grafik işleme kümeleri",
        "position": {
          "x_pct": 35,
          "y_pct": 10,
          "width_pct": 55,
          "height_pct": 55
        }
      },
      {
        "name": "CPU Çekirdekleri (P+E)",
        "description": "12 performans (P) + 4 verimlilik (E) CPU çekirdeği; SoC'un sol-üst bölgesinde",
        "position": {
          "x_pct": 5,
          "y_pct": 10,
          "width_pct": 28,
          "height_pct": 55
        }
      },
      {
        "name": "Neural Engine",
        "description": "16 çekirdekli Apple Neural Engine; 38 TOPS AI çıkarım kapasitesi",
        "position": {
          "x_pct": 5,
          "y_pct": 70,
          "width_pct": 25,
          "height_pct": 20
        }
      },
      {
        "name": "Bellek Arabirimi (LPDDR5X)",
        "description": "512-bit geniş LPDDR5X bellek kanalları; SoC çevresine dağıtılmış; 546 GB/s bant genişliği",
        "position": {
          "x_pct": 0,
          "y_pct": 0,
          "width_pct": 100,
          "height_pct": 8
        }
      },
      {
        "name": "Media Engine ve I/O",
        "description": "Donanım ProRes, H.265, AV1 encode/decode; Thunderbolt 5 ve USB4 denetleyicileri",
        "position": {
          "x_pct": 35,
          "y_pct": 70,
          "width_pct": 55,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "Profesyonel video post-prodüksiyon: ProRes donanım hızlandırma ile DaVinci Resolve, Final Cut Pro'da gerçek zamanlı 8K iş akışları",
      "Büyük yerel LLM çıkarımı: 128 GB unified memory ile 100B parametreli modelleri tek makine üzerinde çalıştırma",
      "3D animasyon ve render: Blender CPU+GPU hibrit render, 40 GPU çekirdeği ile laptop sınıfında en hızlı entegre GPU",
      "Yazılım geliştirme ve AI/ML geliştirme: CoreML ve Metal tabanlı makine öğrenmesi model optimizasyonu"
    ],
    "comparison_notes": "M3 Max 40 çekirdekli GPU'ya kıyasla rasterizasyon yaklaşık %20 artmış, donanım RT desteği eklendi. M4 nesli TSMC N3E sürecine geçiş ile verimlilik artışı sağlandı. 546 GB/s birleşik bellek bant genişliği RTX 4090'ın 1.008 TB/s ayrık bant genişliğinin yarısı olsa da, sıfır kopya mimarisi AI iş yüklerinde pratik avantaj sağlar.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Entegre GPU'da ray tracing ve unified memory ile profesyonel performans"
  },
  {
    "id": "amd-zen5-ryzen-9-9950x",
    "name": "AMD Ryzen 9 9950X (Zen 5)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N4 (4nm, CCD'ler) + TSMC N6 (6nm, IOD)",
    "transistor_count": "~19.6 milyar (2 CCD: 2×8.16B + IOD: 3.37B)",
    "die_size": "2× 70.6 mm² (CCD) + 118 mm² (IOD)",
    "image": "ryzen-9950x.png",
    "key_specs": {
      "architecture": "Zen 5 (Granite Ridge, AM5)",
      "cores": 16,
      "threads": 32,
      "base_clock": "4.3 GHz",
      "boost_clock": "5.7 GHz",
      "l1_cache": "1280 KB (toplam)",
      "l2_cache": "16 MB (1 MB/çekirdek)",
      "l3_cache": "64 MB (2× 32 MB)",
      "tdp": "170W",
      "ppt": "230W",
      "socket": "AM5",
      "memory": "DDR5-5600 (çift kanal)",
      "pcie": "PCIe 5.0 x28 (toplam)"
    },
    "architecture_highlights": [
      "Zen 5 mimarisi: L1 veri önbelleği 32 KB'dan 48 KB'a çıkarıldı; L2 ilişkilendirme genişliği 8'den 16'ya yükseltildi",
      "Genişletilmiş decode/dispatch birimi: Zen 4'e kıyasla daha geniş instruction window ve IPC artışı (yaklaşık %16 ortalama)",
      "AVX-512 desteği (256-bit FPU ile tam boy AVX-512): bilimsel ve kripto iş yüklerinde Zen 4'ten belirgin kazanım",
      "2 adet CCD (Chiplet Complex Die) + 1 IOD (I/O Die) tasarımı; chiplet yaklaşımı verimlilik ve maliyet dengesini optimize eder",
      "İki DDR5 bellek kanalı, DDR5-5600 yerel hız; PCIe 5.0 x16+x4 GPU ve NVMe desteği",
      "L2 önbellek bant genişliği iki katına çıkarıldı (64 B/çevrim): bellek erişim yoğunluklu iş yüklerinde kritik iyileştirme"
    ],
    "die_regions": [
      {
        "name": "CCD 1 (8 Zen5 Çekirdeği)",
        "description": "İlk 8 çekirdekli Compute Complex Die; her çekirdek 48KB L1D + 32KB L1I + 1MB L2 + 4MB L3 payı",
        "position": {
          "x_pct": 5,
          "y_pct": 10,
          "width_pct": 35,
          "height_pct": 70
        }
      },
      {
        "name": "CCD 2 (8 Zen5 Çekirdeği)",
        "description": "İkinci 8 çekirdekli Compute Complex Die; CCD1 ile aynı tasarım",
        "position": {
          "x_pct": 45,
          "y_pct": 10,
          "width_pct": 35,
          "height_pct": 70
        }
      },
      {
        "name": "I/O Die (IOD)",
        "description": "TSMC N6 ile üretilmiş I/O chiplet; DDR5 bellek denetleyicisi, PCIe 5.0 denetleyicisi, USB, SATA ve entegre RDNA iGPU içerir",
        "position": {
          "x_pct": 82,
          "y_pct": 10,
          "width_pct": 15,
          "height_pct": 70
        }
      },
      {
        "name": "Infinity Fabric Bağlantısı",
        "description": "CCD'leri IOD'a bağlayan on-package yüksek hızlı veri yolu",
        "position": {
          "x_pct": 5,
          "y_pct": 82,
          "width_pct": 90,
          "height_pct": 10
        }
      }
    ],
    "use_cases": [
      "İçerik oluşturma ve render: video düzenleme, 3D animasyon, müzik prodüksiyon gibi ağır çok iş parçacıklı iş yükleri",
      "Geliştirme ve derleme ortamı: büyük kod tabanları için hızlı derleme süreleri; 16 çekirdek/32 thread avantajı",
      "Masaüstü AI: AVX-512 ile Whisper, Llama.cpp gibi yerel AI çıkarım araçlarında hızlandırılmış çalışma",
      "Üst düzey oyun iş istasyonu: hem yüksek oyun hem de prodüktivite performansı gerektiren kullanıcılar"
    ],
    "comparison_notes": "Ryzen 9 7950X'e kıyasla aynı 16 çekirdek/32 thread yapısında, fakat Zen 5 mimarisi ile ortalama %16 IPC artışı. 5nm'den 4nm geçiş verimlilik kazancı sağlamış; ancak belirgin klock artışı sağlanamamış (7950X de 5.7 GHz max). Çok iş parçacıklı render benchmarkları Zen 5'in gerçek anlamda prim olmadığını gösterdi; fiyat düşürülerek piyasada tutunabildi.",
    "is_announced": null,
    "rumored": null,
    "tagline": "AVX-512 ve geliştirilmiş IPC ile masaüstü Zen 5 amiral gemisi"
  },
  {
    "id": "amd-zen6-ryzen-10000",
    "name": "AMD Zen 6 / Ryzen 10000 (Olympic Ridge)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2026,
    "process_node": "TSMC N2 (2nm) — CCD'ler için; IOD için TSMC N3P (3nm) bekleniyor",
    "transistor_count": "TBD",
    "die_size": "TBD",
    "image": "ryzen-10000-zen6.png",
    "key_specs": {
      "architecture": "Zen 6 (Medusa / Olympic Ridge)",
      "cores_per_ccd": "12 (Zen 5'in 8'inden artış — beklenen)",
      "max_desktop_cores": "24 (2 CCD × 12)",
      "boost_clock_rumored": "6.0–6.5 GHz bölgesi (beklenen)",
      "memory_support": "DDR5-6400 (beklenen)",
      "socket": "AM5 (muhtemel)",
      "avx512_support": "AVX512_BMM, AVX_NE_CONVERT, AVX_IFMA dahil yeni uzantılar (resmi açıklama)",
      "tdp": "TBD"
    },
    "architecture_highlights": [
      "TSMC N2 (2nm GAA) süreci: Zen 5'in N4 sürecine göre transistör yoğunluğu ve güç verimliliği büyük artış bekleniyor",
      "CCD başına 12 çekirdek: Zen 5'in 8 çekirdekli CCD'sine göre %50 yoğunluk artışı; masaüstünde 24 çekirdek hedefi",
      "Yeni Infinity Fabric mimarisi: CCD-IOD arası gecikmenin düşürülmesi ve bant genişliğinin artırılması bekleniyor",
      "N3P I/O die: bellek denetleyicisi, PCIe ve Infinity Fabric bağlantısını barındıran güncel süreç IOD",
      "Zen 6c (yoğun varyant): sunucu platformu EPYC Venice için daha yüksek çekirdek sayısı imkânı",
      "AVX512_FP16 ve yeni AI uzantıları: on-device yapay zeka iş yükleri için genişletilmiş vektör yetenekleri"
    ],
    "die_regions": [
      {
        "name": "CCD (12 Çekirdek — beklenen)",
        "description": "Her CCD'de 12 Zen 6 çekirdeği; N2 süreci yüksek yoğunluk sağlar",
        "position": {
          "x_pct": 5,
          "y_pct": 10,
          "width_pct": 40,
          "height_pct": 70
        }
      },
      {
        "name": "CCD 2 (12 Çekirdek — beklenen)",
        "description": "İkinci CCD; çift CCD konfigürasyonu 24 toplam çekirdek",
        "position": {
          "x_pct": 48,
          "y_pct": 10,
          "width_pct": 40,
          "height_pct": 70
        }
      },
      {
        "name": "I/O Die (IOD — N3P)",
        "description": "Yeni nesil IOD; DDR5-6400 denetleyicisi, PCIe 5.0 ve Infinity Fabric hub'ı",
        "position": {
          "x_pct": 90,
          "y_pct": 10,
          "width_pct": 8,
          "height_pct": 70
        }
      }
    ],
    "use_cases": [
      "Gelecek nesil masaüstü iş yükleri: 24 çekirdeğe çıkabilen yüksek çekirdek sayısı ile render ve derleme iş yükleri",
      "Yapay zeka destekli yaratıcı uygulamalar: yeni AVX-512 AI uzantıları ile yerel LLM hızlandırma",
      "Üst düzey oyun: yüksek IPC ve 6+ GHz klok hızları ile tek thread performans liderliği beklentisi",
      "Sunucu segmenti (EPYC Venice): Zen 6c varyantı ile büyük çekirdek sayılı veri merkezi CPU'ları"
    ],
    "comparison_notes": "Bilgi yok (henüz piyasada değil). AMD roadmap'i Zen 6'nın 2026 içinde çıkacağını resmi olarak teyit etmiştir; ancak bazı kaynaklara göre masaüstü lancmanı 2027'ye kayabilir. N2 süreç geçişi ve 12 çekirdekli CCD yapısı Zen 5'e kıyasla önemli bir jenerasyon sıçraması olacak.",
    "is_announced": true,
    "rumored": true,
    "tagline": "Beklenen 2nm Zen 6 mimarisi — söylentiler ve sızıntılar"
  },
  {
    "id": "intel-arrow-lake-285k",
    "name": "Intel Core Ultra 9 285K (Arrow Lake)",
    "manufacturer": "Intel",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3B (hesaplama tile) + TSMC N5P (GPU tile) + TSMC N6 (I/O tile)",
    "transistor_count": "TBD (toplam paket; Intel açıklamamıştır)",
    "die_size": "~257 mm² (toplam paket yaklaşık)",
    "image": "core-ultra-285k.png",
    "key_specs": {
      "architecture": "Arrow Lake (Lion Cove P-core + Skymont E-core)",
      "p_cores": 8,
      "e_cores": 16,
      "total_cores": 24,
      "threads": 24,
      "hyperthreading": "Hayır (kaldırıldı)",
      "boost_clock": "5.7 GHz",
      "base_clock": "3.7 GHz (P-core) / 3.2 GHz (E-core)",
      "l2_cache": "40 MB",
      "l3_cache": "36 MB",
      "tdp": "125W (baz) / 250W (max turbo)",
      "socket": "LGA1851",
      "memory": "DDR5 çift kanal",
      "pcie": "PCIe 5.0 x20",
      "integrated_gpu": "Intel Xe-LPG (4 Xe-core, Alchemist mimarisi)",
      "npu": "Intel NPU 3.0 (13 TOPS)"
    },
    "architecture_highlights": [
      "Çok-tile mimarisi (Foveros): hesaplama tile (TSMC N3B), GPU tile (N5P), I/O ve SoC tile (N6) ayrı fabrikasyon; Intel'in kendi fabrikasından ilk kez tam bağımsızlık",
      "Lion Cove P-core: Raptor Cove'a kıyasla %9 IPC artışı; daha geniş decode/dispatch, 3 MB L2 (öncekinin 2.5 MB'ından artış)",
      "Hyperthreading kaldırıldı: P-core başına tek thread; alan verimliliği ve termal yönetim iyileştirme hedefiyle; Skymont E-core'ların bu boşluğu doldurması bekleniyor",
      "Skymont E-core: önceki Gracemont ile karşılaştırıldığında önemli IPC artışı; P-core benzeri bazı iş yüklerinde rekabetçi performans",
      "Paylaşılan L3 cache: P-core ve E-core kümelerinin tamamı L3'ü paylaşır; Raptor Lake'e göre görev geçişi gecikmeleri azaltılmış",
      "Entegre NPU 3.0 (13 TOPS): AI PC özelliklerini destekler; ancak Copilot+ için gereken 40 TOPS eşiğinin altında"
    ],
    "die_regions": [
      {
        "name": "Hesaplama Tile (P+E Core'lar)",
        "description": "TSMC N3B ile üretilmiş; 8 Lion Cove P-core ve 16 Skymont E-core, 36 MB paylaşılan L3 cache",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 55,
          "height_pct": 55
        }
      },
      {
        "name": "GPU Tile (Xe-LPG)",
        "description": "TSMC N5P üretimi; 4 Xe-LPG core (Alchemist mimarisi); oyun dışı platformlarda iGPU işlevini üstlenir",
        "position": {
          "x_pct": 62,
          "y_pct": 5,
          "width_pct": 33,
          "height_pct": 30
        }
      },
      {
        "name": "SoC Tile (NPU + Bellek Denetleyicisi)",
        "description": "Bellek denetleyicisi, NPU 3.0 ve yönetim mantığını barındırır; TSMC N6",
        "position": {
          "x_pct": 62,
          "y_pct": 38,
          "width_pct": 33,
          "height_pct": 25
        }
      },
      {
        "name": "I/O Tile (PCIe / USB)",
        "description": "PCIe 5.0 denetleyicisi, USB 3.2 ve platform bağlantılarını içerir; TSMC N6",
        "position": {
          "x_pct": 5,
          "y_pct": 62,
          "width_pct": 90,
          "height_pct": 15
        }
      },
      {
        "name": "Base Tile (Foveros Bağlantı)",
        "description": "Tüm tile'ları birbirine bağlayan intel Foveros paket substrat; tile arası sinyal yönlendirmesi",
        "position": {
          "x_pct": 0,
          "y_pct": 80,
          "width_pct": 100,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "Enerji verimli masaüstü oyun: 125W temel TDP'de rekabetçi performans; Raptor Lake'in 253W PL2'siyle karşılaştırıldığında dramatik enerji tasarrufu",
      "Güç verimliliği odaklı iş istasyonu: multithread iş yüklerinde watt başına yüksek performans",
      "AI PC geçiş platformu: NPU 3.0 ile temel AI özellikleri; gelecekteki Intel NPU 4 tabanlı Copilot+ PC'lerin öncüsü",
      "Çok görevli ofis / geliştirici iş yükü: 24 çekirdek (24 thread) ile arka plan iş yüklerinde verimli E-core kullanımı"
    ],
    "comparison_notes": "Core i9-14900K'ya kıyasla oyunda çoğunlukla daha yavaş (hyperthreading kaldırılması ve bellek gecikme sorunları nedeniyle); ancak enerji verimliliğinde dramatic gelişme: 14900K'nın 250W PL2 tüketiminde elde ettiği performansı 125W'da sağlıyor. Zen 5 Ryzen 9 9950X ile kıyaslandığında çok iş parçacıklı performansta geride; BIOS güncellemeleriyle kısmen telafi edilmeye çalışıldı.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Tile mimarisi ile Intel'in masaüstüne dönüşü — Lion Cove + Skymont"
  },
  {
    "id": "apple-m4-pro-max",
    "name": "Apple M4 Pro / M4 Max",
    "manufacturer": "Apple",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3E (3nm 2. nesil)",
    "transistor_count": "M4 Pro: ~28 milyar / M4 Max: ~92 milyar (tahmini)",
    "die_size": "TBD",
    "image": "apple-m4-pro-max.png",
    "key_specs": {
      "m4_pro_cpu_cores": "14 çekirdek (10P + 4E) veya 12 çekirdek varyant",
      "m4_max_cpu_cores": "14 çekirdek (10P + 4E) veya 16 çekirdek (12P + 4E)",
      "boost_clock_approx": "~4.4–4.5 GHz (performans çekirdeği)",
      "m4_pro_memory_bandwidth": "273 GB/s",
      "m4_max_memory_bandwidth": "410–546 GB/s",
      "m4_pro_max_memory": "64 GB LPDDR5X (unified)",
      "m4_max_max_memory": "128 GB LPDDR5X (unified)",
      "m4_pro_gpu_cores": "20",
      "m4_max_gpu_cores": "32 veya 40",
      "neural_engine": "16 çekirdekli, 38 TOPS",
      "thunderbolt": "Thunderbolt 5 (120 Gb/s)",
      "tdp_m4_max_approx": "~90W (toplam SoC)"
    },
    "architecture_highlights": [
      "Apple Firestorm/Icestorm benzeri 4. nesil P+E çekirdek tasarımı; TSMC N3E ile önceki M3 Pro/Max'a kıyasla %20-25 CPU performans artışı",
      "M4 Pro: DDR5 tabanlı 273 GB/s unified memory; önceki M3 Pro'nun 150 GB/s'sinden %75 artış — Apple'ın açıkladığı en büyük bant genişliği sıçramalarından biri",
      "M4 Max: 546 GB/s unified memory bant genişliği; 512-bit geniş LPDDR5X ile herhangi bir laptop CPU/GPU kombinasyonunu geride bırakan on-package bant genişliği",
      "Thunderbolt 5 desteği (ilk kez MacBook Pro'da M4 Pro/Max ile): 120 Gb/s bant genişliği ile çift 8K ekran bağlantısı",
      "Geliştirilmiş Media Engine (M4 Max): çift video encode motoru + çift ProRes akseleratör; 8K ProRes akışlarını gerçek zamanlı işleme",
      "Hardware ray tracing (tüm M4 ailesi): oyun ve render için donanım hızlandırmalı ışın izleme desteği"
    ],
    "die_regions": [
      {
        "name": "Performans CPU Çekirdekleri (P-core)",
        "description": "10–12 büyük performans çekirdeği; yüksek tek iş parçacığı performansı için tasarlanmış",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 30,
          "height_pct": 45
        }
      },
      {
        "name": "Verimlilik CPU Çekirdekleri (E-core)",
        "description": "4 küçük verimlilik çekirdeği; arka plan görevlerini düşük güçle işler",
        "position": {
          "x_pct": 5,
          "y_pct": 52,
          "width_pct": 30,
          "height_pct": 20
        }
      },
      {
        "name": "GPU Çekirdekleri (32/40)",
        "description": "Büyük birleşik bellek kullanılan entegre GPU; RT ve mesh shading desteği",
        "position": {
          "x_pct": 38,
          "y_pct": 5,
          "width_pct": 55,
          "height_pct": 55
        }
      },
      {
        "name": "Neural Engine + Media Engine",
        "description": "16 çekirdekli 38 TOPS NPU ve ProRes donanım hızlandırıcılar",
        "position": {
          "x_pct": 5,
          "y_pct": 75,
          "width_pct": 45,
          "height_pct": 20
        }
      },
      {
        "name": "Unified Memory Arabirimi",
        "description": "LPDDR5X-8533 bellek kanalları; SoC çevresine on-package olarak dizilmiş",
        "position": {
          "x_pct": 0,
          "y_pct": 92,
          "width_pct": 100,
          "height_pct": 8
        }
      }
    ],
    "use_cases": [
      "Profesyonel video ve müzik prodüksiyonu: ProRes donanım encode, Logic Pro/DaVinci Resolve ile en hızlı laptop deneyimi",
      "Yapay zeka geliştirme ve yerel LLM: 128 GB unified memory ile büyük modelleri MacBook üzerinde çalıştırma",
      "Yazılım geliştirme: XCode ile iOS/macOS simülatör çalıştırma, Swift derleme ve CI/CD işlemleri",
      "3D animasyon ve VFX: yüksek bant genişliği unified memory ile Maya, Cinema 4D, Blender kullanımı"
    ],
    "comparison_notes": "M3 Pro/Max'a kıyasla CPU'da %20-25, GPU'da ~%20 artış. En önemli değişiklik bellek bant genişliğinde: M4 Pro 273 GB/s (M3 Pro'nun 150 GB/s'sinin neredeyse 2 katı) ve Thunderbolt 5 desteği. Apple M5 serisi 2025'te çıkmış olup bu platform kısa süreliğine piyasada kaldı.",
    "is_announced": null,
    "rumored": null,
    "tagline": "ARM tabanlı, unified memory mimarili profesyonel SoC"
  },
  {
    "id": "qualcomm-snapdragon-x-elite",
    "name": "Qualcomm Snapdragon X Elite",
    "manufacturer": "Qualcomm",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N4P (4nm)",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "snapdragon-x-elite.png",
    "key_specs": {
      "architecture": "Qualcomm Oryon v1 (ARM tabanlı, Nuvia tasarımı)",
      "cores": 12,
      "threads": 12,
      "max_single_core_boost": "4.3 GHz (X1E-84-100 varyant)",
      "max_all_core_clock": "3.8 GHz",
      "total_cache": "42 MB",
      "l2_cache_per_core": "12 MB (büyük birleşik L2)",
      "memory_type": "LPDDR5X-8448",
      "memory_bandwidth": "135 GB/s",
      "max_memory": "64 GB",
      "gpu": "Qualcomm Adreno X1-85",
      "gpu_tflops": "4.6 TFLOPS (X1E-84-100)",
      "npu": "Hexagon NPU, 45 TOPS",
      "tdp_platform": "~23W (SoC platform TDP)"
    },
    "architecture_highlights": [
      "Qualcomm Oryon v1 (Nuvia tasarımlı): tamamen sıfırdan tasarlanmış ARM tabanlı çekirdek; Cortex-X serisinden bağımsız, 600+ girişli yeniden sıralama tamponu",
      "12 MB per-core unified L2 cache: tüm Oryon çekirdekleri büyük paylaşılan L2 bloklarına sahip; bellek erişim gecikmelerini Cortex-X4'e kıyasla azaltmış",
      "Windows on ARM uyumluluğu: x86 çeviri katmanı (CHRE) ve yerel ARM64 app desteğiyle PC platformunda ARM pazar açılımı",
      "45 TOPS Hexagon NPU: Copilot+ PC sertifikasyon gereksinimini karşılayan (≥40 TOPS) Qualcomm'un ilk platformu",
      "Entegre Adreno X1-85 GPU: grafik ve AI çıkarımı için paylaşılan 135 GB/s LPDDR5X belleği kullanır",
      "Yüksek güç verimliliği: ~23W platform TDP'de masaüstü Core i7 eşdeğeri çoklu iş parçacığı performansı (ARM uyumlu benchmarklarda)"
    ],
    "die_regions": [
      {
        "name": "Oryon CPU Çekirdeği Kümeleri",
        "description": "12 Oryon çekirdeği; 4'lük kümeler halinde; büyük L2 önbellekleri ile çekirdeğin büyük bölümünü kaplar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 45,
          "height_pct": 55
        }
      },
      {
        "name": "Adreno X1-85 GPU",
        "description": "Entegre GPU; grafik işleme ve AI iş yükü hızlandırma; LPDDR5X belleği CPU ile paylaşır",
        "position": {
          "x_pct": 52,
          "y_pct": 5,
          "width_pct": 43,
          "height_pct": 40
        }
      },
      {
        "name": "Hexagon NPU",
        "description": "45 TOPS AI hızlandırıcı; Copilot+ özelliklerini ve on-device LLM çıkarımını çalıştırır",
        "position": {
          "x_pct": 52,
          "y_pct": 48,
          "width_pct": 43,
          "height_pct": 20
        }
      },
      {
        "name": "Bellek Arabirimi (LPDDR5X)",
        "description": "8 kanallı LPDDR5X-8448 bellek arabirimi; 135 GB/s bant genişliği",
        "position": {
          "x_pct": 5,
          "y_pct": 65,
          "width_pct": 90,
          "height_pct": 15
        }
      },
      {
        "name": "Platform I/O ve Modem",
        "description": "PCIe, USB 4.0, Wi-Fi 7, Bluetooth 5.4 ve güç yönetimi",
        "position": {
          "x_pct": 5,
          "y_pct": 82,
          "width_pct": 90,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Copilot+ Windows laptop: Microsoft'un AI PC programı için referans platform; Copilot, Live Captions, Cocreator gibi yerel AI özellikleri",
      "Uzun pilli ultrabook: pil ömründe Apple M3/M4 ile rekabetçi güç verimliliği; Windows ekosisteminde",
      "Yazılım geliştirme (ARM native): Visual Studio, GitHub Copilot ve ARM64 uygulamaları için optimize geliştirme ortamı",
      "On-device AI çıkarımı: Hexagon NPU ile Stable Diffusion, Whisper, Phi gibi yerel modelleri düşük güç çekimiyle çalıştırma"
    ],
    "comparison_notes": "Intel Core Ultra 7 165H ve AMD Ryzen AI 9 HX 370'e kıyasla ARM uyumlu benchmark'larda üstün; x86 çevirimli uygulamalarda ise benzer veya bazen daha yavaş performans. Apple M3'e kıyasla %15-20 daha yavaş çok iş parçacığı, ancak Windows ekosistemiyle entegrasyon avantajı. Snapdragon X Elite Gen 2 (Oryon v3, N3E) 2025-2026 döneminde bekleniyor.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Oryon çekirdekleri ile Windows on ARM'ı gerçeğe dönüştüren chip"
  },
  {
    "id": "amd-epyc-turin-9965",
    "name": "AMD EPYC Turin 9965 (Zen 5c)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3 (3nm, Zen5c CCD'ler) + TSMC N6 (6nm, IOD)",
    "transistor_count": "TBD (EPYC Turin serisi toplam; çok die paket)",
    "die_size": "TBD",
    "image": "epyc-9965.png",
    "key_specs": {
      "architecture": "Zen 5c — yüksek yoğunluklu kompakt varyant (Turin Dense)",
      "cores": 192,
      "threads": 384,
      "base_clock": "2.25 GHz",
      "all_core_boost": "3.35 GHz",
      "max_boost_clock": "3.7 GHz",
      "l3_cache": "384 MB (12 CCD × 32 MB)",
      "cores_per_ccd": "16 (Zen5c CCD başına)",
      "ccd_count": 12,
      "tdp": "500W",
      "ctdp_range": "450–500W",
      "socket": "SP5",
      "memory_channels": 12,
      "memory_bandwidth": "614 GB/s",
      "memory_spec": "DDR5-6400",
      "pcie": "PCIe 5.0 x128 (tek soket)",
      "list_price_1ku": "11.988 USD"
    },
    "architecture_highlights": [
      "Zen 5c (yoğun varyant): Zen 5 tam çekirdeğinin küçültülmüş versiyonu; standart CCD'nin 8 yerine 16 çekirdek içermesi için zemin alanı optimize edilmiş",
      "12 adet Zen 5c CCD: tek sokette 192 çekirdek; Intel Xeon 6 Sierra Forest 144 çekirdekli rakibine kıyasla %33 daha yüksek çekirdek yoğunluğu",
      "384 MB L3 cache (toplam): her CCD 32 MB L3 paylaşır; büyük cache, çekirdek başına düşmesine rağmen toplam cache önemli miktarda",
      "12 kanallı DDR5-6400 bellek: 614 GB/s bellek bant genişliği; Genoa'nın DDR5-4800 destekli önceki nesline kıyasla %28 fiili artış",
      "500W TDP: yüksek güç tüketimi zorunlu; fakat çekirdek başına ve watt başına performans server workload'larında rekabetçi",
      "AMD Infinity Guard ve CXL bellek genişletme: güvenlik özelliği yığını ve CXL 1.1 ile harici bellek genişletme desteği"
    ],
    "die_regions": [
      {
        "name": "Zen 5c CCD'ler (×12)",
        "description": "Her biri 16 Zen5c çekirdeği ve 32 MB L3 barındıran 12 adet kompakt CCD; N3 süreç",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 75,
          "height_pct": 65
        }
      },
      {
        "name": "I/O Die (IOD)",
        "description": "Merkezi IOD; 12 DDR5 bellek kanalı, PCIe 5.0, Infinity Fabric hub; N6 süreç",
        "position": {
          "x_pct": 82,
          "y_pct": 5,
          "width_pct": 15,
          "height_pct": 65
        }
      },
      {
        "name": "Bellek Denetleyicileri (12 Kanal)",
        "description": "IOD'da bulunan 12 adet DDR5-6400 kanal denetleyicisi; 614 GB/s toplam bant genişliği",
        "position": {
          "x_pct": 82,
          "y_pct": 40,
          "width_pct": 15,
          "height_pct": 30
        }
      },
      {
        "name": "Infinity Fabric Bağlantı Ağı",
        "description": "12 CCD'yi IOD'a bağlayan on-package yüksek bant genişlikli matris",
        "position": {
          "x_pct": 5,
          "y_pct": 72,
          "width_pct": 90,
          "height_pct": 15
        }
      }
    ],
    "use_cases": [
      "Sanal makine yoğun veri merkezi: 192 çekirdek/384 thread ile en yüksek vCPU yoğunluğu; bulut sağlayıcılar için ideal",
      "Web sunucusu ve CDN: yüksek eş zamanlı bağlantı işleme kapasitesi; çekirdek başına maliyet optimizasyonu",
      "Büyük veri analitiği ve veritabanı: geniş paralellik gerektiren OLAP ve veri ambarı iş yükleri",
      "Konteyner ve Kubernetes kümeleri: yüksek iş parçacığı sayısı ile düzinelerce pod'u tek düğümde barındırma"
    ],
    "comparison_notes": "EPYC 9754 (Genoa, Zen 4) kıyasında %37 geometrik ortalama ML/HPC artışı, %17 enterprise iş yükü artışı. Tam boy Zen 5 kullanan EPYC 9955 (128 çekirdek) ile karşılaştırıldığında 9965, daha yüksek çekirdek yoğunluğu ama daha düşük çekirdek başına frekans ve cache hızı sunuyor.",
    "is_announced": null,
    "rumored": null,
    "tagline": "192 çekirdekli Zen 5c ile sunucu pazarının kralı"
  },
  {
    "id": "ram-ddr5",
    "name": "DDR5 RAM (JEDEC Standardı)",
    "manufacturer": "Samsung / SK Hynix / Micron",
    "category": "RAM",
    "release_year": 2020,
    "process_node": "Üreticiye göre değişir: Samsung 12nm, SK Hynix 10nm, Micron 1β (10nm sınıfı)",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "ddr5.png",
    "key_specs": {
      "jedec_standard": "JESD79-5 (DDR5)",
      "speed_range": "4800–8400 MT/s (JEDEC; overlock ile daha yüksek)",
      "voltage": "1.1V (DDR4'ün 1.2V'undan düşük)",
      "channel_width": "64-bit (DDR4 ile aynı; ancak 2 adet 32-bit alt kanal)",
      "burst_length": "BL16 (DDR4 BL8'den 2x artış)",
      "max_module_capacity": "128 GB (RDIMM ile 256 GB+)",
      "peak_bandwidth_per_channel": "67.2 GB/s (DDR5-8400)",
      "on_die_ecc": "Evet (DDR4'te yoktu)",
      "power_management": "On-DIMM PMIC (güç yönetimi IC DIMM üzerinde)",
      "typical_desktop_configs": "DDR5-5600 (AMD Ryzen 9000 varsayılan), DDR5-6000 (AMD EXPO), DDR5-6400 (Intel XMP)"
    },
    "architecture_highlights": [
      "Çift bağımsız 32-bit alt kanal mimarisi: DDR4'ün tek 64-bit kanalı yerine iki yarı-kanal; küçük veri transferlerinde gecikmeyi azaltır",
      "On-Die ECC (hata düzeltme): her DRAM modülünde dahili hata düzeltme; güvenilirlik artışı — özellikle 1β ve daha küçük süreç düğümlerinde önem kazanıyor",
      "PMIC entegrasyonu (DIMM üzerinde güç yönetimi IC): güç regulasyonu DIMM üzerine taşınarak ana kart tasarımı basitleştirildi",
      "Yüksek hız skalabilitesi: JEDEC 8400 MT/s'e kadar standardize etmiş; OC modülleri 12000+ MT/s'e ulaşabiliyor",
      "Düşük güç gereksinimi: 1.1V (DDR4'ün 1.2V'una kıyasla); daha düşük çalışma ısısı ve veri merkezi güç tasarrufu",
      "Yazma gecikmesi iyileştirmesi: DDR5 protokol güncellemeleri ile toplam döngü süresi DDR4'e kıyasla daha iyi olacak şekilde optimize edildi"
    ],
    "die_regions": [
      {
        "name": "DRAM Array'leri (Çekirdek)",
        "description": "Veriyi depolayan kapasitör+transistör hücre dizileri; die yüzeyinin büyük çoğunluğunu kaplar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 80,
          "height_pct": 70
        }
      },
      {
        "name": "Sense Amplifiers + I/O",
        "description": "Hücre verilerini okumak için amplifier dizileri ve harici I/O arabirimi",
        "position": {
          "x_pct": 5,
          "y_pct": 77,
          "width_pct": 80,
          "height_pct": 15
        }
      },
      {
        "name": "On-Die ECC Mantığı",
        "description": "Dahili ECC hesaplama ve düzeltme devresi; her satır verisiyle birlikte ek parity bit'leri",
        "position": {
          "x_pct": 87,
          "y_pct": 5,
          "width_pct": 10,
          "height_pct": 50
        }
      },
      {
        "name": "Row/Column Adres Mantığı",
        "description": "Bellek adresleme, refresh yönetimi ve komut çözümleme devresi",
        "position": {
          "x_pct": 87,
          "y_pct": 57,
          "width_pct": 10,
          "height_pct": 35
        }
      }
    ],
    "use_cases": [
      "Masaüstü ve dizüstü bilgisayarlar: Intel 12. nesil (Alder Lake) sonrası ve AMD AM5 platformlarının zorunlu bellek standardı",
      "Sunucu ve veri merkezi: ECC DDR5 RDIMM ile EPYC ve Xeon platformlarında güvenilir, yüksek kapasiteli bellek",
      "AI iş istasyonu: LLM inference ve training için geniş adreslenebilir bellek kapasitesi; GPU'ya tamamlayıcı sistem belleği",
      "Aşırı hız aşırtma (OC): EXPO (AMD) ve XMP (Intel) profilleri ile yüksek frekanslı oyun belleği konfigürasyonları"
    ],
    "comparison_notes": "DDR4-3200'e kıyasla DDR5-4800 zirve bant genişliğinde ~%50 artış; DDR5-8400'de bu oran %160'ı geçer. Ancak birinci nesil DDR5 modülleri (4800-5200 MT/s) başlangıçta DDR4'e kıyasla daha yüksek gecikme gösterdi. Güncel tasarımlar (2024+) bu gecikme farkını önemli ölçüde kapatmıştır.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Masaüstü ve dizüstüde standartlaşan modern bellek nesli"
  },
  {
    "id": "ram-lpddr5x",
    "name": "LPDDR5X (Düşük Güçlü DDR5X)",
    "manufacturer": "Samsung / SK Hynix / Micron",
    "category": "RAM",
    "release_year": 2021,
    "process_node": "Samsung: 12nm, SK Hynix: 10nm, Micron: 1β/1γ",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "lpddr5x.png",
    "key_specs": {
      "jedec_standard": "JESD209-5B (LPDDR5X)",
      "max_speed_jedec": "8533 MT/s",
      "samsung_lpddr5x_max": "10.700 MT/s (en hızlı üretim)",
      "voltage": "1.05V / 0.5V I/O (LPDDR5'in 1.1V'undan daha düşük)",
      "channel_width_typical": "64-bit veya 128-bit (SoC tasarımına göre)",
      "bandwidth_snapdragon_x_elite": "135 GB/s (16-bit × 8 kanal × 8448 MT/s)",
      "bandwidth_m4_max": "546 GB/s (512-bit geniş arayüz, 8533 MT/s)",
      "max_die_capacity": "32 GB (tek paket)",
      "ecc_support": "Seçimli (bazı SoC uygulamalarında)"
    },
    "architecture_highlights": [
      "JESD209-5B standardı: LPDDR5'i 8533 MT/s'e genişleten uzantı; sinyal bütünlüğü iyileştirmeleri ve TX/RX ekolizasyon eklendi",
      "PAM signaling yerine NRZ (Non-Return-to-Zero): yüksek frekanslarda sinyal bütünlüğü için optimize edilmiş sinyalizasyon",
      "Adaptive Refresh Management: yenileme gereksinimlerini gerçek zamanlı olarak ayarlayarak güç tasarrufu sağlayan yeni özellik",
      "Multi-Rank Operasyon: tek pakette çoklu rank desteği; gecikme optimizasyonu için komut pipeline kullanımı",
      "LPDDR5X-10700 (Samsung, 2024): 12nm süreçte üretilen en hızlı mobil bellek; %25 daha yüksek bant genişliği ve %25 enerji verimliliği artışı",
      "On-package yapı (PoP): SoC ve bellek aynı pakette üst üste montaj; telefon/tablet için en düşük gecikme ve en kompakt form"
    ],
    "die_regions": [
      {
        "name": "DRAM Core Array'leri",
        "description": "Kapasitör+transistör hücre matrisi; mobil optimize kompakt layout",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 75,
          "height_pct": 65
        }
      },
      {
        "name": "Sense Amplifiers",
        "description": "Hücre sinyallerini okuyan amplifier dizisi; yüksek hızda (8533+ MT/s) kritik",
        "position": {
          "x_pct": 5,
          "y_pct": 72,
          "width_pct": 75,
          "height_pct": 15
        }
      },
      {
        "name": "I/O Arabirimi ve PHY",
        "description": "Yüksek hız sinyalizasyonu için TX/RX ekolizasyon devresi; LPDDR5X'in kritik özelliği",
        "position": {
          "x_pct": 82,
          "y_pct": 5,
          "width_pct": 15,
          "height_pct": 50
        }
      },
      {
        "name": "Güç Yönetimi / ZQ Kalibrasyon",
        "description": "1.05V çalışma için dahili voltaj regülasyonu ve impedans kalibrasyonu",
        "position": {
          "x_pct": 82,
          "y_pct": 57,
          "width_pct": 15,
          "height_pct": 35
        }
      }
    ],
    "use_cases": [
      "Premium akıllı telefon ve tablet: Snapdragon 8 Gen 3, Apple A17 Pro ve MediaTek Dimensity 9300 SoC'larda birincil bellek",
      "Copilot+ laptop ve ARM PC: Snapdragon X Elite ve Apple M4 Pro/Max'ın yüksek bant genişliği gerektiren on-chip unified memory olarak",
      "Yerleşik AI çıkarımı: on-device LLM çıkarımı için kompakt, düşük güçlü ve yüksek bant genişlikli bellek",
      "Otomotiv ve IVI sistemler: genişletilmiş sıcaklık aralığı gereksinimlerini karşılayan endüstriyel LPDDR5X modülleri"
    ],
    "comparison_notes": "LPDDR5 (6400 MT/s) ile karşılaştırıldığında LPDDR5X, aynı form faktöründe %33 daha yüksek bant genişliği sunar. DDR5'in SODIMM modüllerine kıyasla çok daha düşük voltaj (1.05V vs 1.1V) ve SoC ile daha yakın entegrasyon avantajı var; ancak DDR5 kadar büyük DIMM kapasitelerine ulaşamaz.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Mobil cihazlar için düşük güçlü, yüksek hızlı bellek"
  },
  {
    "id": "ram-hbm3e",
    "name": "HBM3E (Yüksek Bant Genişlikli Bellek 3E)",
    "manufacturer": "SK Hynix / Samsung / Micron",
    "category": "RAM",
    "release_year": 2023,
    "process_node": "SK Hynix: 1α; Samsung: HBM3E Shinebolt; Micron: 1β — tüm HBM3E üreticileri 10nm altı süreç",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "hbm3e.png",
    "key_specs": {
      "jedec_standard": "JESD235 HBM3E",
      "pin_speed_typical": "9.2–9.8 Gbps/pin",
      "pin_speed_advanced": "12.4 Gbps/pin (gelişmiş uygulamalar)",
      "bus_width": "1024-bit (16 kanal × 64-bit)",
      "bandwidth_per_stack": "1.0–1.2 TB/s (tipik) — 1.33 TB/s (gelişmiş)",
      "capacity_8hi": "24 GB",
      "capacity_12hi": "36 GB",
      "voltage": "1.1V",
      "stacking_technology": "Through-Silicon Via (TSV) + MR-MUF (Mass Reflow Molded Underfill)",
      "power_efficiency": "HBM2e'ye kıyasla 2.5× daha iyi watt başına performans",
      "key_users": "NVIDIA H200, B200; AMD MI300X; Google TPU v5"
    },
    "architecture_highlights": [
      "Dikey TSV yığınlama: 8–12 adet DRAM kalıbını Through-Silicon Via'lar ile dikey bağlama; aynı silikon interposer üzerinde GPU ile yan yana",
      "1024-bit geniş bellek arabirimi: DDR5'in 64-bit, GDDR7'nin 512-bit genişliğine kıyasla karşılaştırılmaz bant genişliği yoğunluğu",
      "12-Hi yığın (HBM3E): 12 kat DRAM kalıbı ile 36 GB/yığın kapasitesi; HBM3'ün 24 GB sınırını aşıyor",
      "Pseudo-kanal mimarisi: her 64-bit kanalın içinde 2 adet 32-bit pseudo-kanal; küçük işlemlerde gecikmeyi azaltıyor",
      "Termal TSV (All-around power TSV): 6 kat artırılmış TSV sayısı ile IR düşüşü %75 azaltıldı; yoğun AI iş yüklerinde kararlılık",
      "SK Hynix birincil tedarikçi: NVIDIA B200 ve H200 GPU'larının HBM3E tedarikçisi; Micron ve Samsung yakın takipte"
    ],
    "die_regions": [
      {
        "name": "DRAM Die Katmanları (8–12 Hi)",
        "description": "Dikey yığılmış 8–12 adet DRAM kalıbı; TSV'ler ile birbirine bağlı; veriyi depolayan ana katmanlar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 80,
          "height_pct": 50
        }
      },
      {
        "name": "Temel Die (Logic Die)",
        "description": "Yığının altındaki mantık katmanı; serileştiriciler, PHY ve I/O arabirimi içerir; GPU interposer'a bağlı",
        "position": {
          "x_pct": 5,
          "y_pct": 58,
          "width_pct": 80,
          "height_pct": 20
        }
      },
      {
        "name": "TSV Matrisi",
        "description": "Katmanlar arası veri yolu: binlerce Through-Silicon Via sütunu; 1024-bit toplam veri yolu",
        "position": {
          "x_pct": 87,
          "y_pct": 5,
          "width_pct": 10,
          "height_pct": 70
        }
      },
      {
        "name": "Micro Bump Arabirimi",
        "description": "Logic die'ın altındaki mikro bağlantı noktaları; silicon interposer'a 1024-bit paralel bağlantı",
        "position": {
          "x_pct": 5,
          "y_pct": 80,
          "width_pct": 90,
          "height_pct": 15
        }
      }
    ],
    "use_cases": [
      "AI eğitim hızlandırıcıları: NVIDIA B200, H100/H200 ve AMD MI300X gibi büyük AI GPU'larında zorunlu bellek teknolojisi",
      "Büyük dil modeli çıkarımı: 100B+ parametreli modelleri minimum bellek bant genişliği darboğazıyla çalıştırma",
      "HPC süperbilgisayarlar: FP64 hesaplamada saniyede terabayt düzeyinde bellek bant genişliği gerektiren simülasyonlar",
      "Özel AI çipleri: Google TPU, Graphcore, Cerebras ve diğer özel AI hızlandırıcı tasarımlarında HBM3E"
    ],
    "comparison_notes": "HBM3 (6.4 Gbps/pin, 819 GB/s) ile karşılaştırıldığında HBM3E tipik olarak %50 daha yüksek bant genişliği ve %50 daha fazla kapasite (12-Hi ile 36 GB vs 8-Hi 24 GB) sunar. GDDR7'nin 512-bit 1792 GB/s bant genişliğine kıyasla HBM3E, aynı toplam bant genişliğini çok daha düşük pin sayısıyla ve çok daha az fiziksel alan kaplar.",
    "is_announced": null,
    "rumored": null,
    "tagline": "AI çağının yüksek bant genişlikli yığın belleği"
  },
  {
    "id": "ram-gddr7",
    "name": "GDDR7 (7. Nesil Grafik DDR Belleği)",
    "manufacturer": "Samsung / SK Hynix / Micron",
    "category": "RAM",
    "release_year": 2024,
    "process_node": "Samsung: 12nm, SK Hynix: 1β, Micron: 1β",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "gddr7.png",
    "key_specs": {
      "jedec_standard": "JESD232 GDDR7",
      "pin_speed_initial": "28–32 Gbps/pin",
      "pin_speed_roadmap": "48 Gbps/pin (yol haritası)",
      "signaling": "PAM3 (Pulse Amplitude Modulation 3-level)",
      "voltage": "1.2V",
      "bandwidth_per_device": "128–192 GB/s (cihaz başına)",
      "bandwidth_rtx5090": "1792 GB/s (512-bit, 28 Gbps)",
      "bandwidth_rx9070xt": "640 GB/s (256-bit, 20 Gbps GDDR6)",
      "capacity_per_die": "16 Gb (2 GB)",
      "typical_gpu_configs": "16–32 GB (RTX 5080/5090 gibi üst segment GPU'larda)",
      "power_efficiency_vs_gddr6": "~%20 daha iyi (yüksek bant genişliğinde)"
    },
    "architecture_highlights": [
      "PAM3 sinyalizasyon (3 seviyeli darbe genlik modülasyonu): GDDR6'nın 2 seviyeli NRZ'ına kıyasla aynı frekansta %50 daha fazla bit/pin verimliliği",
      "28–32 Gbps başlangıç hızı: GDDR6X'in 21 Gbps maksimum hızına kıyasla önemli artış; GDDR6X'in PAM4 sinyalizasyonu yerine daha verimli PAM3 tercih edildi",
      "Yüksek enerji verimliliği: 1.2V çalışma gerilimi ve PAM3 mimari verimliliği ile GDDR6/6X'e kıyasla watt başına daha yüksek bant genişliği",
      "Büyük bant genişliği/pin avantajı: aynı 512-bit bus genişliğinde GDDR7 (28 Gbps) 1792 GB/s; GDDR6X (21 Gbps) 1.008 TB/s — %77 artış",
      "Epoxy Mold Compound (EMC): yeni yüksek termal iletkenlikli paketleme; termal direnci %70 azaltarak GPU sıcaklık yönetimini iyileştiriyor",
      "RTX 50 serisi GDDR7 ilk kullanımı: Samsung GDDR7 modülleri önce doğrulama tamamlandığı için NVIDIA RTX 50 serisi lansmanını destekledi"
    ],
    "die_regions": [
      {
        "name": "DRAM Core Array",
        "description": "Veri depolama hücrelerinden oluşan ana dizi; tüm die yüzeyinin çoğunluğunu kaplar",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 75,
          "height_pct": 65
        }
      },
      {
        "name": "PAM3 Alıcı/Verici (PHY)",
        "description": "Yüksek hızlı PAM3 sinyalizasyon için analog alıcı ve verici devre; GDDR7'nin kritik yenilikçi bölümü",
        "position": {
          "x_pct": 82,
          "y_pct": 5,
          "width_pct": 15,
          "height_pct": 40
        }
      },
      {
        "name": "Sense Amplifiers",
        "description": "Hücre okuma amplifier dizisi; 32 Gbps hızında güvenilir veri okuma için optimize",
        "position": {
          "x_pct": 5,
          "y_pct": 72,
          "width_pct": 75,
          "height_pct": 15
        }
      },
      {
        "name": "Kontrol ve Adres Mantığı",
        "description": "Satır/sütun adresleme, refresh yönetimi ve GDDR7 komut protokolü devresi",
        "position": {
          "x_pct": 82,
          "y_pct": 47,
          "width_pct": 15,
          "height_pct": 40
        }
      }
    ],
    "use_cases": [
      "Üst segment oyun GPU'ları: NVIDIA RTX 5080/5090 ve gelecekteki AMD RX 9000 üst segment modellerinde yüksek çözünürlük oyun belleği",
      "AI çıkarım GPU'ları (tüketici sınıfı): yerel LLM çalıştırmak için yeterli bant genişliği; GDDR7 ile 32 GB model desteği",
      "Oyun iş istasyonu geliştirme ortamı: Unreal Engine, Blender render ve game streaming iş yükleri için yüksek hızlı video belleği",
      "Makine öğrenmesi araştırması (küçük ölçek): HBM3E gerektirmeyen orta ölçek model eğitim ve fine-tuning işlemleri"
    ],
    "comparison_notes": "GDDR6X (21 Gbps, PAM4) ile karşılaştırıldığında GDDR7 aynı bus genişliğinde %33–52 daha fazla bant genişliği sunar ve enerji verimliliği daha iyi. GDDR6X'in daha karmaşık PAM4 yerine GDDR7'nin daha verimli PAM3 sinyalizasyonu tercih edildi. HBM3E'ye kıyasla çok daha düşük birim maliyet ve kullanım kolaylığı; AI veri merkezi değil, oyun/yaratıcı grafik GPU'ları için optimize.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Yeni nesil oyun ve workstation GPU'ları için PAM3 modülasyonlu bellek"
  },
  {
    "id": "nvidia-ada-rtx-4090",
    "name": "NVIDIA GeForce RTX 4090",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2022,
    "process_node": "TSMC 4N (özel 5nm sınıfı)",
    "transistor_count": "76.3 milyar (AD102)",
    "die_size": "608.5 mm²",
    "image": "rtx-5090.png",
    "image_credit": "Temsilî görsel — GeForce ailesi",
    "key_specs": {
      "architecture": "Ada Lovelace (AD102-300)",
      "cuda_cores": 16384,
      "tensor_cores": "512 adet (4. nesil)",
      "ray_tracing_cores": "128 adet (3. nesil)",
      "vram": "24 GB GDDR6X",
      "vram_speed": "21 Gbps",
      "memory_interface": "384-bit",
      "memory_bandwidth": "1008 GB/s",
      "boost_clock": "2520 MHz",
      "base_clock": "2230 MHz",
      "l2_cache": "72 MB",
      "tdp": "450W",
      "pcie": "PCIe 4.0 x16",
      "fp32_tflops": "~82.6 TFLOPS"
    },
    "architecture_highlights": [
      "AD102 die'ının tam sürümü 144 SM içerir; RTX 4090'da 128 SM açık — kalanlar üretim verimi için kapalı tutuluyor",
      "L2 cache'i bir önceki nesle (RTX 3090: 6 MB) göre 12 kat büyüterek 72 MB'a çıkardı; bellek bant genişliği neredeyse aynı kalırken performans bu sayede arttı",
      "4. nesil Tensor Core'larla FP8 desteği ve DLSS 3 Frame Generation tüketici kartlarına geldi",
      "Kiralama piyasasında hâlâ en çok listelenen tüketici GPU'larından biri: 24 GB VRAM, orta boy modellerde çıkarım için yeterli"
    ],
    "die_regions": [
      {
        "name": "GPC Kümeleri / SM'ler",
        "description": "128 açık SM, 16.384 CUDA core; die'ın büyük bölümü",
        "position": {
          "x_pct": 5,
          "y_pct": 5,
          "width_pct": 65,
          "height_pct": 70
        }
      },
      {
        "name": "L2 Cache",
        "description": "72 MB L2 — Ada'nın bant genişliği yerine cache ile hızlanma stratejisi",
        "position": {
          "x_pct": 70,
          "y_pct": 5,
          "width_pct": 25,
          "height_pct": 45
        }
      },
      {
        "name": "Bellek Denetleyicileri",
        "description": "12 adet 32-bit GDDR6X denetleyici (384-bit)",
        "position": {
          "x_pct": 5,
          "y_pct": 78,
          "width_pct": 90,
          "height_pct": 12
        }
      },
      {
        "name": "NVENC / NVDEC ve PCIe",
        "description": "Çift AV1 kodlayıcı, PCIe 4.0 arayüzü",
        "position": {
          "x_pct": 70,
          "y_pct": 55,
          "width_pct": 25,
          "height_pct": 20
        }
      }
    ],
    "use_cases": [
      "4K oyun ve DLSS 3 ile yüksek kare hızı",
      "Yerel AI çıkarımı ve ince ayar: 24 GB VRAM ile 7–13 milyar parametreli modeller",
      "3D render ve video kodlama (çift AV1 NVENC)",
      "Bulutta ucuz GPU kiralama: veri merkezi kartlarına göre saatlik fiyatı çok düşük"
    ],
    "comparison_notes": "RTX 5090'a göre CUDA core sayısı %25 daha az (16.384'e karşı 21.760), bellek bant genişliği 1.008 GB/s'ye karşı 1.792 GB/s. Veri merkezi kartı L40S ile aynı AD102 die'ını kullanır; fark ECC'siz bellek, daha yüksek saat hızı ve tüketici lisansı.",
    "is_announced": null,
    "rumored": null,
    "tagline": "Cache'i 12 kat büyüterek hızlanan Ada amiral gemisi"
  },
  {
    "id": "nvidia-grace-blackwell-ultra-gb300",
    "name": "NVIDIA GB300 Grace Blackwell Ultra",
    "manufacturer": "NVIDIA",
    "category": "GPU",
    "release_year": 2025,
    "process_node": "TSMC 4NP (GPU) + TSMC 4N (CPU)",
    "transistor_count": "208 milyar (B300 GPU başına, çift die)",
    "die_size": "Çoklu die paketi — Grace CPU + Blackwell Ultra GPU'lar",
    "image": "blackwell-b200.png",
    "image_credit": "Temsilî görsel — Blackwell ailesi",
    "key_specs": {
      "architecture": "Grace Blackwell Ultra (Grace CPU + B300 GPU'lar)",
      "cpu": "72 çekirdekli Arm Neoverse V2 (Grace)",
      "vram": "288 GB HBM3e (GPU başına)",
      "memory_bandwidth": "8 TB/s (GPU başına)",
      "fp4_tflops": "15 PFLOPS (yoğun NVFP4, GPU başına)",
      "nvlink": "NVLink 5, 1.8 TB/s GPU-GPU",
      "compute_tray": "1 hesap tepsisi: 2 Grace + 4 B300, 1.15 TB HBM3e, 960 GB LPDDR5X",
      "form_factor": "GB300 NVL72 rafı: 72 GPU + 36 Grace CPU",
      "rack_memory": "Raf başına ~21 TB HBM3e + 17.28 TB LPDDR5X",
      "rack_power": "Raf başına 132–140 kW"
    },
    "architecture_highlights": [
      "GB200'ün halefi: her GPU'daki HBM3e 192 GB'tan 288 GB'a çıktı (12 katmanlı yığınlar); bant genişliği 8 TB/s'de kaldı",
      "Yoğun FP4 hesabı GPU başına 15 PFLOPS'a yükseldi; FP8 ve FP16 performansı bir önceki nesille aynı kaldı — tasarım bilinçli olarak düşük hassasiyetli çıkarıma yöneldi",
      "NVL72 rafında 72 GPU tek bir NVLink alanında; raf başına yaklaşık 21 TB HBM3e tek bir dev hızlandırıcı gibi adreslenebiliyor",
      "Raf başına 130 kW'ın üzerindeki güç tüketimi sıvı soğutmayı ve veri merkezinde yeni elektrik altyapısını zorunlu kılıyor"
    ],
    "die_regions": [
      {
        "name": "Blackwell Ultra GPU #1",
        "description": "İki retikül die, 288 GB HBM3e, 8 TB/s",
        "position": {
          "x_pct": 4,
          "y_pct": 6,
          "width_pct": 44,
          "height_pct": 40
        }
      },
      {
        "name": "Blackwell Ultra GPU #2",
        "description": "İkinci B300 paketi",
        "position": {
          "x_pct": 52,
          "y_pct": 6,
          "width_pct": 44,
          "height_pct": 40
        }
      },
      {
        "name": "Grace CPU",
        "description": "72 Arm Neoverse V2 çekirdeği ve LPDDR5X bellek",
        "position": {
          "x_pct": 20,
          "y_pct": 52,
          "width_pct": 60,
          "height_pct": 24
        }
      },
      {
        "name": "NVLink-C2C ve NVLink 5",
        "description": "CPU–GPU ve GPU–GPU bağlantıları",
        "position": {
          "x_pct": 10,
          "y_pct": 80,
          "width_pct": 80,
          "height_pct": 12
        }
      }
    ],
    "use_cases": [
      "Akıl yürüten (reasoning) modellerde büyük ölçekli çıkarım — uzun yanıtlar çok fazla FP4 hesabı ve KV önbelleği ister",
      "Trilyon parametreli modellerin eğitimi ve ince ayarı",
      "Büyük bağlamlı çıkarım: GPU başına 288 GB HBM3e daha uzun KV önbelleği demek"
    ],
    "comparison_notes": "GB200'e göre fark hesap mimarisinde değil bellekte ve FP4'te: GPU başına %50 daha fazla HBM3e ve daha yüksek FP4 hesabı. Kiralama piyasasında GPU başına saatlik en pahalı model; tek B300'e göre fiyat farkı CPU, NVLink alanı ve raf altyapısının bedeli.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Daha fazla bellek, daha çok FP4: akıl yürüten modeller için raf ölçeğinde sistem"
  },
  {
    "id": "apple-a19-pro",
    "name": "Apple A19 Pro",
    "manufacturer": "Apple",
    "category": "CPU",
    "release_year": 2025,
    "process_node": "TSMC N3P (3 nm sınıfı)",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "apple-m4-pro-max.png",
    "image_credit": "Temsilî görsel — Apple Silicon ailesi (M4 Pro/Max). A19 Pro'nun kendi fotoğrafı değil.",
    "description": "iPhone 17 Pro ve 17 Pro Max'in SoC'u. A18 Pro ile aynı 2+4 çekirdek düzenini koruyor; kazanç TSMC N3P düğümünden, daha yüksek saatten, 12 GB belleğe çıkıştan ve büyütülmüş önbelleklerden geliyor. Telefonun ilk buhar odası bu chip'in ısısını taşımak için eklendi.",
    "key_specs": {
      "architecture": "Apple Silicon — 2 performans (P) + 4 verimlilik (E) çekirdeği",
      "cores": 6,
      "boost_clock": "4.26 GHz (P çekirdekleri)",
      "e_core_clock": "2.60 GHz",
      "gpu": "6 çekirdek Apple GPU (iPhone 17 Pro); A19 Pro cihaza göre 5 ya da 6 çekirdekli",
      "neural_engine": "16 çekirdek",
      "npu_tops": "35 TOPS",
      "unified_memory": "12 GB LPDDR5X",
      "memory_bandwidth": "76.8 GB/s",
      "l2_cache": "16 MB (P) + 6 MB (E)",
      "l3_cache": "32 MB",
      "guc": "TDP Apple tarafından açıklanmıyor"
    },
    "architecture_highlights": [
      "Düğüm N3E'den N3P'ye geçti: aynı 3 nm sınıfında üçüncü nesil süreç",
      "P çekirdek saati 4.04 GHz'ten (A18 Pro) 4.26 GHz'e çıktı",
      "Bellek 8 GB'tan 12 GB LPDDR5X'e çıktı; bant genişliği 76.8 GB/s (A19: 68.3 GB/s)",
      "Önbellekler büyüdü: P kümesi L2 16 MB, E kümesi L2 4 MB'tan 6 MB'a, sistem önbelleği 24 MB'tan 32 MB'a",
      "Neural Engine 16 çekirdek, 35 TOPS — A18 Pro ile aynı tepe değer"
    ],
    "die_regions": [],
    "use_cases": [
      "iPhone 17 Pro ve iPhone 17 Pro Max'in ana işlemcisi",
      "Cihaz üstü Apple Intelligence modelleri — 12 GB bellek bu iş için artırıldı"
    ],
    "comparison_notes": "A18 Pro'ya göre çekirdek sayısı aynı; fark düğüm (N3E → N3P), saat (4.04 → 4.26 GHz), bellek (8 → 12 GB) ve önbellekte. Transistör sayısı ve die alanı Apple tarafından açıklanmadı.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Aynı altı çekirdek, daha fazla bellek ve önbellek — ve ilk kez buhar odasıyla soğutulan bir iPhone chip'i",
    "kaynaklar": [
      {
        "ad": "Wikipedia — Apple A19",
        "url": "https://en.wikipedia.org/wiki/Apple_A19"
      }
    ]
  },
  {
    "id": "apple-a18-pro",
    "name": "Apple A18 Pro",
    "manufacturer": "Apple",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3E (3 nm sınıfı)",
    "transistor_count": "20 milyar",
    "die_size": "105 mm²",
    "image": "apple-m4-pro-max.png",
    "image_credit": "Temsilî görsel — Apple Silicon ailesi (M4 Pro/Max). A18 Pro'nun kendi fotoğrafı değil.",
    "description": "iPhone 16 Pro ve 16 Pro Max'in SoC'u. Aynı yılın A18'inden 4.8 milyar transistör ve 15 mm² daha büyük: farkın büyük kısmı daha geniş önbelleklere ve 6 çekirdekli GPU'ya gidiyor.",
    "key_specs": {
      "architecture": "Apple Silicon — 2 performans (P) + 4 verimlilik (E) çekirdeği",
      "cores": 6,
      "boost_clock": "4.04 GHz (P çekirdekleri)",
      "e_core_clock": "2.42 GHz",
      "gpu": "6 çekirdek Apple GPU",
      "neural_engine": "16 çekirdek",
      "npu_tops": "35 TOPS",
      "unified_memory": "8 GB LPDDR5X",
      "l2_cache": "16 MB (P) + 4 MB (E)",
      "l3_cache": "24 MB",
      "guc": "TDP Apple tarafından açıklanmıyor"
    },
    "architecture_highlights": [
      "A18 (15.2 milyar transistör, 90 mm²) ile aynı CPU düzeni; Pro sürüm 20 milyar transistör ve 105 mm²",
      "Farkın büyük kısmı önbellekte: P kümesi L2 8 MB → 16 MB, sistem önbelleği 12 MB → 24 MB",
      "GPU her iPhone 16 Pro'da 6 çekirdek (A18'de cihaza göre 4–6)",
      "iFixit teardown'ı bellek paketini LPDDR5 olarak okudu; Apple ve Wikipedia LPDDR5X veriyor"
    ],
    "die_regions": [],
    "use_cases": [
      "iPhone 16 Pro ve iPhone 16 Pro Max'in ana işlemcisi"
    ],
    "comparison_notes": "Bellek bant genişliği kaynakta açıklanmadığı için puana girmedi. A19 Pro'ya göre bir nesil önceki düğüm (N3E) ve 4 GB daha az bellek.",
    "is_announced": true,
    "rumored": null,
    "tagline": "A18 ile aynı çekirdekler, iki kat önbellek",
    "kaynaklar": [
      {
        "ad": "Wikipedia — Apple A18",
        "url": "https://en.wikipedia.org/wiki/Apple_A18"
      }
    ]
  },
  {
    "id": "google-tensor-g4",
    "name": "Google Tensor G4",
    "manufacturer": "Google",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "Samsung Foundry 4 nm (4LPP+ olduğu bildiriliyor; Google doğrulamadı)",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": null,
    "image_credit": null,
    "description": "Pixel 9 serisinin SoC'u. Google çekirdek yapısını resmî olarak ayrıntılandırmadı; aşağıdaki çekirdek düzeni cihaz üzerinde yapılan incelemelerle tespit edildi. Modem SoC'un içinde değil: ayrı bir Samsung Exynos 5400 chip'i.",
    "key_specs": {
      "architecture": "1× Arm Cortex-X4 @ 3.1 GHz + 3× Cortex-A720 @ 2.6 GHz + 4× Cortex-A520 @ 1.92 GHz (ARMv9.2-A)",
      "cores": 8,
      "boost_clock": "3.1 GHz (Cortex-X4)",
      "gpu": "Arm Mali-G715 (7 çekirdek olduğu düşünülüyor) @ 940 MHz",
      "tpu": "3. nesil Google TPU (Tensor G3 ile aynı) — TOPS açıklanmadı",
      "unified_memory": "16 GB LPDDR5X (Pixel 9 Pro); standart modellerde 12 GB",
      "modem": "Ayrı chip: Samsung Exynos 5400",
      "guc": "TDP Google tarafından açıklanmıyor"
    },
    "architecture_highlights": [
      "Üç kümeli düzen: tek bir Cortex-X4 tepe çekirdeği, üç A720 orta çekirdek, dört A520 verim çekirdeği",
      "TPU bir önceki nesille (G3) aynı; Google bu nesilde yapay zekâ hızlandırıcısını değiştirmedi",
      "Modem SoC'a gömülü değil — Snapdragon 8 Elite'in aksine ayrı bir Exynos 5400 chip'i kullanılıyor",
      "Üretim düğümü Samsung 4 nm; 4LPP+ varyantı olduğu bildiriliyor ama Google bunu doğrulamadı"
    ],
    "die_regions": [],
    "use_cases": [
      "Pixel 9, 9 Pro, 9 Pro XL ve 9 Pro Fold'un ana işlemcisi",
      "Cihaz üstü Gemini Nano — Pro modellerdeki 16 GB bellek bu iş için"
    ],
    "comparison_notes": "Bellek bant genişliği ve NPU TOPS değeri açıklanmadı; puan çekirdek sayısı, saat ve bellek kapasitesine dayanıyor ve bu yüzden kapsamı düşük (%40 — puanlanabilir alt sınır).",
    "is_announced": true,
    "rumored": null,
    "tagline": "Google'ın kendi SoC'u — ama ayrıntılarını en az açıklayanı",
    "kaynaklar": [
      {
        "ad": "Wikipedia — Google Tensor",
        "url": "https://en.wikipedia.org/wiki/Google_Tensor"
      },
      {
        "ad": "Android Authority — Google Tensor G4 explained",
        "url": "https://www.androidauthority.com/google-tensor-g4-explained-everything-you-need-to-know-about-the-pixel-9-processor-3466184/"
      }
    ]
  },
  {
    "id": "qualcomm-snapdragon-8-elite",
    "name": "Qualcomm Snapdragon 8 Elite",
    "manufacturer": "Qualcomm",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3E (3 nm sınıfı)",
    "transistor_count": "Bilgi yok",
    "die_size": "124.1 mm²",
    "image": "snapdragon-x-elite.png",
    "image_credit": "Temsilî görsel — Qualcomm Oryon ailesi (Snapdragon X Elite). Snapdragon 8 Elite'in kendi fotoğrafı değil.",
    "description": "Qualcomm'un dizüstü Snapdragon X Elite için geliştirdiği Oryon çekirdeklerini telefona taşıyan ilk amiral gemisi SoC'u. Klasik 'büyük-orta-küçük' düzen yerine yalnızca iki tür Oryon çekirdeği var; verim çekirdeği hiç yok. 5G modem chip'in içine gömülü.",
    "key_specs": {
      "architecture": "2× Oryon Prime @ 4.32 GHz + 6× Oryon Performance @ 3.53 GHz (SM8750)",
      "cores": 8,
      "boost_clock": "4.32 GHz (Prime çekirdekler)",
      "gpu": "Adreno 830 @ 1100 MHz (~3.38 TFLOPS FP32)",
      "npu": "Hexagon — TOPS açıklanmadı",
      "memory_type": "LPDDR5X, 4 kanal × 16 bit (64 bit)",
      "memory_bandwidth": "84.8 GB/s",
      "modem": "Entegre Snapdragon X80 5G",
      "guc": "TDP Qualcomm tarafından açıklanmıyor"
    },
    "architecture_highlights": [
      "Verim çekirdeği yok: sekiz çekirdeğin hepsi Oryon — ikisi 4.32 GHz Prime, altısı 3.53 GHz Performance",
      "Oryon, Qualcomm'un Nuvia satın alımıyla gelen kendi ARM çekirdeği; Snapdragon X Elite ile aynı soydan",
      "Modem SoC'un içinde (X80) — Tensor G4 ve iPhone'larda modem ayrı bir chip",
      "Die alanı 124.1 mm², A18 Pro'dan (105 mm²) büyük"
    ],
    "die_regions": [],
    "use_cases": [
      "Samsung Galaxy S25 Ultra (\"Galaxy için\" özel sürümü) ve 2025 Android amiral gemileri"
    ],
    "comparison_notes": "Galaxy S25 Ultra'daki \"for Galaxy\" sürümünün saatleri standart SM8750'den farklı olabilir; buradaki değerler standart sürüme ait. NPU TOPS açıklanmadığı için puana girmedi.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Dizüstü çekirdekleriyle çalışan telefon chip'i — ve hiç verim çekirdeği yok",
    "kaynaklar": [
      {
        "ad": "Wikipedia — List of Qualcomm Snapdragon systems on chips (SM8750)",
        "url": "https://en.wikipedia.org/wiki/List_of_Qualcomm_Snapdragon_systems_on_chips"
      }
    ]
  },
  {
    "id": "amd-sephiroth-steam-deck",
    "name": "AMD \"Sephiroth\" (Steam Deck OLED APU)",
    "manufacturer": "AMD",
    "category": "CPU",
    "release_year": 2023,
    "process_node": "TSMC N6 (6 nm)",
    "transistor_count": "Bilgi yok",
    "die_size": "Bilgi yok",
    "image": "ryzen-9950x.png",
    "image_credit": "Temsilî görsel — AMD Ryzen ailesi. Sephiroth'un kendi fotoğrafı değil.",
    "description": "Valve için özel üretilmiş APU. İlk Steam Deck'teki 'Aerith' (Van Gogh, TSMC N7) ile aynı CPU ve GPU yapısına sahip; yalnızca 6 nm'ye küçültüldü ve daha hızlı belleğe bağlandı. Kazanç performans değil verim: aynı iş daha az enerjiyle yapılıyor.",
    "key_specs": {
      "architecture": "4 çekirdek / 8 iş parçacığı Zen 2 + RDNA 2 GPU (özel APU)",
      "cores": 4,
      "threads": 8,
      "base_clock": "2.4 GHz",
      "boost_clock": "3.5 GHz",
      "gpu": "RDNA 2, 8 hesaplama birimi @ 1.0–1.6 GHz",
      "unified_memory": "16 GB LPDDR5X (6400 MT/s'te)",
      "memory_bandwidth": "102.4 GB/s",
      "tdp": "15 W",
      "tdp_araligi": "3–15 W"
    },
    "architecture_highlights": [
      "Aerith (TSMC N7) → Sephiroth (TSMC N6): çekirdek sayısı ve saatler aynı kaldı",
      "Bellek LPDDR5-5500'den (88 GB/s) LPDDR5X'e (6400 MT/s, 102.4 GB/s) geçti",
      "TDP aralığı 3–15 W ile aynı; düğüm küçülmesinin getirisi pil ömrüne gitti",
      "NPU yok — bu chip yapay zekâ çıkarımı için değil, oyun için tasarlandı"
    ],
    "die_regions": [],
    "use_cases": [
      "Steam Deck OLED'in ana işlemcisi (LCD Steam Deck'te selefi Aerith var)"
    ],
    "comparison_notes": "Zen 2 çekirdekleri 2019 mimarisi; buradaki diğer SoC'lara göre eski. Sınıfta NPU ölçütü olmadığı için puan çekirdek, saat, bant genişliği, bellek ve verimlilikten geliyor.",
    "is_announced": true,
    "rumored": null,
    "tagline": "Aynı chip, daha küçük düğüm: performansı değil pil ömrünü artıran küçültme",
    "kaynaklar": [
      {
        "ad": "Wikipedia — Steam Deck",
        "url": "https://en.wikipedia.org/wiki/Steam_Deck"
      }
    ]
  },
  {
    "id": "apple-m4",
    "name": "Apple M4",
    "manufacturer": "Apple",
    "category": "CPU",
    "release_year": 2024,
    "process_node": "TSMC N3E (3 nm sınıfı)",
    "transistor_count": "28 milyar",
    "die_size": "Bilgi yok",
    "image": "apple-m4-pro-max.png",
    "image_credit": "Temsilî görsel — Apple M4 ailesi (M4 Pro/Max). Temel M4'ün kendi fotoğrafı değil.",
    "description": "M4 ailesinin temel üyesi; Mac mini, MacBook Air ve iPad Pro'da kullanılıyor. Buradaki değerler Mac mini'deki tam yapılandırmaya ait: 10 CPU ve 10 GPU çekirdeği.",
    "key_specs": {
      "architecture": "4 performans (P) + 6 verimlilik (E) çekirdeği (10 çekirdekli yapılandırma)",
      "cores": 10,
      "boost_clock": "4.4 GHz",
      "gpu": "10 çekirdek Apple GPU (bazı cihazlarda 8 ya da 9)",
      "neural_engine": "16 çekirdek",
      "npu_tops": "38 TOPS",
      "memory_type": "LPDDR5X-7500",
      "max_unified_memory": "32 GB",
      "memory_bandwidth": "120 GB/s",
      "guc": "TDP Apple tarafından açıklanmıyor; Mac mini güç kaynağı en fazla 155 W"
    },
    "architecture_highlights": [
      "28 milyar transistör, TSMC N3E",
      "Neural Engine 38 TOPS — A18 Pro ve A19 Pro'nun 35 TOPS'unun üzerinde",
      "Bellek en fazla 32 GB; 64 GB'a kadar çıkmak için M4 Pro gerekiyor",
      "120 GB/s bant genişliği: A19 Pro'nun (76.8 GB/s) yaklaşık 1.6 katı"
    ],
    "die_regions": [],
    "use_cases": [
      "Mac mini (2024) taban modeli",
      "MacBook Air ve iPad Pro"
    ],
    "comparison_notes": "M4 Pro'ya göre daha az çekirdek (10'a karşı 12–14) ve daha dar bellek veri yolu (120 GB/s'ye karşı 273 GB/s).",
    "is_announced": true,
    "rumored": null,
    "tagline": "M4 ailesinin temeli: Mac mini'den iPad'e",
    "kaynaklar": [
      {
        "ad": "Wikipedia — Apple M4",
        "url": "https://en.wikipedia.org/wiki/Apple_M4"
      },
      {
        "ad": "EveryMac — Mac mini M4 10 CPU/10 GPU 2024 Specs",
        "url": "https://everymac.com/systems/apple/mac_mini/specs/mac-mini-m4-10-core-cpu-10-core-gpu-2024-specs.html"
      }
    ]
  }
];

export function getChipById(id) { return chips.find((c) => c.id === id); }
export function chipsByCategory(cat) { return chips.filter((c) => c.category === cat); }
