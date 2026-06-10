// Mobile nav
const tog = document.getElementById('navToggle');
const lnk = document.getElementById('navLinks');
if(tog && lnk){ tog.addEventListener('click',()=>lnk.classList.toggle('open')); }

// Year
const yr = document.getElementById('year');
if(yr) yr.textContent = new Date().getFullYear();

// Reveal animations
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'), i*70);
      io.unobserve(e.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Hero slider
(function(){
  try{
    const slides = document.querySelectorAll('#heroSlides .hero-slide');
    const dots = document.querySelectorAll('#heroDots button');
    if(!slides.length) return;
    let i = 0;
    const go = (n)=>{
      if(slides[i]) slides[i].classList.remove('active');
      if(dots[i]) dots[i].classList.remove('active');
      i = (n + slides.length) % slides.length;
      if(slides[i]) slides[i].classList.add('active');
      if(dots[i]) dots[i].classList.add('active');
    };
    if(dots && dots.length){ dots.forEach(d=>d.addEventListener('click',()=>go(+d.dataset.i))); }
    setInterval(()=>go(i+1), 5500);
  }catch(err){ console.error('Hero slider error', err); }
})();

// Newsletter
(function(){
  try{
    const f = document.getElementById('newsletterForm');
    const note = document.getElementById('newsletterNote');
    if(!f) return;
    f.addEventListener('submit',(e)=>{
      e.preventDefault();
      const name = f.querySelector('input[name="newsletter-name"]');
      const email = f.querySelector('input[type="email"]');
      if(!note) return;
      if(!name || !name.value || !name.value.trim()){ note.textContent = 'Please enter your name.'; note.style.color = '#ff9f3d'; return; }
      if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ note.textContent = 'Please enter a valid email.'; note.style.color = '#ff9f3d'; return; }
      sendToSheet({ source: "newsletter", name: name.value, email: email.value, org: "", country: "", message: "Newsletter signup" }, note);
      f.reset();
    });
  }catch(err){ console.error('Newsletter error', err); }
})();

// Insights tabs
(function(){
  const tabs = document.querySelectorAll('#insightTabs .insight-tab');
  const posts = document.querySelectorAll('#insightGrid .post');
  if(!tabs.length) return;
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const f = t.dataset.filter;
    posts.forEach(p=>{ p.style.display = (f==='all'||p.dataset.cat===f) ? '' : 'none'; });
  }));
})();

// Get Involved role cards
(function(){
  const cards = document.querySelectorAll('#roleGrid .role-card');
  const panel = document.getElementById('rolePanel');
  if(!cards.length || !panel) return;
  const eye = document.getElementById('rolePanelEyebrow');
  const title = document.getElementById('rolePanelTitle');
  const desc = document.getElementById('rolePanelDesc');
  const alt = document.getElementById('ivAltLink');
  const status = document.getElementById('ivStatus');
  const meta = {
    mentor:{ t:'Become a Mentor', d:'Tell us about your background and the kind of mentorship you can offer.', alt:'https://forms.gle/8n8XSMuaiogttDMw6' },
    volunteer:{ t:'Volunteer with us', d:'Let us know your skills, availability and where you\'d like to help.', alt:'https://forms.gle/8n8XSMuaiogttDMw6' },
    sponsor:{ t:'Sponsor & Fund', d:'Share a little about your organization and the kind of support you\'d like to provide.', alt:'mailto:digiskillsorg@gmail.com?subject=Sponsorship%20inquiry' },
    media:{ t:'Events, Media & CSR', d:'Tell us about the collaboration — events, storytelling or CSR programs.', alt:'mailto:digiskillsorg@gmail.com?subject=Media%20%26%20CSR%20collaboration' },
    school:{ t:'Schools & Organizations', d:'Tell us about your school or organization and how you\'d like to partner.', alt:'mailto:digiskillsorg@gmail.com?subject=Schools%20%26%20Organizations%20partnership' }
  };
  if(alt) alt.style.display = 'none';
  cards.forEach(c=>c.addEventListener('click',()=>{
    cards.forEach(x=>x.classList.remove('selected'));
    c.classList.add('selected');
    const m = meta[c.dataset.role] || meta.mentor;
    eye.textContent = c.querySelector('h3').textContent.toUpperCase();
    title.textContent = m.t;
    desc.textContent = m.d;
    if(alt){
      if(c.dataset.role === 'volunteer'){
        alt.href = m.alt;
        alt.style.display = '';
      } else {
        alt.style.display = 'none';
      }
    }
    panel.classList.add('visible');
    status.textContent='';
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  const form = document.getElementById('involvedForm');
  if(form){
  form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const status = document.getElementById('ivStatus');

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())){
      status.style.color='#f29127';
      status.textContent='Please add your name and a valid email.';
      return;
    }

    sendToSheet({
      source: "involved_form",
      name: form.name.value,
      email: form.email.value,
      org: form.org.value,
      country: form.country.value,
      message: form.message.value
    }, status);

    form.reset();
  });

    }
  })();

  // Contact form


// Contact form
(function(){
  const f = document.getElementById('contactForm');
  if(!f) return;
  const s = document.getElementById('contactStatus');
  f.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!f.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()) || !f.message.value.trim()){
      s.style.color='#f29127'; s.textContent='Please complete name, valid email, and message.'; return;
    }
    const body = encodeURIComponent(`From: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`);
    const subject = encodeURIComponent(f.subject.value || 'Website contact');
    window.location.href = `mailto:digiskillsorg@gmail.com?subject=${subject}&body=${body}`;
    s.style.color=''; s.textContent='Opening your email client...';
  });
})();

// Footer contact reveal — click icon/label to toggle value
(function(){
  document.querySelectorAll('.contact-reveal-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const key = btn.dataset.reveal;
      const val = btn.parentElement.querySelector(`.contact-reveal-val[data-target="${key}"]`);
      if(val) val.classList.toggle('show');
    });
  });
})();

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYhKu0Wxayqdaaefbu6SGUc4VEEr0X0bEVnzFXlWp2zwtdm3zaOby-0Rb3IbeHl0IP/exec";

async function sendToSheet(payload, statusEl) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (statusEl) {
      statusEl.textContent = "Thanks! You're on the list.";
      statusEl.style.color = "";
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "Something went wrong. Try again.";
      statusEl.style.color = "red";
    }
  }

}
