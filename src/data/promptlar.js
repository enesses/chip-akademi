/**
 * Prompt kütüphanesi.
 *
 * Yer tutucu: {{ad|varsayılan}} — sayfa her biri için bir kutu açar, kullanıcı
 * doldurur, doldurulmuş metni kopyalar. Varsayılan, prompt'un olduğu gibi
 * kopyalansa bile çalışan bir örnektir.
 *
 * arac: hangi tür araçta en iyi çalıştığı. Görsel/video/müzik üreticileri
 * İngilizce prompt'u daha iyi anlıyor; o prompt'lar İngilizce, açıklamaları
 * Türkçe.
 */

export const KATEGORILER = [
  { id: "oyun", ad: "Oyun yapımı", ozet: "Tarayıcı oyunu, tasarım belgesi, seviye, mekanik" },
  { id: "gorsel", ad: "Görsel", ozet: "Görsel üretim modelleri için hazır kalıplar" },
  { id: "video-ses", ad: "Video ve müzik", ozet: "Video ve müzik üretim modelleri" },
  { id: "kod", ad: "Kod", ozet: "İnceleme, hata ayıklama, test, mimari" },
  { id: "yazi", ad: "Yazı ve içerik", ozet: "Blog, e-posta, sosyal medya, senaryo" },
  { id: "ogrenme", ad: "Öğrenme", ozet: "Konu anlatımı, sınav hazırlığı, çalışma planı" },
  { id: "is", ad: "İş ve verimlilik", ozet: "Toplantı, karar, plan, CV" },
  { id: "veri", ad: "Veri ve analiz", ozet: "Tablo, grafik, formül" },
  { id: "cip", ad: "Çip ve donanım", ozet: "Bu sitenin konusu: kıyas, toplama, maliyet" },
];

export const ARACLAR = {
  sohbet: "Claude ya da herhangi bir sohbet asistanı",
  claude: "Claude (artifact/kod çalıştırma ile)",
  gorsel: "Görsel üretim modelleri (Midjourney, DALL·E, Stable Diffusion, Flux…)",
  video: "Video üretim modelleri",
  muzik: "Müzik üretim modelleri",
};

export const PROMPTLAR = [
  /* ───────────────────────── OYUN ───────────────────────── */
  {
    id: "tek-dosya-oyun",
    kategori: "oyun",
    baslik: "Tek dosyada oynanabilir tarayıcı oyunu",
    aciklama: "Kütüphanesiz, tek HTML dosyası; telefonda da oynanır. Claude'da artifact olarak hemen açılır.",
    arac: "claude",
    seviye: "başlangıç",
    metin: `Bana tek bir HTML dosyasında, hiçbir dış kütüphane kullanmadan oynanabilir bir tarayıcı oyunu yap.

Oyun türü: {{oyun türü|sonsuz koşu (endless runner)}}
Tema ve hikâye: {{tema|uzayda yakıtı biten bir astronot, göktaşlarından kaçarak yakıt topluyor}}
Görsel tarz: {{görsel tarz|neon renkli, koyu arka plan, basit geometrik şekiller}}

Şartlar:
- <canvas> ve düz JavaScript kullan; requestAnimationFrame ile sabit zaman adımlı oyun döngüsü kur.
- Üç ekran olsun: başlangıç, oyun, oyun bitti (skor ve "tekrar oyna").
- Klavye ve dokunmatik kontrol birlikte çalışsın; kontrolleri başlangıç ekranında yaz.
- Zorluk zamanla artsın (hız, düşman sıklığı). İlk 20 saniye kolay olsun.
- En yüksek skoru sakla; tarayıcı depolaması yoksa oyun yine çalışsın.
- Ekran boyutu değişince tuval yeniden ölçeklensin, oyun bozulmasın.
- Ses efektlerini Web Audio API ile kodla üret (dosya yükleme yok).

Kodu yazdıktan sonra: oyunun nasıl oynandığını 3 maddede anlat ve oyunu daha eğlenceli yapacak 3 fikir öner.`,
  },
  {
    id: "oyun-tasarim-belgesi",
    kategori: "oyun",
    baslik: "Oyun tasarım belgesi (GDD)",
    aciklama: "Bir fikri; çekirdek döngü, mekanikler, ilerleme ve kapsam tablosuyla eksiksiz bir tasarım belgesine çevirir.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Deneyimli bir oyun tasarımcısı gibi davran. Aşağıdaki fikir için bir oyun tasarım belgesi (GDD) yaz.

Fikir: {{oyun fikri|zamanı geri sarabilen bir kedinin bulmaca-platform oyunu}}
Platform: {{platform|PC ve Nintendo Switch}}
Ekip ve süre: {{ekip|2 kişi, 9 ay}}

Belge şu başlıkları içersin:
1. Tek cümlelik özet (elevator pitch) ve hedef oyuncu
2. Çekirdek oyun döngüsü (30 saniye / 5 dakika / 1 saat ölçeğinde)
3. Temel mekanikler — her biri için: ne yapar, oyuncuya ne hissettirir, nasıl öğretilir
4. İlerleme ve ödül sistemi
5. Seviye yapısı ve zorluk eğrisi
6. Sanat ve ses yönü (3 referans oyunla)
7. Kapsam: "olmazsa olmaz / olsa iyi / sonraya" tablosu
8. En büyük 3 risk ve her biri için en ucuz prototip testi

Ekip ve süreye göre gerçekçi ol; kapsamı aşan fikirleri "sonraya" sütununa koy.`,
  },
  {
    id: "seviye-tasarimi",
    kategori: "oyun",
    baslik: "Platform oyunu bölüm tasarımı (ASCII harita)",
    aciklama: "Yeni bir mekaniği öğreten, test eden ve ustalaştıran 3 bölümlük bir seri; harita karakterlerle çizilir.",
    arac: "sohbet",
    seviye: "orta",
    metin: `2B platform oyunum için 3 bölümlük bir seri tasarla. Bölümler şu mekaniği sırayla öğretsin, sınasın ve ustalaştırsın:

Mekanik: {{mekanik|duvara tutunup zıplama}}
Oyuncunun zaten bildiği: {{bilinenler|koşma, zıplama, düşmanın üstüne basma}}

Her bölüm için:
- 60x15 karakterlik ASCII harita (# zemin, ^ diken, E düşman, C toplanabilir, S başlangıç, F bitiş, . boşluk)
- Bölümün amacı tek cümleyle
- Oyuncunun ilk ölebileceği yer ve neden orada öldüğünü anlayacağı
- Tahmini tamamlanma süresi

Kural: Yeni mekanik ilk kez güvenli bir yerde, ölüm riski olmadan gösterilsin ("öğret"), sonra riskle birleşsin ("sına"), en son başka bir mekanikle karışsın ("ustalaştır").`,
  },
  {
    id: "mekanik-beyin-firtinasi",
    kategori: "oyun",
    baslik: "Oyun mekaniği beyin fırtınası",
    aciklama: "Bir tema için 10 özgün mekanik, her biri için bir hafta sonunda yapılabilecek prototip tarifi.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `"{{tema|yerçekimi}}" teması etrafında 10 özgün oyun mekaniği öner.

Her mekanik için:
- Adı ve tek cümlelik tarifi
- Benzer bir mekanik kullanan bilinen bir oyun (varsa) ve bunun ondan farkı
- En basit prototip: hangi şekiller, hangi kontroller, kaç saatte yapılır
- Bu mekanikten çıkabilecek 2 bulmaca ya da durum

Sonunda en çok potansiyeli olan 3 tanesini seç ve nedenini açıkla. Klişe fikirleri (çift zıplama, ölümsüzlük güçlendiricisi gibi) listeye alma.`,
  },
  {
    id: "karakter-diyalog",
    kategori: "oyun",
    baslik: "Karakter ve dallanan diyalog",
    aciklama: "Bir NPC için kişilik, ses tonu ve oyuncunun seçimlerine göre dallanan diyalog ağacı (JSON).",
    arac: "sohbet",
    seviye: "orta",
    metin: `Oyunum için bir yan karakter yaz.

Oyunun dünyası: {{dünya|tufandan sonra çatılarda kurulmuş bir şehir}}
Karakterin rolü: {{rol|oyuncuya ilk görevi veren, geçmişini saklayan bir tamirci}}

1. Karakter kartı: ad, yaş, istediği şey, korktuğu şey, konuşma tarzı (3 örnek replik).
2. İlk karşılaşma için dallanan bir diyalog: oyuncunun her düğümde 2–3 seçeneği olsun, en az 1 seçenek karakterin oyuncuya güvenini düşürsün.
3. Diyaloğu şu JSON yapısında ver:
   { "dugumler": { "<id>": { "konusan": "...", "metin": "...", "secenekler": [ { "metin": "...", "sonraki": "<id>", "guven": +1 } ] } } }
4. Karakterin sırrının hangi diyalog kombinasyonuyla açığa çıktığını açıkla.`,
  },
  {
    id: "motor-script",
    kategori: "oyun",
    baslik: "Oyun motoru için hazır script",
    aciklama: "Godot, Unity ya da Unreal için açıklamalı, yapıştırılıp çalıştırılabilir bir oyuncu/özellik scripti.",
    arac: "sohbet",
    seviye: "orta",
    metin: `{{motor|Godot 4 (GDScript)}} için şu özelliği yazan bir script istiyorum:

Özellik: {{özellik|koyote süresi ve zıplama tamponu olan, değişken yükseklikte zıplayan 2B karakter}}
Sahnedeki düğüm/nesne yapısı: {{yapı|CharacterBody2D > CollisionShape2D, AnimatedSprite2D}}

- Ayarlanabilir sayıları dışa açık değişken yap (export / SerializeField) ve her birine birim ve önerilen aralık yaz.
- Kodun içinde neden öyle yazıldığını açıklayan kısa yorumlar olsun.
- Sonunda sahnede nasıl kurulacağını adım adım anlat ve sık yapılan 2 kurulum hatasını yaz.
- Motorun hangi sürümünü varsaydığını belirt; sürüme özgü API kullanıyorsan söyle.`,
  },
  {
    id: "oyun-ekonomisi",
    kategori: "oyun",
    baslik: "Oyun içi ekonomi ve denge tablosu",
    aciklama: "Para, eşya fiyatları ve kazanç hızını oyuncunun saatine göre dengeleyen tablo ve formüller.",
    arac: "sohbet",
    seviye: "ileri",
    metin: `Oyunumun ekonomisini dengele.

Oyun: {{oyun|çiftlik kurma ve ticaret oyunu}}
Para birimleri: {{para|altın (oyunla kazanılır)}}
Hedef: Oyuncu {{hedef|ilk büyük yükseltmeyi 2 saatte, son yükseltmeyi 25 saatte}} alabilsin.

Bana ver:
1. Kazanç kaynakları ve saat başına ortalama kazanç (oyuncu ilerledikçe nasıl arttığı)
2. 12 satırlık bir eşya/yükseltme tablosu: ad, fiyat, getirisi, kaçıncı saatte alınabilir
3. Fiyat ve kazanç formülleri (üstel mi doğrusal mı, neden)
4. Enflasyonu ve "para biriktirip sıkılma" durumunu önleyen 3 para harcama yolu
5. Hesabı doğrulamak için basit bir simülasyon: saat saat oyuncunun parası (tablo)`,
  },
  {
    id: "oyun-hata-ayikla",
    kategori: "oyun",
    baslik: "Oyunumdaki hatayı bul ve düzelt",
    aciklama: "Kodunu yapıştır, ne olması gerektiğini ve ne olduğunu yaz; kök neden ve düzeltilmiş kod gelir.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Oyunumda bir hata var. Önce kök nedeni bul, sonra düzelt.

Ne olmalı: {{beklenen|karakter platformun kenarına gelince düşmeli}}
Ne oluyor: {{gerçekleşen|karakter havada yürümeye devam ediyor, bazen platformun içine giriyor}}
Ne zaman oluyor: {{ne zaman|özellikle yüksek hızda ve kare hızı düşükken}}

Kod:
\`\`\`
{{kod|// kodunu buraya yapıştır}}
\`\`\`

1. Hatanın kök nedenini açıkla (belirtiyi değil).
2. Yalnızca değişen kısımları göster, her değişikliğin nedenini tek satırla yaz.
3. Bu hatanın bir daha olmaması için kodu nasıl test edebileceğimi söyle.`,
  },

  /* ───────────────────────── GÖRSEL ───────────────────────── */
  {
    id: "gorsel-prompt-gelistir",
    kategori: "gorsel",
    baslik: "Kısa fikri ayrıntılı görsel prompt'una çevir",
    aciklama: "Türkçe tek cümlelik fikrini, görsel modellerinin anlayacağı İngilizce, ayrıntılı 3 farklı prompt'a çevirir.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Görsel üretim modelleri için prompt mühendisi gibi davran.

Fikrim: {{fikir|yağmurlu bir İstanbul akşamında simit satan robot}}
Kullanacağım araç: {{araç|Midjourney}}
Görselin kullanımı: {{kullanım|blog kapağı, yatay}}

Bana İngilizce 3 farklı prompt yaz, her biri farklı bir yaklaşım olsun (ör. fotogerçekçi / illüstrasyon / sinematik). Her prompt şu sırayla ilerlesin: ana konu → eylem → ortam → ışık → kamera/kompozisyon → stil → renk paleti.
Araca uygun parametreleri ekle (ör. Midjourney için --ar, --style; Stable Diffusion için negatif prompt).
Her prompt'un altında Türkçe olarak hangi kelimenin neyi değiştirdiğini kısaca açıkla.`,
  },
  {
    id: "urun-fotografi",
    kategori: "gorsel",
    baslik: "Stüdyo ürün fotoğrafı",
    aciklama: "E-ticaret ya da tanıtım için temiz, profesyonel ürün çekimi.",
    arac: "gorsel",
    seviye: "başlangıç",
    metin: `Professional studio product photograph of {{ürün|a matte black wireless earbud case, lid open}}, placed on {{yüzey|a smooth light-grey stone pedestal}}, soft diffused key light from the left, subtle rim light separating the product from the background, gentle realistic shadow, seamless {{arka plan rengi|warm beige}} backdrop, shot on a 100mm macro lens at f/8, ultra sharp focus on the product, high-end commercial advertising style, minimal composition with negative space on the right for text --ar 4:5`,
  },
  {
    id: "karakter-sayfasi",
    kategori: "gorsel",
    baslik: "Karakter tasarım sayfası",
    aciklama: "Oyun ya da çizgi roman için aynı karakterin önden, yandan ve arkadan görünümü.",
    arac: "gorsel",
    seviye: "orta",
    metin: `Character design reference sheet of {{karakter|a young desert courier girl with goggles, patched scarf and a mechanical arm}}, full body turnaround showing front view, side view and back view, plus three facial expressions (neutral, angry, laughing), consistent proportions and outfit across all views, clean white background, {{stil|stylized 2D animation style, clean line art, flat cel shading}}, labelled color palette swatches at the bottom, concept art for a video game --ar 16:9`,
  },
  {
    id: "pixel-sprite",
    kategori: "gorsel",
    baslik: "Pixel art oyun sprite'ı",
    aciklama: "2B oyunlar için düz arka planlı, keskin pikselli karakter veya eşya sayfası.",
    arac: "gorsel",
    seviye: "başlangıç",
    metin: `Pixel art sprite sheet of {{nesne|a small knight with a round shield}}, {{çözünürlük|32x32}} pixel style, 8 frames walking animation in a single row, side view, limited 16-color palette, crisp pixels with no anti-aliasing, no blur, solid flat {{arka plan|magenta}} background for easy removal, retro 16-bit console game aesthetic, evenly spaced frames`,
  },
  {
    id: "logo-ikon",
    kategori: "gorsel",
    baslik: "Minimal logo / uygulama ikonu",
    aciklama: "Basit, ölçeklenebilir, düz renkli bir işaret. Sonucu vektöre çevirmen gerekebilir.",
    arac: "gorsel",
    seviye: "başlangıç",
    metin: `Minimal flat vector logo mark for {{marka|a plant-care mobile app called "Filiz"}}, simple geometric symbol combining {{öğeler|a leaf and a water drop}}, {{renkler|two colors: deep green and soft mint}}, bold clean shapes, no gradients, no text, centered on a plain white background, works at small sizes, Swiss design influence, app icon style with rounded square container`,
  },
  {
    id: "konsept-manzara",
    kategori: "gorsel",
    baslik: "Konsept sanatı manzara",
    aciklama: "Oyun/film dünyası için atmosferik, geniş açılı ortam çizimi.",
    arac: "gorsel",
    seviye: "orta",
    metin: `Epic environment concept art of {{yer|a floating monastery built on giant ancient tree roots above a sea of clouds}}, {{zaman|golden hour}}, volumetric god rays through mist, tiny human figures for scale, strong foreground-midground-background depth, {{stil|painterly digital matte painting}}, rich atmospheric perspective, cinematic wide shot, highly detailed architecture --ar 21:9`,
  },
  {
    id: "sinematik-portre",
    kategori: "gorsel",
    baslik: "Sinematik portre",
    aciklama: "Film karesi havasında, dramatik ışıklı kurgusal bir karakter portresi.",
    arac: "gorsel",
    seviye: "orta",
    metin: `Cinematic close-up portrait of {{kişi|an elderly fisherman with a weathered face and a knitted cap}}, {{ışık|single warm practical lamp light from below-left, deep shadows}}, shallow depth of field, 85mm lens, film grain, {{renk|teal and amber color grading}}, rain droplets on skin, emotional and contemplative mood, still frame from an award-winning drama film --ar 2:3`,
  },
  {
    id: "izometrik-diorama",
    kategori: "gorsel",
    baslik: "İzometrik oda / diorama",
    aciklama: "Küçük, ayrıntılı, 3B görünümlü kesit sahneler — sunum ve sosyal medya için.",
    arac: "gorsel",
    seviye: "başlangıç",
    metin: `Isometric 3D diorama of {{sahne|a cozy tiny game developer's bedroom at night with a glowing PC setup, plants and posters}}, cutaway cube room floating on a plain {{arka plan|pastel blue}} background, soft global illumination, warm interior lights, miniature tilt-shift look, clay render style, high detail on small objects, 45 degree isometric camera --ar 1:1`,
  },
  {
    id: "poster-tipografi",
    kategori: "gorsel",
    baslik: "Afiş / poster",
    aciklama: "Etkinlik ya da film afişi. Metin içeren görsellerde yazım hatası olabilir; kontrol et.",
    arac: "gorsel",
    seviye: "orta",
    metin: `Bold graphic event poster for "{{başlık|GAME JAM 48}}", {{tema|retro arcade and synthwave}} theme, large expressive typography as the main element, {{alt yazı|subtitle text "48 hours, 1 game"}}, limited three-color screen print palette, halftone texture, strong grid layout, lots of contrast, Swiss poster design meets 80s arcade --ar 2:3`,
  },
  {
    id: "teknik-patlatilmis",
    kategori: "gorsel",
    baslik: "Teknik patlatılmış çizim (cihaz içi)",
    aciklama: "Bir cihazın katmanlarını havada ayrık gösteren eğitim amaçlı görsel. Sitenin 'İç' bölümüne uygun.",
    arac: "gorsel",
    seviye: "ileri",
    metin: `Technical exploded view illustration of {{cihaz|a modern smartphone}}, all internal layers separated vertically and floating in order: {{katmanlar|glass, display panel, frame, logic board with chips, battery, camera module, back glass}}, thin leader lines and clean labels, isometric angle, white background, precise engineering blueprint aesthetic mixed with clean 3D product render, soft shadows, educational diagram --ar 3:4`,
  },

  /* ───────────────────────── VİDEO VE MÜZİK ───────────────────────── */
  {
    id: "video-sahne",
    kategori: "video-ses",
    baslik: "Kısa video sahnesi",
    aciklama: "Video üretim modelleri için kamera hareketi ve zamanlaması belirli bir sahne.",
    arac: "video",
    seviye: "orta",
    metin: `{{süre|8-second}} cinematic shot: {{konu|a paper boat sailing through a flooded neon-lit alley at night}}. Camera: {{kamera|slow low-angle dolly forward following the boat}}. Lighting: reflections of pink and cyan signs rippling on the water, light rain. Mood: quiet, dreamy. Style: photorealistic, shallow depth of field, 24fps film look. No text, no people.`,
  },
  {
    id: "urun-tanitim-videosu",
    kategori: "video-ses",
    baslik: "Ürün tanıtım videosu senaryosu",
    aciklama: "30 saniyelik reklam; sahne sahne görüntü, ses ve ekran metni.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `{{ürün|el yapımı seramik kahve fincanları satan küçük bir marka}} için {{süre|30}} saniyelik dikey bir tanıtım videosu senaryosu yaz.

Hedef kitle: {{kitle|25–40 yaş, tasarıma önem veren kahve severler}}
Platform: {{platform|Instagram Reels}}

Tablo halinde, sahne sahne: süre (sn) | görüntü | kamera hareketi | ses/müzik | ekrandaki yazı.
İlk 2 saniye izleyiciyi durduracak bir görüntüyle başlasın. Son sahnede tek bir net çağrı (CTA) olsun.
Her sahne için video üretim modeline verilebilecek kısa bir İngilizce prompt da ekle.`,
  },
  {
    id: "muzik-uret",
    kategori: "video-ses",
    baslik: "Şarkı / müzik üretimi",
    aciklama: "Müzik üretim modelleri için tür, enstrüman, tempo ve yapı tarifi.",
    arac: "muzik",
    seviye: "başlangıç",
    metin: `{{tür|lo-fi hip hop}} instrumental, {{tempo|78 BPM}}, {{ruh hali|calm, nostalgic, rainy evening}}, warm dusty vinyl crackle, mellow Rhodes piano chords, soft boom-bap drums with swung hi-hats, deep round bass, subtle {{özel enstrüman|Turkish ney flute melody}} in the second half, structure: intro, verse, chorus, verse, outro, loopable ending`,
  },
  {
    id: "oyun-muzigi-tarifi",
    kategori: "video-ses",
    baslik: "Oyun müziği ve ses efekti listesi",
    aciklama: "Oyunun her ekranı için müzik tarifi ve gereken tüm ses efektlerinin listesi.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Oyunum için ses tasarım listesi hazırla.

Oyun: {{oyun|karanlık bir ormanda geçen, fenerle ilerlenen bir bulmaca oyunu}}

1. Her ekran/durum (menü, keşif, tehlike yaklaşırken, bulmaca çözüldü, oyun bitti) için müzik tarifi: tempo, enstrümanlar, ruh hali, döngü süresi. Her biri için müzik üretim modeline verilecek İngilizce bir prompt yaz.
2. Gereken tüm ses efektlerinin tablosu: ad | ne zaman çalar | süre | tarif | öncelik.
3. Sesi oyun hissini güçlendirmek için kullanmanın 3 yolu (ör. tehlike sesi oyuncuyu önceden uyarır).`,
  },

  /* ───────────────────────── KOD ───────────────────────── */
  {
    id: "kod-inceleme",
    kategori: "kod",
    baslik: "Kod inceleme (code review)",
    aciklama: "Hataları önem sırasına göre listeler; her biri için somut düzeltme önerir.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Kıdemli bir yazılımcı olarak aşağıdaki kodu incele.

Dil/çerçeve: {{dil|TypeScript, React}}
Kodun amacı: {{amaç|kullanıcının sepetindeki ürünlerin toplam fiyatını indirimlerle hesaplayan bileşen}}

\`\`\`
{{kod|// kodunu buraya yapıştır}}
\`\`\`

Bulguları önem sırasına göre ver: [kritik] hata ya da güvenlik açığı → [önemli] yanlış sonuç verebilecek durumlar → [öneri] okunabilirlik ve bakım.
Her bulgu için: satır, sorun, neden önemli, düzeltilmiş kod.
Sorun olmayan şeyleri "iyi" diye listeleme; yalnızca değişmesi gerekenleri yaz. Emin olmadığın bir bulguyu "emin değilim" diye işaretle.`,
  },
  {
    id: "hata-ayiklama",
    kategori: "kod",
    baslik: "Hata mesajından kök nedene",
    aciklama: "Hata mesajı + ilgili kod → olası nedenler sıralı, doğrulama adımlarıyla.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Şu hatayı alıyorum:

\`\`\`
{{hata mesajı|TypeError: Cannot read properties of undefined (reading 'map')}}
\`\`\`

İlgili kod:
\`\`\`
{{kod|// ilgili kodu buraya yapıştır}}
\`\`\`

Ortam: {{ortam|Node 22, Next.js 15, tarayıcıda oluyor}}

1. Hatanın ne anlama geldiğini bir cümlede açıkla.
2. Olası nedenleri en olasıdan başlayarak sırala; her biri için hangisi olduğunu anlamamı sağlayacak bir kontrol (console.log, breakpoint, komut) yaz.
3. En olası neden için düzeltilmiş kodu göster.`,
  },
  {
    id: "kodu-acikla",
    kategori: "kod",
    baslik: "Kodu bana öğretir gibi açıkla",
    aciklama: "Yabancı bir kodu blok blok, seviyene uygun anlatır; sonunda kendini sınaman için soru sorar.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki kodu {{seviye|programlamaya yeni başlamış bir lise öğrencisi}} seviyesinde açıkla.

\`\`\`
{{kod|// kodu buraya yapıştır}}
\`\`\`

- Önce kodun bütün olarak ne yaptığını 2 cümleyle söyle.
- Sonra mantıksal blokları sırayla anlat; her blokta kullanılan kavramı (döngü, özyineleme, closure…) gündelik bir benzetmeyle açıkla.
- Kafa karıştırabilecek 1–2 satırı ayrıca vurgula.
- Sonunda anlayıp anlamadığımı ölçmek için 3 soru sor, cevaplarını verme.`,
  },
  {
    id: "test-yaz",
    kategori: "kod",
    baslik: "Birim testleri yaz",
    aciklama: "Normal, sınır ve hatalı girdiler için çalıştırılabilir testler.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Aşağıdaki fonksiyon için {{test aracı|Vitest}} ile birim testleri yaz.

\`\`\`
{{kod|// fonksiyonu buraya yapıştır}}
\`\`\`

- Önce test edilecek davranışları madde madde listele (normal durum, sınır değerler, hatalı girdi, boş girdi).
- Her test tek bir şeyi sınasın ve adı neyi sınadığını söylesin.
- Fonksiyonda testler yazarken fark ettiğin bir hata varsa testi yaz ve hatayı ayrıca belirt; fonksiyonu sessizce değiştirme.`,
  },
  {
    id: "proje-mimarisi",
    kategori: "kod",
    baslik: "Proje mimarisi ve klasör yapısı",
    aciklama: "Fikirden teknoloji seçimi, veri modeli, klasör yapısı ve ilk 2 haftalık iş listesine.",
    arac: "sohbet",
    seviye: "ileri",
    metin: `Şu projeyi sıfırdan kuracağım:

Proje: {{proje|okul kulüpleri için etkinlik takvimi ve kayıt uygulaması}}
Kullanıcı sayısı: {{ölçek|ilk yıl en fazla 2.000 kullanıcı}}
Bildiğim teknolojiler: {{bilgi|JavaScript, biraz Python}}

1. Teknoloji önerisi (ön yüz, arka yüz, veritabanı, barındırma) ve her seçimin bir alternatife göre nedeni. Ölçeğe göre aşırı karmaşık şeyler önerme.
2. Veri modeli: tablolar/koleksiyonlar ve ilişkileri.
3. Klasör yapısı (ağaç olarak).
4. İlk 2 haftalık iş listesi, en riskli kısım önce.`,
  },
  {
    id: "regex-sql",
    kategori: "kod",
    baslik: "Regex ya da SQL sorgusu yaz",
    aciklama: "Ne istediğini anlat, sorguyu açıklamasıyla ve test örnekleriyle al.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `{{tür|SQL (PostgreSQL)}} yazmama yardım et.

İstediğim: {{istek|son 30 günde en az 3 sipariş vermiş ama hiç yorum yazmamış müşterileri, toplam harcamaya göre sıralı listele}}
Tablo yapısı / örnek veri: {{yapı|customers(id, name), orders(id, customer_id, total, created_at), reviews(id, customer_id)}}

- Sorguyu yaz ve parça parça ne yaptığını açıkla.
- Doğru çalıştığını görebileceğim 3 örnek girdi ve beklenen çıktı ver.
- Büyük veride yavaşlayabilecek bir kısım varsa söyle.`,
  },

  /* ───────────────────────── YAZI ───────────────────────── */
  {
    id: "blog-taslagi",
    kategori: "yazi",
    baslik: "Blog yazısı: taslaktan son hale",
    aciklama: "Önce başlık ve plan, onaydan sonra yazı. Klişe giriş ve dolgu cümleleri yasak.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `"{{konu|yeni başlayanlar için ekran kartı nasıl seçilir}}" konusunda bir blog yazısı yazacağız.

Okuyucu: {{okuyucu|ilk bilgisayarını toplayacak, teknik terimlere yabancı biri}}
Uzunluk: {{uzunluk|yaklaşık 1.200 kelime}}

Adım 1: 5 başlık önerisi ve yazının planı (ara başlıklar + her birinde verilecek tek ana fikir). Burada dur, onayımı bekle.
Adım 2 (onaydan sonra): Yazıyı yaz.

Kurallar: "Günümüzde…", "Bu yazımızda…" gibi klişe girişler yok. Her paragraf bir şey öğretsin. Teknik terimi ilk geçtiği yerde tek cümleyle açıkla. Sonda 3 maddelik "hemen yapabileceklerin" listesi olsun.`,
  },
  {
    id: "metni-sadelestir",
    kategori: "yazi",
    baslik: "Metni sadeleştir",
    aciklama: "Resmî ya da teknik metni anlamını bozmadan herkesin anlayacağı dile çevirir.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki metni {{hedef|12 yaşındaki birinin}} rahatça anlayacağı şekilde sadeleştir.

Metin:
"""
{{metin|metni buraya yapıştır}}
"""

- Anlamı ve önemli ayrıntıları koru; bilgi ekleme, çıkarma.
- Uzun cümleleri böl, edilgen yapıları etkene çevir.
- Kaçınılmaz teknik terimleri parantez içinde tek cümleyle açıkla.
- Sonunda, sadeleştirirken anlamı kayma riski olan yerleri listele.`,
  },
  {
    id: "resmi-eposta",
    kategori: "yazi",
    baslik: "Resmî e-posta",
    aciklama: "Amaç, alıcı ve ton ver; konu satırıyla birlikte 2 farklı versiyon al.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Bir e-posta yaz.

Kime: {{alıcı|bölüm başkanım}}
Amaç: {{amaç|teslim tarihi geçen projem için 1 hafta ek süre istemek}}
Bağlam: {{bağlam|projenin %80'i bitti, ailevi bir nedenle 4 gün çalışamadım}}
Ton: {{ton|saygılı ama kendini aşırı küçültmeyen}}

İki versiyon yaz: kısa (5 cümle) ve ayrıntılı. Her ikisinde de konu satırı olsun, istek ilk paragrafta açıkça geçsin, net bir yeni tarih önerilsin.`,
  },
  {
    id: "sosyal-medya-serisi",
    kategori: "yazi",
    baslik: "Sosyal medya gönderi serisi",
    aciklama: "Bir konuyu bir haftalık, birbirine bağlanan gönderilere böler.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `{{platform|LinkedIn}} için {{konu|yapay zekâ çiplerinin neden bu kadar pahalı olduğu}} konusunda {{adet|5}} gönderilik bir seri hazırla.

Hesap sahibi: {{kim|donanım meraklısı bir bilgisayar mühendisliği öğrencisi}}

Her gönderi için: ilk satır (kaydırmayı durduracak kanca), gövde, kapanış sorusu, önerilen görsel tarifi.
Gönderiler kendi başına anlaşılsın ama sırayla okununca bir hikâye oluştursun. Abartılı iddia, uydurma istatistik kullanma; sayı kullanacaksan "kaynak gerekiyor" diye işaretle.`,
  },
  {
    id: "youtube-senaryo",
    kategori: "yazi",
    baslik: "YouTube video senaryosu",
    aciklama: "Kanca, bölümler, ekran görüntüsü notları ve izlenme süresini koruyan geçişler.",
    arac: "sohbet",
    seviye: "orta",
    metin: `{{konu|bir telefonun içinde ne var — parça parça}} hakkında {{süre|8}} dakikalık bir YouTube videosu senaryosu yaz.

Kanal tarzı: {{tarz|samimi, esprili ama bilgi dolu}}

- İlk 15 saniye: izleyiciyi tutacak bir soru ya da şaşırtıcı bilgi.
- Bölümler ve her bölümün süresi.
- Konuşma metni ile birlikte [EKRAN: …] notları (ne gösterilecek).
- Her bölüm sonunda bir sonrakine merak uyandıran geçiş cümlesi.
- Video açıklaması ve 5 başlık önerisi.`,
  },

  /* ───────────────────────── ÖĞRENME ───────────────────────── */
  {
    id: "feynman",
    kategori: "ogrenme",
    baslik: "Feynman tekniğiyle anlat",
    aciklama: "Konuyu basitten karmaşığa üç katmanda anlatır, sonra senin açıklamanı düzeltir.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `"{{konu|transistör nasıl çalışır}}" konusunu bana üç katmanda anlat:

1. 10 yaşındaki birine: gündelik bir benzetmeyle, teknik terim yok.
2. Lise öğrencisine: temel terimlerle, bir şema tarifiyle.
3. Üniversite öğrencisine: doğru terimler ve bir sayısal örnekle.

Sonra benden konuyu kendi cümlelerimle anlatmamı iste. Ben anlattıktan sonra eksik ya da yanlış kısımları göster ama doğru cevabı hemen verme; önce ipucu ver.`,
  },
  {
    id: "sinav-sorulari",
    kategori: "ogrenme",
    baslik: "Notlarımdan sınav soruları",
    aciklama: "Ders notundan çoktan seçmeli ve açık uçlu sorular; yanlış şıklar gerçekçi.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki ders notlarından {{sayı|10}} soruluk bir sınav hazırla.

Seviye: {{seviye|üniversite 1. sınıf}}
Notlar:
"""
{{notlar|notlarını buraya yapıştır}}
"""

- 7 çoktan seçmeli (4 şık), 3 açık uçlu soru.
- Yanlış şıklar, öğrencilerin gerçekten yaptığı hatalara dayansın.
- Soruları kolaydan zora sırala.
- Cevap anahtarını en sona koy; her cevap için neden doğru olduğunu ve notun hangi kısmından geldiğini yaz.
- Notlarda olmayan bilgiyi sorma.`,
  },
  {
    id: "ogrenme-plani",
    kategori: "ogrenme",
    baslik: "30 günlük öğrenme planı",
    aciklama: "Günlük süreye göre ölçülebilir hedefler, kaynak türleri ve haftalık mini proje.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `{{beceri|Python ile veri analizi}} öğrenmek için 30 günlük bir plan hazırla.

Şu anki seviyem: {{seviye|hiç programlama bilmiyorum}}
Günde ayırabileceğim süre: {{süre|45 dakika}}
Hedefim: {{hedef|kendi harcamalarımı analiz eden küçük bir program yazmak}}

- Haftalara böl; her haftanın sonunda yapılacak küçük bir proje olsun.
- Her gün: konu, yapılacak alıştırma, "bunu yapabiliyorsan o günü geçtin" kriteri.
- Kaynak türü öner (belge, video, alıştırma sitesi) ama var olduğundan emin olmadığın kaynak adı uydurma.
- 2 tekrar günü koy.`,
  },
  {
    id: "sokratik-ogretmen",
    kategori: "ogrenme",
    baslik: "Sokratik öğretmen",
    aciklama: "Cevabı vermez; soru sorarak seni çözüme götürür. Ödev ve problem çözmek için.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Sokratik bir öğretmen gibi davran. Şu problemi çözmeye çalışıyorum:

{{problem|Bir tren 300 km'lik yolu gidişte 100 km/s, dönüşte 60 km/s ile yapıyor. Ortalama hızı nedir?}}

Kurallar:
- Cevabı ya da çözümün bir sonraki adımını doğrudan söyleme.
- Her mesajda bana yalnızca bir soru sor.
- Yanlış yola girersem bunu söyle ve neden yanlış olduğunu bulmam için soru sor.
- 3 kez takılırsam daha güçlü bir ipucu ver.
- Çözdüğümde, yaptığım hatanın genel adını (ör. "ortalamaların ortalamasını almak") söyle.`,
  },
  {
    id: "ozet-kartlari",
    kategori: "ogrenme",
    baslik: "Özet + tekrar kartları",
    aciklama: "Uzun metinden tek sayfalık özet ve Anki'ye aktarılabilir soru-cevap kartları.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki metinden:

"""
{{metin|metni ya da ders notunu buraya yapıştır}}
"""

1. Tek sayfalık bir özet çıkar: 5–7 ana fikir, her biri 1–2 cümle, önem sırasına göre.
2. {{kart sayısı|15}} adet tekrar kartı yap. Her kart tek bir bilgiyi sorsun; "X nedir?" yerine anlamayı ölçen sorular tercih et.
3. Kartları CSV olarak ver (iki sütun: soru;cevap, ayırıcı noktalı virgül) — Anki'ye doğrudan aktarılabilsin.`,
  },

  /* ───────────────────────── İŞ ───────────────────────── */
  {
    id: "toplanti-aksiyon",
    kategori: "is",
    baslik: "Toplantı notlarından aksiyon listesi",
    aciklama: "Dağınık nottan kararlar, sorumlu ve tarihli görevler, açık sorular.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki toplantı notlarını düzenle:

"""
{{notlar|toplantı notlarını ya da dökümünü buraya yapıştır}}
"""

Çıktı:
1. Alınan kararlar (madde madde)
2. Görevler tablosu: görev | sorumlu | son tarih | bağlı olduğu görev
3. Cevabı bekleyen açık sorular ve kime sorulacağı
4. Katılımcılara gönderilecek 5 cümlelik özet e-posta

Notlarda sorumlu ya da tarih geçmiyorsa "belirtilmedi" yaz, tahmin etme.`,
  },
  {
    id: "karar-matrisi",
    kategori: "is",
    baslik: "Karar matrisi",
    aciklama: "Seçenekleri ağırlıklı kriterlerle puanlar; kararın neye duyarlı olduğunu gösterir.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Bir karar vermeme yardım et.

Karar: {{karar|yeni bilgisayar için dizüstü mü masaüstü mü alayım}}
Seçenekler: {{seçenekler|MacBook Air M4, oyun dizüstüsü, masaüstü kasa + monitör}}
Benim için önemli olanlar: {{kriterler|taşınabilirlik, oyun performansı, bütçe 50.000 TL, 5 yıl kullanım}}

1. Kriterleri 1–5 arası ağırlıklandır, ağırlıkları neden öyle seçtiğini yaz ve bana onaylat.
2. Her seçeneği her kriterde 1–10 puanla, puanın gerekçesini tek cümlede yaz.
3. Ağırlıklı toplamı tablo halinde göster.
4. Hangi ağırlık değişirse sıralamanın değiştiğini söyle.
Fiyat ya da performans rakamı kullanacaksan güncel olmayabileceğini belirt.`,
  },
  {
    id: "is-plani-swot",
    kategori: "is",
    baslik: "İş fikri: SWOT ve ilk 90 gün",
    aciklama: "Fikrin güçlü/zayıf yanları, riskli varsayımlar ve ucuz doğrulama deneyleri.",
    arac: "sohbet",
    seviye: "orta",
    metin: `İş fikrimi değerlendir:

Fikir: {{fikir|öğrencilere saatlik GPU kiralayıp yapay zekâ projelerine yardım eden bir hizmet}}
Kaynaklarım: {{kaynak|2 kişi, 100.000 TL birikim, yazılım biliyoruz}}

1. SWOT analizi (her kutuda en fazla 4 madde, somut).
2. Fikrin dayandığı en riskli 3 varsayım.
3. Her varsayımı 2 hafta içinde, az parayla test edecek bir deney: ne yapılacak, başarı ölçütü ne.
4. İlk 90 günün haftalık planı.
Beni övme; zayıf noktaları açıkça söyle.`,
  },
  {
    id: "muzakere-provasi",
    kategori: "is",
    baslik: "Müzakere provası (rol yapma)",
    aciklama: "Karşı tarafı canlandırır, sonra performansını değerlendirir.",
    arac: "sohbet",
    seviye: "orta",
    metin: `Bir müzakere provası yapalım. Sen karşı tarafı oyna.

Durum: {{durum|stajdan sonra iş teklifi aldım, maaşı %15 artırmak istiyorum}}
Karşı taraf: {{karşı taraf|bütçesi kısıtlı ama beni kaybetmek istemeyen bir ekip lideri}}

- Gerçekçi ol; hemen kabul etme, makul itirazlar getir.
- Her mesajında yalnızca karşı tarafın söyleyeceğini yaz.
- Ben "değerlendir" yazınca rolden çık: iyi yaptıklarımı, kaçırdığım fırsatları ve daha güçlü olabilecek 3 cümleyi söyle.`,
  },
  {
    id: "cv-uyarla",
    kategori: "is",
    baslik: "CV'yi ilana göre uyarla",
    aciklama: "İlandaki anahtar becerilere göre CV maddelerini yeniden yazar; uydurma deneyim eklemez.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `CV'mi şu iş ilanına göre uyarla.

İlan:
"""
{{ilan|iş ilanını buraya yapıştır}}
"""

CV'm:
"""
{{cv|CV metnini buraya yapıştır}}
"""

1. İlandaki en önemli 6 gereksinimi çıkar ve CV'mde karşılığı olup olmadığını tablo halinde göster.
2. Deneyim maddelerimi "eylem + ne yaptım + sonuç (sayıyla)" kalıbında yeniden yaz. Sayı yoksa [sayı ekle] diye yer bırak.
3. CV'mde olmayan bir beceriyi ya da deneyimi ekleme; eksikleri ayrıca listele.
4. 3 cümlelik bir ön yazı girişi yaz.`,
  },

  /* ───────────────────────── VERİ ───────────────────────── */
  {
    id: "csv-analizi",
    kategori: "veri",
    baslik: "Tablodaki veriyi analiz et",
    aciklama: "Önce veriyi tanır, sonra soruları sayılarla cevaplar. Claude'da dosya eklenerek kullanılır.",
    arac: "claude",
    seviye: "orta",
    metin: `Ekteki veri dosyasını analiz et.

Veri: {{veri|aylık harcamalarım (tarih, kategori, tutar)}}
Cevaplamak istediğim sorular: {{sorular|en çok harcadığım 3 kategori hangisi, harcamalarım ay ay artıyor mu, hangi günlerde daha çok harcıyorum}}

1. Önce veriyi tanı: satır sayısı, sütunlar, eksik/tuhaf değerler. Temizlik gerekiyorsa ne yaptığını söyle.
2. Her soruyu hesaplayarak cevapla; sayıları kodla hesapla, tahmin etme.
3. Her cevap için uygun bir grafik çiz.
4. Sorularımın dışında dikkatini çeken 2 şey varsa ekle.`,
  },
  {
    id: "grafik-onerisi",
    kategori: "veri",
    baslik: "Bu veri için hangi grafik?",
    aciklama: "Verinin türüne ve anlatmak istediğine göre grafik seçimi ve yaygın hatalar.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Elimde şu veri var: {{veri|5 farklı GPU'nun 2020–2026 arası yıllık kiralama fiyatları}}
Anlatmak istediğim: {{mesaj|yeni modeller çıktıkça eskilerin fiyatının nasıl düştüğü}}
Kitle: {{kitle|teknik olmayan blog okuyucuları}}

- En uygun grafik türünü ve nedenini söyle; 1 alternatif ve neden daha zayıf olduğunu ekle.
- Eksen, renk, etiket ve başlık için somut öneriler ver (başlık mesajı söylesin).
- Bu veride yapılabilecek 2 yanıltıcı grafik hatasını yaz.`,
  },
  {
    id: "excel-formul",
    kategori: "veri",
    baslik: "Excel / Sheets formülü",
    aciklama: "Ne istediğini anlat; formülü, açıklamasını ve örnek tabloyu al.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `{{program|Google Sheets}} için bir formül yazmama yardım et.

Tablom: {{tablo|A: tarih, B: ürün, C: adet, D: birim fiyat}}
İstediğim: {{istek|her ürün için son 30 günün toplam cirosunu, ürün listesinin yanında göstermek}}

- Formülü yaz ve parça parça açıkla.
- Türkçe dil ayarlı programda formül adları ve ayırıcı (; ya da ,) farklıysa Türkçe sürümünü de ver.
- Formülü denemem için 5 satırlık örnek veri ve beklenen sonucu ver.`,
  },

  /* ───────────────────────── ÇİP ───────────────────────── */
  {
    id: "cip-karsilastir",
    kategori: "cip",
    baslik: "İki çipi karşılaştır",
    aciklama: "Özellik tablosu, hangi işte hangisinin önde olduğu ve kaynak gösterme zorunluluğu.",
    arac: "sohbet",
    seviye: "orta",
    metin: `{{çip 1|NVIDIA H100}} ile {{çip 2|AMD MI300X}}'i karşılaştır.

Benim kullanımım: {{kullanım|70 milyar parametreli bir dil modeliyle çıkarım (inference)}}

1. Özellik tablosu: mimari, üretim süreci, bellek (kapasite, tür, bant genişliği), hesap gücü (hangi hassasiyette olduğunu belirterek), TDP.
2. Benim kullanımımda hangi özelliğin belirleyici olduğu ve neden.
3. Hangisi hangi işte önde: 3 senaryo.
Her sayı için kaynağını (üretici sayfası, bağımsız test) belirt. Emin olmadığın bir rakamı yazma; "doğrulanamadı" de. Farklı hassasiyetteki (FP8 / FP16, seyrek / yoğun) sayıları doğrudan kıyaslama.`,
  },
  {
    id: "pc-toplama",
    kategori: "cip",
    baslik: "Bütçeye göre bilgisayar toplama",
    aciklama: "Parça listesi, darboğaz kontrolü ve bütçe artarsa ilk yükseltilecek parça.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Bana bir masaüstü bilgisayar topla.

Bütçe: {{bütçe|45.000 TL (monitör hariç)}}
Kullanım: {{kullanım|1440p oyun, arada yerel yapay zekâ modeli denemek}}
Elimde olan: {{mevcut|hiçbir şey}}

- Parça listesi: işlemci, anakart, bellek, ekran kartı, depolama, güç kaynağı, kasa. Her parçanın seçilme nedeni tek cümle.
- Darboğaz kontrolü: işlemci–ekran kartı dengesi, güç kaynağı payı.
- Yerel yapay zekâ için ekran kartı belleğinin (VRAM) neden önemli olduğunu açıkla.
- Bütçe %20 artarsa ilk hangi parçayı yükseltmeliyim?
Fiyatların güncel olmayabileceğini ve almadan önce kontrol etmem gerektiğini belirt.`,
  },
  {
    id: "spec-acikla",
    kategori: "cip",
    baslik: "Teknik özellik sayfasını açıkla",
    aciklama: "Bir ürünün özellik listesini satır satır, neyin gerçekten önemli olduğuyla anlatır.",
    arac: "sohbet",
    seviye: "başlangıç",
    metin: `Aşağıdaki teknik özellik listesini bana açıkla:

"""
{{özellikler|ürünün teknik özellik listesini buraya yapıştır}}
"""

Ben bu ürünü {{amaç|video kurgu ve ara sıra oyun}} için alacağım.

- Her satırı tek cümleyle açıkla.
- Benim kullanımım için en önemli 3 satırı ve neden önemli olduklarını söyle.
- Pazarlama dilinde abartılmış ya da yanıltıcı olabilecek bir ifade varsa göster.`,
  },
  {
    id: "gpu-kiralama-hesap",
    kategori: "cip",
    baslik: "GPU kiralama maliyet hesabı",
    aciklama: "Bir eğitim ya da çıkarım işinin bulutta kaça mal olacağını adım adım hesaplar.",
    arac: "sohbet",
    seviye: "ileri",
    metin: `Bulutta GPU kiralayarak şu işi yapacağım; maliyetini hesapla.

İş: {{iş|7 milyar parametreli bir modeli kendi verimle ince ayar (fine-tune) yapmak}}
Veri: {{veri|50.000 örnek, ortalama 500 token}}
Düşündüğüm GPU ve saatlik fiyatı: {{gpu|H100, saati 3,49 $}}

1. Gereken GPU belleğini ve kaç GPU gerektiğini hesapla (varsayımlarını yaz).
2. Tahmini süre: hesabı adım adım göster.
3. Toplam maliyet ve ±%30 belirsizlik aralığı.
4. Maliyeti düşürmek için 3 yol (ör. LoRA, daha ucuz GPU, spot fiyat) ve her birinin etkisi.
Varsayımlarını açıkça listele; benim verdiğim fiyat dışında fiyat uydurma.`,
  },
];

/** {{ad|varsayılan}} yer tutucularını sırasıyla, tekrarsız çıkarır. */
export function degiskenler(metin) {
  const sonuc = [];
  const goruldu = new Set();
  for (const m of metin.matchAll(/\{\{([^|}]+)\|?([^}]*)\}\}/g)) {
    const ad = m[1].trim();
    if (goruldu.has(ad)) continue;
    goruldu.add(ad);
    sonuc.push({ ad, varsayilan: m[2] });
  }
  return sonuc;
}

/** Değerlerle doldurulmuş metin; boş bırakılan alan varsayılanı alır. */
export function doldur(metin, degerler = {}) {
  return metin.replace(/\{\{([^|}]+)\|?([^}]*)\}\}/g, (_, ad, vars) => {
    const v = degerler[ad.trim()];
    return v != null && String(v).trim() !== "" ? v : vars;
  });
}
