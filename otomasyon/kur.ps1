# Ajanları Windows'ta günlük çalışacak şekilde kurar.
#   powershell -ExecutionPolicy Bypass -File otomasyon\kur.ps1
#   powershell -ExecutionPolicy Bypass -File otomasyon\kur.ps1 -Kaldir

param([switch]$Kaldir)

$proje = (Resolve-Path "$PSScriptRoot\..").Path
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { Write-Error "node bulunamadi. Once Node.js kur: https://nodejs.org"; exit 1 }

$gorevler = @(
  @{ Ad = "ChipAkademi-Yenileme";    Saat = "06:00"; Ajan = "yenileme" },
  @{ Ad = "ChipAkademi-Guvenlik";    Saat = "09:00"; Ajan = "guvenlik" },
  @{ Ad = "ChipAkademi-Iyilestirme"; Saat = "10:00"; Ajan = "iyilestirme" },
  @{ Ad = "ChipAkademi-Gelistirme";  Saat = "11:00"; Ajan = "gelistirme rapor" }
)

if ($Kaldir) {
  foreach ($g in $gorevler) {
    Unregister-ScheduledTask -TaskName $g.Ad -Confirm:$false -ErrorAction SilentlyContinue
  }
  Write-Host "Gorevler kaldirildi."
  exit 0
}

foreach ($g in $gorevler) {
  $eylem = New-ScheduledTaskAction -Execute $node `
    -Argument "otomasyon\orkestrator.mjs $($g.Ajan)" -WorkingDirectory $proje
  $tetik = New-ScheduledTaskTrigger -Daily -At $g.Saat
  # Dizustu bilgisayarlarda pilde de calissin
  $ayar = New-ScheduledTaskSettingsSet -StartWhenAvailable `
    -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries
  Register-ScheduledTask -TaskName $g.Ad -Action $eylem -Trigger $tetik `
    -Settings $ayar -Force | Out-Null
  Write-Host "Kuruldu: $($g.Ad) - $($g.Saat)"
}

Write-Host ""
Write-Host "Kontrol: Get-ScheduledTask -TaskName ChipAkademi-*"
Write-Host "Durum:   node otomasyon\durum.mjs"
