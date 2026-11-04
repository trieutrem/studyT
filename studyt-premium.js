/* StudyT Aurora UI — progressive presentation layer; no Supabase writes, no existing function replacement. */
(()=>{
 'use strict';
 const IS_ADMIN=/\badmin\.html(?:$|[?#])/i.test(location.pathname) || /Quản trị/i.test(document.title);
 const root=document.getElementById('landingView');
 if(!root || document.getElementById('stux-topbar'))return;
 const $=(sel,scope=document)=>scope.querySelector(sel);
 const $$=(sel,scope=document)=>Array.from(scope.querySelectorAll(sel));
 const paths={
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',moon:'<path d="M20.8 13a9 9 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',star:'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.2 1.2 7.1L12 18.7l-6.4 3.3 1.2-7.1L1.5 9.7l7.3-1.1Z"/>',
  clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5h6m-6 6h6m-6 4h6"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  chart:'<path d="M4 20V11m6 9V4m6 16v-7m5 7H3"/>',check:'<path d="m5 12 4 4L19 6"/>',
  book:'<path d="M12 7c-3-2-6-2-10-1v13c4-1 7-1 10 1 3-2 6-2 10-1V6c-4-1-7-1-10 1Zm0 0v13"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  file:'<path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 0v6h6"/><path d="M8 13h8m-8 4h8"/>',
  shield:'<path d="m12 2 9 4v6c0 5-3 8-9 10-6-2-9-5-9-10V6Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3c0-3 3-5 6-5s6 2 6 5v3M17 5a3 3 0 0 1 0 6m1 3c2 1 3 2 3 4v3"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
  sparkles:'<path d="m12 2 2.1 6 6 2.1-6 2.1L12 18l-2.1-5.8L4 10.1l5.9-2.1ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8Z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l-2 2a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5h-2.8a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-2-2A1.6 1.6 0 0 0 7.6 15a1.6 1.6 0 0 0-1.5-1H4v-3h2.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l2-2a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5H15a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l2 2a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H23v3h-2.1a1.6 1.6 0 0 0-1.5 1Z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  logout:'<path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5m6-4 4-4-4-4m4 4H9"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'
 };
 const icon=(n,size=20)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]||paths.sparkles}</svg>`;
 const label=IS_ADMIN?'Quản trị':'Học viên';
 const heroHeading=IS_ADMIN?'Xin chào, quản trị viên!':'Chào bạn!';
 const heroIntro=IS_ADMIN?'Quản lý StudyT trực quan, mượt mà và hiệu quả hơn mỗi ngày.':'Cùng StudyT chinh phục tri thức nhé!';
 const heroQuote=IS_ADMIN?'Tổ chức nội dung khoa học – vận hành đơn giản – kiểm soát rõ ràng.':'Học không phải để biết, mà để làm được những điều tuyệt vời hơn!';
 const features=IS_ADMIN?[
  {title:'Quản lý kỳ thi',desc:'Đề thi, kết quả và lần thi',img:'feature-notebook.png',action:'exam'},
  {title:'Quản lý bài ôn',desc:'Môn học, chương và tài liệu',img:'feature-brain.png',action:'practice'},
  {title:'Quản lý tài khoản',desc:'Người dùng và phân quyền',img:'feature-timer.png',action:'users'},
  {title:'Công cụ quản trị',desc:'Kiểm duyệt, nhật ký và dữ liệu',img:'feature-chart.png',action:'pro'}
 ]:[
  {title:'Sổ tay kiến thức',desc:'Ghi chú, tóm tắt, trích dẫn',img:'feature-notebook.png',action:'pro'},
  {title:'Ôn tập thông minh',desc:'Flashcard, ghi nhớ và luyện lại',img:'feature-brain.png',action:'practice'},
  {title:'Thi thử & luyện đề',desc:'Bài thi và phân tích kết quả',img:'feature-timer.png',action:'exam'},
  {title:'Theo dõi kết quả',desc:'Tiến độ, điểm số và hiệu quả',img:'feature-chart.png',action:'analytics'}
 ];
 const sidebar=$('#homeTabs',root);
 if(sidebar){
  if(!$('#stux-brand',sidebar)){
   const brand=document.createElement('div');brand.className='stux-brand';brand.id='stux-brand';brand.setAttribute('role','button');brand.setAttribute('tabindex','0');brand.setAttribute('data-stux-action','home');
   brand.innerHTML='<img src="./assets/pig-logo.png" alt="" width="54" height="54"><span><strong>StudyT</strong><small>'+label.toUpperCase()+'</small></span>';
   sidebar.prepend(brand);
   brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();brand.click();}});
   const foot=document.createElement('div');foot.className='stux-sidefoot';
   foot.innerHTML='<img src="./assets/pig-sidebar.png" alt="" loading="lazy"><div class="stux-sidefoot-card"><strong>✦ Mỗi ngày tiến bộ</strong><span>'+(IS_ADMIN?'Quản lý mọi thứ dễ dàng hơn.':'Một chút nỗ lực, nhiều kiến thức.')+'</span><a href="#" data-stux-action="pro">Mở không gian StudyT '+icon('arrow',14)+'</a></div>';
   sidebar.append(foot);
  }
 }
 const topbar=document.createElement('div');topbar.id='stux-topbar';topbar.className='stux-topbar';
 topbar.innerHTML=`<button type="button" class="stux-mobile-nav" data-stux-action="menu" aria-label="Mở điều hướng">${icon('menu',22)}</button>
  <button type="button" class="stux-search-trigger" data-stux-action="search" title="Tìm nhanh (Ctrl + K)">${icon('search',22)}<span>Tìm kiếm đề thi, tài liệu, ghi chú...</span><kbd>Ctrl + K</kbd></button>
  <div class="stux-top-actions"><button type="button" class="stux-tool-btn" data-stux-action="news" aria-label="Bảng tin và thông báo" title="Thông báo">${icon('bell',21)}<i class="stux-indicator"></i></button>
  <button type="button" class="stux-tool-btn" data-stux-action="theme" aria-label="Chuyển sáng/tối" title="Đổi giao diện">${icon('sun',20)}<span class="stux-tool-divider"></span>${icon('moon',18)}</button>
  <button type="button" class="stux-avatar" data-stux-action="accountMenu" aria-haspopup="menu" aria-expanded="false" aria-label="Mở tài khoản và cài đặt">${IS_ADMIN?'Q':'S'}</button></div>`;
 const accountMenu=document.createElement('div');accountMenu.id='stux-user-menu';accountMenu.className='stux-user-menu';accountMenu.setAttribute('role','menu');accountMenu.hidden=true;
 const menuItems=[
  ['settings','settings','Cài đặt giao diện'],
  ...(IS_ADMIN?[['users','users','Quản lý tài khoản'],['book','studentSite','Trang học viên'],['download','backup','Sao lưu dữ liệu'],['file','restore','Khôi phục dữ liệu']]:[]),
  ['logout','logout','Đăng xuất']
 ];
 accountMenu.innerHTML='<div class="stux-menu-heading"><strong>StudyT · '+label+'</strong><small id="stux-menu-user">Tài khoản hiện tại</small></div>'+menuItems.map(([ico,action,title])=>'<button type="button" role="menuitem" data-stux-action="'+action+'">'+icon(ico,19)+'<span>'+title+'</span></button>').join('');
 topbar.append(accountMenu);
 const header=$('header.landing-nav',root);
 if(header)header.insertAdjacentElement('afterend',topbar);else root.prepend(topbar);
 const pane=$('.home-pane[data-pane="home"]',root);
 if(!pane)return;
 const dash=document.createElement('section');dash.id='stux-dashboard';dash.className='stux-dashboard';dash.setAttribute('aria-label',IS_ADMIN?'Tổng quan quản trị':'Tổng quan học tập');
 const card=f=>`<button type="button" class="stux-feature-card" data-stux-action="${f.action}"><span class="stux-feature-img"><img src="./assets/${f.img}" loading="lazy" alt=""></span><strong>${f.title}</strong><span>${f.desc}</span></button>`;
 const tasks=IS_ADMIN?[
  {ico:'clipboard',title:'Kiểm tra kỳ thi',desc:'Xem danh sách và tình trạng đề',action:'exam'},
  {ico:'book',title:'Rà soát nội dung',desc:'Môn học, chương, tài liệu',action:'practice'},
  {ico:'shield',title:'Kiểm tra tài khoản',desc:'Quản lý quyền truy cập',action:'users'}
 ]:[
  {ico:'book',title:'Ôn tập trắc nghiệm',desc:'Luyện từ bộ câu hỏi của bạn',action:'quiz'},
  {ico:'calendar',title:'Tiếp tục ôn tập',desc:'Mở các bài ôn theo môn học',action:'practice'},
  {ico:'chart',title:'Xem thống kê',desc:'Theo dõi điểm và những câu sai',action:'analytics'}
 ];
 dash.innerHTML=`<div class="stux-hero-grid"><section class="stux-hero"><div class="stux-hero-copy"><span class="stux-eyebrow">${icon('sparkles',15)} STUDYT · ${IS_ADMIN?'ADMIN PREMIUM':'LEARNING PREMIUM'}</span><h1>${heroHeading} <span>👋</span></h1><p>${heroIntro}</p><div class="stux-quote"><span>❝</span><span>${heroQuote}</span></div></div><img class="stux-hero-pig" src="./assets/pig-hero.png" alt="Heo StudyT đội mũ tốt nghiệp, đang đọc sách"></section>
 <section class="stux-progress-card"><div class="stux-section-heading"><h2>${IS_ADMIN?'Tổng quan xuất bản':'Tiến độ học tập'}</h2><span class="stux-glow-dot"></span></div><div class="stux-progress-ring" id="stux-ring" role="button" tabindex="0" data-stux-action="goal" title="Nhấn để chỉnh mục tiêu học" style="--stux-angle:0%"><div><strong id="stux-ring-number">—</strong><small id="stux-ring-caption">Đang cập nhật</small></div></div><div class="stux-progress-legend"><span><i></i><span id="stux-progress-legend-a">${IS_ADMIN?'Đã công bố':'Đã thực hiện'}</span></span><strong id="stux-progress-count-a">—</strong></div><div class="stux-progress-legend"><span><i class="muted"></i>${IS_ADMIN?'Chưa công bố':'Mục tiêu còn lại'}</span><strong id="stux-progress-count-b">—</strong></div><button type="button" class="stux-progress-link" data-stux-action="${IS_ADMIN?'exam':'analytics'}">Xem chi tiết ${icon('arrow',17)}</button></section></div>
 <div class="stux-stat-grid"><button class="stux-stat-card blue" type="button" data-stux-action="${IS_ADMIN?'practice':'practice'}"><span class="stux-stat-icon">${icon('book',29)}</span><span><small>${IS_ADMIN?'Môn học':'Tổng môn học'}</small><strong id="stux-stat-subjects">—</strong><em>${IS_ADMIN?'Môn đang quản lý':'Môn đang có'}</em></span></button>
 <button class="stux-stat-card mint" type="button" data-stux-action="${IS_ADMIN?'exam':'analytics'}"><span class="stux-stat-icon">${icon('check',29)}</span><span><small>${IS_ADMIN?'Kỳ thi':'Bài thi đã làm'}</small><strong id="stux-stat-attempts">—</strong><em>${IS_ADMIN?'Trong hệ thống':'Trong lịch sử'}</em></span></button>
 <button class="stux-stat-card pink" type="button" data-stux-action="${IS_ADMIN?'practice':'analytics'}"><span class="stux-stat-icon">${icon('star',29)}</span><span><small>${IS_ADMIN?'Tài liệu':'Điểm trung bình'}</small><strong id="stux-stat-average">—</strong><em>${IS_ADMIN?'Nội dung được quản lý':'Thang điểm 10'}</em></span></button>
 <button class="stux-stat-card peach" type="button" data-stux-action="${IS_ADMIN?'news':'pro'}"><span class="stux-stat-icon">${icon('clock',29)}</span><span><small>${IS_ADMIN?'Thông báo':'Công cụ hỗ trợ'}</small><strong id="stux-stat-fourth">${IS_ADMIN?'—':'ST PRO'}</strong><em>${IS_ADMIN?'Trong bảng tin':'Sổ tay & ôn tập'}</em></span></button></div>
 <div class="stux-content-grid"><section class="stux-glass-card stux-feature-panel"><div class="stux-panel-title"><h2><span>✨</span> Tính năng nổi bật</h2><button type="button" data-stux-action="${IS_ADMIN?'practice':'pro'}">Khám phá ${icon('arrow',17)}</button></div><div class="stux-features">${features.map(card).join('')}</div></section>
 <section class="stux-glass-card stux-today-panel"><div class="stux-panel-title"><h2>${IS_ADMIN?'Việc cần quản lý':'Lịch ôn tập'}</h2><button type="button" data-stux-action="${IS_ADMIN?'pro':'practice'}">Xem thêm ${icon('arrow',17)}</button></div><div class="stux-today-sub">${IS_ADMIN?'Truy cập nhanh các tác vụ thường dùng':'Gợi ý hoạt động hôm nay, không phải lịch đã đặt'}</div><div class="stux-task-list">${tasks.map((t,i)=>`<button type="button" class="stux-task" data-stux-action="${t.action}"><span class="stux-task-ico tone-${i}">${icon(t.ico,20)}</span><span><strong>${t.title}</strong><small>${t.desc}</small></span>${icon('arrow',16)}</button>`).join('')}</div></section></div>
 <div class="stux-bottom-grid"><section class="stux-glass-card stux-activity-card"><div class="stux-panel-title"><h2>⭐ ${IS_ADMIN?'Hoạt động hệ thống':'Hoạt động gần đây'}</h2><button type="button" data-stux-action="${IS_ADMIN?'news':'analytics'}">Xem chi tiết ${icon('arrow',17)}</button></div><div id="stux-activity-list" class="stux-activity-list"><div class="stux-empty">Đang tải dữ liệu...</div></div></section>
 <section class="stux-banner"><img src="./assets/pig-trophy.png" loading="lazy" alt="Heo StudyT nâng cúp"><div><strong>StudyT <span>${IS_ADMIN?'Admin':'Pro'}</span></strong><p>${IS_ADMIN?'Bộ công cụ quản trị trong một không gian thống nhất.':'Nâng tầm học tập với sổ tay và công cụ thông minh!'}</p><button type="button" data-stux-action="pro">Khám phá ngay ${icon('arrow',17)}</button></div></section></div></section>`;
 pane.prepend(dash);
 function runAction(action){
  function nav(p){const b=$(`#homeTabs button[data-p="${p}"]`);if(b){b.click();return true}return false}
  function source(id){const el=document.getElementById(id);if(el){el.click();return true}return false}
  if(action!=='accountMenu'){
   const m=$('#stux-user-menu');if(m)m.hidden=true;
   const a=$('.stux-avatar');if(a)a.setAttribute('aria-expanded','false');
  }
  switch(action){
   case 'accountMenu':runAction('settings');break;
   case 'logout':{const btn=$('header.landing-nav button[onclick="doLogout()"]',root);if(btn)btn.click();break;}
   case 'backup':{const btn=$('header.landing-nav button[onclick="backupAll()"]',root);if(btn)btn.click();break;}
   case 'restore':{const inp=$('#restoreFile');if(inp)inp.click();break;}
   case 'studentSite':location.href='index.html';break;
   case 'goal':{if(IS_ADMIN){runAction('exam');break;}const k='stux_exams_goal_'+(typeof me!=='undefined'&&me?.id||'guest');let old=5;try{old=Number(localStorage.getItem(k))||5}catch(e){}const v=prompt('Bạn muốn đặt mục tiêu bao nhiêu lượt thi?',String(old));if(v!==null){const n=Number(v);if(Number.isInteger(n)&&n>=1&&n<=1000){try{localStorage.setItem(k,String(n))}catch(e){}refresh()}else alert('Hãy nhập số nguyên từ 1 đến 1000.')}break;}
   case 'home':nav('home');break;
   case 'practice':nav('pr');break;
   case 'exam':nav('exam');break;
   case 'analytics':nav('home');setTimeout(()=>{const e=$('#dashHead')||$('#dashView');if(e)e.scrollIntoView({behavior:'smooth',block:'start'});},150);break;
   case 'news':if(typeof window.stuxOpenNews==='function')window.stuxOpenNews();break;
   case 'quiz':if(typeof window.openMode==='function')window.openMode('quiz');else nav('self');break;
   case 'essay':if(typeof window.openMode==='function')window.openMode('essay');else nav('self');break;
   case 'pro':source('stpro-launch');break;
   case 'search':source('stp-launch');setTimeout(()=>{const p=$('#stp-panel');if(p){const i=$('input[type="search"],input[type="text"]',p);if(i)i.focus();}},90);break;
   case 'settings':if(!nav('st'))source('btnUsers');break;
   case 'users':if(!source('btnUsers'))nav('st');break;
   case 'theme':{const sel=$('#themeSelect');if(sel){sel.value=(sel.value==='dark'?'light':'dark');sel.dispatchEvent(new Event('change',{bubbles:true}));}break;}
   case 'menu':{const bar=$('#homeTabs');if(bar){bar.classList.toggle('stux-mobile-open');}break;}
  }
 }
 root.addEventListener('click',event=>{const target=event.target.closest('[data-stux-action]');if(!target||!root.contains(target))return;event.preventDefault();event.stopPropagation();runAction(target.dataset.stuxAction)});
 root.addEventListener('keydown',event=>{const target=event.target.closest('[data-stux-action][role="button"]');if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();target.click()}});
 document.addEventListener('click',event=>{if(!topbar.contains(event.target)){const m=$('#stux-user-menu');if(m)m.hidden=true;const a=$('.stux-avatar');if(a)a.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){const m=$('#stux-user-menu');if(m&&!m.hidden){m.hidden=true;const a=$('.stux-avatar');if(a){a.setAttribute('aria-expanded','false');a.focus()}}}});
 function setText(id,val){const e=document.getElementById(id);if(e)e.textContent=val}
 const safeArray=(fn)=>{try{const a=fn();return Array.isArray(a)?a:null}catch(e){return null}};
 function refresh(){
  const snap=typeof window.__stuxReadStats==='function'?window.__stuxReadStats():null;
  const attempts=snap?snap.attempts:safeArray(()=>DSH.recs);
  const subjectFolders=snap?Array.from({length:snap.subjectCount}):safeArray(()=>pfs);
  const otherSubjects=snap?Array.from({length:snap.localSubjects}):safeArray(()=>subjects);
  const examinations=snap?snap.exams:safeArray(()=>exams);
  const documents=snap?Array.from({length:snap.documentCount}):safeArray(()=>docs);
  const notices=$$('#newsBox .news-item');
  const countSubjects=subjectFolders?.length||otherSubjects?.filter(s=>s.id!=='srv').length||0;
  const attemptsCount=attempts?.length||0;
  setText('stux-stat-subjects',String(countSubjects));
  setText('stux-stat-attempts',String(IS_ADMIN?(examinations?.length||0):attemptsCount));
  if(IS_ADMIN){setText('stux-stat-average',String(documents?.length||0));setText('stux-stat-fourth',String(notices.length));}
  else{const scores=(attempts||[]).map(a=>Number(a.score)).filter(n=>Number.isFinite(n));setText('stux-stat-average',scores.length?(scores.reduce((x,y)=>x+y,0)/scores.length).toFixed(1):'—');}
  let percent=0,primary=0,secondary=0,caption='Chưa có dữ liệu';
  if(IS_ADMIN){const verified=examinations?.filter(e=>typeof e.published==='boolean')||[];const pub=verified.filter(e=>e.published).length;percent=verified.length?Math.round(100*pub/verified.length):0;primary=pub;secondary=verified.length-pub;caption=verified.length?'Đã công bố':examinations?.length?'Chưa xác minh trạng thái':'Chưa có kỳ thi';}
  else{let goal=5;try{const k='stux_exams_goal_'+(typeof me!=='undefined'&&me?.id||'guest');const stored=Number(localStorage.getItem(k));if(Number.isInteger(stored)&&stored>0)goal=stored;}catch(e){}percent=Math.min(100,Math.round(attemptsCount/goal*100));primary=attemptsCount;secondary=Math.max(0,goal-attemptsCount);caption='Mục tiêu '+goal+' bài thi';}
  const ring=$('#stux-ring');if(ring)ring.style.setProperty('--stux-angle',percent+'%');
  setText('stux-ring-number',percent+'%');setText('stux-ring-caption',caption);
  setText('stux-progress-count-a',String(primary));setText('stux-progress-count-b',String(secondary));
  const activity=$('#stux-activity-list');if(!activity)return;
  activity.replaceChildren();
  const makeItem=(ico,title,subtitle,cls)=>{const row=document.createElement('div');row.className='stux-activity-row';const symbol=document.createElement('span');symbol.className='stux-activity-symbol '+cls;symbol.innerHTML=icon(ico,20);const body=document.createElement('span');const h=document.createElement('strong');h.textContent=title;const s=document.createElement('small');s.textContent=subtitle;body.append(h,s);row.append(symbol,body);activity.append(row)};
  if(IS_ADMIN){makeItem('shield','Khu vực quản trị StudyT','Các chức năng quản trị được giữ nguyên','mint');makeItem('file',`${examinations?.length||0} kỳ thi được tải trong giao diện`,'Theo dữ liệu có trên trang','lavender');makeItem('bell',`${notices.length} mục hiển thị trên bảng tin`,'Chỉ tính thông báo đang hiển thị','peach');}
  else if(attempts?.length){attempts.slice().sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,3).forEach(a=>{const date=new Date(a.at);const day=isNaN(date)?'':date.toLocaleDateString('vi-VN');makeItem('check',String(a.subj||'Bài thi'),`Điểm ${Number(a.score||0).toFixed(1)}/10 · ${day}`,'mint')});}
  else{makeItem('book','Bạn chưa có lượt thi để thống kê','Bắt đầu ôn tập hoặc làm bài thi đầu tiên','lavender');makeItem('star','Sổ tay kiến thức luôn sẵn sàng','Chọn biểu tượng heo để mở không gian ST PRO','peach');}
 }
 try{refresh();}catch(e){console.warn('StudyT Aurora: metrics display unavailable',e)}
 ['subjectGrid','newsBox'].forEach(id=>{const e=document.getElementById(id);if(e){let delay;new MutationObserver(()=>{clearTimeout(delay);delay=setTimeout(refresh,180)}).observe(e,{childList:true,subtree:false})}});
 window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 const timer=setInterval(()=>{if(document.body.classList.contains('authed'))refresh()},20000);
 // Expose a read-only manual refresh hook for diagnostics; no backend side effects.
 window.stuxRefresh=refresh;
 const avatar=$('.stux-avatar');
 const updateAvatar=()=>{const w=$('#whoami');const raw=w?.textContent?.trim()||'';const m=raw.match(/[A-Za-zÀ-ỹ0-9]/);if(avatar&&m)avatar.textContent=m[0].toUpperCase()};
 updateAvatar();const who=$('#whoami');if(who)new MutationObserver(updateAvatar).observe(who,{childList:true,characterData:true,subtree:true});
})();
