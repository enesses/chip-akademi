"""Vite çıktısını tek bir HTML dosyasında birleştirir."""
import os, re, base64, glob

DIST = "dist"
html = open(os.path.join(DIST, "index.html"), encoding="utf-8").read()

def oku(yol):
    return open(yol, encoding="utf-8").read()

for m in re.finditer(r'<script[^>]*src="([^"]+)"[^>]*></script>', html):
    yol = os.path.join(DIST, m.group(1).lstrip("/"))
    if os.path.exists(yol):
        html = html.replace(m.group(0), f"<script type=\"module\">{oku(yol)}</script>")

for m in re.finditer(r'<link[^>]*href="([^"]+\.css)"[^>]*>', html):
    yol = os.path.join(DIST, m.group(1).lstrip("/"))
    if os.path.exists(yol):
        html = html.replace(m.group(0), f"<style>{oku(yol)}</style>")

# görselleri göm
gorseller = {}
for yol in glob.glob("public/images/*"):
    ad = os.path.basename(yol)
    with open(yol, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    ext = ad.rsplit(".", 1)[-1]
    mime = "jpeg" if ext in ("jpg", "jpeg") else ext
    gorseller[ad] = f"data:image/{mime};base64,{b64}"

gomulu = "window.__IMAGES = " + str(gorseller).replace("'", '"') + ";"
html = html.replace("<head>", f"<head><script>{gomulu}</script>", 1)

hedefler = ["chip-akademi.html"]
if os.path.isdir("/mnt/user-data/outputs"):
    hedefler.append("/mnt/user-data/outputs/chip-akademi.html")
for h in hedefler:
    open(h, "w", encoding="utf-8").write(html)
print(f"{len(gorseller)} görsel, HTML: {os.path.getsize(hedefler[0])//1024} KB -> {', '.join(hedefler)}")
