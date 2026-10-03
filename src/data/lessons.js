export const lessons = [
  {
    "id": "chip-nedir",
    "order": 1,
    "track": "temeller",
    "level": "Başlangıç",
    "duration": "8 dk",
    "title": "Chip nedir? Kumdan hesaplayan taşa",
    "subtitle": "Hiçbir şey bilmiyorsan buradan başla",
    "summary": "Bir işlemcinin aslında ne olduğunu, neden 'silikon' dendiğini ve o küçük karenin içinde tam olarak neyin bulunduğunu öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Elinde tuttuğun telefonun içindeki işlemci, tırnağının yarısı kadar bir alanda milyarlarca parçadan oluşuyor. Bu cümle sık tekrarlanır ama genelde şu soru cevapsız kalır: **bu parçalar tam olarak nedir ve ne yaparlar?**\n\nEn kısa cevap şu: bir chip, üzerine mikroskobik elektrik anahtarları kazınmış bir silikon levhadır. Bu anahtarların hepsi tek bir işi yapar — akımı geçirmek ya da kesmek. Yani açık ya da kapalı olmak. Geriye kalan her şey, bilgisayarın yapabildiği tüm işler, bu tek yetenek üzerine kurulmuştur."
      },
      {
        "type": "analogy",
        "title": "Işık düğmeleri şehri",
        "body": "Bir şehir düşün: içinde 90 milyar tane ışık düğmesi var ve hepsi birbirine kablolarla bağlı. Bazı düğmeler açıldığında başka düğmeleri de açıyor, bazıları kapatıyor. Sen şehrin bir ucundan belli düğmeleri açıyorsun, diğer ucunda bambaşka bir düğme deseni ortaya çıkıyor.\n\nİşte bir GPU tam olarak budur. RTX 5090'ın içindeki 92.2 milyar transistör, bu şehrin ışık düğmeleridir. Sen ekrana bir oyun karesi çizdirdiğinde, aslında bu düğmelerin saniyede milyarlarca kez açılıp kapanmasını sağlamış olursun."
      },
      {
        "type": "text",
        "title": "Neden silikon?",
        "body": "Silikon, dünyanın kabuğunda oksijenden sonra en bol bulunan ikinci element. Kum, büyük ölçüde silisyum dioksit. Ama bolluk tek sebep değil.\n\nSilikonun asıl değerli özelliği **yarı iletken** olması. İletken (bakır gibi) her zaman akım geçirir, yalıtkan (cam gibi) hiç geçirmez. Yarı iletken ise duruma göre karar verir — ve işte bu 'duruma göre' kısmı, kontrol edilebilir bir anahtar yapmanı sağlar. Silikona çok küçük miktarda başka elementler katarak (buna *katkılama* deniyor) bu davranışı istediğin gibi ayarlayabilirsin."
      },
      {
        "type": "diagram",
        "variant": "sand-to-chip",
        "caption": "Kumdan çalışan bir chip'e giden yolun ana durakları"
      },
      {
        "type": "list",
        "title": "Bir chip'in içinde ne var?",
        "items": [
          "**Transistörler** — akımı açıp kapayan mikroskobik anahtarlar. Sayıları milyarlarla ölçülür.",
          "**Kablolama katmanları** — transistörleri birbirine bağlayan bakır yollar. Modern chip'lerde 15-20 katman üst üste dizilir.",
          "**Cache (önbellek)** — chip'in üzerinde duran hızlı bellek. Die alanının çoğu zaman üçte birini kaplar.",
          "**Bellek denetleyicileri** — chip'in dışındaki RAM ile konuşan bloklar.",
          "**I/O arayüzleri** — PCIe, USB, ekran çıkışı gibi dış dünya bağlantıları."
        ]
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Aklında kalsın",
        "body": "Chip, hesap yapan bir nesne değil. Hesap yapıyormuş gibi davranan, çok iyi düzenlenmiş bir anahtar yığını. Bilgisayarın 'zekâsı' donanımda değil, bu anahtarların hangi sırayla açılıp kapanacağını söyleyen komutlarda."
      },
      {
        "type": "text",
        "title": "Die, chip, işlemci — hangisi ne?",
        "body": "Bu üç kelime sık sık karıştırılır:\n\n**Die**, wafer'dan kesilmiş çıplak silikon parçasıdır. Paketlenmemiş, korumasız haldedir.\n\n**Chip** genellikle die'ın paketlenmiş, bacakları takılmış, kullanıma hazır halidir. Günlük dilde ikisi birbirinin yerine kullanılır.\n\n**İşlemci** ise bir chip'in işlevini anlatır. Bir chip CPU olabilir, GPU olabilir, bellek denetleyicisi olabilir. Modern bir Ryzen paketinin içinde birden fazla die vardır — bunu ilerideki chiplet dersinde göreceğiz."
      }
    ],
    "keyTerms": [
      "Transistör",
      "Silikon",
      "Yarı iletken",
      "Die",
      "Wafer",
      "Katkılama"
    ],
    "quiz": [
      {
        "q": "Silikon chip üretiminde neden tercih edilir?",
        "options": [
          "En sert element olduğu için",
          "Yarı iletken olduğu ve iletkenliği kontrol edilebildiği için",
          "En iyi elektrik ilettiği için",
          "Isıya en dayanıklı malzeme olduğu için"
        ],
        "answer": 1,
        "explanation": "Silikonun kilit özelliği yarı iletken olması. İletkenliği katkılama ile ayarlanabildiği için kontrol edilebilir anahtarlar yapılabiliyor. Bolluğu ikincil bir avantaj."
      },
      {
        "q": "Bir transistörün temel işlevi nedir?",
        "options": [
          "Elektriği depolamak",
          "Sayıları toplamak",
          "Akımı geçirmek veya kesmek",
          "Veriyi kalıcı olarak saklamak"
        ],
        "answer": 2,
        "explanation": "Transistör tek bir iş yapar: bir anahtar gibi akımı açar veya kapar. Toplama, saklama gibi işlevler milyarlarca transistörün düzenli birleşiminden doğar."
      },
      {
        "q": "'Die' terimi neyi ifade eder?",
        "options": [
          "Chip'in plastik paketi",
          "Wafer'dan kesilmiş çıplak silikon parçası",
          "Anakart üzerindeki soket",
          "Chip'in soğutucusu"
        ],
        "answer": 1,
        "explanation": "Die, wafer'dan kesilmiş paketlenmemiş silikon parçasıdır. Paketlendikten sonra genelde 'chip' denir."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-rtx-5090",
      "amd-zen5-ryzen-9-9950x"
    ]
  },
  {
    "id": "transistor",
    "order": 2,
    "track": "temeller",
    "level": "Başlangıç",
    "duration": "9 dk",
    "title": "Transistör: her şeyin temel taşı",
    "subtitle": "Üç bacaklı bir anahtarın dünyayı değiştirmesi",
    "summary": "Transistörün nasıl çalıştığını, neden bu kadar küçüldüğünü ve FinFET ile GAA arasındaki farkı öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Bir transistörün üç bağlantısı vardır: **kaynak (source)**, **savak (drain)** ve **kapı (gate)**. Akım kaynaktan savağa akmak ister ama arada bir engel vardır. Kapıya voltaj uyguladığında bu engel kalkar ve akım geçer. Voltajı kestiğinde engel geri gelir.\n\nİşte bu kadar. Bir musluk gibi: kapı, musluğun kolu."
      },
      {
        "type": "diagram",
        "variant": "transistor-switch",
        "caption": "MOSFET'in üç bağlantısı ve kapı voltajının kanal üzerindeki etkisi"
      },
      {
        "type": "analogy",
        "title": "Bahçe hortumu",
        "body": "Elinde bir bahçe hortumu var ve ortasından ayağınla basıyorsun. Bastığın sürece su akmıyor (transistör kapalı), ayağını kaldırdığında su akıyor (transistör açık).\n\nFarkı şu: senin ayağın saniyede belki iki kez inip kalkabilir. Modern bir transistör bunu saniyede 5 milyar kez yapıyor. Ve chip'in içinde bunlardan 90 milyar tane var, hepsi aynı anda çalışıyor."
      },
      {
        "type": "text",
        "title": "Neden sürekli küçültüyoruz?",
        "body": "Transistörü küçültmenin üç doğrudan faydası var:\n\n**Daha hızlı olur.** Elektronun kat etmesi gereken mesafe kısalır, anahtarlama süresi düşer.\n\n**Daha az güç harcar.** Küçük transistör, açılıp kapanırken daha az yük taşır. Milyarlarca transistörde bu fark devasa hale gelir.\n\n**Aynı alana daha fazlası sığar.** Aynı boyuttaki die'a daha fazla transistör koyabilirsin — yani daha fazla cache, daha fazla çekirdek, daha fazla yetenek.\n\nBu üçlü kazanç, yarım asırdır bilgisayar endüstrisini ileri taşıyan motor. Ama artık eskisi kadar kolay değil."
      },
      {
        "type": "text",
        "title": "Planardan FinFET'e, oradan GAA'ya",
        "body": "Transistörler küçüldükçe yeni bir sorun çıktı: kapı, kanal üzerindeki kontrolünü kaybetmeye başladı. Kapalı olması gereken transistörden akım sızmaya başladı — buna **kaçak akım (leakage)** deniyor ve doğrudan boşa harcanan güç demek.\n\nÇözüm, kapının kanalı daha çok sarmasıydı:\n\n**Planar** (2011 öncesi): Kapı kanalın sadece üstünde. Tek yüzeyden kontrol.\n\n**FinFET** (2011-2023): Kanal dikey bir 'yüzgeç' haline getirildi, kapı onu üç taraftan sarıyor. Kontrol büyük ölçüde iyileşti.\n\n**GAA / Nanosheet** (2024+): Kanal yatay şeritlere bölündü ve kapı onları **dört taraftan** tamamen sarıyor. Intel buna RibbonFET, Samsung MBCFET diyor. TSMC N2 nesliyle geçiyor."
      },
      {
        "type": "table",
        "title": "Transistör yapıları karşılaştırması",
        "headers": [
          "Yapı",
          "Kapı kaç yüzden sarıyor",
          "Kullanım dönemi",
          "Örnek"
        ],
        "rows": [
          [
            "Planar",
            "1 yüz",
            "~2011 öncesi",
            "Intel 32nm, eski ARM chip'leri"
          ],
          [
            "FinFET",
            "3 yüz",
            "2011 – 2024",
            "TSMC N7/N5/N4, Intel 10nm"
          ],
          [
            "GAA / Nanosheet",
            "4 yüz (tam sarma)",
            "2024 sonrası",
            "Intel 18A (RibbonFET), Samsung SF3, TSMC N2"
          ]
        ]
      },
      {
        "type": "callout",
        "tone": "info",
        "title": "PowerVia ve arkadan güç dağıtımı",
        "body": "Intel 18A ile gelen ikinci yenilik PowerVia: güç kabloları artık transistörlerin üstünden değil, wafer'ın **arkasından** geliyor. Böylece üst katmandaki sinyal kabloları rahatlıyor ve voltaj düşüşü azalıyor. Core Ultra X9 388H, bu tekniğin seri üretimdeki ilk örneklerinden."
      },
      {
        "type": "callout",
        "tone": "warn",
        "title": "Küçültme yavaşlıyor",
        "body": "Bir transistörün kapı uzunluğu artık birkaç düzine atom genişliğinde. Bu ölçekte kuantum tünelleme devreye giriyor: elektron, kapalı olması gereken engelden 'sızabiliyor'. Bu yüzden endüstri artık sadece küçültmeye değil, chiplet ve 3D istifleme gibi yapısal çözümlere yöneliyor."
      }
    ],
    "keyTerms": [
      "MOSFET",
      "Kapı (Gate)",
      "FinFET",
      "GAA",
      "RibbonFET",
      "Kaçak akım",
      "PowerVia"
    ],
    "quiz": [
      {
        "q": "Bir transistörde 'kapı' (gate) ne işe yarar?",
        "options": [
          "Akımı depolar",
          "Kaynak ile savak arasındaki akışı kontrol eder",
          "Isıyı dışarı atar",
          "Veriyi kalıcı olarak saklar"
        ],
        "answer": 1,
        "explanation": "Kapıya uygulanan voltaj, kaynak ile savak arasındaki kanalı açar ya da kapatır. Musluğun kolu gibi düşünebilirsin."
      },
      {
        "q": "FinFET'ten GAA'ya geçişin temel motivasyonu nedir?",
        "options": [
          "Üretim maliyetini düşürmek",
          "Chip'i fiziksel olarak büyütmek",
          "Kapının kanal üzerindeki kontrolünü artırıp kaçak akımı azaltmak",
          "Daha fazla renk desteği sağlamak"
        ],
        "answer": 2,
        "explanation": "Transistörler küçüldükçe kapı kontrolü zayıflıyor ve kaçak akım artıyor. GAA'da kapı kanalı dört taraftan sardığı için kontrol maksimuma çıkıyor."
      },
      {
        "q": "Aşağıdakilerden hangisi transistörü küçültmenin doğrudan faydası DEĞİLDİR?",
        "options": [
          "Anahtarlama süresinin kısalması",
          "Aynı alana daha fazla transistör sığması",
          "Kuantum tünellemenin azalması",
          "Anahtarlama başına daha az güç harcanması"
        ],
        "answer": 2,
        "explanation": "Tam tersi: transistör küçüldükçe kuantum tünelleme ARTAR. Bu, küçültmenin faydası değil, sınırıdır."
      }
    ],
    "relatedChips": [
      "intel-panther-lake-x9-388h",
      "amd-zen6-ryzen-10000"
    ]
  },
  {
    "id": "ikili-sistem-ve-kapilar",
    "order": 3,
    "track": "temeller",
    "level": "Başlangıç",
    "duration": "10 dk",
    "title": "0 ve 1: mantık kapıları nasıl düşünür?",
    "subtitle": "Anahtarlardan aritmetiğe giden köprü",
    "summary": "Transistörlerin nasıl birleşip mantık kapıları oluşturduğunu ve bu kapıların nasıl toplama yapabildiğini adım adım gör.",
    "sections": [
      {
        "type": "text",
        "body": "Bir önceki derste transistörün sadece açılıp kapandığını gördük. Peki bir anahtar nasıl olur da 2+3'ü hesaplayabilir?\n\nCevap katmanlarda. Birkaç transistörü belli bir düzende bağlarsan **mantık kapısı** elde edersin. Birkaç mantık kapısını bağlarsan toplayıcı elde edersin. Milyonlarca toplayıcı ve benzeri bloktan da bir işlemci çıkar.\n\nHer katman, altındaki katmanın karmaşıklığını gizler. Bu, bilgisayar mühendisliğinin en temel fikridir."
      },
      {
        "type": "text",
        "title": "Voltaj = anlam",
        "body": "Chip'in içinde 0 ve 1 diye bir şey yok. Sadece voltaj var. Yaklaşık 0 volt ise buna '0' diyoruz, yaklaşık 1 volt ise '1'. Aradaki değerler geçiş anıdır ve devre onları görmezden gelecek şekilde tasarlanır.\n\nBu, dijital sistemlerin analog sistemlerden neden çok daha güvenilir olduğunun cevabı: küçük bir gürültü 0.1 voltluk sapma yaratsa bile, '0' hâlâ '0' olarak okunur."
      },
      {
        "type": "diagram",
        "variant": "logic-gates",
        "caption": "Temel mantık kapıları ve doğruluk tabloları"
      },
      {
        "type": "table",
        "title": "Temel kapılar ve davranışları",
        "headers": [
          "Kapı",
          "Kural",
          "Günlük karşılığı"
        ],
        "rows": [
          [
            "AND",
            "Her iki giriş de 1 ise çıkış 1",
            "İki anahtarı da açman gerekiyor"
          ],
          [
            "OR",
            "Girişlerden biri 1 ise çıkış 1",
            "İki anahtardan biri yeterli"
          ],
          [
            "NOT",
            "Girişi tersine çevirir",
            "Değil"
          ],
          [
            "XOR",
            "Girişler farklıysa çıkış 1",
            "İkisinden sadece biri"
          ],
          [
            "NAND",
            "AND'in tersi",
            "Evrensel kapı — her şey bundan yapılabilir"
          ]
        ]
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "NAND'in evrenselliği",
        "body": "Sadece NAND kapıları kullanarak AND, OR, NOT, XOR — yani her mantık işlevini kurabilirsin. Bu yüzden birçok chip tasarımında NAND temel yapı taşıdır: tek tip bloğu optimize etmek, beş farklı bloğu optimize etmekten çok daha kolaydır."
      },
      {
        "type": "steps",
        "title": "İki biti toplamak: yarım toplayıcı",
        "items": [
          {
            "label": "Sorun",
            "body": "1 + 1 = 10 (ikili sistemde iki). Yani iki bit topladığında sonuç iki bit olabilir: bir 'toplam' ve bir 'elde'."
          },
          {
            "label": "Toplam biti",
            "body": "0+0=0, 0+1=1, 1+0=1, 1+1=0. Bu tam olarak XOR'un davranışı."
          },
          {
            "label": "Elde biti",
            "body": "Elde sadece 1+1 durumunda oluşur. Bu da AND'in davranışı."
          },
          {
            "label": "Sonuç",
            "body": "Bir XOR + bir AND = yarım toplayıcı. Yaklaşık 10 transistör. Bunları zincirleyerek 64 bitlik sayıları toplayan bir birim kurabilirsin."
          }
        ]
      },
      {
        "type": "text",
        "title": "Buradan işlemciye",
        "body": "Bir CPU'nun aritmetik mantık birimi (ALU), işte bu toplayıcıların ve benzeri blokların birleşimidir. Çarpma, tekrarlanan toplamanın optimize edilmiş halidir. Bölme daha karmaşıktır ama yine aynı temel üzerine kuruludur.\n\nModern bir CPU çekirdeğinde birden fazla ALU bulunur — böylece aynı saat çevriminde birden fazla işlem yapılabilir. Buna *superscalar* denir ve bir sonraki mimari derslerinde tekrar karşımıza çıkacak."
      }
    ],
    "keyTerms": [
      "Mantık kapısı",
      "AND / OR / NOT / XOR",
      "NAND",
      "İkili sistem",
      "ALU",
      "Yarım toplayıcı"
    ],
    "quiz": [
      {
        "q": "İki bitin toplamındaki 'toplam' bitini hangi kapı üretir?",
        "options": [
          "AND",
          "OR",
          "XOR",
          "NOT"
        ],
        "answer": 2,
        "explanation": "0+0=0, 0+1=1, 1+0=1, 1+1=0 — bu tam olarak XOR'un doğruluk tablosu. Elde bitini ise AND üretir."
      },
      {
        "q": "NAND kapısının özel önemi nedir?",
        "options": [
          "En az güç harcayan kapıdır",
          "Tek başına tüm diğer mantık işlevleri kurulabilir",
          "En hızlı çalışan kapıdır",
          "Sadece bellek chip'lerinde kullanılır"
        ],
        "answer": 1,
        "explanation": "NAND evrensel bir kapıdır: yalnızca NAND kullanarak AND, OR, NOT ve XOR dahil her mantık devresini kurabilirsin."
      },
      {
        "q": "Dijital devreler neden analog devrelerden daha gürültüye dayanıklıdır?",
        "options": [
          "Daha yüksek voltajda çalıştıkları için",
          "Sadece iki geçerli durum tanıyıp aradaki sapmaları yok saydıkları için",
          "Daha az transistör kullandıkları için",
          "Daha düşük sıcaklıkta çalıştıkları için"
        ],
        "answer": 1,
        "explanation": "Dijital devre voltajı iki kategoriye indirger. 0.1 voltluk bir gürültü, '0' okumasını değiştirmez — analog bir devrede ise bu doğrudan hata olurdu."
      }
    ],
    "relatedChips": []
  },
  {
    "id": "surec-dugumu",
    "order": 4,
    "track": "uretim",
    "level": "Orta",
    "duration": "10 dk",
    "title": "\"3nm\" gerçekte ne demek?",
    "subtitle": "Süreç düğümü, litografi ve pazarlama isimleri",
    "summary": "Süreç düğümü isimlerinin neden artık fiziksel bir ölçü olmadığını, EUV'nin ne yaptığını ve TSMC/Intel/Samsung isimlerinin nasıl karşılaştırılacağını öğren.",
    "sections": [
      {
        "type": "callout",
        "tone": "warn",
        "title": "Önce bu yanılgıyı temizleyelim",
        "body": "TSMC'nin '3nm' sürecinde hiçbir şey 3 nanometre değildir. Kapı uzunluğu da değildir, transistör genişliği de. Bu isimler 2000'lerin ortasından beri fiziksel bir ölçüyü değil, bir **nesil etiketini** ifade ediyor."
      },
      {
        "type": "text",
        "title": "Peki isim neyi anlatıyor?",
        "body": "Eskiden düğüm ismi gerçekten kapı uzunluğunu verirdi: 180nm süreçte kapı 180 nanometreydi. Ama transistör yapısı planardan FinFET'e geçince tek bir 'uzunluk' tanımlamak anlamsızlaştı.\n\nBugün düğüm ismi kabaca şunu söylüyor: *bu, bir önceki nesle göre yaklaşık %30-40 daha yoğun ve/veya daha verimli bir üretim teknolojisi.* Gerçek karşılaştırma ölçütü ise **transistör yoğunluğu** — milimetrekareye kaç milyon transistör sığdığı."
      },
      {
        "type": "table",
        "title": "İsimler yanıltıcı: yaklaşık yoğunluk karşılaştırması",
        "headers": [
          "Süreç",
          "Üretici",
          "Yaklaşık konum",
          "Örnek ürün"
        ],
        "rows": [
          [
            "N5 / 4N",
            "TSMC",
            "Yoğun 5nm sınıfı",
            "RTX 5090, H100"
          ],
          [
            "N4P / 4NP",
            "TSMC",
            "5nm'nin iyileştirilmiş türevi",
            "Ryzen 9950X, B200"
          ],
          [
            "N3P",
            "TSMC",
            "3nm sınıfı",
            "MI355X, Apple M5"
          ],
          [
            "Intel 3",
            "Intel",
            "TSMC N4/N3 arası",
            "Xeon 6"
          ],
          [
            "Intel 18A",
            "Intel",
            "TSMC N2 sınıfı hedefleniyor",
            "Core Ultra X9 388H"
          ]
        ]
      },
      {
        "type": "text",
        "title": "Litografi: ışıkla desen çizmek",
        "body": "Chip üretiminin kalbi **fotolitografi**. Wafer'ın üzerine ışığa duyarlı bir kimyasal (photoresist) sürülür, sonra maskeden geçirilen ışıkla desen basılır. Işığın vurduğu yerler çözünür hale gelir ve yıkanır. Geriye kalan desen, sonraki adımlarda kazınır veya katkılanır.\n\nSorun şu: çizebileceğin en ince çizgi, kullandığın ışığın dalga boyuyla sınırlı. Uzun yıllar 193 nm dalga boylu ışık kullanıldı — ve 193 nm ışıkla 30 nm çizgi çizmek için akıl almaz numaralar geliştirildi (daldırma litografisi, çoklu desenleme)."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "EUV: 13.5 nanometrelik ışık",
        "body": "Extreme Ultraviolet litografi, 13.5 nm dalga boyunda ışık kullanır — öncekinin on dörtte biri. Bu ışığı üretmek için erimiş kalay damlacıklarına saniyede 50.000 kez lazer ateşlenir ve oluşan plazma ışık yayar. Havada bile emildiği için tüm sistem vakumda çalışır ve mercek yerine aynalar kullanılır.\n\nBu makineleri dünyada yalnızca Hollandalı **ASML** üretiyor. Tanesi yüz milyonlarca dolar ve yılda sınırlı sayıda üretilebiliyor. 5nm ve altındaki her chip bu makinelerden geçmek zorunda — bu yüzden ASML, yarı iletken jeopolitiğinin merkezinde."
      },
      {
        "type": "diagram",
        "variant": "lithography",
        "caption": "Fotolitografi döngüsü: kaplama, pozlama, geliştirme, kazıma"
      },
      {
        "type": "list",
        "title": "Bir wafer neden yüzlerce adımdan geçer?",
        "items": [
          "Modern bir chip 15-20 metal kablolama katmanına sahip — her katman kendi litografi döngüsünü gerektirir.",
          "Her katman için kaplama, pozlama, geliştirme, kazıma, temizleme adımları tekrarlanır.",
          "Katkılama (doping) adımlarında iyonlar silikona hızlandırılarak gömülür.",
          "Toplamda 1000'den fazla proses adımı ve 3-4 aylık üretim süresi ortaya çıkar.",
          "Tek bir adımda oluşan mikroskobik hata, o die'ı çöpe gönderebilir — buna **verim (yield)** sorunu denir."
        ]
      },
      {
        "type": "text",
        "title": "Verim: neden büyük die pahalıdır?",
        "body": "Bir wafer üzerinde rastgele dağılmış kusurlar oluşur. Die'ın ne kadar büyükse, içine bir kusur düşme olasılığı o kadar yüksektir.\n\nBu yüzden 750 mm²'lik bir GB202 (RTX 5090) die'ı, 199 mm²'lik bir Navi 44'ten (RX 9060 XT) çok daha pahalıdır — sadece dört kat büyük olduğu için değil, verimi de çok daha düşük olduğu için. Chiplet fikrinin doğuş sebebi tam olarak budur ve bunu ayrı bir derste ele alacağız."
      }
    ],
    "keyTerms": [
      "Süreç düğümü",
      "Fotolitografi",
      "EUV",
      "ASML",
      "Photoresist",
      "Verim (Yield)",
      "Transistör yoğunluğu"
    ],
    "quiz": [
      {
        "q": "TSMC'nin 'N3' sürecinde 3 nanometre olan şey nedir?",
        "options": [
          "Kapı uzunluğu",
          "Transistör genişliği",
          "Hiçbir şey — bu bir nesil etiketidir",
          "Metal katmanlar arası mesafe"
        ],
        "answer": 2,
        "explanation": "Düğüm isimleri 2000'lerin ortasından beri fiziksel bir ölçüyü ifade etmiyor. Anlamlı karşılaştırma ölçütü transistör yoğunluğudur."
      },
      {
        "q": "EUV litografisi hangi dalga boyunda ışık kullanır?",
        "options": [
          "193 nm",
          "13.5 nm",
          "3 nm",
          "365 nm"
        ],
        "answer": 1,
        "explanation": "EUV 13.5 nm dalga boyu kullanır — önceki nesil daldırma litografisinin 193 nm'sinin yaklaşık on dörtte biri."
      },
      {
        "q": "Büyük die'lar neden orantısız şekilde pahalıdır?",
        "options": [
          "Daha fazla silikon kullandıkları için",
          "Wafer üzerindeki rastgele kusurlara yakalanma olasılıkları daha yüksek olduğu için",
          "Daha uzun sürede üretildikleri için",
          "Daha fazla enerji harcadıkları için"
        ],
        "answer": 1,
        "explanation": "Kusurlar wafer üzerinde rastgele dağılır. Die büyüdükçe içine kusur düşme olasılığı artar, verim düşer ve sağlam die başına maliyet hızla yükselir."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-rtx-5090",
      "amd-rdna4-rx-9060xt"
    ]
  },
  {
    "id": "wafer-den-chip-e",
    "order": 5,
    "track": "uretim",
    "level": "Orta",
    "duration": "8 dk",
    "title": "Wafer'dan pakete: üretim hattı",
    "subtitle": "Kum nasıl çalışan bir işlemciye dönüşüyor?",
    "summary": "Ham silikondan paketlenmiş chip'e giden 1000+ adımlık yolun ana duraklarını ve binning'in ne olduğunu öğren.",
    "sections": [
      {
        "type": "steps",
        "title": "Üretim hattının ana durakları",
        "items": [
          {
            "label": "1 · Ham silikon",
            "body": "Kuvars kumu yüksek sıcaklıkta indirgenerek metalurjik silikon elde edilir, sonra kimyasal işlemlerle %99.9999999 saflığa getirilir. Bu saflık düzeyine 'dokuz dokuz' denir."
          },
          {
            "label": "2 · Kristal büyütme",
            "body": "Czochralski yöntemiyle erimiş silikona bir tohum kristal daldırılıp yavaşça döndürülerek çekilir. Sonuç: tek kristalli, silindirik bir külçe (ingot). Ağırlığı yüzlerce kilo olabilir."
          },
          {
            "label": "3 · Dilimleme ve parlatma",
            "body": "Külçe elmas telle 300 mm çapında, kâğıt inceliğinde dilimlere kesilir. Yüzey atom düzeyinde düzgün olana kadar parlatılır."
          },
          {
            "label": "4 · Katman katman inşa",
            "body": "Yüzlerce litografi, kazıma, katkılama ve kaplama döngüsü. Önce transistörler, sonra üstüne 15-20 katman bakır kablolama. Bu aşama aylar sürer."
          },
          {
            "label": "5 · Wafer testi",
            "body": "Her die'a mikroskobik problar dokundurularak elektriksel test yapılır. Çalışmayanlar işaretlenir."
          },
          {
            "label": "6 · Kesme ve paketleme",
            "body": "Wafer die'lara ayrılır. Sağlam die'lar bir taşıyıcıya monte edilir, bağlantıları yapılır, ısı yayıcı takılır."
          },
          {
            "label": "7 · Son test ve binning",
            "body": "Paketlenmiş chip'ler saat hızı, güç tüketimi ve çalışan blok sayısına göre sınıflandırılır."
          }
        ]
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Binning: aynı die, farklı ürün",
        "body": "RTX 5080 ile RTX 5070 Ti aynı GB203 die'ını kullanır. Fark şu: üretimde bazı SM blokları kusurlu çıkar. Bu die'lar çöpe atılmaz — kusurlu bloklar kalıcı olarak devre dışı bırakılır ve chip daha alt bir model olarak satılır.\n\nBu, verim sorununu gelire çeviren zekice bir yöntemdir. Aynı mantık CPU'larda da geçerlidir: 8 çekirdekli bir CCD'de iki çekirdek kusurluysa, 6 çekirdekli ürün olarak satılır."
      },
      {
        "type": "diagram",
        "variant": "wafer-yield",
        "caption": "300 mm'lik bir wafer üzerinde die boyutu ve kusur ilişkisi"
      },
      {
        "type": "text",
        "title": "Neden 300 mm?",
        "body": "Wafer çapı büyüdükçe wafer başına daha fazla die çıkar ve kenarlardaki fire oranı düşer. Endüstri 200 mm'den 300 mm'ye 2000'lerin başında geçti.\n\n450 mm uzun süre konuşuldu ama gerçekleşmedi: gereken yeni ekipman yatırımı, sağlayacağı tasarrufu aşıyordu. Yani 300 mm, teknik bir sınır değil ekonomik bir denge noktası."
      },
      {
        "type": "text",
        "title": "Fab, foundry, fabless",
        "body": "**Fab** (fabrication plant), chip üretilen tesistir. Bir tanesinin maliyeti 20 milyar doları aşabilir.\n\n**Foundry**, başkaları için üretim yapan fab şirketidir. TSMC bunun en büyük örneği: kendi chip'ini tasarlamaz, NVIDIA'nın, AMD'nin, Apple'ın tasarımlarını üretir.\n\n**Fabless** şirket ise sadece tasarım yapar, üretimi dışarı verir. NVIDIA, AMD, Apple ve Qualcomm fabless'tır. Intel ise hem tasarlar hem üretir — ve son yıllarda foundry olarak da başkalarına hizmet vermeye başladı."
      }
    ],
    "keyTerms": [
      "Wafer",
      "Ingot",
      "Czochralski",
      "Binning",
      "Verim",
      "Foundry",
      "Fabless"
    ],
    "quiz": [
      {
        "q": "'Binning' ne anlama gelir?",
        "options": [
          "Kusurlu chip'lerin imha edilmesi",
          "Chip'lerin test sonuçlarına göre farklı ürün modellerine ayrılması",
          "Wafer'ın dilimlenmesi",
          "Chip'in paketlenmesi"
        ],
        "answer": 1,
        "explanation": "Binning, üretilen chip'leri saat hızı ve çalışan blok sayısına göre sınıflandırıp farklı modeller olarak satma sürecidir. Kusurlu bloklar devre dışı bırakılır."
      },
      {
        "q": "TSMC ne tür bir şirkettir?",
        "options": [
          "Fabless tasarım şirketi",
          "Foundry — başkalarının tasarımlarını üreten fab",
          "Sadece kendi chip'lerini üreten entegre üretici",
          "Litografi makinesi üreticisi"
        ],
        "answer": 1,
        "explanation": "TSMC bir foundry'dir: kendi chip'ini tasarlamaz, NVIDIA/AMD/Apple gibi fabless şirketlerin tasarımlarını üretir. Litografi makinelerini ise ASML üretir."
      },
      {
        "q": "RTX 5080 ve RTX 5070 Ti arasındaki ilişki neyi örnekler?",
        "options": [
          "İki tamamen farklı die tasarımını",
          "Aynı die'ın farklı binning sonuçlarını",
          "Farklı süreç düğümlerini",
          "Farklı bellek teknolojilerini"
        ],
        "answer": 1,
        "explanation": "İkisi de GB203 die'ını kullanır. 5070 Ti, bazı blokları devre dışı bırakılmış bir binning ürünüdür."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-rtx-5080",
      "nvidia-blackwell-rtx-5090"
    ]
  },
  {
    "id": "cpu-nasil-calisir",
    "order": 6,
    "track": "mimari",
    "level": "Orta",
    "duration": "11 dk",
    "title": "CPU nasıl çalışır? Getir–çöz–yürüt",
    "subtitle": "Bir komutun chip içindeki yolculuğu",
    "summary": "Komut döngüsünü, pipeline'ı, dallanma tahminini ve out-of-order yürütmeyi somut örneklerle öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Bir CPU, özünde çok basit bir döngüyü sonsuza kadar tekrarlar:\n\n1. Bellekten bir komut **getir** (fetch)\n2. Komutun ne olduğunu **çöz** (decode)\n3. Komutu **yürüt** (execute)\n4. Sonucu **yaz** (write back)\n\nBu kadar. Bilgisayarının yaptığı her şey — video oynatmak, oyun çalıştırmak, bu metni göstermek — bu döngünün saniyede milyarlarca kez tekrarlanmasından ibaret."
      },
      {
        "type": "analogy",
        "title": "Çamaşır makinesi kuyruğu",
        "body": "Bir yurtta tek çamaşır makinesi ve tek kurutucu var. Naif yaklaşım: yıka, kurut, katla, sonra sıradaki kişi başlasın. Bu şekilde makineler zamanın çoğunda boş bekler.\n\nAkıllı yaklaşım: sen kurutucudayken sıradaki kişi makineye çamaşırını atsın. Sen katlarken o kurutucuya geçsin. Aynı anda üç kişi farklı aşamalarda.\n\nİşte **pipeline** budur. Bir komut yürütme aşamasındayken, sonraki komut çözülüyor, ondan sonraki getiriliyor."
      },
      {
        "type": "diagram",
        "variant": "cpu-pipeline",
        "caption": "Pipeline: aynı anda farklı aşamalarda ilerleyen komutlar"
      },
      {
        "type": "text",
        "title": "Pipeline'ın bedeli: dallanma",
        "body": "Pipeline harika çalışır — ta ki bir `if` ifadesine gelene kadar.\n\nCPU, `if (x > 5)` komutunu gördüğünde hangi yolun izleneceğini bilmiyor. Ama pipeline'ı boş bırakamaz, çünkü sonucu beklemek 15-20 çevrim kaybettirir. Bu yüzden **tahmin eder** ve tahmin ettiği yoldan komutları çekmeye devam eder.\n\nTahmin doğruysa hiçbir şey kaybedilmez. Yanlışsa pipeline'daki tüm spekülatif iş çöpe gider ve baştan başlanır. Modern dallanma tahmincileri %95-99 doğrulukla çalışır — ve bu yüzdenin son bir puanı, çekirdek tasarımcılarının yıllarını alır."
      },
      {
        "type": "callout",
        "tone": "info",
        "title": "Out-of-order yürütme",
        "body": "Modern CPU'lar komutları yazıldıkları sırada yürütmez. Bir komut bellekten veri beklerken, ona bağımlı olmayan sonraki komutlar öne alınıp yürütülür. Sonuçlar ise doğru sırada yazılır — yani programcı açısından hiçbir şey değişmiş görünmez.\n\nBu, tek çekirdek performansının en büyük kaynaklarından biridir. Zen 5'in Zen 4'e göre yaklaşık %16 IPC artışının önemli bir kısmı, bu mekanizmanın genişletilmesinden gelir."
      },
      {
        "type": "text",
        "title": "Superscalar: paralel yürütme birimleri",
        "body": "Bir çekirdek içinde birden fazla ALU, birden fazla yükleme/saklama birimi ve birden fazla kayan nokta birimi bulunur. Bu sayede aynı saat çevriminde birden fazla komut tamamlanabilir.\n\nIPC (Instructions Per Cycle) tam olarak bunu ölçer: çevrim başına kaç komut bitiriliyor? Modern bir yüksek performanslı çekirdek, uygun kodda çevrim başına 4-6 komut tamamlayabilir."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "İki chip'i karşılaştırırken",
        "body": "Saat hızı tek başına anlamsızdır. Gerçek performans kabaca **IPC × Saat Hızı × Çekirdek Sayısı** ile ilgilidir (iş yükü paralelleşebiliyorsa).\n\n5 GHz'de düşük IPC'li bir çekirdek, 4 GHz'de yüksek IPC'li bir çekirdekten yavaş olabilir. Bu yüzden farklı mimarilerin GHz değerlerini doğrudan kıyaslamak yanıltıcıdır."
      }
    ],
    "keyTerms": [
      "Fetch-Decode-Execute",
      "Pipeline",
      "Dallanma tahmini",
      "Out-of-order",
      "Superscalar",
      "IPC"
    ],
    "quiz": [
      {
        "q": "Pipeline'ın temel amacı nedir?",
        "options": [
          "Saat hızını artırmak",
          "Farklı komutları aynı anda farklı aşamalarda işleyerek verimi artırmak",
          "Güç tüketimini azaltmak",
          "Cache boyutunu büyütmek"
        ],
        "answer": 1,
        "explanation": "Pipeline, bir komut yürütülürken diğerinin çözülmesini ve bir başkasının getirilmesini sağlar. Böylece yürütme birimleri boş beklemez."
      },
      {
        "q": "Dallanma tahmini yanlış çıkarsa ne olur?",
        "options": [
          "Program çöker",
          "Sonuç yanlış hesaplanır",
          "Pipeline'daki spekülatif iş iptal edilir ve baştan başlanır",
          "CPU saat hızını düşürür"
        ],
        "answer": 2,
        "explanation": "Yanlış tahmin sonucu bozmaz — sadece performans kaybettirir. Spekülatif olarak yapılan iş atılır ve doğru yoldan yeniden başlanır."
      },
      {
        "q": "4.5 GHz'de çalışan A chip'i, 5.0 GHz'de çalışan B chip'inden hızlı olabilir mi?",
        "options": [
          "Hayır, saat hızı her zaman belirleyicidir",
          "Evet, A'nın IPC'si yeterince yüksekse",
          "Sadece çekirdek sayısı aynıysa",
          "Sadece aynı üreticiden ise"
        ],
        "answer": 1,
        "explanation": "Performans kabaca IPC × saat hızı ile orantılıdır. Daha yüksek IPC'li bir mimari, daha düşük frekansta bile öne geçebilir."
      }
    ],
    "relatedChips": [
      "amd-zen5-ryzen-9-9950x",
      "intel-arrow-lake-285k"
    ]
  },
  {
    "id": "cekirdek-thread-cache",
    "order": 7,
    "track": "mimari",
    "level": "Orta",
    "duration": "10 dk",
    "title": "Çekirdek, thread, cache: spec'lerin anlamı",
    "subtitle": "P-core, E-core, SMT ve 3D V-Cache neden var?",
    "summary": "Çekirdek ile iş parçacığı arasındaki farkı, hibrit mimarilerin mantığını ve cache'in neden bu kadar önemli olduğunu öğren.",
    "sections": [
      {
        "type": "text",
        "title": "Çekirdek ve iş parçacığı",
        "body": "**Çekirdek (core)**, bağımsız olarak komut yürütebilen fiziksel bir birimdir. Kendi ALU'ları, kendi kayıtları ve kendi L1/L2 cache'i vardır.\n\n**İş parçacığı (thread)**, işletim sisteminin gördüğü mantıksal yürütme hattıdır. SMT (Intel'de Hyper-Threading) sayesinde tek bir fiziksel çekirdek iki iş parçacığı sunabilir.\n\nSMT sihir değil: ikinci iş parçacığı, birinci iş parçacığı bellek beklerken boşta kalan yürütme birimlerini kullanır. Tipik kazanç %20-30'dur — iki kat değil."
      },
      {
        "type": "callout",
        "tone": "info",
        "title": "Intel neden SMT'yi kaldırdı?",
        "body": "Lunar Lake ve Arrow Lake'te Hyper-Threading yok. Intel'in gerekçesi: SMT'nin getirdiği %20-30 kazanç için harcanan die alanı ve güç bütçesi, doğrudan bir E-core eklemekten daha verimsiz. 8 çekirdek + 8 thread yerine 8 çekirdek + 8 thread ama daha basit ve verimli bir tasarım."
      },
      {
        "type": "text",
        "title": "Hibrit mimari: P-core ve E-core",
        "body": "Modern chip'lerin çoğu artık iki tip çekirdek barındırıyor:\n\n**P-core (Performance)** — büyük, karmaşık, yüksek IPC ve yüksek frekans. Tek iş parçacığına duyarlı işler için. Çok yer kaplar ve çok güç harcar.\n\n**E-core (Efficient)** — küçük, basit, düşük güç. Bir P-core'un kapladığı alana dört E-core sığabilir. Paralel ve arka plan işleri için ideal.\n\nApple bu yaklaşımı 2020'de M1 ile popülerleştirdi, Intel 2021'de Alder Lake ile x86'ya taşıdı. Panther Lake üçüncü bir kademe daha ekliyor: sistem boştayken çalışan ayrı **LP-E core**'lar."
      },
      {
        "type": "table",
        "title": "Farklı yaklaşımlar",
        "headers": [
          "Chip",
          "Yapı",
          "Felsefe"
        ],
        "rows": [
          [
            "AMD Ryzen 9950X",
            "16 × Zen 5 (hepsi aynı)",
            "Tek tip, güçlü çekirdek"
          ],
          [
            "AMD EPYC Turin 9965",
            "192 × Zen 5c (yoğunlaştırılmış)",
            "Aynı mimari, alan için sıkıştırılmış"
          ],
          [
            "Intel Core Ultra X9 388H",
            "4 P + 8 E + 4 LP-E",
            "Üç kademeli hibrit"
          ],
          [
            "Apple M5 Max",
            "6 S-core + 12 P-core",
            "Performansa ağırlıklı hibrit"
          ],
          [
            "Snapdragon X2 Elite Extreme",
            "12 Prime + 6 Performance",
            "İkisi de tam performans sınıfı"
          ]
        ]
      },
      {
        "type": "text",
        "title": "Cache: neden bu kadar önemli?",
        "body": "Bir CPU çekirdeği, RAM'den veri almak için yaklaşık 60-100 nanosaniye bekler. Aynı sürede yüzlerce komut yürütebilirdi. Bu bekleme, modern bilgisayarların en büyük darboğazıdır.\n\nCache, bu boşluğu doldurmak için var. Sık kullanılan veriyi çekirdeğe yakın tutar:\n\n**L1** — 32-64 KB, ~4 çevrim gecikme. Çekirdeğin hemen yanında.\n**L2** — 512 KB - 2 MB, ~14 çevrim. Çekirdeğe özel.\n**L3** — 32-500 MB, ~50 çevrim. Çekirdekler arası paylaşımlı.\n\nKüçüldükçe hızlanır, büyüdükçe yavaşlar. Bu kaçınılmaz bir denge."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "3D V-Cache neden oyunlarda fark yaratıyor?",
        "body": "Ryzen 7 9800X3D'nin 96 MB L3'ü var — normalin üç katı. Oyunlar genellikle nispeten küçük ama sürekli erişilen bir veri kümesiyle çalışır (harita, fizik durumu, oyuncu verileri).\n\nBu küme 96 MB'a sığdığında CPU artık RAM'e gitmek zorunda kalmaz. 100 nanosaniyelik bekleme, 15 nanosaniyeye düşer. Kazanç frekanstan değil, **beklememekten** gelir.\n\nAynı chip render veya derleme gibi büyük veri kümeleriyle çalışan işlerde belirgin avantaj sağlamaz — çünkü o veri hiçbir cache'e sığmaz."
      }
    ],
    "keyTerms": [
      "Çekirdek",
      "Thread",
      "SMT",
      "P-core / E-core",
      "L1/L2/L3 Cache",
      "3D V-Cache"
    ],
    "quiz": [
      {
        "q": "SMT (Hyper-Threading) tipik olarak ne kadar performans artışı sağlar?",
        "options": [
          "İki kat",
          "%20-30",
          "%5'ten az",
          "Dört kat"
        ],
        "answer": 1,
        "explanation": "İkinci iş parçacığı sadece boşta kalan yürütme birimlerini doldurur. Tipik kazanç %20-30'dur, iki kat değil."
      },
      {
        "q": "9800X3D'nin oyunlardaki avantajı nereden gelir?",
        "options": [
          "Daha yüksek saat hızından",
          "Daha fazla çekirdekten",
          "Büyük L3 cache sayesinde RAM'e gitme ihtiyacının azalmasından",
          "Daha yeni süreç düğümünden"
        ],
        "answer": 2,
        "explanation": "96 MB L3, oyunların çalışma kümesini chip üzerinde tutar. RAM'e gitme sayısı düştüğü için bekleme süresi dramatik şekilde azalır."
      },
      {
        "q": "E-core'ların varlık sebebi nedir?",
        "options": [
          "Daha yüksek saat hızına çıkabilmeleri",
          "Aynı alan ve güç bütçesinde daha fazla paralel iş yapabilmeleri",
          "Sadece grafik işlerini yürütmeleri",
          "Daha büyük cache'e sahip olmaları"
        ],
        "answer": 1,
        "explanation": "Bir P-core'un yerine dört E-core sığabilir. Paralelleşebilen iş yüklerinde bu, aynı alandan çok daha fazla toplam verim demektir."
      }
    ],
    "relatedChips": [
      "amd-zen5-ryzen-7-9800x3d",
      "intel-panther-lake-x9-388h",
      "amd-epyc-turin-9965"
    ]
  },
  {
    "id": "gpu-neden-farkli",
    "order": 8,
    "track": "mimari",
    "level": "Orta",
    "duration": "10 dk",
    "title": "GPU neden bu kadar farklı?",
    "subtitle": "16 profesör mü, 16.000 öğrenci mi?",
    "summary": "CPU ile GPU arasındaki felsefe farkını, SIMT modelini ve Tensor Core'ların ne yaptığını öğren.",
    "sections": [
      {
        "type": "analogy",
        "title": "Profesörler ve öğrenciler",
        "body": "Bir CPU, 16 profesörden oluşan bir ekiptir. Her biri çok karmaşık, birbirinden farklı problemleri hızlıca çözebilir. Ama sayıları az.\n\nBir GPU ise 16.000 lise öğrencisidir. Hiçbiri karmaşık bir problemi tek başına çözemez ama hepsine aynı anda aynı basit işlemi verirsen, işi profesörlerden kat kat hızlı bitirirler.\n\nSoru şu: elinde ne tür bir problem var? Bir tane çok zor problem mi, yoksa on binlerce basit ve birbirinin aynı problem mi?"
      },
      {
        "type": "diagram",
        "variant": "cpu-vs-gpu",
        "caption": "Die alanının dağılımı: CPU kontrole, GPU hesaba yatırım yapar"
      },
      {
        "type": "text",
        "title": "Alan nereye harcanıyor?",
        "body": "Bir CPU çekirdeğinin die alanının büyük kısmı **hesap yapmayan** bloklara gider: dallanma tahmincisi, out-of-order zamanlayıcı, büyük cache'ler, önceden getirme mantığı. Bunların hepsi tek bir komut akışını mümkün olduğunca hızlandırmak için.\n\nBir GPU'da bu blokların çoğu ya yok ya çok basit. Onun yerine alan doğrudan ALU'lara ayrılmış. RTX 5090'da 21.760 CUDA core var — her biri çok basit ama sayıları devasa."
      },
      {
        "type": "text",
        "title": "SIMT: aynı komut, farklı veri",
        "body": "GPU'lar **SIMT** (Single Instruction, Multiple Threads) modeliyle çalışır. Çekirdekler 32'lik gruplar halinde (NVIDIA'da *warp*, AMD'de *wavefront*) yönetilir ve grup içindeki tüm çekirdekler aynı komutu, farklı veriler üzerinde yürütür.\n\nBu, kontrol mantığından muazzam tasarruf sağlar: 32 çekirdek için tek bir komut çözücü yeterlidir.\n\nAma bir bedeli var. Grup içindeki thread'ler farklı dallara giderse (bazıları `if`, bazıları `else`), GPU her iki yolu da sırayla çalıştırmak zorunda kalır. Buna **divergence** denir ve GPU kodunun en büyük performans tuzağıdır."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Gecikmeyi gizleme",
        "body": "CPU, bellek gecikmesiyle cache kullanarak savaşır. GPU ise farklı bir yol izler: bir warp bellek beklerken, o anda başka bir warp'ı çalıştırmaya geçer.\n\nBu yüzden GPU'ların gecikmesi yüksek ama bant genişliği devasadır — ve bu yüzden GDDR/HBM belleklerin yüksek gecikmesi GPU için sorun değildir. Yeterince paralel iş varsa bekleme hiç hissedilmez."
      },
      {
        "type": "text",
        "title": "Tensor Core: matris çarpımı için özel donanım",
        "body": "Sinir ağlarının işinin neredeyse tamamı matris çarpımıdır. Bu o kadar baskın bir desen ki, NVIDIA 2017'de (Volta) bunun için özel birimler ekledi: **Tensor Core**.\n\nBir Tensor Core, tek bir işlemde küçük bir matris çarpımı yapar — genel amaçlı CUDA core'lardan onlarca kat verimli. Karşılığında sadece bu işi yapabilir.\n\nAMD'de bunun karşılığı **Matrix Core**, Apple'da **Neural Accelerator**, Intel'de **XMX** birimleridir. İsimler farklı, fikir aynı."
      },
      {
        "type": "table",
        "title": "Aynı fikrin farklı isimleri",
        "headers": [
          "Kavram",
          "NVIDIA",
          "AMD",
          "Intel",
          "Apple"
        ],
        "rows": [
          [
            "Temel hesap birimi",
            "CUDA Core",
            "Stream Processor",
            "Xe Vector Engine",
            "GPU Core"
          ],
          [
            "Grup birimi",
            "SM (Warp: 32)",
            "CU (Wavefront: 32/64)",
            "Xe Core",
            "GPU Core"
          ],
          [
            "Matris hızlandırıcı",
            "Tensor Core",
            "Matrix Core",
            "XMX",
            "Neural Accelerator"
          ],
          [
            "Işın izleme",
            "RT Core",
            "Ray Accelerator",
            "RTU",
            "Ray Tracing Accelerator"
          ],
          [
            "Yeniden ölçekleme",
            "DLSS",
            "FSR",
            "XeSS",
            "MetalFX"
          ]
        ]
      },
      {
        "type": "callout",
        "tone": "warn",
        "title": "GPU her işte hızlı değildir",
        "body": "Sıralı bağımlılığı olan, dallanma yoğun veya küçük veri kümeli işlerde GPU CPU'dan yavaştır. Veriyi CPU belleğinden GPU belleğine kopyalamanın maliyeti bile bazen kazancı yer.\n\nGPU'nun parladığı yer: aynı işlemin binlerce bağımsız veri üzerinde tekrarlandığı durumlar. Grafik render, matris çarpımı, fizik simülasyonu, kriptografi."
      }
    ],
    "keyTerms": [
      "SIMT",
      "Warp / Wavefront",
      "Divergence",
      "CUDA Core",
      "Tensor Core",
      "Gecikme gizleme"
    ],
    "quiz": [
      {
        "q": "GPU'lar bellek gecikmesiyle nasıl başa çıkar?",
        "options": [
          "Çok büyük cache'ler kullanarak",
          "Bir grup beklerken başka bir grubu çalıştırarak",
          "Belleği tamamen kullanmayarak",
          "Saat hızını düşürerek"
        ],
        "answer": 1,
        "explanation": "GPU'lar gecikmeyi cache ile değil, iş değiştirerek gizler. Bir warp bellek beklerken başka bir warp yürütülür."
      },
      {
        "q": "SIMT modelinde 'divergence' nedir?",
        "options": [
          "Belleğin bozulması",
          "Aynı gruptaki thread'lerin farklı dallara gitmesi ve her yolun ayrı çalıştırılması",
          "GPU'nun aşırı ısınması",
          "İki GPU arasındaki bağlantı kopması"
        ],
        "answer": 1,
        "explanation": "Bir warp içindeki thread'ler farklı if/else dallarına giderse GPU her iki yolu da sırayla yürütmek zorunda kalır — bu ciddi performans kaybıdır."
      },
      {
        "q": "Tensor Core'ların temel işlevi nedir?",
        "options": [
          "Işın izleme hesapları",
          "Video kodlama",
          "Matris çarpımını çok verimli yapmak",
          "Bellek yönetimi"
        ],
        "answer": 2,
        "explanation": "Tensor Core'lar matris çarpımı için özelleşmiş birimlerdir. Sinir ağı işinin neredeyse tamamı matris çarpımı olduğu için AI'da belirleyicidirler."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-b200",
      "amd-cdna4-instinct-mi355x",
      "intel-battlemage-arc-b580"
    ]
  },
  {
    "id": "bellek-hiyerarsisi",
    "order": 9,
    "track": "bellek",
    "level": "Orta",
    "duration": "9 dk",
    "title": "Bellek hiyerarşisi: hız mı, kapasite mi?",
    "subtitle": "Register'dan SSD'ye uzanan piramit",
    "summary": "Neden tek tip bellek kullanmadığımızı, bellek duvarını ve gecikme ile bant genişliği arasındaki farkı öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Neden bilgisayarda tek tip bellek yok? Cevap basit: **hızlı bellek pahalı ve küçük, ucuz bellek yavaş ve büyük.** Bu ikisini aynı anda elde etmenin bir yolu yok, o yüzden katmanlı bir sistem kurulur.\n\nHer katman, altındaki katmanın yavaşlığını gizlemeye çalışır."
      },
      {
        "type": "diagram",
        "variant": "memory-hierarchy",
        "caption": "Bellek piramidi: yukarı çıktıkça hızlanır ve küçülür"
      },
      {
        "type": "table",
        "title": "Katmanların büyüklük düzeyi",
        "headers": [
          "Katman",
          "Tipik boyut",
          "Gecikme",
          "İnsan ölçeğinde"
        ],
        "rows": [
          [
            "Register",
            "Birkaç KB",
            "< 1 çevrim",
            "Elindeki kalem"
          ],
          [
            "L1 Cache",
            "32-64 KB",
            "~4 çevrim",
            "Masanın üstü"
          ],
          [
            "L2 Cache",
            "0.5-2 MB",
            "~14 çevrim",
            "Çekmece"
          ],
          [
            "L3 Cache",
            "32-500 MB",
            "~50 çevrim",
            "Odadaki kitaplık"
          ],
          [
            "RAM",
            "8-128 GB",
            "~200+ çevrim",
            "Şehirdeki kütüphane"
          ],
          [
            "SSD",
            "0.5-8 TB",
            "~100.000+ çevrim",
            "Başka şehirdeki arşiv"
          ]
        ]
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Bellek duvarı",
        "body": "1980'den bugüne işlemci hızı yaklaşık 1000 kat arttı. Bellek gecikmesi ise sadece 10 kat iyileşti. Aradaki bu makas **bellek duvarı** olarak bilinir.\n\nBugün bir CPU çekirdeği, RAM'den veri beklerken yüzlerce komut yürütebilirdi. Modern chip tasarımının büyük kısmı, bu beklemeyi gizlemekle uğraşır: daha büyük cache, daha akıllı önceden getirme, out-of-order yürütme, SMT, GPU'da warp değiştirme."
      },
      {
        "type": "text",
        "title": "Gecikme ve bant genişliği aynı şey değil",
        "body": "Bu iki kavram sürekli karıştırılır ama bambaşka şeylerdir.\n\n**Gecikme (latency)**, bir isteğin cevabının ne kadar sürede geldiğidir. Nanosaniye ile ölçülür.\n\n**Bant genişliği (bandwidth)**, birim zamanda ne kadar veri taşındığıdır. GB/s ile ölçülür.\n\nBenzetme: İstanbul'dan Ankara'ya veri göndermek. Fiber hat düşük gecikme sunar (milisaniyeler) ama sınırlı bant genişliği. Bir kamyon dolusu sabit disk göndermek ise korkunç gecikme (saatler) ama devasa bant genişliği verir.\n\nHBM3E'nin 8 TB/s bant genişliği vardır ama gecikmesi DDR5'ten daha kötüdür. GPU için bu sorun değil — çünkü GPU gecikmeyi paralellikle gizler."
      },
      {
        "type": "callout",
        "tone": "info",
        "title": "Neden AI için bellek her şeydir",
        "body": "Bir dil modelinin çıkarımında her token üretimi için modelin tüm ağırlıklarının bellekten okunması gerekir. 70 milyar parametreli bir model FP16'da 140 GB yer kaplar.\n\nYani hız, hesap gücüyle değil, **saniyede kaç kez 140 GB okuyabildiğinle** sınırlıdır. B300'ün 288 GB'a çıkması ve HBM4'ün 2 TB/s'ye ulaşması tam olarak bu yüzden."
      }
    ],
    "keyTerms": [
      "Bellek hiyerarşisi",
      "Cache",
      "Bellek duvarı",
      "Gecikme",
      "Bant genişliği",
      "Önceden getirme"
    ],
    "quiz": [
      {
        "q": "Neden tek tip bellek kullanmıyoruz?",
        "options": [
          "Standart olmadığı için",
          "Hızlı bellek pahalı ve küçük, ucuz bellek yavaş ve büyük olduğu için",
          "İşletim sistemleri desteklemediği için",
          "Güç tüketimi çok yüksek olacağı için"
        ],
        "answer": 1,
        "explanation": "Hız, kapasite ve maliyet aynı anda optimize edilemez. Katmanlı hiyerarşi bu üçü arasında pratik bir denge kurar."
      },
      {
        "q": "'Bellek duvarı' neyi ifade eder?",
        "options": [
          "RAM'in fiziksel kapasite sınırını",
          "İşlemci hızının bellek hızından çok daha hızlı artmış olmasını",
          "Belleğin ısınma sorununu",
          "Anakart üzerindeki slot sayısını"
        ],
        "answer": 1,
        "explanation": "İşlemci hızı ~1000 kat, bellek gecikmesi ~10 kat iyileşti. Bu makas, modern chip tasarımının en büyük mücadele alanı."
      },
      {
        "q": "HBM3E'nin gecikmesi DDR5'ten yüksek olmasına rağmen GPU'lar için neden uygundur?",
        "options": [
          "Daha ucuz olduğu için",
          "GPU'lar gecikmeyi paralel iş değiştirerek gizlediği için",
          "GPU'lar belleği nadiren kullandığı için",
          "Gecikme GPU'da hiç önemli olmadığı için"
        ],
        "answer": 1,
        "explanation": "GPU bir grup bellek beklerken başka bir grubu çalıştırır. Yeterli paralellik varsa gecikme hissedilmez; belirleyici olan bant genişliğidir."
      }
    ],
    "relatedChips": [
      "ram-hbm3e",
      "ram-ddr5",
      "amd-zen5-ryzen-7-9800x3d"
    ]
  },
  {
    "id": "ram-aileleri",
    "order": 10,
    "track": "bellek",
    "level": "Orta",
    "duration": "9 dk",
    "title": "DDR, LPDDR, GDDR, HBM: hangisi nerede?",
    "subtitle": "Dört aile, dört farklı öncelik",
    "summary": "Bellek ailelerinin neden farklılaştığını ve her birinin hangi ödünleşimi seçtiğini öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Hepsi DRAM. Hepsi veriyi kapasitörlerde saklıyor ve sürekli tazelenmesi gerekiyor. Fark, **hangi şeyin optimize edildiğinde**.\n\nBir bellek tasarlarken şunlar arasında seçim yapmak zorundasın: gecikme, bant genişliği, güç tüketimi, kapasite, maliyet, fiziksel boyut. Hepsini birden alamazsın."
      },
      {
        "type": "table",
        "title": "Dört aile, dört öncelik",
        "headers": [
          "Aile",
          "Öncelik",
          "Nerede kullanılır",
          "Tipik bant genişliği"
        ],
        "rows": [
          [
            "DDR5",
            "Kapasite ve maliyet dengesi",
            "Masaüstü, sunucu",
            "~50-90 GB/s (çift kanal)"
          ],
          [
            "LPDDR5X",
            "Güç verimliliği",
            "Dizüstü, telefon, SoC",
            "~120-230 GB/s"
          ],
          [
            "GDDR7",
            "Yüksek pin hızı",
            "Ekran kartları",
            "~1000-1800 GB/s"
          ],
          [
            "HBM3E / HBM4",
            "Maksimum bant genişliği",
            "AI hızlandırıcıları",
            "~4800-8000 GB/s"
          ]
        ]
      },
      {
        "type": "text",
        "title": "DDR5: dengeli seçim",
        "body": "Masaüstü ve sunucunun standardı. Takılıp çıkarılabilir DIMM modülleri sayesinde yükseltilebilir ve kapasite esnekliği sunar.\n\nDDR4'ten en önemli farkı kanal yapısı: DDR4'te modül başına tek 64-bit kanal varken, DDR5'te iki adet 32-bit kanal var. Aynı frekansta bile daha iyi paralellik demek bu.\n\nAyrıca güç yönetimi anakarttan modülün üzerindeki PMIC'e taşındı ve chip içi ECC standart hale geldi."
      },
      {
        "type": "text",
        "title": "LPDDR5X: her miliwatt önemli",
        "body": "'LP' = Low Power. Voltaj düşürüldü, boşta kalma modları agresifleştirildi ve genellikle chip paketinin üzerine lehimlendi.\n\nPaket üstü olmasının iki sonucu var: sinyal yolları kısaldığı için hem gecikme hem güç düşüyor — ama belleği yükseltemiyorsun. Apple M serisi, Snapdragon X2 ve Intel Lunar Lake bu yolu seçiyor.\n\nSnapdragon X2 Elite Extreme'in 228 GB/s bant genişliği, LPDDR5X'in artık sadece 'düşük güçlü' değil aynı zamanda hızlı olduğunu gösteriyor."
      },
      {
        "type": "text",
        "title": "GDDR7: pin hızı yarışı",
        "body": "GPU'lar gecikmeye duyarsız ama bant genişliğine aç. GDDR bu yüzden pin başına hızı maksimize eder ve gecikmeyi umursamaz.\n\nGDDR7'nin kilit yeniliği **PAM3** modülasyonu: her sinyal seviyesinde üç farklı voltaj kullanarak çevrim başına daha fazla bilgi taşır. GDDR6'nın NRZ'si (iki seviye) ile karşılaştırıldığında aynı frekansta belirgin şekilde daha fazla veri geçer.\n\nGDDR6X ise NVIDIA'ya özel bir ara çözümdü: PAM4 (dört seviye) kullanıyordu ama sinyal gürültüsü ve ısı sorunları yaşattı. PAM3, ikisi arasında daha dengeli bir nokta."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "HBM: yatay değil dikey",
        "body": "Diğer üç aile bant genişliğini pin hızını artırarak kazanır. HBM ise bambaşka bir yol izler: **arayüzü genişletir**.\n\nBir GDDR7 chip'i 32-bit arayüze sahiptir. Bir HBM3E yığını 1024-bit, HBM4 ise 2048-bit. Bunun için DRAM die'ları üst üste istiflenir ve TSV'lerle dikey olarak bağlanır, sonra tüm yığın bir silikon interposer üzerinden GPU'ya bağlanır.\n\nSonuç: düşük frekansta bile devasa bant genişliği ve bit başına çok daha düşük güç. Bedeli ise maliyet — HBM üretimi ve paketlemesi son derece pahalı, o yüzden sadece veri merkezi ürünlerinde görülüyor."
      },
      {
        "type": "diagram",
        "variant": "memory-families",
        "caption": "Arayüz genişliği ve pin hızı arasındaki ödünleşim"
      }
    ],
    "keyTerms": [
      "DDR5",
      "LPDDR5X",
      "GDDR7",
      "HBM",
      "PAM3",
      "TSV",
      "Interposer",
      "Kanal"
    ],
    "quiz": [
      {
        "q": "HBM'in yüksek bant genişliği esas olarak nereden gelir?",
        "options": [
          "Çok yüksek pin hızından",
          "Çok geniş arayüzden (1024-2048 bit)",
          "Daha iyi soğutmadan",
          "Daha küçük süreç düğümünden"
        ],
        "answer": 1,
        "explanation": "HBM pin hızını değil arayüz genişliğini artırır. Dikey istifleme ve TSV'ler sayesinde 1024-2048 bitlik arayüzler mümkün olur."
      },
      {
        "q": "LPDDR5X'in dizüstülerde paket üstüne lehimlenmesinin dezavantajı nedir?",
        "options": [
          "Daha yüksek gecikme",
          "Daha yüksek güç tüketimi",
          "Belleğin yükseltilememesi",
          "Daha düşük bant genişliği"
        ],
        "answer": 2,
        "explanation": "Paket üstü yerleşim gecikmeyi ve gücü düşürür ama modül takılıp çıkarılamadığı için bellek yükseltilemez."
      },
      {
        "q": "GDDR7'nin GDDR6'ya göre temel sinyalleşme farkı nedir?",
        "options": [
          "NRZ yerine PAM3 kullanması",
          "Daha düşük voltajda çalışması",
          "Dikey istiflenmesi",
          "ECC desteği eklemesi"
        ],
        "answer": 0,
        "explanation": "GDDR7, üç seviyeli PAM3 modülasyonu kullanır. Bu sayede aynı frekansta çevrim başına daha fazla bilgi taşınır."
      }
    ],
    "relatedChips": [
      "ram-gddr7",
      "ram-hbm4",
      "ram-lpddr5x",
      "ram-ddr5"
    ]
  },
  {
    "id": "chiplet-ve-paketleme",
    "order": 11,
    "track": "uretim",
    "level": "İleri",
    "duration": "10 dk",
    "title": "Chiplet: tek die devri kapandı",
    "subtitle": "Neden herkes chip'leri parçalara ayırıyor?",
    "summary": "Chiplet mantığını, verim ekonomisini ve 2.5D/3D paketleme tekniklerini öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Yıllarca bir chip'in tek bir silikon parçası olması gerektiği düşünülürdü. Bugün AMD'nin EPYC'i 13 die'dan, NVIDIA'nın B300'ü 2 die'dan, AMD'nin MI355X'i 10 die'dan oluşuyor. Apple bile M5 nesliyle bu yola girdi.\n\nSebep temel olarak ekonomik."
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Verim matematiği",
        "body": "Diyelim ki wafer'da cm² başına belli bir kusur yoğunluğu var.\n\n**Tek büyük die** (800 mm²): kusurların çoğu bir die'ı öldürür, verim düşük olur. Her kayıp, 800 mm²'lik silikonun çöpe gitmesi demek.\n\n**Sekiz küçük die** (100 mm² her biri): aynı kusur sadece bir küçük die'ı öldürür. Kalan yedisi kullanılabilir. Ayrıca kusurlu die'lar daha alt ürünlerde değerlendirilebilir.\n\nDie alanı büyüdükçe verim doğrusal değil, üstel olarak düşer. Chiplet bu eğriden kaçmanın yoludur."
      },
      {
        "type": "text",
        "title": "İkinci fayda: süreç karışımı",
        "body": "Bir chip'in her parçası aynı ölçüde küçültmeden fayda görmez.\n\nHesap çekirdekleri en pahalı ve en yeni süreçte üretilmeye değer. Ama bellek denetleyicileri, PCIe arayüzleri, USB kontrolcüleri analog devrelerdir — bunlar zaten iyi küçülmez ve yeni süreçte üretmek para israfıdır.\n\nBu yüzden AMD, Ryzen'de çekirdek die'ını (CCD) TSMC N4P'de, I/O die'ını (IOD) daha ucuz N6'da üretir. Intel Panther Lake'te hesap tile'ı kendi 18A sürecinde, GPU tile'ı TSMC N3E'de üretiliyor. Her blok kendi için en mantıklı düğümde."
      },
      {
        "type": "diagram",
        "variant": "chiplet-package",
        "caption": "2.5D ve 3D paketleme: yan yana ve üst üste die'lar"
      },
      {
        "type": "list",
        "title": "Paketleme teknikleri",
        "items": [
          "**2.5D (interposer)** — die'lar yan yana, altlarındaki silikon interposer üzerinden bağlanır. HBM'i GPU'ya bağlamanın standart yolu. TSMC CoWoS bunun en yaygın örneği.",
          "**3D istifleme** — die'lar doğrudan üst üste, TSV'lerle bağlanır. AMD'nin 3D V-Cache'i ve HBM yığınları böyle çalışır.",
          "**Foveros** — Intel'in aktif taban die kullanan yaklaşımı; taban die sadece bağlantı değil, mantık da içerir.",
          "**Hibrit bonding** — bakır-bakır doğrudan temas; mikro lehim topu bile yok. Bağlantı yoğunluğunu kat kat artırır."
        ]
      },
      {
        "type": "callout",
        "tone": "warn",
        "title": "Bedava değil",
        "body": "Chiplet'in bedeli **die'lar arası iletişim**. Aynı silikon içinde veri taşımak neredeyse bedavayken, iki die arasında taşımak hem gecikme hem güç maliyeti yaratır.\n\nRyzen'de bir çekirdeğin başka bir CCD'deki çekirdeğe erişimi, aynı CCD içindekine göre belirgin şekilde yavaştır — oyun performansında zaman zaman görülen tuhaflıkların kaynağı budur.\n\nNVIDIA B300'de bu sorun NV-HBI ile 10 TB/s'lik bağlantı kurularak çözüldü; öyle ki yazılım iki die'ı tek GPU olarak görüyor. Ama bu bağlantının kendisi ciddi bir mühendislik ve güç maliyeti."
      },
      {
        "type": "text",
        "title": "3D V-Cache: yönün önemi",
        "body": "AMD'nin 3D V-Cache'i, chiplet fikrinin dikey versiyonu. İlk nesilde (5800X3D, 7800X3D) cache katmanı hesap die'ının **üstüne** konuyordu. Bu, çekirdeklerin soğutucuyla arasına bir katman girmesi demekti — sıcaklık yönetimi zorlaştı, saat hızları ve overclock kısıtlandı.\n\nİkinci nesilde (9800X3D) cache **altına** taşındı. Çekirdekler artık doğrudan soğutucuya bakıyor. Aynı transistörler, aynı cache boyutu — sadece sıralama değişti ve sonuç, tam overclock desteği ve daha yüksek saat hızları oldu.\n\nBu, modern chip tasarımında fiziksel yerleşimin mimari kadar önemli olduğunun güzel bir örneği."
      }
    ],
    "keyTerms": [
      "Chiplet",
      "CCD / IOD",
      "2.5D",
      "3D istifleme",
      "Interposer",
      "CoWoS",
      "Foveros",
      "Hibrit bonding"
    ],
    "quiz": [
      {
        "q": "Chiplet yaklaşımının temel ekonomik gerekçesi nedir?",
        "options": [
          "Daha az güç harcaması",
          "Küçük die'ların veriminin büyük die'lardan çok daha yüksek olması",
          "Daha kolay soğutulması",
          "Daha az transistör kullanması"
        ],
        "answer": 1,
        "explanation": "Die alanı büyüdükçe verim üstel olarak düşer. Chip'i küçük parçalara bölmek, kusur kaynaklı kayıpları dramatik şekilde azaltır."
      },
      {
        "q": "AMD neden I/O die'ını daha eski bir süreçte üretir?",
        "options": [
          "Daha hızlı olduğu için",
          "Analog devreler küçültmeden pek fayda görmediği için ve daha ucuz olduğu için",
          "Yeni süreçlerde üretilemediği için",
          "Daha az ısındığı için"
        ],
        "answer": 1,
        "explanation": "Bellek denetleyicisi ve PCIe gibi analog bloklar iyi küçülmez. Onları pahalı yeni süreçte üretmek para israfı olur."
      },
      {
        "q": "2. nesil 3D V-Cache'te ne değişti?",
        "options": [
          "Cache boyutu iki katına çıktı",
          "Cache katmanı hesap die'ının üstünden altına taşındı",
          "Cache DDR5'e taşındı",
          "TSV'ler kaldırıldı"
        ],
        "answer": 1,
        "explanation": "Cache altına taşındı, böylece çekirdekler doğrudan soğutucuya bakar hale geldi. Bu, tam overclock desteği ve daha yüksek saat hızlarını mümkün kıldı."
      }
    ],
    "relatedChips": [
      "amd-zen5-ryzen-7-9800x3d",
      "amd-cdna4-instinct-mi355x",
      "intel-panther-lake-x9-388h"
    ]
  },
  {
    "id": "guc-isi-saat",
    "order": 12,
    "track": "mimari",
    "level": "İleri",
    "duration": "9 dk",
    "title": "Güç, ısı ve saat hızı",
    "subtitle": "TDP gerçekte ne anlatır, ne anlatmaz?",
    "summary": "Voltaj-frekans eğrisini, neden son 200 MHz'in çok pahalı olduğunu ve TDP'nin sınırlarını öğren.",
    "sections": [
      {
        "type": "text",
        "title": "Güç nereden geliyor?",
        "body": "Bir chip'in dinamik güç tüketimi kabaca şuna orantılıdır:\n\n**Güç ≈ Kapasitans × Voltaj² × Frekans**\n\nDikkat edilecek nokta: voltaj **karesi** ile giriyor. Frekans ise doğrusal.\n\nAma bir sorun var: daha yüksek frekansta kararlı çalışmak için daha yüksek voltaj gerekir. Yani frekansı artırdığında voltajı da artırmak zorundasın — ve güç, kabaca frekansın küpüyle artmaya başlar."
      },
      {
        "type": "diagram",
        "variant": "power-curve",
        "caption": "Voltaj-frekans eğrisi: son birkaç yüz MHz orantısız pahalıdır"
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "Neden son %5 performans %40 güç ister?",
        "body": "Bir chip'i tepe frekansının %90'ında çalıştırdığında, gücün belki yarısını harcarsın. Son %10'luk frekans artışı için voltajı yükseltmek zorunda kalırsın ve güç neredeyse iki katına çıkar.\n\nBu yüzden dizüstü ve sunucu chip'leri tepe frekanstan uzakta çalıştırılır. Ve bu yüzden 'undervolting' (voltajı düşürme) genelde çok az performans kaybıyla ciddi sıcaklık ve güç kazancı sağlar."
      },
      {
        "type": "text",
        "title": "TDP ne değildir",
        "body": "TDP (Thermal Design Power), soğutma çözümünün ne kadar ısı atabilmesi gerektiğini gösteren bir tasarım hedefidir. Yaygın üç yanılgı:\n\n**TDP maksimum güç tüketimi değildir.** Anlık tüketim TDP'yi rahatlıkla aşabilir. Intel'in PL1/PL2, AMD'nin PPT gibi ayrı sınırları vardır.\n\n**Farklı üreticilerin TDP'leri karşılaştırılamaz.** Intel ve AMD bu değeri farklı koşullarda tanımlar.\n\n**TDP performansı göstermez.** 65W'lık bir chip, 105W'lık bir chip'ten hızlı olabilir."
      },
      {
        "type": "text",
        "title": "Isı yoğunluğu sorunu",
        "body": "Toplam watt tek başına yeterli değil — ısının **nereye yoğunlaştığı** da kritik.\n\nModern chip'lerde ısı die yüzeyine eşit dağılmaz. Yürütme birimlerinin bulunduğu küçük bölgeler, cache bölgelerinden çok daha sıcak olur. Bu noktalara *hot spot* denir ve termal kısıtlamayı (throttling) tetikleyen genellikle bunlardır.\n\nChip'ler küçüldükçe aynı gücü daha küçük alandan atmak gerekiyor. B300'ün 1400W'ı, sıvı soğutmayı zorunlu kılıyor — hava ile bu güç yoğunluğunu yönetmek fiziksel olarak mümkün değil."
      },
      {
        "type": "list",
        "title": "Modern chip'lerin güç yönetimi araçları",
        "items": [
          "**DVFS** — iş yüküne göre voltaj ve frekansı milisaniyeler içinde ayarlama.",
          "**Power gating** — kullanılmayan blokları tamamen elektriksel olarak kesme.",
          "**Clock gating** — bloğu açık bırakıp saat sinyalini durdurma; daha hızlı geri dönüş.",
          "**Termal kısıtlama** — sıcaklık eşiği aşıldığında frekansı düşürme.",
          "**Boost algoritmaları** — sıcaklık ve güç bütçesi izin verdiği sürece frekansı yükseltme."
        ]
      },
      {
        "type": "callout",
        "tone": "info",
        "title": "Karanlık silikon",
        "body": "Modern chip'lerde tüm transistörleri aynı anda tam hızda çalıştırmak mümkün değil — güç bütçesi yetmez. Herhangi bir anda die'ın önemli bir kısmı ya kapalı ya da düşük hızda çalışır. Buna **dark silicon** denir.\n\nBu gerçek, chip tasarımını değiştirdi: artık amaç 'her şeyi hızlı yapan tek bir birim' değil, 'her iş için özelleşmiş, sadece gerektiğinde açılan birimler'. NPU'ların, video kodlayıcıların ve Tensor Core'ların çoğalmasının arkasındaki mantık bu."
      }
    ],
    "keyTerms": [
      "TDP",
      "DVFS",
      "Voltaj-frekans eğrisi",
      "Termal kısıtlama",
      "Hot spot",
      "Dark silicon",
      "Power gating"
    ],
    "quiz": [
      {
        "q": "Dinamik güç tüketimi voltajla nasıl ilişkilidir?",
        "options": [
          "Doğrusal",
          "Karesi ile",
          "Küpü ile",
          "İlişkili değil"
        ],
        "answer": 1,
        "explanation": "Güç ≈ Kapasitans × Voltaj² × Frekans. Voltaj karesi ile girdiği için voltajı düşürmek güç tasarrufunda en etkili yöntemdir."
      },
      {
        "q": "TDP ile ilgili hangisi doğrudur?",
        "options": [
          "Chip'in maksimum güç tüketimidir",
          "Soğutma tasarımı için bir hedef değerdir ve anlık tüketim bunu aşabilir",
          "Chip'in performansını gösterir",
          "Farklı üreticiler arasında doğrudan karşılaştırılabilir"
        ],
        "answer": 1,
        "explanation": "TDP bir soğutma tasarım hedefidir. Anlık tüketim onu aşabilir ve üreticiler bu değeri farklı koşullarda tanımladığı için doğrudan karşılaştırılamaz."
      },
      {
        "q": "'Dark silicon' ne anlama gelir?",
        "options": [
          "Kusurlu üretilmiş die bölgeleri",
          "Güç bütçesi yetmediği için herhangi bir anda kapalı kalan die bölgeleri",
          "Işık geçirmeyen paketleme malzemesi",
          "Devre dışı bırakılmış binning blokları"
        ],
        "answer": 1,
        "explanation": "Modern chip'lerde tüm transistörleri aynı anda tam hızda çalıştıracak güç bütçesi yoktur. Die'ın önemli bir kısmı her an kapalı veya düşük hızdadır."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-ultra-b300",
      "intel-lunar-lake-288v"
    ]
  },
  {
    "id": "spec-okuma-rehberi",
    "order": 13,
    "track": "pratik",
    "level": "Pratik",
    "duration": "10 dk",
    "title": "Bir spec sayfası nasıl okunur?",
    "subtitle": "Öğrendiklerini gerçek satın alma kararına dönüştür",
    "summary": "Pazarlama sayısını gerçek bilgiden ayırmayı ve bir chip'i değerlendirirken hangi soruları sorman gerektiğini öğren.",
    "sections": [
      {
        "type": "text",
        "body": "Bir ürün sayfasına baktığında karşına onlarca sayı çıkıyor. Hangileri gerçekten önemli, hangileri gürültü?\n\nCevap, ne yapmak istediğine bağlı. Ama her durumda geçerli birkaç okuma kuralı var."
      },
      {
        "type": "callout",
        "tone": "warn",
        "title": "Kural 1: Aynı ailede olmayan sayıları karşılaştırma",
        "body": "5.2 GHz'lik bir AMD çekirdeği ile 5.1 GHz'lik bir Intel çekirdeği aynı hızda değildir — IPC'leri farklı.\n\n21.760 CUDA core, 16.384 stream processor'dan fazla değildir — bunlar farklı şeyleri sayar.\n\n50 TOPS NPU ile 80 TOPS NPU karşılaştırması bile riskli: hangi hassasiyette (INT8? INT4?) ölçüldüğü belirtilmezse sayı anlamsızdır."
      },
      {
        "type": "steps",
        "title": "Bir GPU değerlendirirken sırayla sor",
        "items": [
          {
            "label": "VRAM kapasitesi yeterli mi?",
            "body": "Bu, en sert sınırdır. Yetmiyorsa hiçbir hesap gücü seni kurtarmaz. 1440p oyun için bugün 12 GB alt sınır, yerel AI için 16 GB pratik minimum."
          },
          {
            "label": "Bellek bant genişliği ne?",
            "body": "Bus genişliği × bellek hızı. Yüksek çözünürlükte ve AI'da belirleyici. 128-bit arayüzlü bir kart 4K'da zorlanır."
          },
          {
            "label": "Hesap birimleri kaç?",
            "body": "CUDA core / stream processor sayısı, ancak aynı mimari içinde anlamlı bir karşılaştırma ölçütüdür."
          },
          {
            "label": "Hangi yeniden ölçekleme teknolojisi?",
            "body": "DLSS 4, FSR 4, XeSS 3 — modern oyunda etkin performansı ham güçten daha çok belirleyebiliyor."
          },
          {
            "label": "Güç ve soğutma bütçen ne?",
            "body": "575W'lık bir kart, güç kaynağını ve kasa hava akışını da yeniden düşünmeni gerektirir."
          }
        ]
      },
      {
        "type": "steps",
        "title": "Bir CPU değerlendirirken sırayla sor",
        "items": [
          {
            "label": "İş yükün paralel mi, sıralı mı?",
            "body": "Oyun ve çoğu günlük iş birkaç çekirdek kullanır — tek çekirdek performansı belirleyicidir. Render, derleme ve simülasyon ise çekirdek sayısını sever."
          },
          {
            "label": "Cache miktarı iş yüküne uygun mu?",
            "body": "Oyun ve simülasyonda büyük L3 dramatik fark yaratır. Render'da neredeyse hiç fark etmez."
          },
          {
            "label": "Platform ne kadar yaşayacak?",
            "body": "Soket ömrü önemli. AM5 uzun süredir destekleniyor; Intel soketleri daha sık değişiyor."
          },
          {
            "label": "Bellek desteği ne?",
            "body": "Kanal sayısı ve desteklenen hız, özellikle entegre GPU kullanacaksan doğrudan performansa yansır."
          },
          {
            "label": "Güç ve gerçek tüketim?",
            "body": "TDP değil, bağımsız testlerdeki gerçek tüketim ve sıcaklık değerlerine bak."
          }
        ]
      },
      {
        "type": "table",
        "title": "Sık görülen pazarlama tuzakları",
        "headers": [
          "İfade",
          "Gerçekte ne demek"
        ],
        "rows": [
          [
            "\"20 PFLOPS AI performansı\"",
            "Muhtemelen FP4 ve seyrek (sparse) — gerçek yoğun performans yarısı olabilir"
          ],
          [
            "\"2 kat daha hızlı\"",
            "Hangi iş yükünde, hangi ayarlarda, neye göre? Genelde en avantajlı senaryo seçilir"
          ],
          [
            "\"En yeni 3nm süreç\"",
            "İsim fiziksel bir ölçü değil; yoğunluk verisi olmadan anlamsız"
          ],
          [
            "\"16 GB'a kadar\"",
            "Test edilen ve satılan model hangisi? Alt modeller 8 GB olabilir"
          ],
          [
            "\"120 TOPS platform AI\"",
            "CPU + GPU + NPU toplamı. NPU'nun tek başına değeri çok daha düşük"
          ]
        ]
      },
      {
        "type": "callout",
        "tone": "key",
        "title": "En güvenilir yöntem",
        "body": "Üretici sayıları yön verir, karar vermez. Gerçek karar için:\n\n**Bağımsız testlere bak** — kendi kullandığın uygulamalarla yapılmış olanlara.\n\n**Kendi darboğazını bul** — sistemi yavaşlatan şey CPU mu, GPU mu, RAM mi, disk mi? En zayıf halkayı güçlendirmek en pahalı bileşeni yükseltmekten genelde daha etkilidir.\n\n**Gerçek kullanımını ölç** — görev yöneticisinde oyun sırasında VRAM ve CPU kullanımına bak. Tahmin etme, ölç."
      },
      {
        "type": "text",
        "title": "Buradan sonrası",
        "body": "Bu noktada bir chip'in spec sayfasındaki her satırın ne anlama geldiğini biliyorsun: süreç düğümünün neden yanıltıcı olduğunu, transistör sayısının neyi anlattığını, cache'in neden önemli olduğunu, bant genişliği ile gecikmenin farkını, TDP'nin sınırlarını.\n\nŞimdi katalogdaki 32 chip'e dönüp bak. Die diyagramlarındaki bölgeleri tanıyacak, karşılaştırma tablosundaki satırların neden farklı olduğunu anlayacaksın."
      }
    ],
    "keyTerms": [
      "Seyrek (sparse) performans",
      "Darboğaz",
      "Tek çekirdek performansı",
      "Etkin performans"
    ],
    "quiz": [
      {
        "q": "Farklı üreticilerin GHz değerlerini doğrudan karşılaştırmak neden yanıltıcıdır?",
        "options": [
          "Ölçüm yöntemleri farklı olduğu için",
          "Mimarilerin IPC'si farklı olduğu için",
          "Saat hızı hiç önemli olmadığı için",
          "Sıcaklığa bağlı değiştiği için"
        ],
        "answer": 1,
        "explanation": "Performans kabaca IPC × frekans ile orantılıdır. Farklı mimarilerin IPC'si farklı olduğu için sadece GHz karşılaştırmak eksik bilgi verir."
      },
      {
        "q": "Bir GPU seçerken en sert sınır genellikle nedir?",
        "options": [
          "Saat hızı",
          "CUDA core sayısı",
          "VRAM kapasitesi",
          "TDP"
        ],
        "answer": 2,
        "explanation": "VRAM yetmiyorsa hiçbir hesap gücü bunu telafi edemez. Kapasite aşıldığında performans kademeli değil, ani şekilde çöker."
      },
      {
        "q": "\"20 PFLOPS AI performansı\" ifadesinde dikkat edilmesi gereken nedir?",
        "options": [
          "Hangi hassasiyet (FP4/FP8) ve seyrek mi yoğun mu olduğu",
          "Chip'in rengi",
          "Üretim yılı",
          "Soket tipi"
        ],
        "answer": 0,
        "explanation": "AI performans sayıları genellikle en düşük hassasiyette ve seyrek (sparse) koşullarda verilir. Yoğun (dense) FP16 değeri çok daha düşük olabilir."
      }
    ],
    "relatedChips": [
      "nvidia-blackwell-rtx-5080",
      "amd-zen5-ryzen-7-9800x3d",
      "ram-ddr5"
    ]
  }
];

export function getLessonById(id) { return lessons.find((l) => l.id === id); }
