#!/usr/bin/env python3
"""chip-akademi.html → claude.ai'da yayınlanabilir sayfa (artifact/chip-akademi.html).

Yayın aracı sayfayı kendi <!doctype><html><head><body> iskeletine sarar ve
adını yalnızca dosyanın ilk 8 KB'ındaki <title>'dan okur. Tek dosyalık
derlemede ise ~1 MB'lık gömülü görsel verisi <title>'dan önce geliyor ve
kendi iskelet etiketleri var. Bu betik:

  1. <title>'ı en başa alır (yayın adı "Chip Akademi" olur),
  2. kendi doctype/html/head/body etiketlerini kaldırır, içeriği korur,
  3. kök dili Türkçe yapar (yoksa büyük harf dönüşümü "EKİM"i "EKIM" yazar),
  4. tek koyu temayı yayın iskeletine bildirir (color-scheme: dark; iskelet
     :root'u varsayılan olarak açık işaretler),
  5. telefonda güvenli alan boşluğunu (çentik / alt çubuk) koyu boyar ve
     yapışkan üst başlığı çentiğin altına iter.

Kullanım:  python3 otomasyon/artifact-hazirla.py   (önce build-single.py)
"""
import re
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
GIRDI = KOK / "chip-akademi.html"
CIKTI = KOK / "artifact" / "chip-akademi.html"

# index.css'teki --background: 220 26% 6%
ZEMIN = "hsl(220 26% 6%)"


def main() -> int:
    if not GIRDI.exists():
        print(f"✗ {GIRDI.name} yok — önce: npx vite build && python3 build-single.py")
        return 1
    s = GIRDI.read_text(encoding="utf-8")

    # Konumlar özgün metinde aranmalı: s.lower() Türkçe "İ"yi iki karaktere
    # ("i̇") açtığı için uzunluk değişir ve indeksler kayar.
    bas = re.search(r"<head[^>]*>", s, re.I)
    head_son = [m.start() for m in re.finditer(r"</head>", s, re.I)]
    body_bas = re.search(r"<body[^>]*>", s, re.I)
    body_son = [m.start() for m in re.finditer(r"</body>", s, re.I)]
    if not (bas and head_son and body_bas and body_son):
        print("✗ beklenen <head>/<body> yapısı bulunamadı")
        return 1

    head = s[bas.end():head_son[-1]]
    body = s[body_bas.end():body_son[-1]]

    m = re.search(r"<title>(.*?)</title>", head, re.I | re.S)
    baslik = m.group(1).strip() if m else "Chip Akademi"
    # Yayın iskeleti charset ve viewport'u zaten ekliyor; title başa taşınıyor.
    head = re.sub(r"<title>.*?</title>", "", head, flags=re.I | re.S)
    head = re.sub(r"<meta\s+charset=[^>]*>", "", head, flags=re.I)
    head = re.sub(r"<meta\s+name=\"viewport\"[^>]*>", "", head, flags=re.I)

    dil = re.search(r"<html[^>]*\blang=\"([^\"]+)\"", s, re.I)
    dil = dil.group(1) if dil else "tr"

    on_ek = (
        f"<title>{baslik}</title>\n"
        # Yayın iskeletinin <html>'inde lang yok; olmazsa CSS uppercase Türkçe
        # kuralı yerine İngilizce kuralı uygular: "Ekim" → "EKIM", "Giriş" →
        # "GIRIŞ". Kök dil, React çizmeden önce ayarlanmalı.
        f"<script>document.documentElement.lang = \"{dil}\";</script>\n"
        "<style>\n"
        "  /* Tek koyu tema: iskelet :root'u açık işaretler, koyuya çevir. */\n"
        f"  :root {{ color-scheme: dark; background: {ZEMIN}; }}\n"
        f"  html, body {{ background: {ZEMIN}; }}\n"
        "  /* Yapışkan başlık telefonda çentiğin altında kalmasın. */\n"
        "  header.sticky { top: env(safe-area-inset-top, 0px); }\n"
        "</style>\n"
    )
    cikti = on_ek + head.strip() + "\n" + body.strip() + "\n"

    if baslik not in cikti[:8192]:
        print("✗ <title> ilk 8 KB'ta değil")
        return 1
    # Yalnızca betik/stil dışındaki işaretlemeye bak: küçültülmüş React kodu
    # "<html" gibi dizgeler içeriyor, bunlar etiket değil.
    isaretleme = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", "", cikti, flags=re.I | re.S)
    if re.search(r"<!doctype|<html[\s>]|<head[\s>]|<body[\s>]", isaretleme, re.I):
        print("✗ iskelet etiketi kaldı")
        return 1
    boyut = len(cikti.encode("utf-8"))
    if boyut > 16 * 1024 * 1024:
        print(f"✗ {boyut/1048576:.1f} MB — yayın sınırı 16 MB")
        return 1

    CIKTI.parent.mkdir(exist_ok=True)
    CIKTI.write_text(cikti, encoding="utf-8")
    print(f"✓ {CIKTI.relative_to(KOK)} hazır ({boyut//1024} KB, başlık: {baslik})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
