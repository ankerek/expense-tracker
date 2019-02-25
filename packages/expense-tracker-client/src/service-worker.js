const precacheController = new workbox.precaching.PrecacheController()

precacheController.addToCacheList(self.__precacheManifest)

self.addEventListener('install', event => {
  event.waitUntil(precacheController.install())
})

self.addEventListener('activate', event => {
  event.waitUntil(
    precacheController.activate().then(() => self.clients.claim())
  )
})

workbox.routing.registerNavigationRoute('/index.html')

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(event.request, response)
      return response || fetch(event.request)
    })
  )
})

// workbox.routing.registerRoute(
//   new RegExp('.*\.js'),
//   workbox.strategies.networkFirst()
// )



