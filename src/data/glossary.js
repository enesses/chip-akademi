export const glossary = [
  { term: "ALU", def: "Aritmetik Mantık Birimi. Toplama, çıkarma ve mantık işlemlerini yapan temel hesap devresi." },
  { term: "ASML", def: "EUV litografi makinelerini üreten tek şirket. Modern çip üretiminin kilit tedarikçisi." },
  { term: "Bant genişliği", def: "Bellek ile hesap birimi arasında saniyede taşınabilen veri miktarı, GB/s cinsinden." },
  { term: "Bellek duvarı", def: "İşlemci hızının bellek hızından çok daha fazla artması sonucu oluşan performans darboğazı." },
  { term: "Bellek hiyerarşisi", def: "L1'den RAM'e kadar, hıza göre katmanlı bellek yapısı. Hızlı katman küçük, yavaş katman büyüktür." },
  { term: "Binning", def: "Aynı die'dan üretilen çiplerin test sonuçlarına göre farklı modeller olarak ayrılması." },
  { term: "Cache", def: "İşlemciye yakın, hızlı erişilen küçük bellek. RAM'e gitme ihtiyacını azaltır." },
  { term: "Chiplet", def: "Tek büyük die yerine birden fazla küçük die'ın paket içinde birleştirilmesi." },
  { term: "CoWoS", def: "TSMC'nin gelişmiş paketleme teknolojisi. HBM'i hesap die'ına bağlamak için kullanılır." },
  { term: "CUDA Core", def: "NVIDIA GPU'larındaki paralel hesap birimi. Sayısı arttıkça paralel işlem gücü artar." },
  { term: "Die", def: "Wafer'dan kesilmiş, paketlenmemiş çıplak silikon parçası." },
  { term: "EUV", def: "Aşırı morötesi litografi. 13.5nm dalga boyuyla en küçük transistör hatlarını çizer." },
  { term: "FinFET", def: "Kanalın üç yüzünden sarıldığı transistör mimarisi. GAA öncesi standart tasarımdı." },
  { term: "GAA", def: "Gate-All-Around. Kapının kanalı dört yüzden sardığı yeni nesil transistör mimarisi." },
  { term: "HBM", def: "High Bandwidth Memory. Dikey istiflenmiş, çok geniş veri yollu bellek. AI çiplerinde standart." },
  { term: "IPC", def: "Çevrim başına komut sayısı. İşlemci mimarisinin verimliliğini gösterir, frekanstan bağımsız." },
  { term: "Litografi", def: "Işıkla silikon üzerine devre desenlerinin kazınması işlemi." },
  { term: "Node (süreç düğümü)", def: "Üretim teknolojisinin adı (ör. 3nm). Artık gerçek boyutu değil, nesil numarasını ifade eder." },
  { term: "NPU", def: "Neural Processing Unit. Yapay zeka çıkarımı için özelleşmiş, düşük güçlü hesap birimi." },
  { term: "Out-of-order execution", def: "Komutların program sırası yerine hazır oldukları sırada çalıştırılması." },
  { term: "Pipeline", def: "Bir komutun işlenmesini aşamalara bölerek aynı anda birden fazla komutu paralel işleme yöntemi." },
  { term: "SIMT", def: "Single Instruction Multiple Threads. GPU'ların binlerce thread'i aynı komutla paralel çalıştırma modeli." },
  { term: "SRAM", def: "Statik RAM. Tazeleme gerektirmez, çok hızlıdır ama DRAM'e göre çok az yoğunluktadır." },
  { term: "Tensor Core", def: "Matris çarpımına özelleşmiş birim. Yapay zeka modellerinin hesabını hızlandırır." },
  { term: "Transistör", def: "Elektrik akımını açıp kapatan mikroskobik anahtar. Modern çiplerin temel yapı taşı." },
  { term: "TDP", def: "Thermal Design Power. Soğutma sisteminin tasarlandığı hedef güç tüketimi, watt cinsinden." },
  { term: "Wafer", def: "Üzerine yüzlerce chip kazınan, dairesel silikon levha." },
  { term: "Yarı iletken", def: "Elektriği bazen ileten bazen iletmeyen, katkılama ile kontrol edilebilen malzeme." },
  { term: "Yoğunluk (transistör)", def: "Birim alana düşen transistör sayısı, milyon/mm² cinsinden." },
  { term: "3D V-Cache", def: "AMD'nin cache'i dikey olarak çekirdeğin üzerine istiflediği teknoloji." },
  { term: "Chiplet paketleme", def: "Farklı die'ların (CCD, IOD gibi) tek paket içinde birbirine bağlanması." },
];
export function searchGlossary(q) {
  const query = (q || "").toLocaleLowerCase("tr");
  if (!query) return glossary;
  return glossary.filter((g) => g.term.toLocaleLowerCase("tr").includes(query) || g.def.toLocaleLowerCase("tr").includes(query));
}
