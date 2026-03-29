document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const el = {
    modal: document.getElementById('login-modal'),
    dashboard: document.getElementById('dashboard'),
    keyInput: document.getElementById('admin-key-input'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    navBtns: document.querySelectorAll('.nav-btn[data-tab]'),
    sections: document.querySelectorAll('.view-section'),
    toastContainer: document.getElementById('toast-container'),
    
    // Messages
    msgTbody: document.getElementById('messages-tbody'),
    msgEmpty: document.getElementById('messages-empty'),
    refreshMsgBtn: document.getElementById('refresh-messages'),
    
    // Resume
    resumeInfoContainer: document.getElementById('resume-info-container'),
    resumeInput: document.getElementById('resume-upload'),
    resumeDropZone: document.getElementById('drop-zone'),
    fileNameDisplay: document.getElementById('file-name-display'),
    uploadResumeBtn: document.getElementById('upload-resume-btn'),

    // Socials
    socialsTbody: document.getElementById('socials-tbody'),
    addSocialBtn: document.getElementById('add-social-btn'),
    socialFormCard: document.getElementById('social-form-card'),
    socialForm: document.getElementById('social-form'),
    cancelSocialBtn: document.getElementById('cancel-social-btn'),
    socialFormTitle: document.getElementById('social-form-title')
  };

  let adminKey = localStorage.getItem('portfolioAdminKey');
  let currentFile = null;

  // --- Utility ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- API Wrapper ---
  async function apiFetch(endpoint, options = {}) {
    if (!adminKey) throw new Error('No admin key');
    const headers = { 'x-admin-key': adminKey, ...options.headers };
    
    try {
      const res = await fetch(`/api${endpoint}`, { ...options, headers });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized. Key may be invalid.');
        }
        throw new Error(data.message || 'API Error');
      }
      return data;
    } catch (err) {
      console.error('API Fetch Error:', err);
      throw err;
    }
  }

  // --- Auth Flow ---
  function initAuth() {
    if (adminKey) {
      el.modal.classList.add('hidden');
      el.dashboard.classList.remove('hidden');
      loadTab('messages');
    } else {
      el.modal.classList.remove('hidden');
      el.dashboard.classList.add('hidden');
    }
  }

  el.loginBtn.addEventListener('click', async () => {
    const key = el.keyInput.value.trim();
    if (!key) return;
    el.loginBtn.disabled = true;
    el.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    
    adminKey = key;
    try {
      await apiFetch('/contact'); 
      localStorage.setItem('portfolioAdminKey', adminKey);
      el.loginError.classList.add('hidden');
      initAuth();
    } catch (err) {
      adminKey = null;
      el.loginError.textContent = 'Invalid Admin Key';
      el.loginError.classList.remove('hidden');
    } finally {
      el.loginBtn.disabled = false;
      el.loginBtn.innerHTML = 'Authenticate';
    }
  });

  function logout() {
    adminKey = null;
    localStorage.removeItem('portfolioAdminKey');
    el.keyInput.value = '';
    initAuth();
  }
  el.logoutBtn.addEventListener('click', logout);

  // --- Tab Navigation ---
  el.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      el.navBtns.forEach(b => b.classList.remove('active'));
      el.sections.forEach(s => s.classList.add('hidden'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(`view-${tabId}`).classList.remove('hidden');
      loadTab(tabId);
    });
  });

  function loadTab(tab) {
    if (tab === 'messages') loadMessages();
    if (tab === 'resume') loadResumeInfo();
    if (tab === 'social') loadSocials();
    if (tab === 'projects') loadProjects();
    if (tab === 'education') loadEducation();
    if (tab === 'certifications') loadCerts();
    if (tab === 'skills') loadSkills();
  }

  // --- Messages Logic ---
  async function loadMessages() {
    el.msgTbody.innerHTML = '<tr><td colspan="5" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/contact');
      if (data.length === 0) {
        el.msgTbody.innerHTML = '';
        el.msgEmpty.classList.remove('hidden');
        return;
      }
      el.msgEmpty.classList.add('hidden');
      el.msgTbody.innerHTML = data.map(m => `
        <tr>
          <td>${new Date(m.createdAt).toLocaleDateString()}</td>
          <td><strong>${m.name}</strong><br/><small class="text-muted">${m.email}</small></td>
          <td>${m.subject || 'No Subject'}</td>
          <td><span class="badge ${m.status === 'unread' ? 'badge-unread' : (m.status === 'read' ? 'badge-read' : 'badge-replied')}">${m.status}</span></td>
          <td>
            <select class="status-select" data-id="${m._id}">
              <option value="unread" ${m.status === 'unread' ? 'selected' : ''}>Unread</option>
              <option value="read" ${m.status === 'read' ? 'selected' : ''}>Read</option>
              <option value="replied" ${m.status === 'replied' ? 'selected' : ''}>Replied</option>
            </select>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const id = e.target.getAttribute('data-id');
          try {
             await apiFetch(`/contact/${id}/status`, {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ status: e.target.value })
             });
             showToast('Status updated');
             loadMessages();
          } catch (err) { showToast(err.message, 'error'); }
        });
      });
    } catch (err) {
      el.msgTbody.innerHTML = `<tr><td colspan="5" class="error-text">Failed to load messages</td></tr>`;
    }
  }
  el.refreshMsgBtn.addEventListener('click', loadMessages);

  // --- Resume Logic ---
  async function loadResumeInfo() {
    try {
      const res = await fetch('/api/resume/info');
      const { data } = await res.json();
      if (!data) throw new Error('No data');
      el.resumeInfoContainer.innerHTML = `
        <p><strong>Name:</strong> ${data.originalName}</p>
        <p><strong>Size:</strong> ${data.sizeMB} MB</p>
        <p><strong>Uploaded:</strong> ${new Date(data.uploadedAt).toLocaleDateString()}</p>
        <div class="actions mt-4" style="display:flex;gap:1rem;">
          <a href="/api/resume" target="_blank" class="btn btn-secondary"><i class="fas fa-download"></i> Download</a>
          <button id="delete-resume" class="btn btn-danger"><i class="fas fa-trash"></i> Delete</button>
        </div>`;
      document.getElementById('delete-resume').addEventListener('click', async () => {
        if(!confirm('Are you sure you want to delete the active resume?')) return;
        try { await apiFetch('/resume', { method: 'DELETE' }); showToast('Resume deleted'); loadResumeInfo(); } 
        catch(err) { showToast(err.message, 'error'); }
      });
    } catch (err) { el.resumeInfoContainer.innerHTML = '<p class="text-muted">No resume uploaded yet.</p>'; }
  }

  el.resumeDropZone.addEventListener('click', () => el.resumeInput.click());
  el.resumeDropZone.addEventListener('dragover', (e) => { e.preventDefault(); el.resumeDropZone.classList.add('dragover'); });
  el.resumeDropZone.addEventListener('dragleave', () => el.resumeDropZone.classList.remove('dragover'));
  el.resumeDropZone.addEventListener('drop', (e) => {
    e.preventDefault(); el.resumeDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
  });
  el.resumeInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelect(e.target.files[0]);
  });

  function handleFileSelect(file) {
    if (file.type !== 'application/pdf') { showToast('Only PDF files are allowed', 'error'); return; }
    currentFile = file;
    el.fileNameDisplay.textContent = file.name;
    el.uploadResumeBtn.disabled = false;
  }

  el.uploadResumeBtn.addEventListener('click', async () => {
    if (!currentFile) return;
    const formData = new FormData(); formData.append('resume', currentFile);
    el.uploadResumeBtn.disabled = true; el.uploadResumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    try {
      const res = await fetch('/api/resume', { method: 'POST', headers: { 'x-admin-key': adminKey }, body: formData });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      showToast('Resume uploaded successfully');
      currentFile = null; el.fileNameDisplay.textContent = ''; el.resumeInput.value = '';
      loadResumeInfo();
    } catch(err) { showToast(err.message, 'error'); } 
    finally { el.uploadResumeBtn.disabled = false; el.uploadResumeBtn.innerHTML = '<i class="fas fa-upload"></i> Upload'; }
  });


  // --- Social Links Logic ---
  async function loadSocials() {
    el.socialsTbody.innerHTML = '<tr><td colspan="6" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/social/all');
      el.socialsTbody.innerHTML = data.map(s => `
        <tr>
          <td>${s.order}</td><td><i class="${s.icon} fa-lg"></i></td><td><strong>${s.platform}</strong></td>
          <td><a href="${s.url}" target="_blank" style="color:var(--primary)">${s.label}</a></td>
          <td><span class="badge ${s.isActive ? 'badge-active' : 'badge-inactive'} cursor-pointer toggle-social" data-id="${s._id}">${s.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-icon edit-social" data-id="${s._id}" data-obj='${JSON.stringify(s).replace(/'/g, "&apos;")}'><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon delete-social" style="color:var(--danger)" data-id="${s._id}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
      bindCrudEvents('.toggle-social', '.delete-social', '.edit-social', '/social', loadSocials, populateSocialForm);
    } catch (err) { el.socialsTbody.innerHTML = `<tr><td colspan="6" class="error-text">Failed to load socials</td></tr>`; }
  }

  el.addSocialBtn.addEventListener('click', () => { el.socialForm.reset(); document.getElementById('social-id').value = ''; el.socialFormcard?.classList.remove('hidden'); el.socialFormCard.classList.remove('hidden'); el.socialFormTitle.textContent = 'Add Social Link'; });
  el.cancelSocialBtn.addEventListener('click', (e) => { e.preventDefault(); el.socialFormCard.classList.add('hidden'); });

  el.socialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('social-id').value;
    const payload = {
      platform: document.getElementById('social-platform').value, url: document.getElementById('social-url').value,
      label: document.getElementById('social-label').value, username: document.getElementById('social-username').value,
      icon: document.getElementById('social-icon').value, order: parseInt(document.getElementById('social-order').value) || 99
    };
    await saveEntity('/social', id, payload, el.socialFormCard, el.socialForm, loadSocials);
  });

  function populateSocialForm(obj) {
    document.getElementById('social-id').value = obj._id; document.getElementById('social-platform').value = obj.platform;
    document.getElementById('social-url').value = obj.url; document.getElementById('social-label').value = obj.label;
    document.getElementById('social-username').value = obj.username || ''; document.getElementById('social-icon').value = obj.icon;
    document.getElementById('social-order').value = obj.order;
    el.socialFormTitle.textContent = 'Edit Social Link'; el.socialFormCard.classList.remove('hidden'); el.socialFormCard.scrollIntoView();
  }

  // --- Projects Logic ---
  const projectsTbody = document.getElementById('projects-tbody');
  const projectForm = document.getElementById('project-form');
  const projectFormCard = document.getElementById('project-form-card');
  const addProjectBtn = document.getElementById('add-project-btn');
  const cancelProjectBtn = document.getElementById('cancel-project-btn');

  async function loadProjects() {
    projectsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/projects/all');
      projectsTbody.innerHTML = data.map(i => `
        <tr>
          <td>${i.order}</td><td><strong>${i.title}</strong></td><td><a href="${i.liveUrl||'#'}" target="_blank" style="color:var(--primary)">Demo</a></td>
          <td><span class="badge ${i.isActive ? 'badge-active' : 'badge-inactive'} cursor-pointer toggle-project" data-id="${i._id}">${i.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-icon edit-project" data-id="${i._id}" data-obj='${JSON.stringify(i).replace(/'/g, "&apos;")}'><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon delete-project" style="color:var(--danger)" data-id="${i._id}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
      bindCrudEvents('.toggle-project', '.delete-project', '.edit-project', '/projects', loadProjects, populateProjectForm);
    } catch (err) { projectsTbody.innerHTML = `<tr><td colspan="5" class="error-text">Error fetching projects</td></tr>`; }
  }

  addProjectBtn.addEventListener('click', () => { projectForm.reset(); document.getElementById('project-id').value = ''; document.getElementById('project-form-title').textContent = 'Add Project'; projectFormCard.classList.remove('hidden'); });
  cancelProjectBtn.addEventListener('click', (e) => { e.preventDefault(); projectFormCard.classList.add('hidden'); });

  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const payload = {
      title: document.getElementById('project-title').value, description: document.getElementById('project-desc').value,
      features: document.getElementById('project-features').value.split(',').map(s=>s.trim()).filter(Boolean),
      techStack: document.getElementById('project-tech').value.split(',').map(s=>s.trim()).filter(Boolean),
      githubUrl: document.getElementById('project-github').value, liveUrl: document.getElementById('project-live').value,
      icon: document.getElementById('project-icon').value, order: parseInt(document.getElementById('project-order').value) || 99
    };
    await saveEntity('/projects', id, payload, projectFormCard, projectForm, loadProjects);
  });

  function populateProjectForm(obj) {
    document.getElementById('project-id').value = obj._id; document.getElementById('project-title').value = obj.title;
    document.getElementById('project-desc').value = obj.description; document.getElementById('project-features').value = obj.features?.join(', ')||'';
    document.getElementById('project-tech').value = obj.techStack?.join(', ')||''; document.getElementById('project-github').value = obj.githubUrl||'';
    document.getElementById('project-live').value = obj.liveUrl||''; document.getElementById('project-icon').value = obj.icon||'';
    document.getElementById('project-order').value = obj.order;
    document.getElementById('project-form-title').textContent = 'Edit Project'; projectFormCard.classList.remove('hidden'); projectFormCard.scrollIntoView();
  }

  // --- Education Logic ---
  const eduTbody = document.getElementById('education-tbody');
  const eduForm = document.getElementById('education-form');
  const eduFormCard = document.getElementById('education-form-card');
  const addEduBtn = document.getElementById('add-education-btn');
  const cancelEduBtn = document.getElementById('cancel-education-btn');

  async function loadEducation() {
    eduTbody.innerHTML = '<tr><td colspan="5" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/education/all');
      eduTbody.innerHTML = data.map(i => `
        <tr>
          <td>${i.order}</td><td><strong>${i.degree}</strong></td><td>${i.institution}</td>
          <td><span class="badge ${i.isActive ? 'badge-active' : 'badge-inactive'} cursor-pointer toggle-edu" data-id="${i._id}">${i.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-icon edit-edu" data-id="${i._id}" data-obj='${JSON.stringify(i).replace(/'/g, "&apos;")}'><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon delete-edu" style="color:var(--danger)" data-id="${i._id}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
      bindCrudEvents('.toggle-edu', '.delete-edu', '.edit-edu', '/education', loadEducation, populateEduForm);
    } catch (err) { eduTbody.innerHTML = `<tr><td colspan="5" class="error-text">Error</td></tr>`; }
  }

  addEduBtn.addEventListener('click', () => { eduForm.reset(); document.getElementById('education-id').value = ''; document.getElementById('education-form-title').textContent = 'Add Education'; eduFormCard.classList.remove('hidden'); });
  cancelEduBtn.addEventListener('click', (e) => { e.preventDefault(); eduFormCard.classList.add('hidden'); });

  eduForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('education-id').value;
    const payload = {
      degree: document.getElementById('education-degree').value, institution: document.getElementById('education-inst').value,
      dateRange: document.getElementById('education-date').value, location: document.getElementById('education-loc').value,
      description: document.getElementById('education-desc').value, badgeText: document.getElementById('education-badge').value,
      icon: document.getElementById('education-icon').value, order: parseInt(document.getElementById('education-order').value) || 99
    };
    await saveEntity('/education', id, payload, eduFormCard, eduForm, loadEducation);
  });

  function populateEduForm(obj) {
    document.getElementById('education-id').value = obj._id; document.getElementById('education-degree').value = obj.degree;
    document.getElementById('education-inst').value = obj.institution; document.getElementById('education-date').value = obj.dateRange;
    document.getElementById('education-loc').value = obj.location||''; document.getElementById('education-desc').value = obj.description||'';
    document.getElementById('education-badge').value = obj.badgeText||''; document.getElementById('education-icon').value = obj.icon||'';
    document.getElementById('education-order').value = obj.order;
    document.getElementById('education-form-title').textContent = 'Edit Education'; eduFormCard.classList.remove('hidden'); eduFormCard.scrollIntoView();
  }

  // --- Certifications Logic ---
  const certTbody = document.getElementById('certs-tbody');
  const certForm = document.getElementById('cert-form');
  const certFormCard = document.getElementById('cert-form-card');
  const addCertBtn = document.getElementById('add-cert-btn');
  const cancelCertBtn = document.getElementById('cancel-cert-btn');

  async function loadCerts() {
    certTbody.innerHTML = '<tr><td colspan="5" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/certifications/all');
      certTbody.innerHTML = data.map(i => `
        <tr>
          <td>${i.order}</td><td><strong>${i.title}</strong></td><td>${i.issuer}</td>
          <td><span class="badge ${i.isActive ? 'badge-active' : 'badge-inactive'} cursor-pointer toggle-cert" data-id="${i._id}">${i.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-icon edit-cert" data-id="${i._id}" data-obj='${JSON.stringify(i).replace(/'/g, "&apos;")}'><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon delete-cert" style="color:var(--danger)" data-id="${i._id}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
      bindCrudEvents('.toggle-cert', '.delete-cert', '.edit-cert', '/certifications', loadCerts, populateCertForm);
    } catch (err) { certTbody.innerHTML = `<tr><td colspan="5" class="error-text">Error</td></tr>`; }
  }

  addCertBtn.addEventListener('click', () => { certForm.reset(); document.getElementById('cert-id').value = ''; document.getElementById('cert-form-title').textContent = 'Add Certification'; certFormCard.classList.remove('hidden'); });
  cancelCertBtn.addEventListener('click', (e) => { e.preventDefault(); certFormCard.classList.add('hidden'); });

  certForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cert-id').value;
    const payload = {
      title: document.getElementById('cert-title').value, issuer: document.getElementById('cert-issuer').value,
      date: document.getElementById('cert-date').value, topics: document.getElementById('cert-topics').value.split(',').map(s=>s.trim()).filter(Boolean),
      description: document.getElementById('cert-desc').value, badgeText: document.getElementById('cert-badge').value,
      icon: document.getElementById('cert-icon').value, order: parseInt(document.getElementById('cert-order').value) || 99
    };
    await saveEntity('/certifications', id, payload, certFormCard, certForm, loadCerts);
  });

  function populateCertForm(obj) {
    document.getElementById('cert-id').value = obj._id; document.getElementById('cert-title').value = obj.title;
    document.getElementById('cert-issuer').value = obj.issuer; document.getElementById('cert-date').value = obj.date||'';
    document.getElementById('cert-topics').value = obj.topics?.join(', ')||''; document.getElementById('cert-desc').value = obj.description||'';
    document.getElementById('cert-badge').value = obj.badgeText||''; document.getElementById('cert-icon').value = obj.icon||'';
    document.getElementById('cert-order').value = obj.order;
    document.getElementById('cert-form-title').textContent = 'Edit Certification'; certFormCard.classList.remove('hidden'); certFormCard.scrollIntoView();
  }

  // --- Skills Logic ---
  const skillTbody = document.getElementById('skills-tbody');
  const skillForm = document.getElementById('skill-form');
  const skillFormCard = document.getElementById('skill-form-card');
  const addSkillBtn = document.getElementById('add-skill-btn');
  const cancelSkillBtn = document.getElementById('cancel-skill-btn');

  async function loadSkills() {
    skillTbody.innerHTML = '<tr><td colspan="6" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    try {
      const { data } = await apiFetch('/skills/all');
      skillTbody.innerHTML = data.map(i => `
        <tr>
          <td>${i.category}</td><td>${i.order}</td><td><strong>${i.name}</strong></td>
          <td>${i.isTag ? 'Tag' : i.percentage + '%'}</td>
          <td><span class="badge ${i.isActive ? 'badge-active' : 'badge-inactive'} cursor-pointer toggle-skill" data-id="${i._id}">${i.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-icon edit-skill" data-id="${i._id}" data-obj='${JSON.stringify(i).replace(/'/g, "&apos;")}'><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon delete-skill" style="color:var(--danger)" data-id="${i._id}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
      bindCrudEvents('.toggle-skill', '.delete-skill', '.edit-skill', '/skills', loadSkills, populateSkillForm);
    } catch (err) { skillTbody.innerHTML = `<tr><td colspan="6" class="error-text">Error</td></tr>`; }
  }

  addSkillBtn.addEventListener('click', () => { skillForm.reset(); document.getElementById('skill-id').value = ''; document.getElementById('skill-form-title').textContent = 'Add Skill'; skillFormCard.classList.remove('hidden'); });
  cancelSkillBtn.addEventListener('click', (e) => { e.preventDefault(); skillFormCard.classList.add('hidden'); });

  skillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('skill-id').value;
    const payload = {
      category: document.getElementById('skill-category').value, categoryIcon: document.getElementById('skill-categoryIcon').value,
      isTag: document.getElementById('skill-isTag').checked, name: document.getElementById('skill-name').value,
      icon: document.getElementById('skill-icon').value, percentage: parseInt(document.getElementById('skill-percentage').value) || 0,
      color: document.getElementById('skill-color').value, order: parseInt(document.getElementById('skill-order').value) || 99
    };
    await saveEntity('/skills', id, payload, skillFormCard, skillForm, loadSkills);
  });

  function populateSkillForm(obj) {
    document.getElementById('skill-id').value = obj._id; document.getElementById('skill-category').value = obj.category;
    document.getElementById('skill-categoryIcon').value = obj.categoryIcon||''; document.getElementById('skill-isTag').checked = obj.isTag;
    document.getElementById('skill-name').value = obj.name; document.getElementById('skill-icon').value = obj.icon||'';
    document.getElementById('skill-percentage').value = obj.percentage||0; document.getElementById('skill-color').value = obj.color||'';
    document.getElementById('skill-order').value = obj.order;
    document.getElementById('skill-form-title').textContent = 'Edit Skill'; skillFormCard.classList.remove('hidden'); skillFormCard.scrollIntoView();
  }

  // --- CRUD Event Binders ---
  function bindCrudEvents(toggleCls, delCls, editCls, endpoint, refreshFn, populateFn) {
    document.querySelectorAll(toggleCls).forEach(btn => {
      btn.addEventListener('click', async (e) => {
        try { await apiFetch(`${endpoint}/${e.target.getAttribute('data-id')}/toggle`, { method: 'PATCH' }); refreshFn(); } 
        catch(err) { showToast(err.message, 'error'); }
      });
    });
    document.querySelectorAll(delCls).forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(!confirm('Delete this item?')) return;
        try { await apiFetch(`${endpoint}/${e.currentTarget.getAttribute('data-id')}`, { method: 'DELETE' }); showToast('Deleted'); refreshFn(); } 
        catch(err) { showToast(err.message, 'error'); }
      });
    });
    document.querySelectorAll(editCls).forEach(btn => {
      btn.addEventListener('click', (e) => {
        populateFn(JSON.parse(e.currentTarget.getAttribute('data-obj')));
      });
    });
  }

  async function saveEntity(endpoint, id, payload, card, form, refreshFn) {
    try {
      if (id) {
        await apiFetch(`${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        showToast('Updated successfully');
      } else {
        await apiFetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        showToast('Created successfully');
      }
      card.classList.add('hidden'); form.reset(); refreshFn();
    } catch(err) { showToast(err.message, 'error'); }
  }

  // Start
  initAuth();
});
