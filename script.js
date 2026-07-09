/**
 * TakamBot Landing — script.js
 * Notebooks · Particles · Navbar · Scroll animations · Counter · Clipboard · Toast · Mobile menu
 */

// ─────────────────────────────────────────
// 0. Dynamic Notebooks (from notebooks.json)
// ─────────────────────────────────────────
(function loadNotebooks() {
    const grid = document.getElementById('notebooks-grid');
    if (!grid) return;

    // Accent palette — maps accentClass → Tailwind-compatible inline styles
    const ACCENTS = {
        cyber:  { gradient: 'linear-gradient(135deg,#00d4ff,#0090b4)', hover: 'rgba(0,212,255,0.25)', text: '#00d4ff' },
        purple: { gradient: 'linear-gradient(135deg,#a855f7,#ec4899)', hover: 'rgba(168,85,247,0.25)', text: '#a855f7' },
        green:  { gradient: 'linear-gradient(135deg,#10b981,#059669)', hover: 'rgba(16,185,129,0.25)',  text: '#10b981' },
        pink:   { gradient: 'linear-gradient(135deg,#ec4899,#db2777)', hover: 'rgba(236,72,153,0.25)',  text: '#ec4899' },
        orange: { gradient: 'linear-gradient(135deg,#f97316,#ea580c)', hover: 'rgba(249,115,22,0.25)',  text: '#f97316' },
    };

    function buildPill(nb) {
        const accent = ACCENTS[nb.accentClass] || ACCENTS.cyber;
        const a = document.createElement('a');
        a.href = nb.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.id = nb.id;
        a.className = 'notebook-pill group flex items-center gap-3 p-4 rounded-xl bg-dark-800/60 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/60';
        a.style.cssText = '--pill-hover-border: ' + accent.text + '; --pill-shadow: ' + accent.hover;
        a.innerHTML = `
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md transition-shadow"
                 style="background:${accent.gradient}; color:#030712; box-shadow:0 4px 12px ${accent.hover};">
                ${nb.label}
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-white truncate">${nb.title}</div>
                <div class="text-xs text-gray-500">${nb.subtitle}</div>
            </div>
            <svg class="w-4 h-4 text-gray-600 rotate-180 transition-all flex-shrink-0"
                 style="--hover-color:${accent.text}"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>`;

        // Hover effects via JS (avoids needing dynamic Tailwind classes)
        a.addEventListener('mouseenter', () => {
            a.style.borderColor = accent.text + '4d'; // 30% opacity
            a.querySelector('svg').style.color = accent.text;
            a.querySelector('svg').style.transform = 'rotate(180deg) translateX(4px)';
        });
        a.addEventListener('mouseleave', () => {
            a.style.borderColor = '';
            a.querySelector('svg').style.color = '';
            a.querySelector('svg').style.transform = '';
        });
        return a;
    }

    fetch('notebooks.json')
        .then(r => r.json())
        .then(data => {
            grid.innerHTML = ''; // clear skeletons
            data.notebooks.forEach(nb => grid.appendChild(buildPill(nb)));
        })
        .catch(() => {
            // Fallback: hide skeletons, show friendly error
            grid.innerHTML = `
                <p class="col-span-full text-center text-sm text-gray-600 py-4">
                    לא ניתן לטעון את רשימת המחברות. נסו לרענן את הדף.
                </p>`;
        });
})();


// ─────────────────────────────────────────
// 1. Particle Canvas
// ─────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function spawn() {
        const n = Math.min(Math.floor(W / 18), 60);
        particles = Array.from({ length: n }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r:  Math.random() * 1.2 + 0.4,
            o:  Math.random() * 0.35 + 0.08,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p, i) => {
            p.x = (p.x + p.vx + W) % W;
            p.y = (p.y + p.vy + H) % H;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${p.o})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0,212,255,${0.055 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();
    window.addEventListener('resize', () => { resize(); spawn(); }, { passive: true });
})();


// ─────────────────────────────────────────
// 2. Navbar glass on scroll
// ─────────────────────────────────────────
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
})();


// ─────────────────────────────────────────
// 3. Mobile menu
// ─────────────────────────────────────────
(function initMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));
})();


// ─────────────────────────────────────────
// 4. Scroll-in animations (IntersectionObserver)
// ─────────────────────────────────────────
(function initScrollReveal() {
    const obs = new IntersectionObserver(
        entries => entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), idx * 120);
                obs.unobserve(entry.target);
            }
        }),
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.feature-card').forEach(el => obs.observe(el));
})();


// ─────────────────────────────────────────
// 5. Animated counter
// ─────────────────────────────────────────
(function initCounter() {
    const el = document.getElementById('stat-docs');
    if (!el) return;
    let done = false;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !done) {
            done = true;
            obs.unobserve(el);
            const target = 150, duration = 1400, start = performance.now();
            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(ease * target) + '+';
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }
    }, { threshold: 0.5 });
    obs.observe(el);
})();


// ─────────────────────────────────────────
// 6. Copy example question
// ─────────────────────────────────────────
function copyQuestion(el) {
    const text = el.querySelector('.text-gray-300')?.textContent?.trim();
    if (!text) return;
    const copy = () => showToast('✅ השאלה הועתקה!');
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(copy).catch(legacyCopy);
    } else {
        legacyCopy();
    }
    function legacyCopy() {
        const ta = Object.assign(document.createElement('textarea'), {
            value: text,
            style: 'position:fixed;opacity:0'
        });
        document.body.append(ta);
        ta.select();
        try { document.execCommand('copy'); copy(); } catch {}
        ta.remove();
    }
}


// ─────────────────────────────────────────
// 7. Toast notification
// ─────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    clearTimeout(_toastTimer);
    t.textContent = msg;
    t.classList.remove('translate-y-16', 'opacity-0', 'pointer-events-none');
    t.classList.add('translate-y-0', 'opacity-100');
    _toastTimer = setTimeout(() => {
        t.classList.add('translate-y-16', 'opacity-0', 'pointer-events-none');
        t.classList.remove('translate-y-0', 'opacity-100');
    }, 2400);
}


// ─────────────────────────────────────────
// 8. Smooth scroll for internal anchors
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    })
);


// ─────────────────────────────────────────
// 9. Programmatic video autoplay
// ─────────────────────────────────────────
(function initVideoAutoplay() {
    window.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('guide-video');
        if (video) {
            video.muted = true;
            video.play().catch(() => {
                // If blocked by browser, try playing on first user interaction
                const playOnInteraction = () => {
                    video.play().catch(() => {});
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
            });
        }
    });
})();

