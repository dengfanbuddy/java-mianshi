// Service Worker — Java面试题库 PWA 离线缓存 v7（教程知识库手机端适配）
// 策略：导航请求网络优先（防白屏），静态资源缓存优先（提速）
const CACHE = "java-interview-v7";

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-256.png",
  "./icon-384.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon.png",
  "./data/study-methods.js",
  "./data/memory.js",
  "./data/java-basic.js",
  "./data/java-concurrent.js",
  "./data/jvm.js",
  "./data/mysql.js",
  "./data/redis.js",
  "./data/spring.js",
  "./data/design-pattern.js",
  "./data/netty.js",
  "./data/linux.js",
  "./data/mq.js",
  "./data/microservice.js",
  "./data/algorithm.js",
  "./data/game-server.js",
  "./data/scenario.js",
  "./data/resume-deepdive.js",
  "./data/ai-app.js",
  "./data/tutorials/java-concurrent.js",
  "./data/tutorials/jvm.js",
  "./data/tutorials/redis.js",
  "./data/tutorials/mysql.js",
  "./data/tutorials/netty.js",
  "./data/tutorials/java-basic.js",
  "./data/tutorials/spring.js",
  "./data/tutorials/design-pattern.js",
  "./data/tutorials/linux.js",
  "./data/tutorials/mq.js",
  "./data/tutorials/microservice.js",
  "./data/tutorials/algorithm.js",
  "./data/tutorials/game-server.js",
  "./data/tutorials/scenario.js",
  "./data/tutorials/resume-deepdive.js",
  "./data/tutorials/ai-app.js"
];

// 安装：逐个缓存，某个失败不影响整体
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async cache => {
      // 逐个添加，失败的不中断其他文件
      await Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存，立即接管
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  // 只处理同源请求
  if (url.origin !== self.location.origin) return;

  // 导航请求（HTML页面）：网络优先，失败回退缓存 → 防白屏
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match("./index.html")))
    );
    return;
  }

  // 静态资源（JS/图片/JSON）：缓存优先，回退网络
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      });
    })
  );
});
