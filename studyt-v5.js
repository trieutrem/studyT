
(()=>{
  'use strict';
  const $=(s,p=document)=>p.querySelector(s);
  const IS_ADMIN=/admin\.html/i.test(location.pathname)||/Quản trị/i.test(document.title);
  const LEGACY_RE=/@(?:studyt|quizmaster)\.app$/i;
  const GMAIL_RE=/^[^\s@]+@gmail\.com$/i;
  let gateMounted=false, gateOpen=false, checkedOnce=false;

  function injectGate(){
    if(gateMounted) return;
    gateMounted=true;
    const wrap=document.createElement('section');
    wrap.id='stv5-email-gate';
    wrap.innerHTML=`<div class="stv5-card" role="dialog" aria-modal="true" aria-labelledby="stv5GateTitle">
      <div class="stv5-badge">✦ Bảo vệ tài khoản StudyT</div>
      <h3 id="stv5GateTitle">Bổ sung Gmail trước khi tiếp tục</h3>
      <p>Tài khoản cũ của bạn đang dùng địa chỉ đăng nhập kiểu cũ. Để tiếp tục sử dụng StudyT, bạn cần cập nhật sang <b>Gmail thật</b>. Mỗi Gmail chỉ nên dùng cho một tài khoản.</p>
      <div class="stv5-note">Sau khi cập nhật, từ các lần sau bạn nên đăng nhập bằng chính Gmail này. Nếu hệ thống bật xác nhận email, hãy kiểm tra hộp thư để hoàn tất xác minh.</div>
      <label for="stv5EmailInput">Nhập Gmail mới</label>
      <input id="stv5EmailInput" type="email" placeholder="tenban@gmail.com" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false">
      <div class="stv5-err" id="stv5EmailErr"></div>
      <div class="stv5-ok" id="stv5EmailOk"></div>
      <div class="stv5-actions"><button type="button" class="stv5-ghost" id="stv5GateOut">Đăng xuất</button><button type="button" class="stv5-primary" id="stv5GateSave">Cập nhật Gmail</button></div>
    </div>`;
    document.body.appendChild(wrap);
    $('#stv5GateOut',wrap)?.addEventListener('click',async()=>{
      try{ if(typeof sb!=='undefined'&&sb?.auth) await sb.auth.signOut(); }catch(e){}
      location.reload();
    });
    $('#stv5GateSave',wrap)?.addEventListener('click',submitGate);
    $('#stv5EmailInput',wrap)?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); submitGate(); } });
  }
  function setGate(open){
    injectGate();
    gateOpen=!!open;
    const gate=$('#stv5-email-gate');
    if(!gate) return;
    gate.classList.toggle('show',gateOpen);
    document.body.classList.toggle('stv5-lock',gateOpen);
    if(gateOpen){ setTimeout(()=>$('#stv5EmailInput',gate)?.focus(),20); }
  }
  function showErr(msg){ const e=$('#stv5EmailErr'); const ok=$('#stv5EmailOk'); if(ok) ok.style.display='none'; if(e){ e.textContent=msg; e.style.display='block'; } }
  function showOk(msg){ const e=$('#stv5EmailErr'); const ok=$('#stv5EmailOk'); if(e) e.style.display='none'; if(ok){ ok.textContent=msg; ok.style.display='block'; } }
  function normalizeGmail(v){
    v=String(v||'').trim().toLowerCase();
    if(!v) return '';
    const m=v.match(/^([^@\s]+)@gmail\.com$/i);
    if(!m) return v;
    let local=m[1];
    const plus=local.indexOf('+');
    if(plus!==-1) local=local.slice(0,plus);
    local=local.replace(/\./g,'');
    return local+'@gmail.com';
  }
  async function submitGate(){
    const inp=$('#stv5EmailInput');
    if(!inp) return;
    const raw=inp.value.trim();
    const val=normalizeGmail(raw);
    inp.value=raw.toLowerCase();
    if(!GMAIL_RE.test(raw)){ showErr('Hãy nhập Gmail hợp lệ, ví dụ tenban@gmail.com.'); return; }
    const btn=$('#stv5GateSave'); const out=$('#stv5GateOut');
    if(btn) btn.disabled=true; if(out) out.disabled=true;
    try{
      if(typeof sb==='undefined'||!sb?.auth) throw new Error('Chưa kết nối được hệ thống tài khoản.');
      const {error}=await sb.auth.updateUser({ email: val });
      if(error) throw error;
      try{ localStorage.setItem('studyt_gate_email_ok', String(Date.now())); }catch(e){}
      showOk('Đã gửi yêu cầu cập nhật Gmail thành công. Nếu StudyT bật xác nhận email, hãy kiểm tra hộp thư rồi đăng nhập lại bằng Gmail mới.');
      setTimeout(()=>setGate(false),1200);
    }catch(err){
      const msg=(err&&err.message)||'Không thể cập nhật Gmail.';
      showErr(/already|registered|exists/i.test(msg)?'Gmail này đã được dùng cho tài khoản khác. Hãy nhập địa chỉ khác.':msg);
    }finally{ if(btn) btn.disabled=false; if(out) out.disabled=false; }
  }
  async function requireModernEmail(){
    if(checkedOnce && !document.body.classList.contains('authed')) return;
    if(!document.body.classList.contains('authed')) return;
    checkedOnce=true;
    try{
      if(typeof sb==='undefined'||!sb?.auth) return;
      const {data:{user}}=await sb.auth.getUser();
      const email=(user&&user.email)||'';
      if(!email) return setGate(true);
      if(LEGACY_RE.test(email) || !GMAIL_RE.test(email)) return setGate(true);
      setGate(false);
    }catch(_){/* keep silent */}
  }
  function improvePerformance(){
    ['#stp-launch','#stp-panel','#stpro-launch','#studyt-pig-dock'].forEach(sel=>$(sel)?.remove());
    const shell=$('#stpro-shell'); if(shell){ shell.hidden=true; }
  }
  function fineTuneAdmin(){
    if(!IS_ADMIN) return;
    const work=$('#stnx-workspace');
    if(work){
      const closeBtn=work.querySelector('.stnx-work-header button:last-child');
      if(closeBtn) closeBtn.textContent='Đóng';
    }
  }
  function cleanupLegacyTitles(){
    // Make control center and notification areas less playful.
    const guestKicker=document.querySelector('.stux-guest-kicker');
    if(guestKicker) guestKicker.textContent=IS_ADMIN?'STUDYT AURORA · QUẢN TRỊ HỌC THUẬT':'STUDYT AURORA · KHÔNG GIAN HỌC TẬP';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    improvePerformance();
    fineTuneAdmin();
    cleanupLegacyTitles();
    requireModernEmail();
    const mo=new MutationObserver(()=>{ improvePerformance(); requireModernEmail(); });
    mo.observe(document.body,{attributes:true,attributeFilter:['class'],childList:true,subtree:false});
  });
})();
