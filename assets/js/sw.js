
// Name mit Versionsnummer
let cacheName = 'v1::static';

// Dateien für den Cache
let cachedFiles = [
    "index.html",
    "highscores.html",
    "game.html",
    "end.html",
    "end.js",
    "game.js",
    "highscores.js",
    "sticknavbar.js",
    "sw.js",
    "allgemeinWissen.jpg",
    "firmbee-com-gcsNOsPEXfs-unsplash.jpg",
    "flaggenBackground.jpg",
    "logo_large.png",
    "allgemeinwissen.json",
    "mathBackground.jpg",
    "style.ss",
    "highscores.css",
    "game.css"
];

// Self is the recent ServiceWorker
self.addEventListener ("install", function (evt) {
    console.log ("Service Worker Install Event ");
    evt.waitUntil (
        // open with result of  open message
        caches.open (cacheName).then (function (cache) {
            console.log ("Dateien für den Cache");
            return cache.addAll (cachedFiles);
        }).then (function () {
            return self.skipWaiting ();
        }).catch ( function (err) {
            console.log ("Cache Failed", err);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.error("Netzwerkanfragen fehlgeschlagen. Liefere Offline Page " + error);
            return caches.open(cacheName).then(function (cache) {
                return cache.match(cacheName);
            });
        }));
});

self.addEventListener("refreshOffline", function (response) {
    return caches.open(cacheName).then(function (cache) {
        console.log("Offline Seite aktualisiert vom refreshOffline event: " + response.url);
        return cache.put(offlinePage, response);
    });
});

self.addEventListener("notificationclose", function (e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log("Closed notification: " + primaryKey);
});
