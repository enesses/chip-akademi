/**
 * Açık / koyu tema. İlk ziyarette sistem tercihi, sonra kullanıcının seçimi
 * (localStorage) geçerli. İlk boyamadan önceki uygulama index.html'deki küçük
 * betikte; bu modül yalnızca değiştirme ve dinleme işini yapar.
 */
import { useEffect, useState } from "react";

const ANAHTAR = "chip-akademi:tema";
const dinleyiciler = new Set();

export function aktifTema() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "koyu" : "acik";
}

export function temaAyarla(tema) {
  document.documentElement.classList.toggle("dark", tema === "koyu");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "koyu" ? "#111214" : "#f6f4ef");
  try { window.localStorage.setItem(ANAHTAR, tema); } catch { /* özel pencere */ }
  for (const fn of dinleyiciler) fn(tema);
}

export function useTema() {
  const [tema, setTema] = useState(aktifTema);
  useEffect(() => { dinleyiciler.add(setTema); return () => { dinleyiciler.delete(setTema); }; }, []);
  return [tema, () => temaAyarla(tema === "koyu" ? "acik" : "koyu")];
}
