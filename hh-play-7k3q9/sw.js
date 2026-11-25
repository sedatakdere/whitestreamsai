// Hoot Hollow offline cache. Bump VERSION on every release.
const VERSION="hh-v0.3.5";
const CORE=["./","./index.html","./privacy.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const font=/fonts\.(googleapis|gstatic)\.com/.test(r.url);
  if(font){e.respondWith(caches.open(VERSION+"-fonts").then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{c.put(r,res.clone());return res;}))));return;}
  if(new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(new Request(r.url,{cache:"no-cache",credentials:"same-origin"})).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))));});
