/**
 * Metni panoya kopyala.
 *
 * claude.ai yayınında sayfa izinleri kısıtlı bir çerçevede çalışır ve
 * navigator.clipboard reddedilebilir. O zaman eski yol (gizli textarea +
 * execCommand) denenir. İkisi de olmazsa false döner; çağıran taraf metni
 * seçili göstererek kullanıcıya Ctrl+C dedirtir.
 */
export async function panoyaKopyala(metin) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(metin);
      return true;
    }
  } catch {
    /* eski yola düş */
  }
  try {
    const t = document.createElement("textarea");
    t.value = metin;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.top = "-1000px";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, metin.length);
    const ok = document.execCommand("copy");
    t.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Arama paletinden bir sayfaya "şunu aç" iletmek için (tek sayfalık uygulama, bellekte). */
export const acilacak = { prompt: null, skill: null };
/** Sayfa zaten açıksa rota değişmez, sayfa yeniden kurulmaz; bu olayla haber verilir. */
export const ACILACAK_OLAY = "chip-akademi:acilacak";
