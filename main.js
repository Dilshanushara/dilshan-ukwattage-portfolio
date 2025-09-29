/* =========================
   Portfolio Main Script
   ========================= */

   const state = {
    typingRoles: [
      'scalable web apps.',
      'performant frontends.',
      'modular architectures.',
      'clean APIs.',
      'user-centered solutions.'
    ],
    currentRoleIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typingInterval: null,
    intersectionObserver: null,
    projects: [
      {
        id: 'salon-revive',
        name: 'Salon Revive Website',
        category: ['react','fullstack'],
        stack: ['React','TypeScript','SCSS','GitHub Pages'],
        meta: 'Responsive SPA',
        description: 'A modern responsive salon website with multi-section layout, service highlighting, and mobile-first design. Emphasis on polished UI and component-driven structure.',
        long: 'Built as a showcase project to test design systems, responsive layout strategies, and reusable component patterns. Implemented graceful fallbacks, semantic structure, and accessible color contrast.',
        repo: 'https://github.com/Dilshanushara/Salon-Revive',
        live: 'https://dilshanushara.github.io/Salon-Revive/'
      },
      {
        id: 'task-manager',
        name: 'Task Management App',
        category: ['angular','fullstack'],
        stack: ['Angular','RxJS','TypeScript','.NET Core','REST'],
        meta: 'Productivity Platform',
        description: 'Task planning system with reactive UI, modular feature domains, and API integration.',
        long: 'Focus on clean architecture: separated feature modules, route-based code splitting, state encapsulation, and custom RxJS operators for data orchestration.',
        repo: 'https://github.com/Dilshanushara/TaskManagementApp',
        live: ''
      },
      // {
      //   id: 'microservice-core',
      //   name: 'Service Monitoring Core',
      //   category: ['dotnet','fullstack'],
      //   stack: ['.NET Core','Microservices','MySQL','Docker'],
      //   meta: 'Service Infrastructure',
      //   description: 'Microservices foundation for service registration & health tracking (internal concept project).',
      //   long: 'Implemented service registry pattern, health check endpoints, resilience strategies (retry/backoff), and structured logging for observability.',
      //   repo: '',
      //   live: ''
      // },
      // {
      //   id: 'angular-experiments',
      //   name: 'Angular Pattern Lab',
      //   category: ['angular'],
      //   stack: ['Angular','RxJS','SCSS','TypeScript'],
      //   meta: 'Component Library',
      //   description: 'Pattern exploration: reactive forms, dynamic modules, directive composition, custom pipes.',
      //   long: 'Serves as a sandbox for exploring Angular best practices including OnPush strategies, zone-less experiments, and optimized change detection profiling.',
      //   repo: '',
      //   live: ''
      // }
    ]
  };
  
  /* Theme Persistence */
  (function initTheme() {
    const stored = localStorage.getItem('theme');
    const html = document.documentElement;
    if (stored === 'light') {
      html.setAttribute('data-theme','light');
    } else if (stored === 'dark') {
      html.setAttribute('data-theme','dark');
    }
    const toggleBtn = document.getElementById('mode-toggle');
    updateThemeIcon(toggleBtn);
  
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(toggleBtn);
    });
  })();
  function updateThemeIcon(btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  
  /* Typing Effect */
  function startTyping() {
    const el = document.getElementById('typing-roles');
    const roles = state.typingRoles;
    if (!el) return;
  
    function type() {
      const full = roles[state.currentRoleIndex];
      if (!state.isDeleting) {
        el.textContent = full.slice(0, ++state.charIndex);
        if (state.charIndex === full.length) {
          state.isDeleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        el.textContent = full.slice(0, --state.charIndex);
        if (state.charIndex === 0) {
          state.isDeleting = false;
          state.currentRoleIndex = (state.currentRoleIndex + 1) % roles.length;
        }
      }
      const speed = state.isDeleting ? 48 : 90;
      setTimeout(type, speed);
    }
    type();
  }
  startTyping();
  
  /* Scroll to top button */
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });
  
  /* Intersection Observer for section reveals + nav highlight */
  const sections = Array.from(document.querySelectorAll('section.section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const observerOpts = { threshold: 0.18, rootMargin: '0px 0px -10% 0px' };
  
  state.intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // highlight nav link
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOpts);
  
  sections.forEach(sec => state.intersectionObserver.observe(sec));
  
  /* Smooth scroll for nav links (support manual highlight override) */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (hash.startsWith('#')) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
          // collapse mobile navbar
          const nav = document.getElementById('primaryNav');
          if (nav.classList.contains('show')) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(nav);
              collapse.hide();
          }
        }
      }
    });
  });
  
  /* Render Projects */
  function renderProjects(filter = 'all') {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';
    const filtered = state.projects.filter(p => {
      return filter === 'all' || p.category.includes(filter);
    });
  
    if (!filtered.length) {
      container.innerHTML = `<p class="loading">No projects matched.</p>`;
      return;
    }
  
    filtered.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card fade-in';
      card.setAttribute('data-project-id', project.id);
      card.innerHTML = `
        <h3>${escapeHTML(project.name)}</h3>
        <div class="project-meta">${escapeHTML(project.meta || '')}</div>
        <p class="project-desc">${escapeHTML(project.description)}</p>
        <div class="project-tags">
          ${project.stack.map(s => `<span>${escapeHTML(s)}</span>`).join('')}
        </div>
        <div class="card-actions">
          ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener">Live</a>` : ''}
          ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noopener">Code</a>` : ''}
          <button type="button" class="detail-btn" data-project="${project.id}">Details</button>
        </div>
      `;
      container.appendChild(card);
      requestAnimationFrame(() => card.classList.add('visible'));
    });
  }
  renderProjects();
  
  function escapeHTML(str) {
    return (str||'').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }
  
  /* Project Filters */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
  
  /* Modal Logic */
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  document.addEventListener('click', e => {
    const detailBtn = e.target.closest('.detail-btn');
    if (detailBtn) {
      const id = detailBtn.getAttribute('data-project');
      openProjectModal(id);
    }
    if (e.target.matches('[data-close-modal]') || e.target === modal) {
      closeModal();
    }
  });
  
  function openProjectModal(id) {
    const proj = state.projects.find(p => p.id === id);
    if (!proj) return;
    modalBody.innerHTML = `
      <h3>${escapeHTML(proj.name)}</h3>
      <p>${escapeHTML(proj.long || proj.description)}</p>
      <h4 style="margin-top:1.4rem;font-size:.85rem;letter-spacing:1px;text-transform:uppercase;color:var(--clr-primary)">Tech Stack</h4>
      <p>${proj.stack.map(s => `<code style="font-family:var(--font-mono);background:var(--clr-surface-alt);padding:.25em .45em;border-radius:6px;margin:0 .25em .25em 0;display:inline-block;">${escapeHTML(s)}</code>`).join('')}</p>
      <div class="modal-links">
        ${proj.live ? `<a class="btn small-btn outline-btn" href="${proj.live}" target="_blank" rel="noopener">Live Site</a>`:''}
        ${proj.repo ? `<a class="btn small-btn primary-btn" href="${proj.repo}" target="_blank" rel="noopener">Repository</a>`:''}
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  
  /* Escape modal with ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
  
  /* Blog feed (Medium via rss2json) */
  async function loadBlogs() {
    const container = document.getElementById('blogs-container');
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dilshanukwattage');
      if (!res.ok) throw new Error('Failed to fetch blog feed.');
      const data = await res.json();
      if (!data.items) throw new Error('No items property.');
      const posts = data.items.slice(0,4);
      container.innerHTML = '';
      posts.forEach(post => {
        const plain = post.description.replace(/<[^>]+>/g,'').split(/\s+/).slice(0,30).join(' ') + '...';
        const card = document.createElement('article');
        card.className = 'blog-card fade-in';
        card.innerHTML = `
          <h3><a href="${post.link}" target="_blank" rel="noopener">${escapeHTML(post.title)}</a></h3>
          <div class="blog-meta">${escapeHTML(post.author)} • ${new Date(post.pubDate).toLocaleDateString()}</div>
          <p class="blog-desc">${escapeHTML(plain)}</p>
        `;
        container.appendChild(card);
        requestAnimationFrame(() => card.classList.add('visible'));
      });
    } catch (err) {
      container.innerHTML = `<p class="loading">Unable to load articles right now.</p>`;
      console.error(err);
    }
  }
  loadBlogs();
  
  /* Contact form (frontend simulation) */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();
  
      let valid = true;
      clearErrors();
      if (!name) {
        showError('name','Required');
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email','Invalid email');
        valid = false;
      }
      if (!message) {
        showError('message','Required');
        valid = false;
      }
  
      if (!valid) {
        status.textContent = 'Please correct highlighted fields.';
        status.style.color = 'var(--clr-danger)';
        return;
      }
  
      status.textContent = 'Sending...';
      status.style.color = 'var(--clr-text-dim)';
  
      // Simulate async
      setTimeout(() => {
        status.textContent = 'Message sent successfully!';
        status.style.color = 'var(--clr-success)';
        contactForm.reset();
      }, 900);
    });
  }
  
  function showError(field, msg) {
    const span = document.querySelector(`[data-error-for="${field}"]`);
    if (span) span.textContent = msg;
  }
  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  }
  
  /* Year */
  document.getElementById('year').textContent = new Date().getFullYear();
  
  /* Accessibility: focus trap in modal (basic) */
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' && modal.classList.contains('open')) {
      const focusables = modal.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
  
  /* Utility: throttle (if needed) */
  function throttle(fn, wait=200) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  }
  
  /* End of file */