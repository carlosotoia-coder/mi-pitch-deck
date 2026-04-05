/* ============================================================
   MAIN JS — Carlos Soto @carloseba1_
   Todas las animaciones GSAP + ScrollTrigger + Chart.js
   ============================================================ */

import {
  initProgressBar,
  animateCounter,
  initVideoAutoplay,
  initVideoHover,
  initRevealOnScroll,
  staggerOnScroll,
  loadData,
  fmt
} from '../../../shared/js/core.js';

/* ---- DATA ---- */
const DATA_PATH = '../../../data/carloseba1.json';

/* ---- MAIN INIT ---- */
document.addEventListener('DOMContentLoaded', async () => {
  gsap.registerPlugin(ScrollTrigger);

  let data;
  try { data = await loadData(DATA_PATH); }
  catch (e) { console.warn('Could not load data, using fallbacks'); data = {}; }

  initProgressBar();
  initHeroAnimation();
  initVideoAutoplay();
  initVideoHover();
  initRevealOnScroll();
  staggerOnScroll('.stagger-container', 0.12);
  initKPIs(data);
  initRateBars(data);
  initTabs();
  initPinnedSections();
  initGrowthChart(data);
  initClosingAnimation();
  initNav();
});

/* ============================================================
   HERO ANIMATION — entrada al cargar
   ============================================================ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .from('.hero-badge',       { opacity: 0, y: -20, duration: 0.6 })
    .from('.hero__name',       { opacity: 0, y: 80, skewY: 3, duration: 1 }, '-=0.3')
    .from('.hero__handle',     { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
    .from('.hero__spec',       { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
    .from('.hero__cta',        { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero__ball',       { opacity: 0, scale: 0.5, rotation: -30, duration: 1 }, '-=0.8')
    .from('#progress-bar',     { opacity: 0, duration: 0.3 });
}

/* ============================================================
   KPI COUNTERS — animados al entrar en viewport
   ============================================================ */
function initKPIs(data) {
  const kpis = data.kpis || [
    { value: 340846, label: 'Visualizaciones' },
    { value: 230625, label: 'Cuentas alcanzadas' },
    { value: 22001,  label: 'Seguidores' },
    { value: 26097,  label: 'Interacciones' }
  ];

  // Render KPI cards if containers exist
  const grid = document.getElementById('kpi-grid');
  if (grid) {
    grid.innerHTML = kpis.map(k => `
      <div class="card kpi gsap-reveal">
        <span class="kpi__value" data-target="${k.value}" data-decimals="0">0</span>
        <span class="kpi__label">${k.label}</span>
      </div>
    `).join('');
  }

  // Animate counters on scroll
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounter(el, target, 2, decimals)
    });
  });
}

/* ============================================================
   RATE BARS
   ============================================================ */
function initRateBars(data) {
  const rates = data.rates || [
    { value: 89,   label: 'Audiencia no seguidores', suffix: '%' },
    { value: 92.7, label: 'Contenido Reels',          suffix: '%' },
    { value: 74.7, label: 'Interacciones no seguidores', suffix: '%' }
  ];

  const container = document.getElementById('rates-grid');
  if (!container) return;

  container.innerHTML = rates.map(r => `
    <div class="card gsap-reveal">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.8rem;">
        <span class="body-md" style="font-weight:500">${r.label}</span>
        <span class="kpi__value" style="font-size:2.5rem;" data-target="${r.value}" data-decimals="${Number.isInteger(r.value) ? 0 : 1}">${r.value}</span>
      </div>
      <div class="rate-bar-wrap">
        <div class="rate-bar">
          <div class="rate-bar__fill" data-rate="${r.value}"></div>
        </div>
      </div>
    </div>
  `).join('');

  // Animate bars
  ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.rate-bar__fill').forEach(bar => {
        bar.style.width = bar.dataset.rate + '%';
      });
    }
  });
}

/* ============================================================
   TABS — sin scroll, click simple
   ============================================================ */
function initTabs() {
  document.querySelectorAll('.tabs-header').forEach(header => {
    const buttons = header.querySelectorAll('.tab-btn');
    const panels  = header.closest('.tabs-wrapper')?.querySelectorAll('.tab-panel');
    if (!panels) return;

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        panels[i]?.classList.add('is-active');
      });
    });
    // init first
    buttons[0]?.classList.add('is-active');
    panels[0]?.classList.add('is-active');
  });
}

/* ============================================================
   PINNED SECTIONS con scrub
   ============================================================ */
function initPinnedSections() {
  // PIN: Sección de perfil — texto entra desde abajo con scrub
  const profileSection = document.getElementById('profile');
  if (profileSection) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: profileSection,
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1
      }
    });
    tl
      .from('#profile .reveal-l', { x: -60, opacity: 0, stagger: 0.1 })
      .from('#profile .reveal-r', { x:  60, opacity: 0 }, '<0.2');
  }

  // PIN: Sección de colaboraciones
  const colabSection = document.getElementById('colaboraciones');
  if (colabSection) {
    gsap.from('#colaboraciones .card', {
      scrollTrigger: {
        trigger: colabSection,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 0.8
      },
      opacity: 0,
      y: 50,
      stagger: 0.08
    });
  }
}

/* ============================================================
   CHART.JS — Gráfico de crecimiento
   ============================================================ */
function initGrowthChart(data) {
  const canvas = document.getElementById('growth-chart');
  if (!canvas || !window.Chart) return;

  const labels   = data?.growth?.labels   || ['Ene','Feb','Mar','Abr','May','Jun'];
  const follows  = data?.growth?.followers || [14000,15800,17200,19100,21000,22001];
  const views    = data?.growth?.views     || [42000,68000,110000,195000,280000,340846];

  let chartCreated = false;

  ScrollTrigger.create({
    trigger: canvas,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      if (chartCreated) return;
      chartCreated = true;

      const accent  = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      const accent3 = getComputedStyle(document.documentElement).getPropertyValue('--color-accent3').trim();
      const muted   = getComputedStyle(document.documentElement).getPropertyValue('--color-muted').trim();

      new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Seguidores',
              data: follows,
              borderColor: accent,
              backgroundColor: accent + '18',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: accent,
              pointRadius: 5,
              pointHoverRadius: 8,
              yAxisID: 'y'
            },
            {
              label: 'Visualizaciones',
              data: views,
              borderColor: accent3,
              backgroundColor: accent3 + '18',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: accent3,
              pointRadius: 5,
              pointHoverRadius: 8,
              yAxisID: 'y2'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1400, easing: 'easeInOutQuart' },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              labels: {
                color: muted,
                font: { family: 'JetBrains Mono', size: 11 },
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: '#0c0f0d',
              borderColor: accent + '40',
              borderWidth: 1,
              titleColor: accent,
              bodyColor: muted,
              titleFont: { family: 'JetBrains Mono', size: 11 },
              bodyFont:  { family: 'DM Sans', size: 12 }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0,230,118,0.06)' },
              ticks: { color: muted, font: { family: 'JetBrains Mono', size: 10 } }
            },
            y: {
              grid: { color: 'rgba(0,230,118,0.06)' },
              ticks: {
                color: muted,
                font: { family: 'JetBrains Mono', size: 10 },
                callback: v => v >= 1000 ? (v/1000).toFixed(0) + 'K' : v
              }
            },
            y2: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: muted,
                font: { family: 'JetBrains Mono', size: 10 },
                callback: v => v >= 1000 ? (v/1000).toFixed(0) + 'K' : v
              }
            }
          }
        }
      });
    }
  });
}

/* ============================================================
   CLOSING ANIMATION — pin + fade
   ============================================================ */
function initClosingAnimation() {
  const closing = document.getElementById('closing');
  if (!closing) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: closing,
      start: 'top top',
      end: '+=600',
      pin: true,
      scrub: 1
    }
  });

  tl
    .from('.closing__eyebrow', { opacity: 0, y: 30 })
    .from('.closing__quote',   { opacity: 0, y: 50, duration: 1.2 }, '-=0.3')
    .from('.closing__contact', { opacity: 0, y: 30 }, '-=0.5')
    .from('.closing__ball',    { opacity: 0, scale: 0.3, rotation: 180, duration: 1.5 }, '<');
}

/* ============================================================
   NAV — smooth scroll a secciones
   ============================================================ */
function initNav() {
  document.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        gsap.to(window, { scrollTo: { y: target, offsetY: 0 }, duration: 1, ease: 'power3.inOut' });
      }
    });
  });
}
