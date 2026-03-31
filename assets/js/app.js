/**
 * EasySyntax — app.js
 * Laravel-ready: maps to resources/js/app.js
 *
 * Uses Alpine.js for reactivity.
 * Partial loading via data-include (simulates Blade @include).
 */

/* ─── Partial Loader ─── */
async function loadPartials() {
    const slots = document.querySelectorAll('[data-include]');
    for (const el of slots) {
        try {
            const res = await fetch(el.dataset.include);
            if (res.ok) el.innerHTML = await res.text();
        } catch (e) {
            console.warn('Partial load failed:', el.dataset.include);
        }
    }
    // Re-init Alpine for dynamically loaded partials
    if (window.Alpine) document.querySelectorAll('[x-data]').forEach(el => {
        if (!el._x_dataStack) Alpine.initTree(el);
    });
    // Re-init scroll reveal after partials load
    initReveal();
    initBackToTop();
}

/* ─── Scroll Reveal ─── */
function initReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    const ro = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => ro.observe(el));
}

/* ─── Back to Top ─── */
function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 400);
    });
}

/* ─── Mobile Menu ─── */
function toggleMenu() {
    document.getElementById('mobile-menu')?.classList.toggle('open');
}
function closeMenu() {
    document.getElementById('mobile-menu')?.classList.remove('open');
}

/* ─── Price Toggle ─── */
function switchMode(mode) {
    ['online','onsite','video'].forEach(m => {
        document.getElementById('prices-'+m)?.classList.toggle('active', mode === m);
    });
    const active = 'tab-pill px-7 py-2.5 rounded-xl font-black text-lg uppercase bg-indigo-600 text-white border-b-4 border-indigo-900';
    const inactive = 'tab-pill px-7 py-2.5 rounded-xl font-black text-lg uppercase text-slate-500';
    ['online','onsite','video'].forEach(m => {
        const tab = document.getElementById('tab-'+m);
        if (tab) tab.className = mode === m ? active : inactive;
    });
}

/* ─── FAQ Accordion ─── */
function toggleFaq(btn) {
    const body = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const isOpen = body.classList.contains('open');
    document.querySelectorAll('.faq-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
    if (!isOpen) { body.classList.add('open'); icon.classList.add('open'); }
}

/* ─── Syarat Modal ─── */
function openSyarat() {
    document.getElementById('syarat-modal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSyarat() {
    document.getElementById('syarat-modal')?.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── Copy Link ─── */
function copyLink(url) {
    navigator.clipboard.writeText(url || window.location.href).then(() => {
        const toast = document.getElementById('copy-toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    });
}

/* ─── Share Helpers ─── */
function shareWhatsApp(url, text) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}
function shareFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}
function shareTwitter(url, text) {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSyarat(); });
});
