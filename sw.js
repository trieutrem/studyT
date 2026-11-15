/* StudyT Aurora — only static app shell is cached, never Supabase/auth/data requests. */
const VERSION='studyt-aurora-v9.5-20261116';
const SHELL=['./assets/pig-light.webp','./assets/pig-dark-logo.webp','./assets/pig-dark-side.webp','./studyt-v93.css?v=9.5','./studyt-premium.js?v=9.5','./assets/aurora-hero.webp','./studyt-v92.css?v=9.2','./assets/icon-check.svg','./assets/icon-star.svg','./','./index.html','./admin.html','./studyt-premium.css','./studyt-premium.js','./studyt-ux2.js','./studyt-ux2.css','./studyt-evolve.js','./studyt-evolve.css','./studyt-refine.css','./studyt-v5.css','./studyt-v5.js','./studyt-unified-v8.css','./studyt-unified-v8.js','./manifest.webmanifest','./assets/pig-hero.png','./assets/pig-sidebar.png','./assets/pig-logo.png','./assets/pig-trophy.png','./assets/feature-notebook.png','./assets/feature-brain.png','./assets/feature-timer.png','./assets/feature-chart.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>Promise.allSettled(SHELL.map(url=>cache.add(url)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('studyt-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const u=new URL(request.url);
 if(!SHELL.some(path=>new URL(path,self.registration.scope).pathname===u.pathname))return;
 event.respondWith(fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(hit=>hit||caches.match(u.pathname))));
});