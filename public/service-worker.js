/* eslint-disable no-restricted-globals */
const CACHE_PREFIX = 'big-trip-cache';
const CACHE_VER = 'v15';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/bundle.js',
        '/css/style.css',
        '/fonts/Montserrat-Bold.woff2',
        '/fonts/Montserrat-ExtraBold.woff2',
        '/fonts/Montserrat-Medium.woff2',
        '/fonts/Montserrat-Regular.woff2',
        '/fonts/Montserrat-SemiBold.woff2',
        '/img/icons/bus.png',
        '/img/icons/check-in.png',
        '/img/icons/drive.png',
        '/img/icons/flight.png',
        '/img/icons/restaurant.png',
        '/img/icons/ship.png',
        '/img/icons/sightseeing.png',
        '/img/icons/taxi.png',
        '/img/icons/transport.png',
        '/img/photos/1.jpg',
        '/img/photos/2.jpg',
        '/img/photos/3.jpg',
        '/img/photos/4.jpg',
        '/img/photos/5.jpg',
        '/img/header-bg.png',
        '/img/header-bg@2x.png',
        '/img/logo.png',
      ])),
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    // Получаем все названия кэшей
    caches.keys()
      .then(
        // Перебираем их и составляем набор промисов на удаление
        (keys) => Promise.all(
          keys.map(
            (key) => {
              // Удаляем только те кэши,
              // которые начинаются с нашего префикса,
              // но не совпадают по версии
              if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                return caches.delete(key);
              }

              // Остальные не обрабатываем
              return null;
            },
          )
            .filter((key) => key !== null),
        ),
      ),
  );
});

const handleFetch = (evt) => {
  const { request } = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        // Если в кэше нашёлся ответ на запрос (request),
        // возвращаем его (cacheResponse) вместо запроса к серверу
        if (cacheResponse) {
          return cacheResponse;
        }

        // Если в кэше не нашёлся ответ,
        // повторно вызываем fetch
        // с тем же запросом (request),
        // и возвращаем его
        return fetch(request)
          .then((response) => {
            // Если ответа нет, или ответ со статусом отличным от 200 OK,
            // или ответ небезопасного типа (не basic), тогда просто передаём
            // ответ дальше, никак не обрабатываем
            if (!response
              || response.status !== HTTP_STATUS_OK
              || response.type !== RESPONSE_SAFE_TYPE) {
              return response;
            }

            // А если ответ удовлетворяет всем условиям, клонируем его
            const clonedResponse = response.clone();

            // Копию кладём в кэш
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));

            // Оригинал передаём дальше
            return response;
          });
      }),
  );
};

self.addEventListener('fetch', handleFetch);
