#!/usr/bin/env bash
#
# Ajanları bu makinede günlük çalışacak şekilde kurar (macOS / Linux).
#   bash otomasyon/kur.sh          # kur
#   bash otomasyon/kur.sh --kaldir # kaldır
#
# Not: Bilgisayar o saatte kapalıysa görev çalışmaz. Kesintisiz çalışması
# gerekiyorsa GitHub Actions daha uygun (.github/workflows/otomasyon.yml).

set -e
PROJE="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(command -v node || true)"
ISARET="# chip-akademi-otomasyon"

if [ -z "$NODE" ]; then
  echo "node bulunamadı. Önce Node.js kur: https://nodejs.org"
  exit 1
fi

mevcut="$(crontab -l 2>/dev/null | grep -v "$ISARET" || true)"

if [ "$1" = "--kaldir" ]; then
  echo "$mevcut" | crontab -
  echo "Görevler kaldırıldı."
  exit 0
fi

yeni="$mevcut
$ISARET
0 6 * * *  cd $PROJE && $NODE otomasyon/orkestrator.mjs yenileme    >> otomasyon/cron.log 2>&1  $ISARET
0 9 * * *  cd $PROJE && $NODE otomasyon/orkestrator.mjs guvenlik    >> otomasyon/cron.log 2>&1  $ISARET
0 10 * * * cd $PROJE && $NODE otomasyon/orkestrator.mjs iyilestirme >> otomasyon/cron.log 2>&1  $ISARET
0 11 * * * cd $PROJE && $NODE otomasyon/orkestrator.mjs gelistirme rapor >> otomasyon/cron.log 2>&1  $ISARET"

echo "$yeni" | crontab -

echo "Kuruldu. Zamanlama (yerel saat):"
echo "  06:00  Yenileme    — fiyat ve Bugün verisi"
echo "  09:00  Güvenlik"
echo "  10:00  İyileştirme"
echo "  11:00  Geliştirme + Rapor"
echo
echo "Kontrol:  crontab -l | grep chip-akademi"
echo "Günlük:   tail -f $PROJE/otomasyon/cron.log"
echo "Durum:    node otomasyon/durum.mjs"
echo
echo "'Bugün' sayfasının otomatik yenilenmesi için API anahtarını kabuk"
echo "profiline ekle (~/.zshrc veya ~/.bashrc):"
echo "  export ANTHROPIC_API_KEY=\"...\""
