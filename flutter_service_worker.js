'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "715ef2780ac7a77c5a7fc18c97ddb0a0",
"assets/FontManifest.json": "2b45949d904b8b3e8dfa489a1c12743a",
"assets/fonts/font-bold.ttf": "dba0c688b8d5ee09a1e214aebd5d25e4",
"assets/fonts/font-regular.ttf": "eae9c18cee82a8a1a52e654911f8fe83",
"assets/fonts/MaterialIcons-Regular.ttf": "a37b0c01c0baf1888ca812cc0508f6e2",
"assets/fonts/Quicksand-Medium.ttf": "0c64233241ead44bffbec54eb9d1d164",
"assets/fonts/Quicksand_Bold.otf": "c3bf00e585782373e1b601c07b513d85",
"assets/fonts/Quicksand_Book.otf": "dd2da1d8f9d3944efe2797e1fa02e096",
"assets/fonts/Quicksand_Light.otf": "555cd799d40b72622c36b330714d4026",
"assets/fonts/Raleway-Medium.ttf": "430a0518f5ff3b6c8968b759a29b36e2",
"assets/fonts/Raleway-Regular.ttf": "580d0778ad254335be45bf58bb449f43",
"assets/images/img_main.jpg": "2da2847a8dfc1862cac8677b02a90944",
"assets/images/laptop.jpg": "ca4c43469ac10f564613a4851adcf654",
"assets/images/logo_flutterph.png": "015c34b29b409c9fa44847d8496a2978",
"assets/images/logo_google_developers.png": "43a2d26fc5d97c58c306d2c01416a205",
"assets/images/preview_study_jam.jpg": "a2d2a591cc4cee6ac96ae9f4000e21cb",
"assets/images/social_facebook.png": "c14e76e5f0714aecc4cac71476d1ad72",
"assets/images/social_facebook_group.png": "95f142d63cf0877bcb16ef3a55a977f0",
"assets/images/social_github.png": "a2cf0470aa066fb4623dd507aca193ec",
"assets/images/social_instagram.png": "47f15e4fb23c6b0f41a4bb70b642ebd9",
"assets/images/social_linkedin.png": "2118906561764c7e19b4afd6713d1147",
"assets/images/social_meetup.png": "3f2cce083ba567bde92098fb28982e61",
"assets/images/social_twitter.png": "aa6a0db3b93019af2a8848cf79a132ab",
"assets/NOTICES": "53597e0b7f3e4bbe237939e3a037493c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/web/assets/fonts/font-bold.ttf": "dba0c688b8d5ee09a1e214aebd5d25e4",
"assets/web/assets/fonts/font-regular.ttf": "eae9c18cee82a8a1a52e654911f8fe83",
"assets/web/assets/images/img_main.jpg": "2da2847a8dfc1862cac8677b02a90944",
"assets/web/assets/images/laptop.jpg": "ca4c43469ac10f564613a4851adcf654",
"assets/web/assets/images/logo_flutterph.png": "015c34b29b409c9fa44847d8496a2978",
"assets/web/assets/images/logo_google_developers.png": "43a2d26fc5d97c58c306d2c01416a205",
"assets/web/assets/images/preview_study_jam.jpg": "a2d2a591cc4cee6ac96ae9f4000e21cb",
"assets/web/assets/images/social_facebook.png": "c14e76e5f0714aecc4cac71476d1ad72",
"assets/web/assets/images/social_facebook_group.png": "95f142d63cf0877bcb16ef3a55a977f0",
"assets/web/assets/images/social_github.png": "a2cf0470aa066fb4623dd507aca193ec",
"assets/web/assets/images/social_instagram.png": "47f15e4fb23c6b0f41a4bb70b642ebd9",
"assets/web/assets/images/social_linkedin.png": "2118906561764c7e19b4afd6713d1147",
"assets/web/assets/images/social_meetup.png": "3f2cce083ba567bde92098fb28982e61",
"assets/web/assets/images/social_twitter.png": "aa6a0db3b93019af2a8848cf79a132ab",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "157b027d7b2d0f43027d1996220910ff",
"/": "157b027d7b2d0f43027d1996220910ff",
"main.dart.js": "91b536e36cee36380189798366f28021",
"manifest.json": "9432f3169231df869a380175565e0ecc"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
