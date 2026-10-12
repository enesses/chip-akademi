/**
 * Öneri onayı: Otomasyon sayfasındaki "Onayla" düğmesi.
 *
 * Akış: düğme → kullanıcının kendi "Claude Code Remote" bağlantısıyla
 * fire_trigger → hesabındaki "Chip Akademi öneri onayı" görevi başlar →
 * görev PR'ı birleştirir, raporu ve claude.ai yayınını yeniler
 * (otomasyon/ONAY.md). Görev yalnızca sahibin hesabında olduğu için başka
 * biri basarsa çağrı onun hesabında görevi bulamaz; sayfa da düğmeyi yalnızca
 * sahibe gösterir.
 *
 * Bu yetenek yalnızca claude.ai yayınında vardır (window.claude). Diskten ya
 * da GitHub Pages'ten açılınca düğme yerine açıklama görünür.
 */

export const ONAY_GOREVI = "trig_01CG5MeYqRbRoEJz4xKJ53L1";
export const SUNUCU = "Claude Code Remote";

/** { durum: "hazir" | "sahip-degil" | "yok" } */
export async function onayHazirMi() {
  const claude = typeof window !== "undefined" ? window.claude : undefined;
  if (!claude || typeof claude.use !== "function") return { durum: "yok" };
  let mcp = null, user = null;
  try {
    [mcp, user] = await Promise.all([claude.use("mcp"), claude.use("user")]);
  } catch {
    return { durum: "yok" };
  }
  if (!mcp) return { durum: "yok" };
  let sahip = false;
  try { sahip = user ? await user.isOwner() : false; } catch { sahip = false; }
  return sahip ? { durum: "hazir", mcp } : { durum: "sahip-degil" };
}

/** Hata kodunu kullanıcıya söylenecek Türkçe cümleye ve "belirsiz mi" bilgisine çevir. */
export function hataAciklamasi(e) {
  const kod = e?.code || "upstream_error";
  switch (kod) {
    case "server_not_connected":
      return { metin: "Claude Code Remote bağlantısı bu hesapta bulunamadı. claude.ai'de Ayarlar → Bağlayıcılar'dan ekle.", belirsiz: false };
    case "needs_reauth":
      return { metin: "Claude Code Remote bağlantısının oturumu düşmüş. claude.ai'de Ayarlar → Bağlayıcılar'dan yeniden bağlan.", belirsiz: false };
    case "selection_required":
      return { metin: "Birden çok Claude Code Remote bağlantın var; claude.ai hangisini kullanacağını soruyor, seçip yeniden dene.", belirsiz: false };
    case "not_in_manifest":
      return { metin: "Bu sayfaya bağlantı izni verilmedi. Sayfanın izinler menüsünden Claude Code Remote'a izin ver.", belirsiz: false };
    case "blocked_by_policy":
    case "approval_required":
      return { metin: "Kuruluş politikası bu sayfadan görev başlatmaya izin vermiyor.", belirsiz: false };
    case "tool_error":
      return { metin: `Görev başlatılamadı: ${e?.message || "bilinmeyen hata"}`, belirsiz: false };
    case "not_granted":
    case "capability_disabled":
    case "capability_removed":
      return { metin: "Bu görünümde onay düğmesi çalışmıyor; uygulamayı claude.ai'de aç.", belirsiz: false };
    default:
      // server_unavailable / upstream_error: görev başlamış da olabilir.
      return { metin: "Yanıt alınamadı; onay iletilmiş olabilir. Birkaç dakika bekle — PR birleşince bu liste yenilenir. Değişmezse yeniden dene.", belirsiz: true };
  }
}

/** Onay görevini başlat. prler: [23, 24] */
export async function onayla(mcp, prler) {
  const text = `ONAY PR ${prler.map((n) => `#${n}`).join(" ")}`;
  return mcp.callTool(SUNUCU, "fire_trigger", { trigger_id: ONAY_GOREVI, text });
}

/* Basılmış düğmeyi yenilemede de "iletildi" göstermek için (yalnızca bu tarayıcı; yoksa sorun değil). */
const ANAHTAR = "chip-akademi:onay-iletilen";
export function iletilenler() {
  try { return JSON.parse(window.localStorage.getItem(ANAHTAR) || "{}"); } catch { return {}; }
}
export function iletildiOlarakIsaretle(prler) {
  try {
    const d = iletilenler();
    for (const n of prler) d[n] = Date.now();
    window.localStorage.setItem(ANAHTAR, JSON.stringify(d));
  } catch { /* depolama kapalı: yalnızca bu açılışta görünür */ }
}
