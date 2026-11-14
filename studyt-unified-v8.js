/* StudyT V8 · New student menu and electronics placeholder. No auth or database writes. */
(()=>{'use strict';
const ADMIN=/admin\.html/i.test(location.pathname)||/Quản trị/i.test(document.title);
const q=(s,p=document)=>p.querySelector(s);
const language=()=>document.documentElement.lang==='en'?'en':'vi';
const translations={vi:{link:'Điện tử',heading:'Xác nhận thông tin điện tử',description:'Nhập thông tin cơ bản để chuẩn bị cho tính năng sắp ra mắt.',id:'Mã ID',name:'Họ và tên',birth:'Ngày sinh',agree:'Tôi đã kiểm tra và xác nhận các thông tin trên là chính xác.',submit:'Xác nhận thông tin',soon:'Tính năng sẽ được cập nhật sau. Thông tin tại biểu mẫu này chưa được lưu hoặc gửi đi.',missing:'Vui lòng nhập đầy đủ ID, họ tên và ngày sinh.',unconfirmed:'Hãy đánh dấu ô xác nhận trước khi tiếp tục.',future:'Ngày sinh không thể ở tương lai.',success:'Đã kiểm tra biểu mẫu. Tính năng sẽ được cập nhật sau; dữ liệu chưa được lưu.',tasks:'🎯 Nhiệm vụ',add:'+ Thêm đầu việc',assignment:'Bài tập & Đồ án',backup:'Tải bản sao lưu',choose:'Chọn bản sao…',export:'Xuất bản sao',import:'Nhập bản sao'},en:{link:'Electronic',heading:'Electronic information',description:'Enter basic details for an upcoming feature.',id:'ID',name:'Full name',birth:'Date of birth',agree:'I have checked and confirm these details are accurate.',submit:'Confirm details',soon:'This feature is coming soon. The details in this form are not saved or sent anywhere.',missing:'Please enter your ID, full name, and date of birth.',unconfirmed:'Please tick the confirmation box.',future:'Date of birth cannot be in the future.',success:'Form checked. This feature is coming soon; your data was not stored.',tasks:'🎯 Tasks',add:'+ Add task',assignment:'Assignments & Projects',backup:'Download backup',choose:'Choose backup…',export:'Export backup',import:'Import backup'}};
const T=k=>translations[language()][k];
function addElectronic(){if(ADMIN)return;
 const root=q('#landingView'),bar=q('#homeTabs'),main=q('#homeTabs button[data-p="tk"]'),subs=q('#homeTabs .nv-subs');
 if(!root||!bar||!main||!subs)return;
 let btn=q('#homeTabs button[data-p="dientu"]');if(!btn){btn=document.createElement('button');btn.type='button';btn.dataset.p='dientu';btn.innerHTML='<span class="ic" aria-hidden="true">🪪</span><span></span>';subs.after(btn)}
 const caption=q('span:last-child',btn);if(caption&&caption.textContent!==T('link'))caption.textContent=T('link');
 let pane=q('#studyt-electronic-pane');if(!pane){pane=document.createElement('div');pane.className='home-pane';pane.dataset.pane='dientu';pane.id='studyt-electronic-pane';
 pane.innerHTML='<section class="studyt-electronic"><div class="se-kicker">STUDYT · ELECTRONIC</div><h2 data-se-label="heading"></h2><p data-se-label="description"></p><form id="studyt-electronic-form" novalidate><div class="studyt-electronic-grid"><label><span data-se-label="id"></span><input name="studentId" type="text" maxlength="64" autocomplete="off" required></label><label><span data-se-label="name"></span><input name="fullName" type="text" maxlength="120" autocomplete="name" required></label><label><span data-se-label="birth"></span><input name="birth" type="date" required></label><label class="se-check"><input name="agree" type="checkbox" required><span data-se-label="agree"></span></label></div><div class="se-info" data-se-label="soon"></div><div class="se-actions"><button type="submit" class="primary" data-se-label="submit"></button><span class="se-message" id="studyt-electronic-status" role="status" aria-live="polite"></span></div></form></section>';
 root.appendChild(pane);
 q('#studyt-electronic-form',pane).addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,msg=q('#studyt-electronic-status',pane);const id=f.elements.studentId.value.trim(),name=f.elements.fullName.value.trim(),birth=f.elements.birth.value;
 if(!id||!name||!birth){msg.textContent=T('missing');return}if(!f.elements.agree.checked){msg.textContent=T('unconfirmed');return}if(new Date(birth+'T00:00:00')>new Date()){msg.textContent=T('future');return}msg.textContent=T('success');
 // Future feature placeholder: No localStorage, sessionStorage or network request with identifying data.
 });}
 pane.querySelectorAll('[data-se-label]').forEach(el=>{const value=T(el.dataset.seLabel);if(el.textContent!==value)el.textContent=value});
}
function updateAssignments(){if(ADMIN)return;const h=q('#tkPane .tk-h');if(!h)return;const b=q('.tk-open-tasks',h);if(b&&b.textContent!==T('tasks'))b.textContent=T('tasks');const a=q('[onclick="tkA.add()"]',h);if(a&&a.textContent!==T('add'))a.textContent=T('add');const title=q('h2',h);if(title&&title.textContent!==T('assignment'))title.textContent=T('assignment')}
function updateBackups(){[['#dtExp','backup'],['#dtImpB','choose'],['#essayExportBtn','export'],['#essayImportBackupBtn','import']].forEach(([selector,key])=>{const button=q(selector);if(button&&button.textContent!==T(key))button.textContent=T(key)})}
let scheduled=false;
function update(){if(scheduled)return;scheduled=true;try{addElectronic();updateAssignments();updateBackups()}finally{scheduled=false}}
function boot(){update();const bar=q('#homeTabs'),root=q('#landingView');if(bar)new MutationObserver(()=>queueMicrotask(update)).observe(bar,{childList:true});
 if(root)new MutationObserver(changes=>{if(changes.some(c=>Array.from(c.addedNodes).some(n=>n.nodeType===1&&(n.id==='tkPane'||n.id==='dtBox'||n.id==='studyt-electronic-pane'||n.querySelector?.('.tk-h,#dtExp')))))queueMicrotask(update)}).observe(root,{childList:true,subtree:true});
 document.addEventListener('click',()=>setTimeout(update,85),true);document.addEventListener('change',()=>setTimeout(update,85),true);window.addEventListener('storage',update);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
