/* StudyT Aurora V5.2: account migration, confirmed-email gate, safe legacy compatibility. */
(()=>{
'use strict';
const ADMIN_EMAIL='hktrieuvioletvc@gmail.com';
const IS_ADMIN=/admin\.html/i.test(location.pathname)||/Quản trị/i.test(document.title);
const LEGACY_RE=/@(?:studyt|quizmaster)\.app$/i;
const GMAIL_RE=/^[a-z0-9._+\-]+@gmail\.com$/i;
const $=(q,scope=document)=>scope.querySelector(q);
let mounted=false, visible=false, checking=null, lastAuthed=false, pendingEmail='';
function canonicalGmail(value){
  const v=String(value||'').trim().toLowerCase();
  const m=/^([^@\s]+)@gmail\.com$/i.exec(v);
  if(!m)return '';
  let l=m[1].split('+')[0].replace(/\./g,'');
  return /^[a-z0-9]{1,64}$/.test(l)?l+'@gmail.com':'';
}
function client(){try{return typeof sb!=='undefined'?sb:null}catch(_){return null}}
function mount(){
 if(mounted)return;mounted=true;
 const el=document.createElement('section');el.id='stv5-email-gate';
 el.innerHTML=`<div class="stv5-card" role="dialog" aria-modal="true" aria-labelledby="stv5GateTitle">
 <div class="stv5-badge">✦ Hoàn thiện tài khoản StudyT</div>
 <h3 id="stv5GateTitle">Xác nhận Gmail để tiếp tục</h3>
 <p id="stv5GateDescription">Tài khoản cũ của bạn chưa có Gmail xác thực. Hãy cập nhật Gmail để tiếp tục sử dụng StudyT.</p>
 <div class="stv5-note">Địa chỉ @studyt.app / @quizmaster.app trước đây chỉ dùng để đăng nhập, không phải hộp thư thật. Nếu Supabase yêu cầu xác nhận email cũ, việc chuyển đổi cần được quản trị viên hỗ trợ an toàn.</div>
 <label for="stv5EmailInput">Gmail của bạn</label>
 <input type="email" id="stv5EmailInput" autocomplete="email" placeholder="tenban@gmail.com" spellcheck="false" autocapitalize="none" inputmode="email">
 <div class="stv5-err" role="alert" id="stv5EmailErr"></div>
 <div class="stv5-ok" role="status" id="stv5EmailOk"></div>
 <div class="stv5-actions"><button type="button" id="stv5GateOut" class="stv5-ghost">Đăng xuất</button><button type="button" id="stv5CheckEmail" class="stv5-ghost">Tôi đã xác nhận</button><button type="button" id="stv5GateSave" class="stv5-primary">Gửi email xác nhận</button></div>
 </div>`;
 document.body.append(el);
 $('#stv5GateOut').addEventListener('click',async()=>{
  try{const s=client();if(s)await s.auth.signOut()}catch(_){}
  location.reload();
 });
 $('#stv5GateSave').addEventListener('click',()=>void submit());
 $('#stv5CheckEmail').addEventListener('click',()=>void check(true));
 $('#stv5EmailInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();void submit()}});
}
function status(message,ok){
 const good=$('#stv5EmailOk'),bad=$('#stv5EmailErr');
 if(!good||!bad)return;
 good.style.display=ok?'block':'none';bad.style.display=ok?'none':'block';
 (ok?good:bad).textContent=message;
}
function display(open){
 mount();visible=!!open;
 $('#stv5-email-gate').classList.toggle('show',visible);
 document.body.classList.toggle('stv5-lock',visible);
 if(visible&&document.activeElement!==$('#stv5EmailInput'))$('#stv5EmailInput').focus();
}
function isReady(user){
 const email=String(user?.email||'').toLowerCase();
 if(IS_ADMIN)return email===ADMIN_EMAIL && Boolean(user?.email_confirmed_at);
 return GMAIL_RE.test(email)&&!LEGACY_RE.test(email)&&Boolean(user?.email_confirmed_at);
}
function renderProfileMessage(user){
 const p=$('#stv5GateDescription');if(!p)return;
 const current=String(user?.email||'');
 if(IS_ADMIN){
  p.textContent=`Chỉ ${ADMIN_EMAIL} được sử dụng tại trang quản trị. Email xác thực hiện tại là ${current||'chưa có'}. Quản trị viên cần chuyển email trên chính tài khoản Supabase cũ, không tạo tài khoản mới.`;
  const input=$('#stv5EmailInput'); if(input){input.value=ADMIN_EMAIL;input.readOnly=true;}
 }else{
  p.textContent=LEGACY_RE.test(current)?'Tài khoản trước đây dùng email đăng nhập nội bộ. Hãy nhập Gmail thật và xác nhận để tiếp tục.':'Gmail của bạn chưa được xác nhận. Hãy hoàn tất xác nhận email rồi chọn “Tôi đã xác nhận”.';
 }
}
async function check(manual=false){
 if(checking)return checking;
 if(!document.body.classList.contains('authed')){display(false);return false}
 checking=(async()=>{
  try{
   const s=client();if(!s)throw new Error('Không kết nối được dịch vụ xác thực.');
   if(manual){const refreshed=await s.auth.refreshSession();if(refreshed.error)throw refreshed.error;}
   const res=await s.auth.getUser();if(res.error)throw res.error;
   const u=res.data?.user;
   if(isReady(u)){display(false);return true}
   display(true);renderProfileMessage(u);
   if(manual)status('Gmail chưa được xác nhận hoặc vẫn đang chờ thay đổi. Hãy mở liên kết trong Gmail, hoặc liên hệ quản trị nếu email cũ không nhận được thư.',false);
   return false;
  }catch(e){
   display(true);status('Chưa thể kiểm tra trạng thái tài khoản: '+String(e?.message||'Lỗi xác thực')+'. Bạn có thể thử lại hoặc đăng xuất.',false);
   return false;
  }finally{checking=null;}
 })();
 return checking;
}
async function submit(){
 const input=$('#stv5EmailInput'),raw=String(input?.value||'').trim().toLowerCase();
 const email=IS_ADMIN?ADMIN_EMAIL:canonicalGmail(raw);
 if(!email || (!IS_ADMIN&&!GMAIL_RE.test(raw))){status('Vui lòng nhập Gmail hợp lệ, ví dụ tenban@gmail.com.',false);return}
 if(!IS_ADMIN&&email===ADMIN_EMAIL){status('Gmail này dành riêng cho quản trị viên. Hãy sử dụng Gmail khác.',false);return}
 const s=client();if(!s){status('Chưa kết nối Supabase.',false);return}
 const send=$('#stv5GateSave'),checkBtn=$('#stv5CheckEmail');
 if(send)send.disabled=true;if(checkBtn)checkBtn.disabled=true;
 try{
  const redirect=location.origin + (IS_ADMIN?'/admin.html':'/');
  const {data,error}=await s.auth.updateUser({email},{emailRedirectTo:redirect});
  if(error)throw error;
  pendingEmail=email;
  const fresh=await s.auth.getUser();
  if(!fresh.error&&isReady(fresh.data?.user)){display(false);return}
  display(true);
  status('Đã gửi yêu cầu thay đổi Gmail. Vui lòng mở thư xác nhận tại '+email+' rồi nhấn “Tôi đã xác nhận”. Nếu thư yêu cầu xác nhận cả email cũ @studyt.app không tồn tại, hãy liên hệ quản trị viên để chuyển đổi tài khoản trong Supabase.',true);
 }catch(e){
  const m=String(e?.message||'Không thể cập nhật email.');
  status(/already|registered|exists|in use/i.test(m)?'Gmail này có thể đã được sử dụng cho tài khoản khác. Vui lòng dùng địa chỉ Gmail khác.':/email address.*invalid/i.test(m)?'Supabase từ chối email đăng nhập nội bộ hiện tại. Bạn cần nhờ quản trị viên cập nhật email ngay trên tài khoản Supabase cũ (giữ nguyên UID).':m,false);
 }finally{if(send)send.disabled=false;if(checkBtn)checkBtn.disabled=false}
}
function cleanUpLegacy(){
 // Premium launchers are redundant; keep underlying StudyT applications intact.
 for(const sel of ['#stp-launch','#stp-panel','#stpro-launch','#studyt-pig-dock'])$(sel)?.remove();
 $('#stpro-shell')?.setAttribute('hidden','');
}
function enhance(){
 cleanUpLegacy();
 const heading=$('.stux-guest-kicker');if(heading)heading.textContent=IS_ADMIN?'STUDYT · QUẢN TRỊ HỌC THUẬT':'STUDYT · KHÔNG GIAN HỌC TẬP';
}
function boot(){
 enhance();
 lastAuthed=document.body.classList.contains('authed');
 if(lastAuthed)void check();
 const observer=new MutationObserver(()=>{
  const now=document.body.classList.contains('authed');
  if(now!==lastAuthed){lastAuthed=now;if(now)void check();else display(false)}
 });
 observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 const authSignal=()=>{if(document.body.classList.contains('authed'))void check()};
 // Check again when navigating back from a confirmation email.
 window.addEventListener('focus',authSignal);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')authSignal()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
