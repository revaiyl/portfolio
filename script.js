// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// paged carousels (Projects + Credentials)
// - arrows only appear when there are more cards than fit on screen
// - one click moves a full page (3 cards desktop, 2 tablet)
document.querySelectorAll('.projects-wrap').forEach(wrap => {
  const track = wrap.querySelector('.projects-scroll');
  const prev  = wrap.querySelector('.scroll-btn.prev');
  const next  = wrap.querySelector('.scroll-btn.next');

  function metrics(){
    const items = Array.from(track.children);
    if(!items.length) return null;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap) || 0;
    const cardW = items[0].getBoundingClientRect().width;
    const inner = track.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const perView = Math.max(1, Math.round((inner + gap) / (cardW + gap)));
    return {items, gap, cardW, perView};
  }

  function updateEnds(){
    const max = track.scrollWidth - track.clientWidth;
    prev.classList.toggle('is-disabled', track.scrollLeft <= 4);
    next.classList.toggle('is-disabled', track.scrollLeft >= max - 4);
  }

  function update(){
    const m = metrics();
    if(!m) return;
    const n = m.items.length;
    const needArrows = n > m.perView;
    const missing = (m.perView - (n % m.perView)) % m.perView;

    // blank space after the last card so the last page can start at its first card
    if(needArrows && missing > 0){
      track.style.setProperty('--tail', (missing * (m.cardW + m.gap) - m.gap) + 'px');
      track.classList.add('has-tail');
    } else {
      track.classList.remove('has-tail');
    }

    prev.classList.toggle('is-hidden', !needArrows);
    next.classList.toggle('is-hidden', !needArrows);
    updateEnds();
  }

  function go(dir){
    const m = metrics();
    if(!m) return;
    const n = m.items.length;
    const first = m.items[0].offsetLeft;
    const pos = m.items.map(el => el.offsetLeft - first);

    // card currently at the left edge
    let cur = 0;
    pos.forEach((p, i) => {
      if(Math.abs(p - track.scrollLeft) < Math.abs(pos[cur] - track.scrollLeft)) cur = i;
    });

    const lastStart = (Math.ceil(n / m.perView) - 1) * m.perView;
    const target = Math.min(Math.max(cur + dir * m.perView, 0), lastStart);
    track.scrollTo({left: pos[target], behavior: 'smooth'});
  }

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', updateEnds, {passive:true});
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});

// tab switching (Projects + Credentials)
document.querySelectorAll('.tab-group').forEach(group => {
  const btns = group.querySelectorAll('.tab-btn');
  const panels = group.querySelectorAll('.tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });
});

// contact form placeholder handler (no backend wired up yet)
function handleSubmit(e){
  e.preventDefault();
  alert('This form isn\'t connected to anything yet — hook it up to a service like Formspree, EmailJS, or your own backend when you\'re ready.');
}