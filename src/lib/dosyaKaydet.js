/**
 * Kullanıcıya üretilmiş bir dosya ver (notları .md, profili .json olarak).
 *
 * Uygulama üç ortamda açılıyor:
 *   - claude.ai yayını: sayfa kilitli bir çerçevede çalışır, <a download>
 *     sessizce hiçbir şey yapmaz. Dosya, `downloads` yeteneğiyle verilir;
 *     izleyici bir onay penceresi görür ve isterse reddedebilir.
 *   - Diskten açılan tek dosya (file://) ve GitHub Pages: window.claude yok;
 *     klasik indirme bağlantısı çalışır.
 *
 * Dönüş: { durum: "kaydedildi" | "iptal" | "hata", mesaj? }
 */
export async function dosyaKaydet(dosyaAdi, icerik, mime) {
  const claude = typeof window !== "undefined" ? window.claude : undefined;

  if (claude && typeof claude.use === "function") {
    let indirme = null;
    try {
      indirme = await claude.use("downloads");
    } catch {
      indirme = null;
    }
    if (!indirme) {
      return { durum: "hata", mesaj: "Bu görünümde dosya kaydedilemiyor." };
    }
    try {
      await indirme.save({ filename: dosyaAdi, data: icerik });
      return { durum: "kaydedildi" };
    } catch (e) {
      switch (e?.code) {
        case "declined":
          return { durum: "iptal" };
        case "rate_limited":
          return { durum: "hata", mesaj: "Açık bir kaydetme penceresi var. Onu kapatıp yeniden deneyin." };
        default:
          return { durum: "hata", mesaj: "Bu görünümde dosya kaydedilemiyor." };
      }
    }
  }

  const blob = new Blob([icerik], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dosyaAdi;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Hemen iptal etmek bazı tarayıcılarda indirmeyi yarıda keser.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { durum: "kaydedildi" };
}
