/**
 * Dış eğitimler kataloğu: ücretli ve ücretsiz çevrimiçi kurslar.
 *
 * Her satır 8 Ekim 2026'da kursun kendi sayfası açılarak dolduruldu.
 * dogrulama.durum:
 *   "sayfa"   — bilgiler kursun kendi sayfasından okundu
 *   "katalog" — kurs sayfası okunamadı; sağlayıcının resmî kataloğundan okundu
 *   "haber"   — sağlayıcının sitesi açılamadı; bilgi haberden, kendin kontrol et
 * Fiyat sayfada yazmıyorsa null; tahmin yok. Fiyatlar bölgeye ve kampanyaya
 * göre değişir; sayfa bunu kullanıcıya söyler.
 */

export const KONTROL_TARIHI = "2026-10-08";

export const ALANLAR = [
  { id: "yapay-zeka", ad: "Yapay zekâ", konular: ["ai-temel", "prompt-claude", "ml-dl", "turkce"] },
  { id: "cip", ad: "Çip ve donanım", konular: ["mimari", "cip-tasarim", "gpu", "yariiletken"] },
];

export const KONULAR = {
  "ai-temel": "Yapay zekâya giriş",
  "prompt-claude": "Prompt, Claude ve ajanlar",
  "ml-dl": "Makine ve derin öğrenme",
  turkce: "Türkçe kaynaklar",
  mimari: "Bilgisayar mimarisi",
  "cip-tasarim": "Çip tasarımı (Verilog, FPGA, ASIC)",
  gpu: "GPU programlama (CUDA)",
  yariiletken: "Yarı iletken fiziği ve üretimi",
};

export const UCRET = {
  ucretsiz: { ad: "Ücretsiz", kisa: "Ücretsiz", renk: "#34d399" },
  "ucretsiz-sertifika-ucretli": { ad: "Ücretsiz kayıt, sertifika ücretli", kisa: "Sertifika ücretli", renk: "#22d3ee" },
  "ucretsiz-baslangic": { ad: "Ücretsiz başlanır, tamamı ücretli olabilir", kisa: "Kısmen ücretsiz", renk: "#a78bfa" },
  ucretli: { ad: "Ücretli", kisa: "Ücretli", renk: "#f59e0b" },
};

export const EGITIMLER = [
  /* ─────────── Yapay zekâya giriş ─────────── */
  {
    id: "elements-of-ai", ad: "Introduction to AI (Elements of AI)", saglayici: "MinnaLearn ve Helsinki Üniversitesi",
    url: "https://elementsofai.com", konu: "ai-temel", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "İngilizce", seviye: "başlangıç", sure: "Kendi hızında", sertifika: null,
    neden: "Teknik olmayanlar için yazılmış; matematik ya da programlama gerektirmiyor. Yapay zekâya sıfırdan başlamak için en sade kapı.",
    dogrulama: { durum: "sayfa", not: "Ücretsiz olduğu ve 'karmaşık matematik ya da programlama gerekmez' ifadesi sayfadan okundu. Türkçe dil seçeneği listede görünmüyor." },
  },
  {
    id: "ai-for-everyone", ad: "AI For Everyone", saglayici: "DeepLearning.AI · Coursera (Andrew Ng)",
    url: "https://www.coursera.org/learn/ai-for-everyone", konu: "ai-temel", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "Sayfada 'Enroll for free' yazıyor; sertifika ve bazı materyaller için ödeme gerekebilir. Coursera Plus'a dahil, maddi yardım başvurusu var.",
    dil: "İngilizce (27 dilde altyazı)", seviye: "başlangıç", sure: "7 saat", sertifika: "ücretli",
    neden: "Yöneticiler ve teknik olmayan çalışanlar için: yapay zekâ neyi yapabilir, neyi yapamaz, bir kurumda nasıl kullanılır.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre, paylaşılabilir sertifika ve dil sayısı sayfadan okundu. Türkçe altyazı listede doğrulanamadı." },
  },
  {
    id: "generative-ai-for-everyone", ad: "Generative AI for Everyone", saglayici: "DeepLearning.AI · Coursera (Andrew Ng)",
    url: "https://www.coursera.org/learn/generative-ai-for-everyone", konu: "ai-temel", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "'Enroll for free'; sertifika ücretli, maddi yardım var.",
    dil: "İngilizce (28 dilde altyazı)", seviye: "başlangıç", sure: "6 saat (3 hafta, haftada 1–2 saat)", sertifika: "ücretli",
    neden: "Kod bilmeden üretken yapay zekânın nasıl çalıştığını ve işte nasıl kullanılacağını anlatıyor. Sohbet asistanlarını bilinçli kullanmak için iyi bir başlangıç.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre ve sertifika sayfadan okundu." },
  },
  {
    id: "google-ai-essentials", ad: "Google AI Essentials", saglayici: "Google · Coursera",
    url: "https://www.coursera.org/learn/google-ai-essentials", konu: "ai-temel", ucret: "ucretli",
    fiyat: "Ayda $49 (ABD/Kanada, 7 gün ücretsiz denemeden sonra)",
    fiyatNotu: "Sayfada 'diğer ülkelerde fiyat değişebilir' ve 'ücretsiz alınamaz' yazıyor. Maddi yardım var.",
    dil: "İngilizce (17 dilde altyazı)", seviye: "başlangıç", sure: "10 saatten kısa", sertifika: "ücretli",
    neden: "Günlük iş görevlerinde üretken yapay zekâyı ve prompt yazmayı öğreten kısa, uygulamalı bir program; sonunda Google sertifikası.",
    dogrulama: { durum: "sayfa", not: "Fiyat metni ve 'ücretsiz alınamaz' ifadesi sayfadan okundu. Sayfadaki süre tutarsız: bir yerde 4, açıklamada 10 saatin altı yazıyor." },
  },
  {
    id: "anthropic-ai-fluency", ad: "AI Fluency: Framework & Foundations", saglayici: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/ai-fluency-framework-foundations", konu: "ai-temel", ucret: "ucretsiz", fiyat: "Ücretsiz", fiyatNotu: null,
    dil: "İngilizce", seviye: "başlangıç", sure: null, sertifika: "ücretsiz",
    neden: "Claude'un yapımcısından: yapay zekâyla verimli, etik ve güvenli çalışmak için bir çerçeve. Yeni kullanıcılar da deneyimliler de yararlanır.",
    dogrulama: { durum: "sayfa", not: "'Register | FREE' ve final değerlendirmesinden sonra tamamlama sertifikası sayfadan okundu. Süre sayfada yok." },
  },

  /* ─────────── Prompt, Claude ve ajanlar ─────────── */
  {
    id: "anthropic-claude-101", ad: "Claude 101", saglayici: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/claude-101", konu: "prompt-claude", ucret: "ucretsiz", fiyat: "Ücretsiz", fiyatNotu: null,
    dil: "İngilizce", seviye: "başlangıç", sure: null, sertifika: "ücretsiz",
    neden: "Claude'u günlük işte kullanmak için: projeler, artifact'ler, skill'ler, araç bağlama ve araştırma, rol bazlı örneklerle.",
    dogrulama: { durum: "sayfa", not: "'Register | FREE', müfredat başlıkları ve tamamlama sertifikası sayfadan okundu." },
  },
  {
    id: "anthropic-claude-api", ad: "Building with the Claude API", saglayici: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api", konu: "prompt-claude", ucret: "ucretsiz", fiyat: "Ücretsiz", fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: null, sertifika: null,
    neden: "Claude API ile uygulama geliştirmeyi baştan sona anlatıyor. Python ve JSON bilen geliştiriciler için.",
    dogrulama: { durum: "sayfa", not: "'Register | FREE' ve ön koşullar (Python, temel JSON) sayfadan okundu. Sertifika açıkça yazmıyor." },
  },
  {
    id: "anthropic-mcp", ad: "Introduction to Model Context Protocol", saglayici: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol", konu: "prompt-claude", ucret: "ucretsiz", fiyat: "Ücretsiz", fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: null, sertifika: null,
    neden: "Claude'u dış servislere bağlayan MCP sunucu ve istemcilerini Python ile yazmayı öğretiyor; yapay zekâ ajanı kurmak isteyenler için.",
    dogrulama: { durum: "sayfa", not: "'Register | FREE', ön koşullar (Python, JSON, HTTP) ve içerik sayfadan okundu." },
  },
  {
    id: "dlai-prompt-engineering", ad: "ChatGPT Prompt Engineering for Developers", saglayici: "DeepLearning.AI ve OpenAI",
    url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", konu: "prompt-claude", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Sayfada 'platform betası boyunca sınırlı süre ücretsiz' yazıyor; ileride değişebilir. Başarı belgesi PRO üyelikle.",
    dil: "İngilizce", seviye: "başlangıç", sure: "1 saat 40 dakika (9 video, 7 kod örneği)", sertifika: "ücretli",
    neden: "Dil modellerini programdan kullanmak için gereken prompt tekniklerini kısa sürede öğretiyor. Teknikler Claude'da da geçerli.",
    dogrulama: { durum: "sayfa", not: "Süre, 'Learn for Free' ve PRO sertifika bilgisi sayfadan okundu." },
  },
  {
    id: "hf-agents", ad: "AI Agents Course", saglayici: "Hugging Face",
    url: "https://huggingface.co/learn/agents-course/unit0/introduction", konu: "prompt-claude", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Kurs da sertifika da ücretsiz.",
    dil: "İngilizce", seviye: "orta", sure: "Bölüm başına ~1 hafta, haftada 3–4 saat", sertifika: "ücretsiz",
    neden: "Yapay zekâ ajanlarının nasıl çalıştığını ve nasıl kurulduğunu uygulamalı öğretiyor. Temel Python ve LLM bilgisi olanlar için.",
    dogrulama: { durum: "sayfa", not: "'Bu ücretsiz kurs', ücretsiz sertifikalar ve haftalık süre sayfadan okundu." },
  },

  /* ─────────── Makine ve derin öğrenme ─────────── */
  {
    id: "ml-specialization", ad: "Machine Learning Specialization", saglayici: "Stanford ve DeepLearning.AI · Coursera (Andrew Ng)",
    url: "https://www.coursera.org/specializations/machine-learning-introduction", konu: "ml-dl", ucret: "ucretsiz-sertifika-ucretli",
    fiyat: "Ayda $49 (Coursera aboneliği)",
    fiyatNotu: "SSS'de 'ücretsiz izlersen sertifika almazsın' yazıyor; aynı sayfada 'ücretsiz alınamaz' da geçiyor. Kayıt sırasında kontrol et. Fiyat bölgeye göre değişir.",
    dil: "İngilizce (30 dilde altyazı)", seviye: "başlangıç", sure: "2 ay, haftada 10 saat (3 kurs)", sertifika: "ücretli",
    neden: "Makine öğrenmesine başlamak için en çok önerilen program: regresyon, sınıflandırma, sinir ağları ve öneri sistemleri Python ile.",
    dogrulama: { durum: "sayfa", not: "Fiyat, ücretsiz izleme notu, seviye ve süre sayfadan okundu. Sayfa kendi içinde çelişkili." },
  },
  {
    id: "dl-specialization", ad: "Deep Learning Specialization", saglayici: "DeepLearning.AI · Coursera (Andrew Ng)",
    url: "https://www.coursera.org/specializations/deep-learning", konu: "ml-dl", ucret: "ucretli", fiyat: null,
    fiyatNotu: "Sayfada 'ücretsiz alınamaz' yazıyor; tutar görünmüyor. Coursera aboneliğine dahil, maddi yardım var.",
    dil: "İngilizce (27 dilde altyazı)", seviye: "orta", sure: "3 ay, haftada 10 saat (5 kurs)", sertifika: "ücretli",
    neden: "Makine öğrenmesinden sonraki adım: sinir ağları, CNN, RNN ve Transformer'lar derinlemesine.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre ve 'ücretsiz alınamaz' ifadesi sayfadan okundu." },
  },
  {
    id: "fastai", ad: "Practical Deep Learning for Coders", saglayici: "fast.ai",
    url: "https://course.fast.ai/", konu: "ml-dl", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: "9 ders, her biri ~90 dakika", sertifika: null,
    neden: "Önce çalışan bir model yaptırıp sonra teoriye inen bir yaklaşım. Bir yıl kadar kod deneyimi yeterli; ileri matematik gerekmiyor.",
    dogrulama: { durum: "sayfa", not: "'Ücretsiz kurs', ön koşullar ve ders sayısı sayfadan okundu." },
  },
  {
    id: "cs50-ai", ad: "CS50's Introduction to Artificial Intelligence with Python", saglayici: "Harvard (HarvardX · edX)",
    url: "https://www.harvardonline.harvard.edu/course/cs50s-introduction-artificial-intelligence-python", konu: "ml-dl", ucret: "ucretsiz-sertifika-ucretli",
    fiyat: "Onaylı sertifika $299", fiyatNotu: "Ücretsiz izlenebilir; sertifika ücretli. Kayıt edX üzerinden.",
    dil: "İngilizce", seviye: "orta", sure: "7 hafta, haftada 10–30 saat", sertifika: "ücretli",
    neden: "Arama, olasılık, makine öğrenmesi ve sinir ağlarını Python projeleriyle öğreten güçlü bir akademik temel.",
    dogrulama: { durum: "sayfa", not: "Ücretsiz izleme, $299 sertifika ve süre Harvard Online sayfasından okundu." },
  },
  {
    id: "hf-llm", ad: "LLM Course", saglayici: "Hugging Face",
    url: "https://huggingface.co/learn/llm-course/chapter1/1", konu: "ml-dl", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Tamamen ücretsiz ve reklamsız.",
    dil: "İngilizce (Türkçe çevirisi hazırlanıyor)", seviye: "orta", sure: "Bölüm başına ~1 hafta, haftada 6–8 saat", sertifika: "yok",
    neden: "Büyük dil modellerini kullanmayı, ince ayar yapmayı ve paylaşmayı Transformers kütüphanesiyle öğretiyor.",
    dogrulama: { durum: "sayfa", not: "Ücretsiz olduğu, sertifika olmadığı ve Türkçe çevirinin sürdüğü sayfadan okundu." },
  },
  {
    id: "udemy-ml-az", ad: "Machine Learning A-Z: ML, DL, AI with AWS, Python & R", saglayici: "Udemy · SuperDataScience",
    url: "https://www.udemy.com/course/machinelearning/", konu: "ml-dl", ucret: "ucretli", fiyat: null,
    fiyatNotu: "Fiyat ödeme adımında gösteriliyor; Udemy'de bölgeye ve kampanyaya göre çok değişir. Kampanya dönemini beklemek mantıklı.",
    dil: "İngilizce", seviye: "başlangıç", sure: "49 saat (474 ders)", sertifika: null,
    neden: "Udemy'nin en bilinen makine öğrenmesi kurslarından; klasik algoritmaları Python ve R ile adım adım uyguluyor.",
    dogrulama: { durum: "sayfa", not: "Ad, eğitmenler, dil ve toplam süre sayfadan okundu. Fiyat sayfada yok." },
  },

  /* ─────────── Türkçe ─────────── */
  {
    id: "google-mlcc-tr", ad: "Makine Öğrenimi Hızlandırılmış Kursu", saglayici: "Google for Developers",
    url: "https://developers.google.com/machine-learning/crash-course?hl=tr", konu: "turkce", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Giriş yapmadan, ödeme adımı olmadan açık erişimli.",
    dil: "Türkçe", seviye: "başlangıç", sure: "12 modül", sertifika: null,
    neden: "Animasyonlu videolar, etkileşimli görseller ve alıştırmalarla makine öğrenmesine Türkçe giriş; yeni sürümde LLM modülü de var.",
    dogrulama: { durum: "sayfa", not: "Türkçe sayfa açıldı; başlık ve 12 modül okundu. 'Ücretsiz' ibaresi yok, açık erişimden çıkarıldı." },
  },
  {
    id: "ms-ai-beginners-tr", ad: "Yeni Başlayanlar için Yapay Zekâ", saglayici: "Microsoft (GitHub)",
    url: "https://github.com/microsoft/AI-For-Beginners/blob/main/translations/tr/README.md", konu: "turkce", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Açık kaynak (MIT lisanslı) müfredat.",
    dil: "Türkçe çeviri", seviye: "başlangıç", sure: "12 hafta, 24 ders", sertifika: null,
    neden: "Sembolik yapay zekâdan sinir ağlarına, görüntü işlemeden dil işlemeye uzanan, testli bir müfredat. Kendi başına çalışanlar için.",
    dogrulama: { durum: "sayfa", not: "Türkçe README açıldı: '12 haftalık, 24 derslik' ve 'başlangıç seviyesine uygun' okundu." },
  },
  {
    id: "datacamp-chatgpt-tr", ad: "ChatGPT'yi Anlamak", saglayici: "DataCamp",
    url: "https://www.datacamp.com/tr/courses/understanding-chatgpt", konu: "turkce", ucret: "ucretsiz-baslangic", fiyat: null,
    fiyatNotu: "Sayfada 'Kursa Ücretsiz Başla' yazıyor; tamamının ve belgenin ücreti sayfada yok. DataCamp genelde abonelikle çalışır.",
    dil: "Türkçe", seviye: "başlangıç", sure: "1 saat (8 video, 27 alıştırma)", sertifika: null,
    neden: "Sohbet asistanlarının nasıl çalıştığını ve nerede işe yaradığını Türkçe anlatan kısa bir kurs.",
    dogrulama: { durum: "sayfa", not: "Türkçe ad, süre, video ve alıştırma sayısı sayfadan okundu. Tam erişimin ücretli olup olmadığı sayfada yazmıyor." },
  },
  {
    id: "btk-akademi", ad: "BTK Akademi yapay zekâ eğitimleri", saglayici: "BTK Akademi",
    url: "https://www.btkakademi.gov.tr/", konu: "turkce", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Ocak 2026 tarihli bir habere göre yeni eğitimler 'tamamen ücretsiz ve sertifikalı'.",
    dil: "Türkçe", seviye: null, sure: null, sertifika: null,
    neden: "Devletin Türkçe çevrimiçi eğitim platformu. Habere göre makine öğrenmesinin matematiği, yapay zekâ ajanı geliştirme ve Claude gibi eğitimler var.",
    dogrulama: { durum: "haber", not: "Site bu kontrolde açılamadı (yalnızca JavaScript ile yükleniyor). Bilgi haberden; kursları sitede kendin kontrol et." },
  },
  {
    id: "coddy-verilog-tr", ad: "Verilog Öğren", saglayici: "Coddy",
    url: "https://coddy.tech/landing/tr/verilog", konu: "turkce", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "Türkçe", seviye: "başlangıç", sure: "128 ders, 112 görev, 5 proje (temeller ~2–3 hafta)", sertifika: "ücretsiz",
    neden: "Tarayıcıda, Türkçe ve etkileşimli bir Verilog kursu: temellerden durum makinelerine, RTL tasarımına ve testbench'lere.",
    dogrulama: { durum: "sayfa", not: "'Ücretsiz ve etkileşimli', ders sayıları ve ücretsiz tamamlama sertifikası Türkçe sayfadan okundu." },
  },

  /* ─────────── Bilgisayar mimarisi ─────────── */
  {
    id: "nand2tetris", ad: "From Nand to Tetris", saglayici: "nand2tetris.org (Nisan ve Schocken)",
    url: "https://www.nand2tetris.org/", konu: "mimari", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Kâr amacı gütmeyen kullanımda her şey ücretsiz ve açık kaynak; sertifikalı sürümü Coursera'da.",
    dil: "İngilizce", seviye: "başlangıç", sure: null, sertifika: "yok",
    neden: "NAND kapısından başlayıp çalışan bir bilgisayarı kendin kuruyorsun. Çiplerin mantık kapılarından nasıl yükseldiğini anlamanın en iyi yolu.",
    dogrulama: { durum: "sayfa", not: "Ücretsiz ve açık kaynak ifadesi resmî siteden okundu." },
  },
  {
    id: "nand2tetris-coursera", ad: "Build a Modern Computer from First Principles: From Nand to Tetris", saglayici: "Kudüs İbrani Üniversitesi · Coursera",
    url: "https://www.coursera.org/learn/build-a-computer", konu: "mimari", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "'Enroll for free'; sertifika ücretli. Ücretsiz izleme seçeneği sayfada net değil.",
    dil: "İngilizce (22 dilde altyazı)", seviye: "başlangıç", sure: "~4–6 hafta, haftada ~10 saat", sertifika: "ücretli",
    neden: "Nand2Tetris'in sertifikalı, süreli sürümü: 6 proje, ön bilgi gerekmiyor.",
    dogrulama: { durum: "sayfa", not: "Ücretsiz kayıt, modül ve proje sayısı, sertifika sayfadan okundu." },
  },
  {
    id: "mit-6004", ad: "Computation Structures (6.004)", saglayici: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/", konu: "mimari", ucret: "ucretsiz", fiyat: null,
    fiyatNotu: "Açık lisanslı (CC BY-NC-SA 4.0) ders kayıtları.",
    dil: "İngilizce", seviye: "orta", sure: null, sertifika: "yok",
    neden: "MIT'nin lisans dersi: dijital mantık, CMOS, işlemci tasarımı, boru hattı ve bellek hiyerarşisi, video derslerle.",
    dogrulama: { durum: "sayfa", not: "Ders adı, eğitmen, lisans seviyesi ve video kaynağı OCW sayfasından okundu." },
  },
  {
    id: "eth-ddca", ad: "Digital Design and Computer Architecture (ETH Zürich)", saglayici: "Prof. Onur Mutlu · YouTube",
    url: "https://www.youtube.com/playlist?list=PL5Q2soXY2Zi_FRrloMa2fUYWPGiZUBQo2", konu: "mimari", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: "38 video (Bahar 2020)", sertifika: "yok",
    neden: "Türk bilgisayar mimarı Onur Mutlu'nun ETH dersinin tam kayıtları: mantık tasarımından mikromimariye ve belleğe derin bir müfredat.",
    dogrulama: { durum: "sayfa", not: "YouTube listesi açıldı: başlık, kanal ve 38 video okundu. Dersin resmî sitesi bu kontrolde açılamadı." },
  },

  /* ─────────── Çip tasarımı ─────────── */
  {
    id: "zero-to-asic", ad: "Zero to ASIC Digital Course", saglayici: "Zero to ASIC (Matt Venn)",
    url: "https://www.zerotoasiccourse.com/digital/", konu: "cip-tasarim", ucret: "ucretli",
    fiyat: "Silicon $699 · Boron $999", fiyatNotu: "Silicon paketine bir Tiny Tapeout alanı dahil; kart üstünde çip +$150 ve kargo.",
    dil: "İngilizce", seviye: "başlangıç", sure: "6+ saat video, 9 proje (~20 saat)", sertifika: "ücretli",
    neden: "Açık kaynak araçlarla kendi dijital çipini tasarlatıp gerçekten ürettiriyor. HDL bilgisi gerektirmiyor; ilk çipini yapmak isteyenler için.",
    dogrulama: { durum: "sayfa", not: "Paket fiyatları, video ve proje sayısı, ~20 saat tahmini ve sertifika sayfadan okundu." },
  },
  {
    id: "vlsi-cad-logic", ad: "VLSI CAD Part I: Logic", saglayici: "Illinois Üniversitesi · Coursera",
    url: "https://www.coursera.org/learn/vlsi-cad-logic", konu: "cip-tasarim", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "'Enroll for free'; sertifika ücretli.",
    dil: "İngilizce (22 dilde altyazı)", seviye: "orta", sure: "2 hafta, haftada 10 saat", sertifika: "ücretli",
    neden: "Çip tasarım araçlarının (EDA) mantık sentezi ve doğrulamada hangi algoritmalarla çalıştığını programlama ödevleriyle öğretiyor.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre ve sertifika sayfadan okundu." },
  },
  {
    id: "hdl-fpga", ad: "Hardware Description Languages for FPGA Design", saglayici: "Colorado Boulder Üniversitesi · Coursera",
    url: "https://www.coursera.org/learn/fpga-hardware-description-languages", konu: "cip-tasarim", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "Kayıt ücretsiz; sertifika ücretli.",
    dil: "İngilizce (21 dilde altyazı)", seviye: "orta", sure: "~4 hafta, haftada 10 saat", sertifika: "ücretli",
    neden: "Verilog ve VHDL ile FPGA için donanım tasarlamayı uygulamalı anlatıyor.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre ve modül sayısı sayfadan okundu." },
  },

  /* ─────────── GPU ─────────── */
  {
    id: "nvidia-cuda-intro", ad: "An Even Easier Introduction to CUDA", saglayici: "NVIDIA Deep Learning Institute",
    url: "https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+T-AC-01+V1", konu: "gpu", ucret: "ucretsiz", fiyat: "Ücretsiz",
    fiyatNotu: null, dil: "İngilizce", seviye: "başlangıç", sure: "1 saat", sertifika: "yok",
    neden: "GPU'da ilk CUDA çekirdeğini yazmak için bir saatlik ücretsiz başlangıç.",
    dogrulama: { durum: "katalog", not: "Kurs sayfası yalnızca JavaScript ile yükleniyor; ad, ücret ve süre NVIDIA'nın Mayıs 2026 resmî eğitim kataloğundan okundu." },
  },
  {
    id: "nvidia-cuda-cpp", ad: "Getting Started With Accelerated Computing in Modern CUDA C++", saglayici: "NVIDIA Deep Learning Institute",
    url: "https://www.nvidia.com/en-us/training/self-paced-courses/", konu: "gpu", ucret: "ucretli", fiyat: "$90", fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: "8 saat", sertifika: "ücretli",
    neden: "Modern C++ ile CUDA hızlandırmayı öğreten uygulamalı, sertifikalı kurs. C++ bilen ve GPU'ya geçmek isteyenler için.",
    dogrulama: { durum: "katalog", not: "Kursa özel sayfa bulunamadı; bağlantı NVIDIA'nın kendi hızında kurslar listesine gider. Fiyat, süre ve sertifika Mayıs 2026 resmî kataloğundan." },
  },
  {
    id: "nvidia-cuda-python", ad: "Fundamentals of Accelerated Computing With CUDA Python", saglayici: "NVIDIA Deep Learning Institute",
    url: "https://www.nvidia.com/en-us/training/self-paced-courses/", konu: "gpu", ucret: "ucretli", fiyat: "$90", fiyatNotu: null,
    dil: "İngilizce", seviye: "orta", sure: "8 saat", sertifika: "ücretli",
    neden: "Python (Numba) ile GPU çekirdekleri yazmayı öğretiyor; yapay zekâ ve veri bilimi tarafındaki Python kullanıcıları için.",
    dogrulama: { durum: "katalog", not: "Kursa özel sayfa bulunamadı; bilgiler Mayıs 2026 resmî kataloğundan." },
  },
  {
    id: "fcc-cuda", ad: "Learn CUDA Programming (12 saatlik video)", saglayici: "freeCodeCamp.org (Elliot Arledge)",
    url: "https://www.freecodecamp.org/news/learn-cuda-programming/", konu: "gpu", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "İngilizce", seviye: "başlangıç", sure: "12 saat", sertifika: "yok",
    neden: "GPU mimarisinden CUDA çekirdeklerine ve optimizasyona uzanan ücretsiz, uzun bir video kurs.",
    dogrulama: { durum: "sayfa", not: "freeCodeCamp duyuru sayfasından okundu; video sayfası bu kontrolde açılamadı." },
  },

  /* ─────────── Yarı iletken ─────────── */
  {
    id: "purdue-semi-beginners", ad: "Semiconductors for Beginners: Device to Fabrication", saglayici: "Purdue Üniversitesi",
    url: "https://engineering.purdue.edu/online/semiconductors/semiconductors-for-beginners", konu: "yariiletken", ucret: "ucretli",
    fiyat: "$99", fiyatNotu: "Kayıt sayfasındaki ücret; tamamlama sertifikası dahil.",
    dil: "İngilizce", seviye: "başlangıç", sure: "Kendi hızında, 11–15 saat", sertifika: "ücretli",
    neden: "Yarı iletkenin ne olduğunu ve çipin nasıl üretildiğini (litografi, aşındırma…) sanal bir temiz odada uygulamalı anlatıyor.",
    dogrulama: { durum: "sayfa", not: "Süre ve içerik kurs sayfasından, $99 ücret kayıt sayfasından okundu." },
  },
  {
    id: "kaist-semi-1", ad: "Introduction to Semiconductor Devices 1", saglayici: "KAIST · Coursera",
    url: "https://www.coursera.org/learn/semiconductor-1", konu: "yariiletken", ucret: "ucretsiz-sertifika-ucretli", fiyat: null,
    fiyatNotu: "'Enroll for free'; sertifika ücretli.",
    dil: "İngilizce (22 dilde altyazı)", seviye: "orta", sure: "~8 saat (7 modül)", sertifika: "ücretli",
    neden: "Yük taşınımı, pn eklemi ve MOSFET'in temellerine 8 saatte kompakt bir giriş.",
    dogrulama: { durum: "sayfa", not: "Seviye, süre ve sertifika koşulu sayfadan okundu." },
  },
  {
    id: "cu-semi-devices", ad: "Semiconductor Devices Specialization", saglayici: "Colorado Boulder Üniversitesi · Coursera",
    url: "https://www.coursera.org/specializations/semiconductor-devices", konu: "yariiletken", ucret: "ucretli", fiyat: null,
    fiyatNotu: "Sayfada 'ücretsiz alınamaz' yazıyor; tutar yok. Coursera Plus'a dahil, maddi yardım var.",
    dil: "İngilizce (22 dilde altyazı)", seviye: "ileri", sure: "4 hafta, haftada 10 saat (3 kurs)", sertifika: "ücretli",
    neden: "Yarı iletken fiziği, pn eklemi, BJT ve MOSFET'i derinlemesine işleyen üç derslik program.",
    dogrulama: { durum: "sayfa", not: "Seviye, kurs saatleri ve 'ücretsiz alınamaz' ifadesi sayfadan okundu." },
  },
  {
    id: "nanohub-nanotransistors", ad: "Fundamentals of Nanotransistors", saglayici: "nanoHUB · Purdue (Mark Lundstrom)",
    url: "https://nanohub.org/courses/NT", konu: "yariiletken", ucret: "ucretsiz", fiyat: null, fiyatNotu: null,
    dil: "İngilizce", seviye: "ileri", sure: "Kendi hızında", sertifika: null,
    neden: "Nano ölçekli transistör fiziğini tanınmış bir hocadan anlatıyor. İleri lisans, lisansüstü ve mühendisler için.",
    dogrulama: { durum: "sayfa", not: "'Ücretsiz' ifadesi ve hedef kitle sayfadan okundu." },
  },
];

/** Önerilen sıralar: kolay öğrenilebilir başlangıç yolları. */
export const YOLLAR = [
  {
    id: "ai-sifirdan", ad: "Yapay zekâya sıfırdan", ozet: "Kod bilmeden başla, Claude'u iyi kullan, sonra makine öğrenmesine geç.",
    adimlar: ["elements-of-ai", "anthropic-claude-101", "anthropic-ai-fluency", "google-mlcc-tr"],
  },
  {
    id: "ai-gelistirici", ad: "Yapay zekâyla uygulama geliştir", ozet: "Python biliyorsan: API, MCP ve ajanlar.",
    adimlar: ["dlai-prompt-engineering", "anthropic-claude-api", "anthropic-mcp", "hf-agents"],
  },
  {
    id: "cip-tasarimci", ad: "Çip tasarımına giriş", ozet: "Mantık kapısından kendi çipini ürettirmeye.",
    adimlar: ["nand2tetris", "coddy-verilog-tr", "eth-ddca", "zero-to-asic"],
  },
];
