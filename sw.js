// Сервис-воркер: сайт открывается как приложение; страница всегда свежая из сети,
// картинки и видео берутся из кэша после первого просмотра.
const C = 'alfa-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r).catch(() => caches.match(r))); return; }
  if (/\.(jpg|png|webp|mp4)(\?|$)/.test(r.url)) {
    e.respondWith(caches.open(C).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok && res.status === 200) c.put(r, res.clone()); return res; }))));
  }
});
