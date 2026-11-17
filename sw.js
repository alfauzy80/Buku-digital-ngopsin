const CACHE_NAME = "buku-saku-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

// Menginstal Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Menghapus cache lama saat ada pembaruan
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Mengambil file dari Cache (Mode Offline Support)
self.addEventListener("fetch", (event) => {
  // Biarkan panggilan Firebase langsung ke internet, jangan di-cache
  if (event.request.url.includes("firebase")) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Kembalikan file dari cache jika ada, jika tidak, unduh dari internet
      return response || fetch(event.request);
    })
  );
});
