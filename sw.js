/* StudyT Aurora — only static app shell is cached, never Supabase/auth/data requests. */
const VERSION='studyt-aurora-v4-20261104';
const SHELL=['./','./index.html','./admin.html','./studyt-premium.css','./studyt-premium.js','./studyt-ux2.js','./studyt-ux2.css','./studyt-evolve.js','./studyt-evolve.css','./studyt-refine.css','./manifest.webmanifest','./assets/pig-hero.png','./assets/pig-sidebar.png','./assets/pig-logo.png','./assets/pig-trophy.png','./assets/feature-notebook.png','./assets/feature-brain.png','./assets/feature-timer.png','./assets/feature-chart.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>Promise.allSettled(SHELL.map(url=>cache.add(url)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('studyt-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const u=new URL(request.url);
 if(!SHELL.some(path=>new URL(path,self.registration.scope).pathname===u.pathname))return;
 event.respondWith(fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request)));
});