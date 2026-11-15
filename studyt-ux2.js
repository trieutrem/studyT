/* StudyT Aurora V2: guest-first welcome, announcement bell, avatar-to-settings.
   Never bypasses Supabase authentication or the original application's permissions. */
(()=>{
 'use strict';
 const $=(s,p=document)=>p.querySelector(s);
 const IS_ADMIN=/admin\.html/i.test(location.pathname)||/Quản trị/i.test(document.title);
 const auth=$('#authView');
 const landing=$('#landingView');
 if(!auth||!landing||$('#stux-guest'))return;
 const ico={
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  shield:'<path d="m12 2 9 4v6c0 5-3 8-9 10-6-2-9-5-9-10V6Z"/><path d="m9 12 2 2 4-4"/>',
  book:'<path d="M12 6c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Zm0 0v14"/>',
  exam:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2c0-3 2.7-5 6-5s6 2 6 5v2M17 6a3 3 0 0 1 0 6m1 3c2 1 3 3 3 5"/>',
  chart:'<path d="M4 20V11m6 9V4m6 16v-7m5 7H3"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
 };
 const svg=(name,size=20)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ico[name]}</svg>`;
 const feature3d={book:`<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="stBookCover" x2=".8" y2="1"><stop stop-color="#8ab6ff"/><stop offset=".45" stop-color="#4268d9"/><stop offset="1" stop-color="#23358e"/></linearGradient><linearGradient id="stPaper" x2="0" y2="1"><stop stop-color="#fffefb"/><stop offset="1" stop-color="#d8d5e9"/></linearGradient></defs><ellipse cx="80" cy="111" rx="58" ry="9" fill="#6554a0" opacity=".18"/><path d="M17 40Q48 29 80 48Q112 29 143 40L150 101Q112 91 80 110Q48 91 10 101Z" fill="url(#stBookCover)" stroke="#304aa5" stroke-width="3"/><path d="M23 32Q54 25 80 45Q106 25 137 32L143 91Q110 83 80 102Q50 83 17 91Z" fill="url(#stPaper)" stroke="#c6c2da" stroke-width="2"/><path d="M80 45V102" stroke="#a8a1c3" stroke-width="2"/><g stroke="#b8b4ca" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M31 44Q54 41 69 51M29 54Q52 51 69 61M27 64Q50 61 69 71M25 74Q49 71 69 81M91 51Q112 41 129 44M91 61Q112 51 131 54M91 71Q112 61 133 64M91 81Q112 71 135 74"/></g><g class="st3d-page"><path d="M80 45Q106 25 137 32L143 91Q110 83 80 102Z" fill="url(#stPaper)" stroke="#c6c2da" stroke-width="1.5"/><path d="M91 51Q112 41 129 44M91 61Q112 51 131 54M91 71Q112 61 133 64" fill="none" stroke="#b8b4ca" stroke-width="2.5"/></g><path d="M91 95L102 91V116L96 112L91 120Z" fill="#f5b83d"/></svg>`,exam:`<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="stClip" x2="1" y2="1"><stop stop-color="#91f3c5"/><stop offset=".45" stop-color="#20bb86"/><stop offset="1" stop-color="#087653"/></linearGradient><linearGradient id="stPen" x2="1" y2="0"><stop stop-color="#e9a023"/><stop offset=".5" stop-color="#fff09a"/><stop offset="1" stop-color="#e19a18"/></linearGradient></defs><ellipse cx="80" cy="116" rx="45" ry="8" fill="#188a68" opacity=".18"/><g transform="rotate(-8 80 65)"><rect x="37" y="18" width="79" height="98" rx="12" fill="#087653"/><rect x="34" y="14" width="79" height="98" rx="12" fill="url(#stClip)"/><rect x="42" y="23" width="63" height="80" rx="6" fill="#f8fffc"/><rect x="59" y="10" width="30" height="17" rx="5" fill="#aab9c5" stroke="#e7f0f5" stroke-width="2"/><g fill="#26b986"><rect x="50" y="37" width="14" height="14" rx="4"/><rect x="50" y="59" width="14" height="14" rx="4"/><rect x="50" y="81" width="14" height="14" rx="4"/></g><g class="st3d-checks" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m53 44 3 3 5-7"/><path d="m53 66 3 3 5-7"/><path d="m53 88 3 3 5-7"/></g><path d="M71 44h25M71 66h25M71 88h25" stroke="#b7c5c5" stroke-width="3" stroke-linecap="round"/></g><g class="st3d-pen"><g transform="rotate(30 119 65)"><rect x="113" y="25" width="12" height="65" rx="5" fill="url(#stPen)"/><rect x="113" y="25" width="12" height="13" rx="4" fill="#c5d0d8"/><path d="M113 88h12l-6 15Z" fill="#c5d0d8"/><path d="m117 98 2 5 2-5" fill="#344052"/></g></g></svg>`,chart:`<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="stBars" x2="1" y2="0"><stop stop-color="#ffae22"/><stop offset=".5" stop-color="#ffdb72"/><stop offset="1" stop-color="#e98b13"/></linearGradient></defs><ellipse cx="80" cy="113" rx="61" ry="9" fill="#d68c39" opacity=".18"/><path d="M20 99v9c0 16 120 16 120 0v-9" fill="#e7bd9c"/><ellipse cx="80" cy="99" rx="60" ry="15" fill="#fff0db"/><g class="st3d-bar b1"><rect x="34" y="70" width="23" height="31" rx="5" fill="url(#stBars)" stroke="#e99b28"/><path d="M38 75h15" stroke="#fff0ac" stroke-width="2"/></g><g class="st3d-bar b2"><rect x="68" y="52" width="23" height="49" rx="5" fill="url(#stBars)" stroke="#e99b28"/><path d="M72 57h15" stroke="#fff0ac" stroke-width="2"/></g><g class="st3d-bar b3"><rect x="102" y="32" width="23" height="69" rx="5" fill="url(#stBars)" stroke="#e99b28"/><path d="M106 37h15" stroke="#fff0ac" stroke-width="2"/></g><path class="st3d-arrow" d="M27 57Q75 49 120 13M102 13l21-3-5 21" fill="none" stroke="#f5a31d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
 const title=IS_ADMIN?'Quản trị StudyT – dễ dàng và chuyên nghiệp':'Một không gian học tập bạn sẽ yêu thích';
 const summary=IS_ADMIN?'Tổ chức kỳ thi, xây dựng ngân hàng câu hỏi, quản lý học viên và nội dung trong một giao diện thống nhất.':'Học tập, ôn thi, quản lý tài liệu, ghi chú và theo dõi tiến độ ngay tại một nơi – khoa học, tinh tế và đầy cảm hứng.';
 const feats=IS_ADMIN?[
  ['exam','Kỳ thi','Tạo, công bố và quản lý kỳ thi'],
  ['users','Tài khoản','Quản lý học viên và phân quyền'],
  ['shield','Kiểm soát','Theo dõi nội dung và quyền truy cập']
 ]:[
  ['book','Học theo môn','Tài liệu, bài ôn và sổ tay'],
  ['exam','Luyện đề','Thi thử và đánh giá kết quả'],
  ['chart','Tiến độ','Biết mình đang tiến bộ ở đâu']
 ];
 const hero=document.createElement('main');hero.id='stux-guest';
 hero.innerHTML=`
  <header class="stux-guest-nav"><a class="stux-guest-logo" href="${IS_ADMIN?'admin.html':'index.html'}" aria-label="StudyT – trang chủ"><img src="./assets/pig-logo.png" width="51" height="51" alt=""><span><strong>StudyT</strong><small>${IS_ADMIN?'KHÔNG GIAN QUẢN TRỊ':'HỌC TẬP THÔNG MINH'}</small></span></a>
   <nav aria-label="Điều hướng trang giới thiệu"><a href="#stux-intro">Giới thiệu</a><a href="#stux-why">Tính năng</a>${IS_ADMIN?'<a href="./index.html">Dành cho học viên</a>':''}</nav>
   <button type="button" class="stux-guest-outline" data-guest-login="login">Đăng nhập ${svg('arrow',16)}</button></header>
  <section class="stux-guest-hero" id="stux-intro"><div class="stux-guest-copy"><span class="stux-guest-kicker">${svg('spark',16)} STUDYT AURORA · ${IS_ADMIN?'ADMIN':'PREMIUM'}</span>
    <h1>${title}</h1><p>${summary}</p><div class="stux-guest-cta"><button class="stux-guest-primary" type="button" data-guest-login="login">${IS_ADMIN?'Đăng nhập quản trị':'Bắt đầu học ngay'} ${svg('arrow',19)}</button>${IS_ADMIN?'<a href="./index.html" class="stux-guest-secondary">Mở trang học viên</a>':'<button type="button" class="stux-guest-secondary" data-guest-login="reg">Tạo tài khoản miễn phí</button>'}</div>
    <div class="stux-guest-trust"><span>${svg('book',17)} Giáo dục tuổi trẻ</span></div></div>
    <div class="stux-guest-visual"><div class="stux-pig-energy" aria-hidden="true"><i></i><i></i><i></i><b></b></div><span class="stux-guest-orb orb-a"></span><span class="stux-guest-orb orb-b"></span><img class="stux-guest-pig" src="./assets/pig-hero.png" alt="Heo StudyT đội mũ tốt nghiệp"><div class="stux-guest-float f-one">${svg('book',19)} ${IS_ADMIN?'Quản lý môn học':'Sổ tay thông minh'}</div><div class="stux-guest-float f-two">${svg('spark',19)} Học tập đầy cảm hứng</div></div>
  </section>
  <section class="stux-guest-features" id="stux-why"><div class="stux-guest-feature-intro"><span>✦ NHỮNG GÌ STUDYT MANG LẠI</span><h2>${IS_ADMIN?'Quản lý dễ dàng hơn mỗi ngày':'Mọi thứ bạn cần để học tốt hơn'}</h2><p>${IS_ADMIN?'Một nền tảng quản trị dành cho kỳ thi, học liệu và tài khoản.':'Từ ôn tập đến kỳ thi, kết hợp công cụ trực quan và quy trình học tập quen thuộc.'}</p></div><div class="stux-guest-feature-grid">${feats.map(([ic,t,d],i)=>`<article class="stux-guest-feature"><span class="stux-guest-feature-icon c-${i}${IS_ADMIN?'':' st3d-icon'}">${IS_ADMIN?svg(ic,27):feature3d[ic]}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div></section>
  <footer class="stux-guest-footer"><span>© StudyT · Học tập cùng bạn</span><span>${IS_ADMIN?'Chỉ tài khoản quản trị được cấp quyền mới đăng nhập được.':'Đăng ký cần địa chỉ Gmail và mật khẩu.'}</span></footer>`;
 const overlay=document.createElement('div');overlay.id='stux-auth-overlay';overlay.hidden=true;
 overlay.innerHTML='<div class="stux-auth-backdrop" data-guest-dismiss="1"></div><section class="stux-auth-dialog" role="dialog" aria-modal="true" aria-label="Đăng nhập StudyT"><button type="button" class="stux-auth-close" data-guest-dismiss="1" aria-label="Đóng cửa sổ đăng nhập">'+svg('close',21)+'</button></section>';
 const brand=auth.querySelector(':scope > .brand');
 const warn=$('#cfgWarn',auth);
 const panel=auth.querySelector(':scope > .panel');
 if(brand)$('.stux-auth-dialog',overlay).append(brand);
 if(warn)$('.stux-auth-dialog',overlay).append(warn);
 if(panel)$('.stux-auth-dialog',overlay).append(panel);
 auth.prepend(hero);auth.append(overlay);
 let prevFocus=null;
 function openLogin(mode='login'){
  if(document.body.classList.contains('authed'))return;
  prevFocus=document.activeElement;
  if(typeof window.setAuthMode==='function')window.setAuthMode(mode);
  else if(mode==='reg'&&!IS_ADMIN)$('#tabReg')?.click();
  overlay.hidden=false;document.body.classList.add('stux-login-open');
  const input=mode==='reg'?$('#auName'):$('#auUser');
  requestAnimationFrame(()=>input?.focus());
 }
 function closeLogin(){overlay.hidden=true;document.body.classList.remove('stux-login-open');if(prevFocus?.isConnected)prevFocus.focus()}
 auth.addEventListener('click',e=>{
  const entry=e.target.closest('[data-guest-login]');if(entry){openLogin(IS_ADMIN?'login':entry.dataset.guestLogin);return}
  if(e.target.closest('[data-guest-dismiss]'))closeLogin();
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();closeLogin()}
  if(e.key==='Enter'&&!overlay.hidden&&e.target.matches('#auUser,#auEmail,#auPass,#auName')){e.preventDefault();$('#auGo')?.click()}
 });
 if(location.hash==='#dang-nhap'||location.hash==='#login')openLogin('login');
 if(location.hash==='#dang-ky'&&!IS_ADMIN)openLogin('reg');
 const topbar=$('#stux-topbar');
 const bell=topbar?.querySelector('[data-stux-action="news"]');
 const avatar=topbar?.querySelector('.stux-avatar');
 if(avatar){avatar.title='Tài khoản';avatar.setAttribute('aria-label','Mở menu tài khoản');avatar.setAttribute('aria-haspopup','menu')}
 if(bell&&topbar){
  const pop=document.createElement('section');pop.id='stux-news-panel';pop.hidden=true;pop.setAttribute('aria-label','Bảng tin StudyT');
  pop.innerHTML='<div class="stux-news-head"><span class="stux-news-head-icon">'+svg('bell',22)+'</span><div><strong>Bảng tin StudyT</strong><small>Thông báo và cập nhật mới nhất</small></div><button type="button" id="stux-news-close" aria-label="Đóng Bảng tin">'+svg('close',19)+'</button></div><div class="stux-news-body"><div id="stux-news-fallback">Chưa có thông báo mới.</div></div>';
  topbar.append(pop);
  const newsBox=$('#newsBox');
  if(newsBox)$('.stux-news-body',pop).append(newsBox);
  const dot=bell.querySelector('.stux-indicator');
  const countNews=()=>{
   const n=newsBox?.querySelectorAll('.news-item').length||0;
   if(dot){dot.hidden=n===0;dot.setAttribute('aria-label',n?`${n} bản tin`:'Không có bản tin')}
   const fall=$('#stux-news-fallback');if(fall)fall.hidden=n>0;
   bell.title=n?'Bảng tin ('+n+' mục)':'Bảng tin';
  };
  if(newsBox)new MutationObserver(countNews).observe(newsBox,{childList:true});
  countNews();
  const closeNews=()=>{pop.hidden=true;bell.setAttribute('aria-expanded','false');bell.classList.remove('stux-active')};
  window.stuxOpenNews=()=>{
   const willOpen=pop.hidden;
   pop.hidden=!willOpen;
   bell.setAttribute('aria-expanded',String(willOpen));bell.classList.toggle('stux-active',willOpen);
   if(willOpen){countNews();$('#stux-news-close')?.focus()}
  };
  bell.setAttribute('aria-haspopup','dialog');bell.setAttribute('aria-expanded','false');
  $('#stux-news-close')?.addEventListener('click',closeNews);
  document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&!bell.contains(e.target))closeNews()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden){closeNews();bell.focus()}});
 }
 // Account actions live exclusively in the avatar dropdown.
 // User-facing settings are accessed via avatar, not duplicated on the sidebar.
 document.body.classList.toggle('stux-admin',IS_ADMIN);
})();

/* Reset the document scroll when switching between guest and authenticated views. */
(()=>{let authed=document.body.classList.contains('authed');new MutationObserver(()=>{const next=document.body.classList.contains('authed');if(next===authed)return;authed=next;requestAnimationFrame(()=>window.scrollTo(0,0));}).observe(document.body,{attributes:true,attributeFilter:['class']});})();
