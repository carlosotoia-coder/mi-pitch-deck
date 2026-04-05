/* ============================================================
   SHARED CORE JS — pitch-deck system
   Utility functions used by all brand presentations
   ============================================================ */

/* ---------- PROGRESS BAR ---------- */
export function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ---------- ANIMATED COUNTER ---------- */
export function animateCounter(el, target, duration = 2, decimals = 0) {
  if (!el || !window.gsap) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    snap: { val: decimals === 0 ? 1 : 0.1 },
    onUpdate: () => {
      el.textContent = decimals > 0
        ? obj.val.toFixed(decimals).replace('.', ',')
        : Math.round(obj.val).toLocaleString('es-CL');
    }
  });
}

/* ---------- VIDEO AUTOPLAY ON VIEWPORT ---------- */
export function initVideoAutoplay() {
  const videos = document.querySelectorAll('.phone__screen video, .autoplay-video');
  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.4 }
  );

  videos.forEach(v => {
    v.muted = true;
    v.loop  = true;
    v.playsInline = true;
    observer.observe(v);
  });
}

/* ---------- VIDEO HOVER PLAY (cards) ---------- */
export function initVideoHover() {
  document.querySelectorAll('.card-video').forEach(video => {
    video.muted = true;
    video.loop  = true;
    video.playsInline = true;
    const card = video.closest('.card') || video.parentElement;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

/* ---------- GSAP FADE-REVEAL (batch) ---------- */
export function initRevealOnScroll() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.utils.toArray('.gsap-reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ---------- STAGGER CHILDREN ON SCROLL ---------- */
export function staggerOnScroll(selector, staggerTime = 0.1) {
  if (!window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll(selector).forEach(container => {
    const children = container.children;
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        stagger: staggerTime,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ---------- LOAD JSON DATA ---------- */
export async function loadData(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

/* ---------- FORMAT NUMBER ES-CL ---------- */
export function fmt(n) {
  return Math.round(n).toLocaleString('es-CL');
}
