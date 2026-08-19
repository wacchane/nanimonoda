// 配信ファイルを変更したら必ずこの番号を上げる（古いキャッシュはここを見て捨てられる）
const CACHE = 'nanimonoda-v43';
const ASSETS = ['./', './index.html', './app.js', './manifest.webmanifest',
                './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

// 中身が変わるもの。ここは必ずネットワークを先に見る
const FRESH = /\.(?:html|js|webmanifest)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const put = (req, res) => {
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
  return res;
};

/* 画面と処理は network-first、画像は cache-first。
   **全部を cache-first にしないこと。** 新版を配っても一度目の読み込みでは
   必ず古い版が出て、利用者に2回リロードさせることになる。
   ネットワークが死んでいればどちらもキャッシュに落ちるので、オフラインでは
   今までどおり動く。 */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  const fresh = e.request.mode === 'navigate' || FRESH.test(url.pathname);
  if (fresh) {
    e.respondWith(
      fetch(e.request)
        .then(res => put(e.request, res))
        .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => put(e.request, res)))
  );
});
