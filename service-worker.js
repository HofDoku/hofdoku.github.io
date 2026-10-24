/* HofDoku Service Worker – speichert die App-Dateien für Offline-Nutzung.
   Bei jeder neuen Version CACHE-Namen erhöhen, sonst sieht das iPhone die alte Fassung. */
const CACHE = "hofdoku-v0.2.0";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./lib/jspdf.umd.min.js", "./lib/jspdf.plugin.autotable.min.js",
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
