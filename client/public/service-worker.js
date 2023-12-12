self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('svg-icon-cache').then((cache) => {
            return cache.addAll([
                './icons/bear.svg',
                './icons/cat.svg',
                './icons/chicken.svg',
                './icons/cow.svg',
                './icons/dog.svg',
                './icons/fox.svg',
                './icons/horse.svg',
                './icons/lion.svg',
                './icons/monkey.svg',
                './icons/mouse.svg',
                './icons/panda.svg',
                './icons/pig.svg',
                './icons/sheep.svg',
                './icons/snake.svg',
                './icons/tiger.svg',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});