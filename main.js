/* ===========================================
   ANAND NARAYAN DWIVEDI — MAIN JAVASCRIPT
   Portfolio Interactive Features
   =========================================== */

'use strict';

// ============================================================
// API CONFIGURATION
// When served by Express (npm start / npm run dev), all fetch
// calls go to the same origin. A fallback origin is used when
// opening index.html directly in a browser (e.g. via Live Server).
// ============================================================
const API_BASE = (() => {
  // If the page was opened via file:// or a different port,
  // point to the Express backend explicitly.
  if (window.location.protocol === 'file:' || window.location.port === '5500') {
    return 'http://localhost:3001';
  }
  // Otherwise, same origin (Express serves the static files too)
  return '';
})();

// ============================================================
// DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypingEffect();
  initParticles();
  initScrollAnimations();
  initSkillBars();
  initCounterAnimation();
  initContactForm();
  initBackToTop();
  setFooterYear();
  initSocialLinks();    // fetch social links from API
  initResumeButtons();  // check resume availability
  initProjects();
  initEducation();
  initCertificates();
  initSkills();
});

// ============================================================
// THEME TOGGLE (DARK / LIGHT)
// ============================================================
function initTheme() {
  const body        = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
    showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  });

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      if (themeIcon) { themeIcon.className = 'fas fa-moon'; }
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      if (themeIcon) { themeIcon.className = 'fas fa-sun'; }
    }
  }
}

// ============================================================
// NAVBAR — Scroll, Active Link, Hamburger
// ============================================================
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks?.querySelectorAll('.nav-link');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hamburger menu
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on link click (mobile)
  links?.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
      navLinks?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    links?.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// ============================================================
// TYPING EFFECT
// ============================================================
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'React Developer',
    'Node.js Engineer',
    'Problem Solver',
    'CS Student',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay     = 120;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      delay = 110;
      if (charIdx === phrase.length) {
        isDeleting = true;
        delay = 1800; // pause at end
      }
    } else {
      el.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        delay = 400;
      }
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

// ============================================================
// HERO PARTICLES
// ============================================================
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const PARTICLE_COUNT = 18;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 2}px;
      height: ${Math.random() * 3 + 2}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

// ============================================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================================
function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within same parent
        const siblings = Array.from(entry.target.parentElement?.children ?? []);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

// ============================================================
// SKILL BAR ANIMATION
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width') || '0';
        entry.target.style.width = `${width}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// ============================================================
// COUNTER ANIMATION (Hero Stats)
// ============================================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target') ?? '0', 10);
        let current  = 0;
        const step   = Math.ceil(target / 30);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = String(target);
            clearInterval(timer);
          } else {
            el.textContent = String(current);
          }
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ============================================================
// CONTACT FORM — Connected to Express + MongoDB backend
// ============================================================
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = document.getElementById('submitContactBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = (form.elements['name']?.value    ?? '').trim();
    const email   = (form.elements['email']?.value   ?? '').trim();
    const subject = (form.elements['subject']?.value ?? '').trim();
    const message = (form.elements['message']?.value ?? '').trim();

    // ── Client-side validation ──────────────────────────────
    if (!name || name.length < 2) {
      showFormStatus('error', '⚠️ Please enter your name (at least 2 characters).');
      return;
    }
    if (!isValidEmail(email)) {
      showFormStatus('error', '⚠️ Please enter a valid email address.');
      return;
    }
    if (!message || message.length < 10) {
      showFormStatus('error', '⚠️ Message must be at least 10 characters.');
      return;
    }

    // ── Loading state ───────────────────────────────────────
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
    }
    showFormStatus('', ''); // clear previous

    // ── POST to backend API ─────────────────────────────────
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ── Success ──────────────────────────────────────────
        showFormStatus('success', `✅ ${data.message}`);
        form.reset();
        showToast('📬 Message sent and saved!');

      } else if (response.status === 422 && data.errors) {
        // ── Validation errors from server ────────────────────
        const firstError = data.errors[0]?.message || 'Please check your input.';
        showFormStatus('error', `⚠️ ${firstError}`);

      } else if (response.status === 429) {
        // ── Rate limited ─────────────────────────────────────
        showFormStatus('error', '⏳ Too many messages. Please wait a few minutes.');

      } else {
        // ── Other server error ───────────────────────────────
        showFormStatus('error', `❌ ${data.message || 'Server error. Please try again.'}`);
      }

    } catch (networkErr) {
      // ── Network / server offline ─────────────────────────
      console.warn('Contact form network error:', networkErr.message);
      showFormStatus(
        'error',
        '🔌 Could not reach the server. Please email me directly at dwivedianandnarayan@gmail.com'
      );
    } finally {
      // ── Restore button ────────────────────────────────────
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
      }
    }
  });

  // ── Helper: show coloured status below the form ──────────
  function showFormStatus(type, msg) {
    if (!status) return;
    if (!type && !msg) {
      status.className = 'form-status';
      status.textContent = '';
      return;
    }
    status.className = `form-status ${type}`;
    status.textContent = msg;
    // Auto-clear success messages after 6 s
    if (type === 'success') {
      setTimeout(() => {
        status.className = 'form-status';
        status.textContent = '';
      }, 6000);
    }
  }
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// FOOTER YEAR
// ============================================================
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================================
// UTILS
// ============================================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================
// SMOOTH HOVER TILT / GLOW on Project Cards (subtle)
// ============================================================
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width / 2;
    const y      = e.clientY - rect.top - rect.height / 2;
    const inCard = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom
    );

    if (inCard) {
      const rotX = (-y / rect.height) * 6;
      const rotY = (x / rect.width)  * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.05s linear';
    } else {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    }
  });
});

// ============================================================
// SOCIAL LINKS — Fetch from /api/social and render dynamically
// ============================================================
async function initSocialLinks() {
  const grid    = document.getElementById('socialGrid');
  const loading = document.getElementById('socialLoading');
  const footerIcons = document.getElementById('footerSocialIcons');

  if (!grid) return;

  try {
    const res  = await fetch(`${API_BASE}/api/social`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { data: links } = await res.json();

    // Remove loading skeletons
    if (loading) loading.remove();

    if (!links || links.length === 0) {
      grid.innerHTML = `
        <div class="social-error-msg">
          <i class="fas fa-satellite-dish"></i>
          No social links configured yet.
        </div>`;
      return;
    }

    // ── Render social cards ───────────────────────────────────────
    const isExternal = (url) => !url.startsWith('mailto:') && !url.startsWith('tel:');
    const cardHTML = links.map((link, idx) => `
      <a href="${link.url}"
         ${isExternal(link.url) ? 'target="_blank" rel="noopener noreferrer"' : ''}
         class="social-card animate-on-scroll"
         id="social-${link.platform}"
         aria-label="${link.label} Profile"
         style="animation-delay: ${idx * 60}ms">
        <div class="social-icon ${link.colorClass}">
          <i class="${link.icon}"></i>
        </div>
        <div class="social-info">
          <h3>${link.label}</h3>
          <p>${link.username || link.url}</p>
        </div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>`).join('');

    grid.innerHTML = cardHTML;

    // Re-run scroll observer on new cards
    const newCards = grid.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    newCards.forEach(c => observer.observe(c));

    // ── Update footer social icons ───────────────────────────────
    if (footerIcons) {
      // Only show platforms that have a non-mailto URL in the footer
      const footerLinks = links.filter(l => !l.url.startsWith('mailto:'));
      footerIcons.innerHTML = footerLinks.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer"
           class="footer-social-icon" aria-label="${link.label}">
          <i class="${link.icon}"></i>
        </a>`).join('');
    }

  } catch (err) {
    // Backend offline or no data — show graceful fallback (static cards)
    console.info('Social API unavailable, showing static fallback:', err.message);
    if (loading) loading.remove();

    grid.innerHTML = `
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="social-card animate-on-scroll visible" id="social-github">
        <div class="social-icon github"><i class="fab fa-github"></i></div>
        <div class="social-info"><h3>GitHub</h3><p>@anandnarayan</p></div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" class="social-card animate-on-scroll visible" id="social-linkedin">
        <div class="social-icon linkedin"><i class="fab fa-linkedin-in"></i></div>
        <div class="social-info"><h3>LinkedIn</h3><p>Anand Narayan Dwivedi</p></div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>
      <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" class="social-card animate-on-scroll visible" id="social-youtube">
        <div class="social-icon youtube"><i class="fab fa-youtube"></i></div>
        <div class="social-info"><h3>YouTube</h3><p>@AnandDevChannel</p></div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>
      <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" class="social-card animate-on-scroll visible" id="social-twitter">
        <div class="social-icon twitter"><i class="fab fa-x-twitter"></i></div>
        <div class="social-info"><h3>Twitter / X</h3><p>@ananddev</p></div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>
      <a href="mailto:dwivedianandnarayan@gmail.com" class="social-card animate-on-scroll visible" id="social-gmail">
        <div class="social-icon gmail"><i class="fab fa-google"></i></div>
        <div class="social-info"><h3>Gmail</h3><p>dwivedianandnarayan@gmail.com</p></div>
        <div class="social-arrow"><i class="fas fa-arrow-right"></i></div>
      </a>`;
  }
}

// ============================================================
// RESUME BUTTONS — Check API then enable/disable accordingly
// ============================================================
async function initResumeButtons() {
  const btns = [
    document.getElementById('resumeBtn'),
    document.getElementById('downloadResumeBtn'),
  ].filter(Boolean);

  if (btns.length === 0) return;

  try {
    const res = await fetch(`${API_BASE}/api/resume/info`);

    if (res.ok) {
      const { data } = await res.json();
      // Resume is available — update buttons with real download URL and filename
      btns.forEach(btn => {
        btn.href = `${API_BASE}/api/resume`;
        btn.setAttribute('download', data.downloadAs || 'Anand_Narayan_Dwivedi_Resume.pdf');
        btn.title = `Download ${data.downloadAs} (${data.sizeMB})`;
        btn.classList.remove('unavailable');
      });
    } else {
      // No resume uploaded yet — mark buttons as unavailable
      btns.forEach(btn => {
        btn.classList.add('unavailable');
        btn.title = 'Resume not available yet. Check back soon!';
        btn.removeAttribute('download');
        btn.href = '#';
      });
    }
  } catch {
    // Backend offline — leave buttons as-is (href="/api/resume" will trigger 404 if not uploaded)
    console.info('Resume API check skipped — backend may be offline.');
  }
}

// ============================================================
// DYNAMIC PROJECTS
// ============================================================
async function initProjects() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error('API Error');
    const { data } = await res.json();
    if (!data.length) {
      container.innerHTML = '<p class="text-muted" style="text-align:center;grid-column:1/-1;">Check back soon for upcoming projects!</p>';
      return;
    }
    container.innerHTML = data.map((p, idx) => `
      <article class="project-card animate-on-scroll" id="project-${p._id}">
        <div class="project-card-header">
          <div class="project-icon"><i class="${p.icon || 'fas fa-rocket'}"></i></div>
          <div class="project-links">
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="project-link-btn"><i class="fab fa-github"></i></a>` : ''}
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="project-link-btn"><i class="fas fa-external-link-alt"></i></a>` : ''}
          </div>
        </div>
        <div class="project-card-body">
          <div class="project-number">${String(idx + 1).padStart(2, '0')}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <ul class="project-features">
            ${p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
          </ul>
        </div>
        <div class="project-card-footer">
          <div class="project-tech-stack">
            ${p.techStack.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-card-glow"></div>
      </article>
    `).join('');
    observeGrid(container);
  } catch(err) { container.innerHTML = '<p class="text-muted" style="grid-column:1/-1;">Failed to load projects</p>'; }
}

// ============================================================
// DYNAMIC EDUCATION
// ============================================================
async function initEducation() {
  const container = document.getElementById('educationTimeline');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/education`);
    if (!res.ok) throw new Error('API Error');
    const { data } = await res.json();
    if (!data.length) {
      container.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;">No education history provided.</p>';
      return;
    }
    container.innerHTML = data.map(e => `
      <div class="timeline-item animate-on-scroll">
        <div class="timeline-dot"><i class="${e.icon || 'fas fa-university'}"></i></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <div>
              <h3 class="timeline-title">${e.degree}</h3>
              <p class="timeline-institution">${e.institution}</p>
            </div>
            ${e.badgeText ? `<div class="timeline-badge current">${e.badgeText}</div>` : ''}
          </div>
          <div class="timeline-meta">
            <span class="timeline-date"><i class="fas fa-calendar"></i> ${e.dateRange}</span>
            ${e.location ? `<span class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${e.location}</span>` : ''}
          </div>
          ${e.description ? `<p class="timeline-desc">${e.description}</p>` : ''}
        </div>
      </div>
    `).join('');
    observeGrid(container);
  } catch(err) { container.innerHTML = '<p class="text-muted" style="text-align:center;">Failed to load education details</p>'; }
}

// ============================================================
// DYNAMIC CERTIFICATIONS
// ============================================================
async function initCertificates() {
  const container = document.getElementById('certGrid');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/certifications`);
    if (!res.ok) throw new Error('API Error');
    const { data } = await res.json();
    if (!data.length) {
      container.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;">No certifications loaded.</p>';
      return;
    }
    container.innerHTML = data.map(c => `
      <div class="cert-card animate-on-scroll" id="cert-${c._id}">
        <div class="cert-icon"><i class="${c.icon || 'fas fa-certificate'}"></i></div>
        <div class="cert-body">
          <h3 class="cert-title">${c.title}</h3>
          ${c.issuer ? `<p class="cert-company">${c.issuer}</p>` : ''}
          ${c.date ? `<div class="cert-duration"><i class="fas fa-calendar-alt"></i> <span>${c.date}</span></div>` : ''}
          ${c.description ? `<p class="cert-desc">${c.description}</p>` : ''}
          ${c.topics.length ? `<ul class="cert-list">
            ${c.topics.map(t => `<li><i class="fas fa-check-circle"></i> ${t}</li>`).join('')}
          </ul>` : ''}
        </div>
        ${c.badgeText ? `
        <div class="cert-badge">
          <i class="fas fa-shield-alt"></i> ${c.badgeText}
        </div>` : ''}
      </div>
    `).join('');
    observeGrid(container);
  } catch(err) { container.innerHTML = '<p class="text-muted" style="grid-column:1/-1;">Failed to load certifications</p>'; }
}

function observeGrid(container) {
  const newCards = container.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  newCards.forEach(c => observer.observe(c));
}

// ============================================================
// DYNAMIC SKILLS
// ============================================================
async function initSkills() {
  const container = document.getElementById('skillsGrid');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/skills`);
    if (!res.ok) throw new Error('API Error');
    const { data } = await res.json();
    if (!data.length) {
      container.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;">No skills defined yet.</p>';
      return;
    }

    // Group skills by category
    const categories = {};
    data.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = { icon: skill.categoryIcon, items: [], tags: [] };
      }
      if (skill.isTag) categories[skill.category].tags.push(skill);
      else categories[skill.category].items.push(skill);
    });

    let html = '';
    for (const [catName, catData] of Object.entries(categories)) {
      html += `
        <div class="skill-card animate-on-scroll">
          <div class="skill-card-header">
            <div class="skill-card-icon"><i class="${catData.icon || 'fas fa-code'}"></i></div>
            <h3 class="skill-card-title">${catName}</h3>
          </div>
      `;
      if (catData.items.length) {
        html += '<div class="skill-list">';
        catData.items.forEach(item => {
          html += `
            <div class="skill-item">
              <div class="skill-info">
                <i class="${item.icon}"></i>
                <span>${item.name}</span>
              </div>
              <div class="skill-bar-wrap">
                <div class="skill-bar" data-width="${item.percentage}" style="--bar-color: ${item.color || 'var(--primary)'};"></div>
              </div>
              <span class="skill-pct">${item.percentage}%</span>
            </div>
          `;
        });
        html += '</div>';
      }
      if (catData.tags.length) {
        html += '<div class="tech-tags">';
        catData.tags.forEach(tag => {
          html += `<span class="tech-tag"><i class="${tag.icon}"></i> ${tag.name}</span>`;
        });
        html += '</div>';
      }
      html += `</div>`;
    }

    container.innerHTML = html;
    observeGrid(container);
    initSkillBars(); // Start animations for loaded bars
  } catch(err) { container.innerHTML = '<p class="text-muted" style="grid-column:1/-1;">Failed to load skills details</p>'; }
}
