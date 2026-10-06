const menuToggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const dropdown = document.querySelector('.has-dropdown');
const dropBtn = document.querySelector('.dropbtn');

if (menuToggle && navPanel) {
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = navPanel.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navPanel.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('click', (e) => {
    if (!navPanel.contains(e.target) && !menuToggle.contains(e.target)) {
      navPanel.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (dropdown && dropBtn) {
  dropBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('open');
    dropBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      dropBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.navbar-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navPanel?.classList.remove('open');
    dropdown?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.classList.remove('active');
  });
});

const modal = document.getElementById('timelineModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalRef = document.getElementById('modalRef');

document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    if (modalTitle) modalTitle.textContent = item.dataset.title || '';
    if (modalText) modalText.textContent = item.dataset.text || '';
    if (modalRef) modalRef.textContent = 'Referensi: ' + (item.dataset.ref || '');
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});

function closeTimelineModal() {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
}
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeTimelineModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTimelineModal(); });

const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('show', window.scrollY > 450);
  const sections = document.querySelectorAll('main section[id], header[id]');
  let current = 'home';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 140) current = section.id;
  });
  document.querySelectorAll('.navbar-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});
backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Animasi masuk saat elemen terlihat.
const revealItems = document.querySelectorAll('.about-card, .feature-card, .schedule-card, .media-card, .contact-card, .timeline-item, .section-heading');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
revealItems.forEach(el => { el.classList.add('reveal'); observer.observe(el); });


// Professional scroll reveal
const professionalRevealItems = document.querySelectorAll('.section, .quick-info, .closing-cta');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal','revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});
  professionalRevealItems.forEach(el => revealObserver.observe(el));
}

// Active navigation state
const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');
const sections = [...document.querySelectorAll('main section[id], header#home')];
window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 150) current = section.id || current;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
}, {passive:true});


/* ==========================================================
   ADMIN DASHBOARD - protected UI for static hosting
   IMPORTANT: For real security, move authentication/storage
   to a server/database before publishing publicly.
   ========================================================== */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Kharisma2026!';
const STORAGE_KEYS = {
  warta: 'gmit_kharisma_warta_v1',
  segera: 'gmit_kharisma_segera_v1',
  photos: 'gmit_kharisma_photos_v1',
  session: 'gmit_kharisma_admin_session_v1',
  vocalVideos: 'gmit_kharisma_vocal_videos_v1'
};

const defaultWarta = [
  'Ibadah Rumah Tangga Hari Selasa tgl 17 Agstus di rumah : Bpk Marthen Sing.',
  'Ibadah Kaum Bapak Rabu tgl 18 Agustus di rumah : Bpk Marthen Sing.',
  'Ibadah Kaum Ibu Hari Rabu tgl 18 Agustus di rumah : Ibu Septiana Serasehan.',
  'Ibadah Pemuda Hari Rabu tgl 18 Agustus di rumah : Sdr/i Chornolius Palembangan.',
  'Ibadah Rumah Tangga Hari Kamis tgl 19 Agustus di rumah : Bapak Melkiansus Perhania.'
];
const defaultSegera = '1. Pelayanan orang sakit oleh ibu pdt Septhia Serasehan bersama majelis di rayon.';

function getJSON(key, fallback){
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch(e){ return fallback; }
}
function setJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function isAdmin(){ return sessionStorage.getItem(STORAGE_KEYS.session) === '1'; }

/* ==========================================================
   VOCAL GROUP VIDEO MANAGER
   Hanya digunakan untuk video yang diunggah melalui Dashboard Admin.
   Video bawaan "vocal group.mp4" tetap tidak diubah.
   ========================================================== */
const VOCAL_DB_NAME = 'gmit_kharisma_vocal_video_db_v1';
const VOCAL_STORE = 'videos';

function openVocalVideoDB(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){ reject(new Error('Browser tidak mendukung penyimpanan video.')); return; }
    const request = indexedDB.open(VOCAL_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if(!db.objectStoreNames.contains(VOCAL_STORE)){
        db.createObjectStore(VOCAL_STORE, {keyPath:'id', autoIncrement:true});
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Database video gagal dibuka.'));
  });
}

async function getVocalVideos(){
  const db = await openVocalVideoDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(VOCAL_STORE, 'readonly');
    const req = tx.objectStore(VOCAL_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function addVocalVideo(file){
  const db = await openVocalVideoDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(VOCAL_STORE, 'readwrite');
    const req = tx.objectStore(VOCAL_STORE).add({
      name: file.name,
      type: file.type || 'video/mp4',
      size: file.size,
      blob: file,
      createdAt: Date.now()
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteVocalVideo(id){
  const db = await openVocalVideoDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(VOCAL_STORE, 'readwrite');
    const req = tx.objectStore(VOCAL_STORE).delete(Number(id));
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function formatVideoSize(bytes){
  if(bytes < 1024*1024) return `${Math.max(1, Math.round(bytes/1024))} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
}

async function renderVocalGroupVideos(){
  const publicBox = document.getElementById('vocalGroupVideos');
  const adminList = document.getElementById('adminVocalGroupList');
  if(!publicBox && !adminList) return;
  try{
    const videos = await getVocalVideos();
    if(publicBox){
      publicBox.innerHTML = '';
      if(!videos.length){
        publicBox.innerHTML = '<div class="vocal-video-empty">Belum ada video aktivitas tambahan.</div>';
      }else{
        videos.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
        videos.forEach((item,index)=>{
          const card = document.createElement('article');
          card.className = 'media-card vocal-uploaded-video';
          const video = document.createElement('video');
          video.controls = true; video.preload = 'metadata'; video.playsInline = true;
          video.src = URL.createObjectURL(item.blob);
          const caption = document.createElement('p');
          caption.className = 'vocal-video-title';
          caption.textContent = item.name || `Video Aktivitas ${index+1}`;
          card.append(video, caption);
          publicBox.appendChild(card);
        });
      }
    }
    if(adminList){
      adminList.innerHTML = '';
      if(!videos.length){
        adminList.innerHTML = '<div class="vocal-admin-empty">Belum ada video yang diunggah.</div>';
      }else{
        videos.forEach((item,index)=>{
          const row = document.createElement('div');
          row.className = 'vocal-admin-row';
          row.innerHTML = `<div><b>${index+1}. ${escapeHTML(item.name || 'Video Aktivitas')}</b><small>${formatVideoSize(item.size || 0)}</small></div><button type="button" data-delete-vocal-video="${item.id}">Hapus</button>`;
          adminList.appendChild(row);
        });
      }
    }
  }catch(error){
    console.error(error);
    if(publicBox) publicBox.innerHTML = '<div class="vocal-video-empty">Video tambahan belum dapat ditampilkan pada browser ini.</div>';
    if(adminList) adminList.innerHTML = '<div class="vocal-admin-empty">Penyimpanan video tidak tersedia pada browser ini.</div>';
  }
}
function escapeHTML(text){
  return String(text).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

const loginModal = document.getElementById('adminLoginModal');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('adminLoginBtn');
const loginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('adminLoginError');

function openAdminLogin(){
  loginModal?.classList.add('open'); loginModal?.setAttribute('aria-hidden','false');
  setTimeout(() => document.getElementById('adminUsername')?.focus(), 50);
}
function closeAdminLogin(){ loginModal?.classList.remove('open'); loginModal?.setAttribute('aria-hidden','true'); }
function cleanText(text){
  return String(text ?? '').replace(/\r\n/g,'\n').replace(/\r/g,'\n').trim();
}
function renderWarta(){
  const list = document.getElementById('adminWartaList');
  const publicBox = document.getElementById('wartaContent');
  const items = getJSON(STORAGE_KEYS.warta, defaultWarta);
  if(list) list.innerHTML = items.map((text,i)=>`<div class="admin-list-row"><span><b>${i+1}.</b><span class="admin-list-text">${escapeHTML(cleanText(text))}</span></span><button type="button" data-delete-warta="${i}">Hapus</button></div>`).join('');
  if(publicBox) publicBox.innerHTML = items.length ? items.map((text,i)=>`<div class="warta-item"><span class="warta-number">${String(i+1).padStart(2,'0')}</span><p>${escapeHTML(cleanText(text))}</p></div>`).join('') : '<p>Belum ada informasi jemaat.</p>';
}
function sanitizeSegeraHTML(html){
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
  const allowed = new Set(['P','BR','STRONG','B','EM','I','U','S','DIV','SPAN']);

  // Ubah daftar otomatis lama (OL/UL) menjadi paragraf biasa.
  // Jika OL ditemukan, nomor dibuat menjadi teks biasa agar selanjutnya
  // dapat diedit manual seperti mengetik di Word.
  doc.body.querySelectorAll('ol,ul').forEach(list=>{
    const frag = doc.createDocumentFragment();
    [...list.children].forEach((li,index)=>{
      const p = doc.createElement('p');
      if(list.tagName === 'OL') p.appendChild(doc.createTextNode(`${index + 1}. `));
      [...li.childNodes].forEach(node=>p.appendChild(node.cloneNode(true)));
      frag.appendChild(p);
    });
    list.replaceWith(frag);
  });

  doc.body.querySelectorAll('*').forEach(el=>{
    if(!allowed.has(el.tagName)){
      el.replaceWith(document.createTextNode(el.textContent || ''));
      return;
    }
    [...el.attributes].forEach(attr=>{
      if(attr.name !== 'style') el.removeAttribute(attr.name);
    });
    if(el.hasAttribute('style')){
      const safe = el.getAttribute('style')
        .split(';')
        .map(x=>x.trim())
        .filter(x=>/^(text-align|font-weight|font-style|text-decoration)\s*:/i.test(x))
        .join(';');
      if(safe) el.setAttribute('style', safe); else el.removeAttribute('style');
    }
  });
  return doc.body.innerHTML.trim();
}
function textToSegeraHTML(text){
  const raw = String(text ?? '').replace(/\r\n/g,'\n').replace(/\r/g,'\n').trim();
  if(!raw) return '';
  if(/<\/?(p|br|strong|b|em|i|u|s|div|span|ol|ul|li)\b/i.test(raw)) return sanitizeSegeraHTML(raw);
  return raw.split('\n').map(line => {
    const cleaned=line.trim();
    return cleaned ? `<p>${escapeHTML(cleaned)}</p>` : '<p><br></p>';
  }).join('');
}
function renderSegera(){
  const value = localStorage.getItem(STORAGE_KEYS.segera);
  const text = value === null ? defaultSegera : value;
  const admin = document.getElementById('adminSegera');
  const pub = document.getElementById('segeraContent');
  const richHTML = textToSegeraHTML(text);

  if(admin){
    admin.innerHTML = richHTML || '<p><br></p>';
  }
  if(pub){
    pub.innerHTML = richHTML || '<p>Belum ada pengumuman.</p>';
  }
}
function renderPhotos(){
  const photos = getJSON(STORAGE_KEYS.photos, [null,null,null]);
  const gallery = document.getElementById('publicGallery');
  const previews = document.querySelectorAll('[data-photo-preview]');
  previews.forEach(el=>{ const i=Number(el.dataset.photoPreview); el.innerHTML = photos[i] ? `<img src="${photos[i]}" alt="Foto tambahan ${i+1}">` : '<span>Belum ada foto</span>'; });
  if(gallery){
    gallery.innerHTML = photos.filter(Boolean).map((src,i)=>`<figure class="gallery-item"><img src="${src}" alt="Dokumentasi jemaat ${i+1}"><figcaption>Dokumentasi Jemaat ${i+1}</figcaption></figure>`).join('');
    if(!gallery.innerHTML) gallery.innerHTML='<div class="gallery-empty">Belum ada foto tambahan dari admin.</div>';
  }
}
function renderAdmin(){ renderWarta(); renderSegera(); renderPhotos(); }
function showAdminPanel(){
  if(!isAdmin()) return openAdminLogin();
  closeAdminLogin();
  adminPanel?.classList.add('open');
  adminPanel?.setAttribute('aria-hidden','false');
  renderAdmin();
  window.refreshAgendaAccess?.();
  adminPanel?.scrollIntoView({behavior:'smooth',block:'start'});
}

loginBtn?.addEventListener('click', showAdminPanel);
document.querySelectorAll('[data-admin-close]').forEach(el=>el.addEventListener('click', closeAdminLogin));
loginForm?.addEventListener('submit', e=>{
  e.preventDefault();
  const u=document.getElementById('adminUsername').value.trim();
  const p=document.getElementById('adminPassword').value;
  if(u===ADMIN_USERNAME && p===ADMIN_PASSWORD){
    sessionStorage.setItem(STORAGE_KEYS.session,'1'); loginError.textContent=''; showAdminPanel();
  }else loginError.textContent='Username atau password salah.';
});
document.getElementById('adminLogoutBtn')?.addEventListener('click',()=>{
  sessionStorage.removeItem(STORAGE_KEYS.session);
  adminPanel?.classList.remove('open');
  adminPanel?.setAttribute('aria-hidden','true');
  window.refreshAgendaAccess?.();
  window.scrollTo({top:0,behavior:'smooth'});
});
document.getElementById('addWartaForm')?.addEventListener('submit',e=>{
  e.preventDefault(); if(!isAdmin()) return openAdminLogin();
  const input=document.getElementById('newWarta'); const value=cleanText(input.value); if(!value) return;
  const items=getJSON(STORAGE_KEYS.warta,defaultWarta); items.push(value); setJSON(STORAGE_KEYS.warta,items); input.value=''; renderWarta();
});
document.getElementById('adminWartaList')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-delete-warta]'); if(!btn || !isAdmin()) return;
  const i=Number(btn.dataset.deleteWarta), items=getJSON(STORAGE_KEYS.warta,defaultWarta); items.splice(i,1); setJSON(STORAGE_KEYS.warta,items); renderWarta();
});
document.getElementById('saveSegeraBtn')?.addEventListener('click',()=>{
  if(!isAdmin()) return openAdminLogin();
  const editor = document.getElementById('adminSegera');
  const html = sanitizeSegeraHTML(editor?.innerHTML || '');
  const text = (editor?.innerText || '').trim();
  if(!text){
    localStorage.removeItem(STORAGE_KEYS.segera);
  }else{
    localStorage.setItem(STORAGE_KEYS.segera, html);
  }
  renderSegera();
  alert('Pengumuman “SEGERA HADIR” berhasil disimpan.');
});

// Editor SEGERA HADIR bergaya Word.
document.querySelectorAll('.segera-tool').forEach(btn=>btn.addEventListener('mousedown', e=>e.preventDefault()));
document.querySelectorAll('.segera-tool').forEach(btn=>btn.addEventListener('click',()=>{
  const editor=document.getElementById('adminSegera');
  if(!editor) return;
  editor.focus();
  document.execCommand(btn.dataset.cmd, false, null);
}));
document.getElementById('vocalGroupVideoInput')?.addEventListener('change', async e=>{
  if(!isAdmin()) return openAdminLogin();
  const file = e.target.files?.[0];
  e.target.value = '';
  if(!file) return;
  if(!file.type.startsWith('video/')) return alert('Silakan pilih file video.');
  if(file.size > 100*1024*1024) return alert('Ukuran video maksimal 100 MB agar penyimpanan browser tetap aman.');
  try{
    await addVocalVideo(file);
    await renderVocalGroupVideos();
    alert('Video Aktivitas berhasil ditambahkan.');
  }catch(error){
    console.error(error);
    alert('Video gagal disimpan. Ruang penyimpanan browser mungkin tidak mencukupi.');
  }
});

document.getElementById('adminVocalGroupList')?.addEventListener('click', async e=>{
  const btn = e.target.closest('[data-delete-vocal-video]');
  if(!btn || !isAdmin()) return;
  if(!confirm('Hapus video aktivitas ini?')) return;
  try{
    await deleteVocalVideo(btn.dataset.deleteVocalVideo);
    await renderVocalGroupVideos();
  }catch(error){
    console.error(error);
    alert('Video gagal dihapus.');
  }
});

document.querySelectorAll('[data-photo-input]').forEach(input=>input.addEventListener('change',e=>{
  if(!isAdmin()) return openAdminLogin();
  const file=e.target.files?.[0]; if(!file) return; if(!file.type.startsWith('image/')) return alert('Silakan pilih file gambar.');
  if(file.size>2*1024*1024) return alert('Ukuran foto maksimal 2 MB agar dashboard tetap ringan.');
  const i=Number(input.dataset.photoInput), reader=new FileReader();
  reader.onload=()=>{ const photos=getJSON(STORAGE_KEYS.photos,[null,null,null]); photos[i]=reader.result; setJSON(STORAGE_KEYS.photos,photos); renderPhotos(); };
  reader.readAsDataURL(file);
}));
document.querySelectorAll('[data-delete-photo]').forEach(btn=>btn.addEventListener('click',()=>{
  if(!isAdmin()) return openAdminLogin(); const i=Number(btn.dataset.deletePhoto), photos=getJSON(STORAGE_KEYS.photos,[null,null,null]); photos[i]=null; setJSON(STORAGE_KEYS.photos,photos); renderPhotos();
}));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAdminLogin(); });
renderWarta(); renderSegera(); renderPhotos(); renderVocalGroupVideos();

// Menjaga format tulisan Admin (termasuk Enter/baris baru) saat ditampilkan.
function setAdminText(element, text) {
  if (!element) return;
  element.textContent = text == null ? '' : String(text);
  element.style.whiteSpace = 'pre-wrap';
  element.style.overflowWrap = 'anywhere';
  element.style.wordBreak = 'break-word';
  element.style.lineHeight = '1.7';
}


// Penomoran otomatis SEGERA HADIR: selalu dimulai 01, 02, 03, ...
function renumberSegeraHadir() {
  const lists = document.querySelectorAll(
    '.segera-hadir-list, .soon-list, #segeraHadirList, #soonList, #adminSoonList'
  );
  lists.forEach(list => {
    list.style.counterReset = 'segera-item';
    [...list.children].forEach((item, index) => {
      item.style.setProperty('--segera-number', `"${String(index + 1).padStart(2, '0')}"`);
    });
  });
}
document.addEventListener('DOMContentLoaded', renumberSegeraHadir);


/* FIX FINAL SEGERA HADIR: pasang kelas pada container yang benar */
(function () {
  function setupSegeraHadir() {
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,.section-title,.eyebrow'));
    const heading = headings.find(el => /SEGERA\s+HADIR/i.test((el.textContent || '').trim()));
    if (!heading) return;

    let container = heading.parentElement;
    for (let i = 0; i < 4 && container; i++, container = container.parentElement) {
      const candidates = container.querySelectorAll(':scope > div, :scope > ul, :scope > ol, :scope > section');
      for (const c of candidates) {
        if (c.children && c.children.length >= 1) {
          const text = (c.textContent || '').trim();
          if (text && !/SEGERA\s+HADIR/i.test(text.replace(heading.textContent || '', ''))) {
            c.classList.add('segera-hadir-list');
            c.classList.add('soon-list');
            return;
          }
        }
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSegeraHadir);
  } else {
    setupSegeraHadir();
  }
})();


// new

(function () {
  const KEY = 'gereja_agenda_minggu_ini_v1';
  const $ = (id) => document.getElementById(id);

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (m) => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[m]);
  }

  function formatDate(value) {
    if (!value) return '';
    const parts = String(value).split('-');
    if (parts.length !== 3) return esc(value);
    const [year, month, day] = parts;
    const names = ['Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'];
    return names[Number(month) - 1]
      ? `${day} ${names[Number(month) - 1]} ${year}`
      : esc(value);
  }

  function sorted(items) {
    return items.slice().sort((a, b) => {
      const aKey = `${a.date || '9999-12-31'}T${a.time || '23:59'}`;
      const bKey = `${b.date || '9999-12-31'}T${b.time || '23:59'}`;
      return aKey.localeCompare(bKey);
    });
  }

  function loggedIn() {
    return typeof isAdmin === 'function' && isAdmin();
  }

  function syncVisibility() {
    const section = $('admin-agenda');
    if (!section) return;
    const show = loggedIn();
    section.hidden = !show;
    section.setAttribute('aria-hidden', String(!show));
  }

  function render() {
    const list = $('agendaList');
    const empty = $('agendaEmpty');
    const admin = $('agendaAdminList');
    const items = sorted(load());

    if (list) {
      list.innerHTML = items.map(x => `
        <article class="agenda-item">
          <div>
            <div class="agenda-day">${esc(x.day)}</div>
            ${x.date ? `<div class="agenda-date">${formatDate(x.date)}</div>` : ''}
            <div class="agenda-time">${esc(x.time)}</div>
          </div>
          <div>
            <div class="agenda-title">${esc(x.title)}</div>
            ${x.note ? `<div class="agenda-note">${esc(x.note)}</div>` : ''}
          </div>
          <span aria-hidden="true">📅</span>
        </article>
      `).join('');
    }

    if (empty) empty.hidden = items.length > 0;

    if (admin) {
      if (!loggedIn()) {
        admin.innerHTML = '';
      } else {
        admin.innerHTML = items.length
          ? items.map((x,i) => `
            <div class="agenda-admin-row">
              <div>
                <b>${esc(x.day)}${x.date ? ' • ' + esc(x.date) : ''} • ${esc(x.time)}</b>
                — ${esc(x.title)}
                ${x.note ? `<div class="agenda-note">${esc(x.note)}</div>` : ''}
              </div>
              <div class="agenda-actions">
                <button class="agenda-edit" data-index="${i}" type="button"
                        title="Edit agenda" aria-label="Edit agenda">✏️</button>
                <button class="agenda-delete" data-index="${i}" type="button"
                        title="Hapus agenda" aria-label="Hapus agenda">🗑️</button>
              </div>
            </div>
          `).join('')
          : '<div class="agenda-empty">Belum ada agenda untuk dikelola.</div>';

        admin.querySelectorAll('.agenda-edit').forEach(btn => {
          btn.addEventListener('click', () => {
            if (!loggedIn()) return syncVisibility();

            const current = sorted(load());
            const index = Number(btn.dataset.index);
            const item = current[index];
            if (!item) return;

            $('agendaDay').value = item.day || '';
            $('agendaDate').value = item.date || '';
            $('agendaTime').value = item.time || '';
            $('agendaTitle').value = item.title || '';
            $('agendaNote').value = item.note || '';

            const submit = $('agendaForm')?.querySelector('button[type="submit"]');
            if (submit) {
              submit.textContent = '💾 Simpan Perubahan';
              submit.dataset.editIndex = String(index);
            }
            const cancel = $('agendaCancelEdit');
            if (cancel) cancel.hidden = false;

            $('agendaForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            $('agendaTitle')?.focus();
          });
        });

        admin.querySelectorAll('.agenda-delete').forEach(btn => {
          btn.addEventListener('click', () => {
            if (!loggedIn()) return syncVisibility();
            const current = sorted(load());
            const index = Number(btn.dataset.index);
            if (!Number.isInteger(index) || index < 0 || index >= current.length) return;
            current.splice(index, 1);
            save(current);
            render();
          });
        });
      }
    }

    syncVisibility();
  }


  function resetAgendaForm() {
    const form = $('agendaForm');
    if (!form) return;
    form.reset();
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.textContent = '+ Tambah Agenda';
      delete submit.dataset.editIndex;
    }
    const cancel = $('agendaCancelEdit');
    if (cancel) cancel.hidden = true;
  }

  function init() {
    const form = $('agendaForm');

    if (form) {
      $('agendaCancelEdit')?.addEventListener('click', resetAgendaForm);

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!loggedIn()) {
          syncVisibility();
          if (typeof openAdminLogin === 'function') openAdminLogin();
          return;
        }

        const title = $('agendaTitle')?.value.trim();
        const time = $('agendaTime')?.value;
        const day = $('agendaDay')?.value;
        const date = $('agendaDate')?.value;
        const note = $('agendaNote')?.value.trim();

        if (!title || !time || !day) return;

        const items = sorted(load());
        const editIndex = Number(form.querySelector('button[type="submit"]')?.dataset.editIndex);

        if (Number.isInteger(editIndex) && editIndex >= 0 && editIndex < items.length) {
          items[editIndex] = { ...items[editIndex], day, date, time, title, note };
        } else {
          items.push({ day, date, time, title, note });
        }

        save(items);
        form.reset();

        const submit = form.querySelector('button[type="submit"]');
        if (submit) {
          submit.textContent = '+ Tambah Agenda';
          delete submit.dataset.editIndex;
        }
        const cancel = $('agendaCancelEdit');
        if (cancel) cancel.hidden = true;

        render();
      });
    }

    render();
  }

  window.refreshAgendaAccess = function () {
    syncVisibility();
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

