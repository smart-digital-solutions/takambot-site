/**
 * TakamBot Landing — script.js (WOW Edition)
 * Notebooks · Particles · 3D Tilt · Cursor Spotlight · Glitch · Sparkles
 * Magnetic Pills · Scroll Reveal · Counter · Clipboard · Toast · Mobile menu
 */

/* ─────────────────────────────────────────────────────────
   1. LOAD NOTEBOOKS FROM JSON
   ───────────────────────────────────────────────────────── */
const ACCENT_CLASSES = ['accent-cyber', 'accent-purple', 'accent-green', 'accent-pink', 'accent-orange'];
const ACCENT_MAP = {
    cyber: 'accent-cyber', purple: 'accent-purple',
    green:  'accent-green', pink:   'accent-pink', orange: 'accent-orange'
};

async function loadNotebooks() {
    const grid = document.getElementById('notebooks-grid');
    if (!grid) return;

    try {
        const res  = await fetch('notebooks.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data.notebooks || [];

        if (!list.length) { grid.innerHTML = '<p class="text-xs text-gray-600">לא נמצאו מחברות.</p>'; return; }

        grid.innerHTML = '';
        list.forEach((nb, i) => {
            const accentKey   = nb.accentClass || '';
            const accentClass = ACCENT_MAP[accentKey] || ACCENT_CLASSES[i % ACCENT_CLASSES.length];

            const pill = document.createElement('a');
            pill.href   = nb.url;
            pill.target = '_blank';
            pill.rel    = 'noopener noreferrer';
            pill.className = `notebook-pill ${accentClass}`;
            pill.style.animationDelay = `${i * 0.07}s`;
            pill.innerHTML = `
                <div class="pill-label-dot">${nb.label || (i + 1)}</div>
                <div class="pill-text">
                    <span class="pill-title">${nb.title || nb.label}</span>
                    <span class="pill-subtitle">${nb.subtitle || ''}</span>
                </div>
                <span class="pill-arrow">←</span>`;

            // Magnetic hover effect
            attachMagnetic(pill);
            grid.appendChild(pill);
        });
    } catch (err) {
        console.warn('notebooks.json load failed:', err);
        grid.innerHTML = `
            <a href="https://notebooklm.google.com" target="_blank" rel="noopener"
               class="notebook-pill accent-cyber col-span-2">
                <div class="pill-label-dot">📖</div>
                <div class="pill-text"><span class="pill-title">פתחו NotebookLM</span></div>
                <span class="pill-arrow">←</span>
            </a>`;
    }
}

/* ─────────────────────────────────────────────────────────
   2. MAGNETIC HOVER EFFECT FOR PILLS
   ───────────────────────────────────────────────────────── */
function attachMagnetic(el) {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * 0.18;
        const dy   = (e.clientY - cy) * 0.18;
        el.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px) scale(1.01)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
}

/* ─────────────────────────────────────────────────────────
   3. PARTICLE CANVAS
   ───────────────────────────────────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.min(50, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x:  Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r:  Math.random() * 1.2 + 0.3,
            alpha: Math.random() * 0.3 + 0.05,
            color: Math.random() > 0.5 ? '0,212,255' : '168,85,247'
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();

            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ─────────────────────────────────────────────────────────
   5. CURSOR SPOTLIGHT
   ───────────────────────────────────────────────────────── */
function initCursorSpotlight() {
    const spot = document.getElementById('cursor-spotlight');
    if (!spot) return;
    document.addEventListener('mousemove', (e) => {
        spot.style.left    = e.clientX + 'px';
        spot.style.top     = e.clientY + 'px';
        spot.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
        spot.style.opacity = '0';
    });
}

/* ─────────────────────────────────────────────────────────
   6. NAVBAR SCROLL GLASS EFFECT
   ───────────────────────────────────────────────────────── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    document.querySelectorAll('#mobile-menu a').forEach(a =>
        a.addEventListener('click', () =>
            document.getElementById('mobile-menu')?.classList.add('hidden')));
}

/* ─────────────────────────────────────────────────────────
   7. SCROLL REVEAL
   ───────────────────────────────────────────────────────── */
function initScrollReveal() {
    const els = document.querySelectorAll('.feature-card, .example-q');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), i * 80);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────────────────
   8. COUNTER ANIMATION
   ───────────────────────────────────────────────────────── */
function initCounter() {
    const el = document.getElementById('stat-docs');
    if (!el) return;
    const target = 600;
    let current  = 0;
    const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const step = () => {
            current = Math.min(current + Math.ceil(target / 60), target);
            el.textContent = current + '+';
            if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
    io.observe(el);
}

/* ─────────────────────────────────────────────────────────
   9. EXAMPLE Q — radial mouse-track highlight
   ───────────────────────────────────────────────────────── */
function initExampleQHighlight() {
    document.querySelectorAll('.example-q').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
            const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
            btn.style.setProperty('--mx', `${x}%`);
            btn.style.setProperty('--my', `${y}%`);
        });
    });
}

/* ─────────────────────────────────────────────────────────
   10. SPARKLE ON NOTEBOOK PILL CLICK
   ───────────────────────────────────────────────────────── */
const SPARKLE_EMOJIS = ['✨', '⭐', '💫', '🌟', '✦', '❋'];
function spawnSparkles(x, y, count = 8) {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    for (let i = 0; i < count; i++) {
        const el    = document.createElement('span');
        el.className = 'sparkle';
        el.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
        const angle   = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const dist    = 40 + Math.random() * 60;
        const dx      = Math.cos(angle) * dist;
        const dy      = Math.sin(angle) * dist - 20;
        el.style.left = (x - 8) + 'px';
        el.style.top  = (y - 8) + 'px';
        el.style.setProperty('--dx', `${dx}px`);
        el.style.setProperty('--dy', `${dy}px`);
        el.style.animationDelay = `${Math.random() * 0.1}s`;
        container.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }
}

function initSparkles() {
    document.getElementById('notebooks-grid')?.addEventListener('click', (e) => {
        const pill = e.target.closest('.notebook-pill');
        if (!pill) return;
        spawnSparkles(e.clientX, e.clientY, 10);
    });
}

/* ─────────────────────────────────────────────────────────
   11. CLIPBOARD COPY + TOAST
   ───────────────────────────────────────────────────────── */
function copyQuestion(btn) {
    const text = btn.querySelector('span.text-gray-300')?.textContent?.trim();
    if (!text) return;

    const writeText = () => navigator.clipboard.writeText(text).then(showToast).catch(fallback);
    const fallback  = () => {
        const ta = Object.assign(document.createElement('textarea'),
            { value: text, style: 'position:fixed;opacity:0' });
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast(); } catch (_) {}
        ta.remove();
    };

    if (navigator.clipboard) writeText(); else fallback();
    spawnSparkles(
        btn.getBoundingClientRect().left + btn.offsetWidth / 2,
        btn.getBoundingClientRect().top  + btn.offsetHeight / 2,
        6
    );
}

function showToast() {
    const t = document.getElementById('toast');
    if (!t) return;
    t.classList.replace('translate-y-16', 'translate-y-0');
    t.classList.replace('opacity-0', 'opacity-100');
    setTimeout(() => {
        t.classList.replace('translate-y-0', 'translate-y-16');
        t.classList.replace('opacity-100', 'opacity-0');
    }, 2200);
}

/* ─────────────────────────────────────────────────────────
   12. AUTO-PLAY VIDEO (with user-gesture fallback)
   ───────────────────────────────────────────────────────── */
function initVideo() {
    const video = document.getElementById('guide-video');
    if (!video) return;

    video.muted = true;
    const attemptPlay = () => video.play().catch(() => {});
    attemptPlay();

    // Try with sound on first user gesture
    const unlockAudio = () => {
        video.muted = false;
        video.play().catch(() => { video.muted = true; });
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click',   unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
}



/* ─────────────────────────────────────────────────────────
   14. SMOOTH SCROLL for nav links
   ───────────────────────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ─────────────────────────────────────────────────────────
   BOOT — run everything on DOM ready
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    loadNotebooks();
    initParticles();
    initCursorSpotlight();
    initNavbar();
    initScrollReveal();
    initCounter();
    initExampleQHighlight();
    initSparkles();
    initVideo();
    initSmoothScroll();
});
