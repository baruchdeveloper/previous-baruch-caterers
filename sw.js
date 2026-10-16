const CACHE_NAME = "baruch-caterers-v35";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./menu.html",
  "./selected-menu.html",
  "./about.html",
  "./contact.html",
  "./blog.html",
  "./best-wedding-caterers-in-chennai.html",
  "./best-vegetarian-wedding-caterers-in-chennai.html",
  "./small-function-catering-services-in-chennai.html",
  "./bread-halwa-tamil-wedding-sweet.html",
  "./css/style.css",
  "./js/vendor/gsap.min.js",
  "./js/vendor/ScrollTrigger.min.js",
  "./js/vendor/qrcode.min.js",
  "./js/script.js",
  "./js/menu-catalog-v2.js",
  "./js/non-veg-menu-catalog.js",
  "./manifest.webmanifest",
  "./assets/images/1.jpg",
  "./assets/images/2.jpg",
  "./assets/images/3.jpg",
  "./assets/images/4.jpg",
  "./assets/images/bg.png",
  "./assets/icons/app-icon.svg",
  "./assets/icons/app-icon-maskable.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
