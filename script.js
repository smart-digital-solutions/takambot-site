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
            // GA Event Tracking
            // GA Event Tracking & Delayed Navigation
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof gtag === 'function') {
                    // 1. Generic event with parameters (for standard reports)
                    gtag('event', 'notebook_click', { 'notebook_id': nb.id || `notebook-${i}`, 'notebook_title': nb.title || nb.label });
                    // 2. Specific event name (for instant real-time list visibility)
                    const cleanId = (nb.id || `notebook-${i}`).replace(/-/g, '_');
                    gtag('event', `click_${cleanId}`);
                }
                // Delay transition to show sparkle effects
                setTimeout(() => {
                    window.open(nb.url, '_blank');
                }, 350);
            });

            grid.appendChild(pill);
        });
    } catch (err) {
        console.warn('notebooks.json load failed:', err);
        grid.innerHTML = `
            <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer"
               class="notebook-pill accent-cyber col-span-2"
               onclick="if(typeof gtag === 'function') gtag('event', 'notebook_click', { 'notebook_id': 'fallback', 'notebook_title': 'NotebookLM' });">
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
function copyTextWithFeedback(text, anchorEl, toastMessage) {
    if (!text) return;

    const onSuccess = () => showToast(toastMessage);
    const fallback = () => {
        const ta = Object.assign(document.createElement('textarea'),
            { value: text, style: 'position:fixed;opacity:0' });
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); onSuccess(); } catch (_) {}
        ta.remove();
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(fallback);
    } else {
        fallback();
    }

    if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
    }
}

function copyQuestion(btn) {
    const text = btn.querySelector('span.text-gray-300')?.textContent?.trim();
    copyTextWithFeedback(text, btn, '✅ השאלה הועתקה!');
}

function showToast(message = '✅ השאלה הועתקה!') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = message;
    t.classList.replace('translate-y-16', 'translate-y-0');
    t.classList.replace('opacity-0', 'opacity-100');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => {
        t.classList.replace('translate-y-0', 'translate-y-16');
        t.classList.replace('opacity-100', 'opacity-0');
    }, 2400);
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

    // Only unmute when the user clicks explicitly on the video itself
    const unlockAudio = () => {
        video.muted = false;
        video.play().catch(() => { video.muted = true; });
        video.removeEventListener('click', unlockAudio);
    };
    video.addEventListener('click', unlockAudio);
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
   15. LIVE WEEKLY CHANGELOG (Google Sheet + Static Fallback)
   ───────────────────────────────────────────────────────── */
const CHANGELOG_SHEET_ID  = '1VrTI3rQP7isI1dQ0UPk4mlsdqt6IDnaA8JPJz4wQWVc';
const CHANGELOG_SHEET_GID = '323637405';

function parseCsvRows(csvText) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const ch = csvText[i];
        const next = csvText[i + 1];

        if (inQuotes) {
            if (ch === '"' && next === '"') {
                field += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                field += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === ',') {
            row.push(field.trim());
            field = '';
        } else if (ch === '\r' && next === '\n') {
            row.push(field.trim());
            rows.push(row);
            row = [];
            field = '';
            i++;
        } else if (ch === '\n' || ch === '\r') {
            row.push(field.trim());
            rows.push(row);
            row = [];
            field = '';
        } else {
            field += ch;
        }
    }
    if (field.length > 0 || row.length > 0) {
        row.push(field.trim());
        rows.push(row);
    }
    return rows;
}

function isSafeHttpsUrl(rawUrl) {
    try {
        const u = new URL(rawUrl);
        return u.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function normalizeSheetCsvToEntries(csvText) {
    const rows = parseCsvRows(csvText);
    if (rows.length < 2) return [];

    const entries = [];
    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const syncDate = (r[0] || '').trim();
        if (!syncDate || syncDate.startsWith('סה"כ') || syncDate.startsWith('סה״כ')) continue;
        entries.push({
            sync_date:         syncDate,
            publish_date:      (r[1] || '').trim(),
            chapter:           (r[2] || '').trim(),
            doc_id:            (r[3] || '').trim(),
            doc_title:         (r[4] || '').trim(),
            edition:           (r[5] || '').trim(),
            affected_sections: (r[6] || '').trim(),
            change_summary:    (r[7] || '').trim(),
            reference:         (r[8] || '').trim(),
            source_url:        (r[9] || '').trim()
        });
    }
    return entries;
}

function createBadge(text, className) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
}

async function initWeeklyChangelog() {
    const listEl        = document.getElementById('updates-list');
    const weekBtn       = document.getElementById('filter-week-btn');
    const allBtn        = document.getElementById('filter-all-btn');
    const chapSelect    = document.getElementById('chapter-filter-select');
    const searchInput   = document.getElementById('updates-search');
    const liveBadge     = document.getElementById('updates-live-badge');
    if (!listEl) return;

    let allEntries = [];
    let isLive = false;

    const csvUrl = `https://docs.google.com/spreadsheets/d/${CHANGELOG_SHEET_ID}/export?format=csv&gid=${CHANGELOG_SHEET_GID}&t=${Date.now()}`;
    try {
        const res = await fetch(csvUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csvText = await res.text();
        allEntries = normalizeSheetCsvToEntries(csvText);
        if (allEntries.length > 0) isLive = true;
    } catch (err) {
        console.warn('Live Sheet CSV fetch failed, using updates.json fallback:', err);
    }

    if (!allEntries.length) {
        try {
            const fb = await fetch(`updates.json?t=${Date.now()}`);
            if (fb.ok) {
                const payload = await fb.json();
                allEntries = payload.entries || [];
            }
        } catch (err2) {
            console.warn('updates.json fallback failed:', err2);
        }
    }

    if (liveBadge && !isLive) {
        liveBadge.textContent = 'עותק שמור';
        liveBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-[11px] font-semibold text-amber-300';
    }

    if (!allEntries.length) {
        listEl.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06] text-center text-xs text-gray-400';
        empty.textContent = 'טרם תועדו עדכונים להצגה.';
        listEl.appendChild(empty);
        return;
    }

    const latestSync = allEntries[0].sync_date;
    const weekEntries = allEntries.filter(e => e.sync_date === latestSync);
    const uniqueWeekDocs = new Set(weekEntries.map(e => e.doc_id || e.doc_title)).size;

    // Populate KPI cards & Hero pill
    const kpiWeek  = document.getElementById('cl-kpi-week');
    const kpiDocs  = document.getElementById('cl-kpi-week-docs');
    const kpiDate  = document.getElementById('cl-kpi-date');
    const kpiTotal = document.getElementById('cl-kpi-total');
    if (kpiWeek)  kpiWeek.textContent  = String(weekEntries.length);
    if (kpiDocs)  kpiDocs.textContent  = `ב-${uniqueWeekDocs} הוראות`;
    if (kpiDate)  kpiDate.textContent  = latestSync;
    if (kpiTotal) kpiTotal.textContent = String(allEntries.length);

    if (weekBtn) weekBtn.textContent = `✨ חדש השבוע (${weekEntries.length})`;
    if (allBtn)  allBtn.textContent  = `📚 כל ההיסטוריה (${allEntries.length})`;

    const heroPill = document.getElementById('hero-updates-pill');
    const heroText = document.getElementById('hero-updates-text');
    if (heroPill && heroText) {
        heroText.textContent = `עודכן ${latestSync} · ${uniqueWeekDocs} הוראות התחדשו`;
        heroPill.classList.remove('hidden');
    }

    // Populate chapter filter dropdown
    if (chapSelect) {
        const chapters = Array.from(new Set(allEntries.map(e => e.chapter).filter(Boolean)));
        chapters.forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch;
            opt.textContent = ch;
            chapSelect.appendChild(opt);
        });
    }

    let currentMode = 'week';

    function renderList() {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const selectedChap = chapSelect?.value || 'ALL';

        const filtered = allEntries.filter(e => {
            if (currentMode === 'week' && e.sync_date !== latestSync) return false;
            if (selectedChap !== 'ALL' && e.chapter !== selectedChap) return false;
            if (query) {
                const hay = [
                    e.doc_id, e.doc_title, e.chapter, e.affected_sections,
                    e.change_summary, e.reference, e.edition, e.publish_date, e.sync_date
                ].join(' ').toLowerCase();
                if (!hay.includes(query)) return false;
            }
            return true;
        });

        listEl.innerHTML = '';
        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06] text-center text-xs text-gray-400';
            empty.textContent = 'לא נמצאו עדכונים התואמים לסינון שבחרת.';
            listEl.appendChild(empty);
            return;
        }

        filtered.forEach(item => {
            const isLatest = item.sync_date === latestSync;
            const card = document.createElement('article');
            card.className = `update-card p-4 sm:p-5 rounded-2xl ${isLatest ? 'is-latest-week' : ''}`;

            // Header badges row
            const topRow = document.createElement('div');
            topRow.className = 'flex flex-wrap items-center justify-between gap-2 mb-2.5';

            const badgesWrap = document.createElement('div');
            badgesWrap.className = 'flex flex-wrap items-center gap-1.5';

            if (isLatest) {
                badgesWrap.appendChild(
                    createBadge('✨ חדש השבוע', 'px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300')
                );
            }
            if (item.doc_id) {
                badgesWrap.appendChild(
                    createBadge(`הוראה ${item.doc_id}`, 'px-2.5 py-0.5 rounded-full bg-cyber-400/15 border border-cyber-400/30 text-[11px] font-extrabold text-cyber-300')
                );
            }
            if (item.edition) {
                const edLabel = item.edition.startsWith('מהדורה') || item.edition.startsWith('עדכון')
                    ? item.edition : `מהדורה ${item.edition}`;
                badgesWrap.appendChild(
                    createBadge(edLabel, 'px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/25 text-[11px] font-semibold text-purple-300')
                );
            }
            if (item.chapter) {
                badgesWrap.appendChild(
                    createBadge(item.chapter, 'px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[11px] text-gray-300')
                );
            }

            const datesWrap = document.createElement('div');
            datesWrap.className = 'text-[11px] text-gray-400';
            datesWrap.textContent = item.publish_date
                ? `${item.publish_date} (סנכרון ${item.sync_date})`
                : `סנכרון ${item.sync_date}`;

            topRow.appendChild(badgesWrap);
            topRow.appendChild(datesWrap);

            // Title & section line
            const titleEl = document.createElement('h3');
            titleEl.className = 'text-sm sm:text-base font-bold text-white mb-1.5';
            titleEl.textContent = item.doc_title || `עדכון הוראה ${item.doc_id}`;

            const bodyEl = document.createElement('p');
            bodyEl.className = 'text-xs sm:text-[13px] text-gray-300 leading-relaxed mb-3';
            if (item.affected_sections) {
                const secSpan = document.createElement('strong');
                secSpan.className = 'text-cyber-300 ml-1';
                secSpan.textContent = `[סעיף/נספח: ${item.affected_sections}]`;
                bodyEl.appendChild(secSpan);
            }
            bodyEl.appendChild(document.createTextNode(item.change_summary));

            // Footer metadata + interactive buttons
            const footRow = document.createElement('div');
            footRow.className = 'flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/[0.05]';

            const refEl = document.createElement('span');
            refEl.className = 'text-[11px] text-gray-500';
            refEl.textContent = item.reference ? `אסמכתה: ${item.reference}` : '';

            const actionsWrap = document.createElement('div');
            actionsWrap.className = 'flex flex-wrap items-center gap-2';

            const askBtn = document.createElement('button');
            askBtn.type = 'button';
            askBtn.className = 'min-h-[36px] px-3 py-1.5 rounded-lg bg-cyber-400/10 hover:bg-cyber-400/20 border border-cyber-400/25 text-[11px] font-bold text-cyber-300 transition-colors cursor-pointer';
            askBtn.textContent = '💬 שאל את תכמבוט על השינוי';
            askBtn.addEventListener('click', () => {
                const promptText = `בהתאם לעדכון בהוראה ${item.doc_id} (${item.doc_title}${item.edition ? `, מהדורה ${item.edition}` : ''}), פרט לי בבקשה מה השתנה ב${item.affected_sections || 'הוראה'} ומה המשמעות המעשית למזמין?`;
                copyTextWithFeedback(promptText, askBtn, '✅ השאלה הועתקה! הדביקו במחברת');
            });
            actionsWrap.appendChild(askBtn);

            if (isSafeHttpsUrl(item.source_url)) {
                const linkEl = document.createElement('a');
                linkEl.href = item.source_url;
                linkEl.target = '_blank';
                linkEl.rel = 'noopener noreferrer';
                linkEl.className = 'min-h-[36px] inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-[11px] font-semibold text-gray-300 hover:text-white transition-colors';
                linkEl.textContent = item.source_url.includes('drive.google.com')
                    ? '📥 לדוח השינויים (PDF)'
                    : '🌐 לאתר התכ"ם הרשמי';
                actionsWrap.appendChild(linkEl);
            }

            footRow.appendChild(refEl);
            footRow.appendChild(actionsWrap);

            card.appendChild(topRow);
            card.appendChild(titleEl);
            card.appendChild(bodyEl);
            card.appendChild(footRow);
            listEl.appendChild(card);
        });
    }

    weekBtn?.addEventListener('click', () => {
        currentMode = 'week';
        weekBtn.classList.add('active');
        allBtn?.classList.remove('active');
        renderList();
    });
    allBtn?.addEventListener('click', () => {
        currentMode = 'all';
        allBtn.classList.add('active');
        weekBtn?.classList.remove('active');
        renderList();
    });
    chapSelect?.addEventListener('change', renderList);
    searchInput?.addEventListener('input', renderList);

    renderList();
}

/* ─────────────────────────────────────────────────────────
   BOOT — run everything on DOM ready
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    loadNotebooks();
    initWeeklyChangelog();
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
