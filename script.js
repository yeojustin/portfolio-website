// State
let currentFolder = 'home';
let selectedItem = null;
let navHistory = ['home'];
let navHistoryIndex = 0;
let isNavigatingHistory = false;
let currentProject = null;

// DOM Elements
const contentPane = document.getElementById('content-pane');
const navItems = document.querySelectorAll('.nav-item');
const currentPathEl = document.getElementById('current-path');
const breadcrumbLabel = document.getElementById('breadcrumb-label');
const statusItemCount = document.getElementById('status-item-count');
const statusSelected = document.getElementById('status-selected');
const modal = document.getElementById('file-modal');
const modalContent = document.getElementById('file-modal-content');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const modalIcon = document.getElementById('modal-icon');
const modalClose = document.getElementById('modal-close');
const navBackBtn = document.getElementById('nav-back-btn');
const navForwardBtn = document.getElementById('nav-forward-btn');
const navUpBtn = document.getElementById('nav-up-btn');

// Initialize
function init() {
  // Modal close
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // History navigation buttons
  if (navBackBtn) {
    navBackBtn.addEventListener('click', () => {
      if (navHistoryIndex > 0) {
        navHistoryIndex--;
        isNavigatingHistory = true;
        navigateToState(navHistory[navHistoryIndex], false);
        isNavigatingHistory = false;
      }
    });
  }

  if (navForwardBtn) {
    navForwardBtn.addEventListener('click', () => {
      if (navHistoryIndex < navHistory.length - 1) {
        navHistoryIndex++;
        isNavigatingHistory = true;
        navigateToState(navHistory[navHistoryIndex], false);
        isNavigatingHistory = false;
      }
    });
  }

  if (navUpBtn) {
    navUpBtn.addEventListener('click', () => {
      if (currentProject) {
        navigateToState('projects');
      } else if (currentFolder !== 'home') {
        navigateToState('home');
      }
    });
  }

  // Sidebar navigation click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      navigateToState(target);
    });
  });

  // Setup breadcrumbs click to go home
  const breadcrumbHome = document.getElementById('breadcrumb-home');
  const breadcrumbUser = document.getElementById('breadcrumb-user');
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener('click', () => navigateToState('home'));
  }
  if (breadcrumbUser) {
    breadcrumbUser.addEventListener('click', () => navigateToState('home'));
  }

  // Setup search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Initial load
  navigateToState('home', false);
}

function navigateToState(state, push = true) {
  // Clear search input on navigation
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
  }

  if (push && !isNavigatingHistory) {
    navHistory = navHistory.slice(0, navHistoryIndex + 1);
    
    const lastState = navHistory[navHistoryIndex];
    const isNew = typeof state === 'string'
      ? (lastState !== state)
      : (!lastState || lastState.name !== state.name);

    if (isNew) {
      navHistory.push(state);
      navHistoryIndex = navHistory.length - 1;
    }
  }

  if (typeof state === 'string') {
    currentProject = null;
    renderFolder(state);
    
    // Update active sidebar state
    navItems.forEach(n => {
      if (n.dataset.target === state) {
        n.classList.add('active', 'bg-white/10', 'text-white');
      } else {
        n.classList.remove('active', 'bg-white/10', 'text-white');
      }
    });
  } else {
    currentProject = state;
    renderProject(state);
    
    // Highlight "Projects" in sidebar
    navItems.forEach(n => {
      if (n.dataset.target === 'projects') {
        n.classList.add('active', 'bg-white/10', 'text-white');
      } else {
        n.classList.remove('active', 'bg-white/10', 'text-white');
      }
    });
  }

  updateNavButtons();
}
window.navigateToState = navigateToState;

function updateNavButtons() {
  if (navBackBtn) {
    navBackBtn.disabled = navHistoryIndex <= 0;
  }
  if (navForwardBtn) {
    navForwardBtn.disabled = navHistoryIndex >= navHistory.length - 1;
  }
  if (navUpBtn) {
    navUpBtn.disabled = (currentFolder === 'home' && !currentProject);
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (currentProject) return;
  
  const items = portfolioData[currentFolder] || [];
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(query) || 
    (item.description && item.description.toLowerCase().includes(query)) ||
    (item.type && item.type.toLowerCase().includes(query))
  );

  contentPane.innerHTML = '';
  if (filtered.length === 0) {
    contentPane.innerHTML = `<div class="text-center text-gray-500 mt-10 w-full">No items match your search.</div>`;
  } else {
    renderIconView(filtered);
  }

  statusItemCount.textContent = `${filtered.length} items`;
  statusSelected.textContent = '0 items selected';
}

function renderFolder(folderName) {
  currentFolder = folderName;
  const items = portfolioData[folderName] || [];
  
  // Update UI
  const displayName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
  currentPathEl.textContent = displayName;
  
  if (breadcrumbLabel) {
    breadcrumbLabel.textContent = displayName;
  }
  
  statusItemCount.textContent = `${items.length} items`;
  statusSelected.textContent = '0 items selected';
  
  contentPane.innerHTML = '';
  
  if (items.length === 0) {
    contentPane.innerHTML = `<div class="text-center text-gray-500 mt-10 w-full">This folder is empty.</div>`;
    return;
  }

  // Use Icon View by default
  renderIconView(items);
  
  // Click outside to unselect
  contentPane.addEventListener('click', () => {
    document.querySelectorAll('.file-item').forEach(f => {
      f.classList.remove('selected', 'bg-white/10', 'border-white/20');
      if (f.querySelector('span')) f.querySelector('span').classList.remove('text-white');
    });
    statusSelected.textContent = '0 items selected';
  });
}

function renderIconView(items) {
  contentPane.className = 'flex-1 overflow-y-auto p-6 text-gray-200';
  
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full';
  
  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'file-item flex flex-col items-center justify-start p-4 cursor-pointer text-center select-none border border-transparent hover:bg-white/5 hover:border-white/10 rounded-xl transition-all group';
    el.dataset.index = index;
    
    // Icon Style
    const iconHtml = item.isProject 
      ? `<div class="text-5xl flex items-center justify-center w-20 h-20 border border-white/10 bg-white/5 rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">${item.iconEmoji || '📁'}</div>` 
      : `<div class="text-gray-400 group-hover:text-white transition-all shrink-0">${icons[item.type] || icons.doc}</div>`;
    
    el.innerHTML = `
      <div class="w-24 h-24 flex items-center justify-center mb-3 text-gray-200 drop-shadow-lg">
        ${iconHtml}
      </div>
      <span class="text-[13px] font-semibold text-gray-300 break-words w-full px-1 line-clamp-2 leading-tight group-hover:text-white transition-colors">${item.name}</span>
    `;
    
    setupItemListeners(el, item);
    grid.appendChild(el);
  });
  
  contentPane.appendChild(grid);
}

function setupItemListeners(el, item) {
  // Selection logic
  el.addEventListener('click', (e) => {
    document.querySelectorAll('.file-item').forEach(f => {
      f.classList.remove('selected', 'bg-white/10', 'border-white/20');
      const span = f.querySelector('span');
      if (span) span.classList.remove('text-white');
    });
    el.classList.add('selected', 'bg-white/10', 'border-white/20');
    const span = el.querySelector('span');
    if (span) span.classList.add('text-white');
    statusSelected.textContent = '1 item selected';
    e.stopPropagation();
  });
  
  // Double click to open
  el.addEventListener('dblclick', () => {
    openItem(item);
  });
}

function openItem(item) {
  if (item.isProject) {
    incrementViews(item.name);
    navigateToState(item);
  } else if (item.type === 'folder') {
    navigateToState(item.target);
  } else if (['link', 'email', 'linkedin', 'github', 'medium'].includes(item.type)) {
    window.open(EXTERNAL_LINKS[item.target], '_blank');
  } else {
    // Open modal
    const content = modalContents[item.target];
    if (content) {
      modalTitle.textContent = content.title;
      modalIcon.textContent = content.icon;
      modalBody.innerHTML = content.content;
      openModal();
    } else {
      // Fallback
      modalTitle.textContent = item.name;
      modalIcon.textContent = '📄';
      modalBody.innerHTML = `<div class="text-center text-gray-500 py-10">Cannot preview this file type.</div>`;
      openModal();
    }
  }
}

function openModal() {
  modal.classList.remove('hidden');
  // Trigger reflow
  void modal.offsetWidth;
  modal.classList.remove('opacity-0');
  modalContent.classList.remove('scale-95');
  modalContent.classList.add('scale-100');
}

function closeModal() {
  modal.classList.add('opacity-0');
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

// View Tracking Utilities
function getViews(projectName) {
  const views = localStorage.getItem(`views_${projectName}`);
  return views ? parseInt(views) : 0;
}

function incrementViews(projectName) {
  const current = getViews(projectName);
  localStorage.setItem(`views_${projectName}`, current + 1);
}

// Start
document.addEventListener('DOMContentLoaded', init);

function renderProject(project) {
  // Update Path
  currentPathEl.innerHTML = `<span class="hover:bg-white/10 px-1 rounded cursor-pointer transition-colors" onclick="navigateToState('projects')">Projects</span> 
    <span class="text-gray-500 px-1">/</span> 
    <span class="text-gray-200 font-medium px-1">${project.name}</span>`;
  
  if (breadcrumbLabel) {
    breadcrumbLabel.textContent = project.name;
  }
  statusItemCount.textContent = '1 item';
  statusSelected.textContent = '0 items selected';

  contentPane.innerHTML = `
    <div class="max-w-5xl mx-auto pb-10 w-full animate-popIn">
      
      <!-- Premium Hero Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 mt-4">
        <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-[2px] shadow-[0_0_30px_rgba(139,92,246,0.3)] shrink-0 transition-transform hover:scale-105 duration-300">
          <div class="w-full h-full bg-[#1a1b1e] rounded-[22px] flex items-center justify-center text-5xl">
            ${project.iconEmoji || '📁'}
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-3">${project.name}</h1>
          <div class="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full shadow-inner">${project.category || 'App'}</span>
            ${(() => {
              const colors = {
                green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
                red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
                orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400' },
                blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
                yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
                gray: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', dot: 'bg-gray-400' }
              };
              const c = colors[project.statusColor] || colors.green;
              return `
                <span class="px-3 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full shadow-inner flex items-center gap-1.5">
                  ${project.status || 'Live'}
                </span>
              `;
            })()}
          </div>
        </div>
      </div>

      <!-- 2-Column Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
        
        <!-- Left: Overview & Actions -->
        <div class="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Project Overview</h2>
            <p class="text-gray-300 leading-relaxed text-[15px] font-medium">
              ${project.description}
            </p>
          </div>
          
          <!-- Call to Actions -->
          <div class="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-white/5">
            ${project.appUrl ? `
              <a href="${project.appUrl}" target="_blank" class="group relative px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2">
                Launch App
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            ` : ''}
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" class="group relative px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-bold rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View Source
              </a>
            ` : ''}
          </div>
        </div>
        
        <!-- Right: Tech Stack Panel -->
        <div class="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-fit shadow-inner">
          <h2 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 border-b border-white/5 pb-2">Tech Stack</h2>
          <div class="flex flex-wrap gap-2.5">
            ${(project.stack || []).map(tech => `<span class="bg-black/30 text-gray-300 px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/10 hover:border-indigo-500/50 hover:text-indigo-200 transition-colors cursor-default">${tech}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Content / Embedment Container -->
      ${(project.embedHtml || project.contentFile) ? `
      <div id="project-content-container" class="w-full mt-8 bg-black/40 border border-white/10 rounded-xl relative shadow-inner transition-all ${(project.embedHtml && project.embedHtml.includes('<iframe')) ? 'h-[85vh] md:h-[1000px] overflow-hidden' : 'p-6 sm:p-8 overflow-x-auto min-h-[100px]'}">
         ${project.embedHtml ? project.embedHtml : `
           <div class="flex items-center justify-center h-20 text-gray-400 gap-3">
             <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
             Loading content...
           </div>
         `}
      </div>
      ` : ''}
    </div>
  `;

  // Fetch external HTML content asynchronously if contentFile is specified
  if (project.contentFile && !project.embedHtml) {
    fetch(project.contentFile)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
      })
      .then(html => {
        const container = document.getElementById('project-content-container');
        if (container) {
          container.innerHTML = html;
          // Apply massive height class if the fetched html contains an iframe
          if (html.includes('<iframe')) {
            container.className = 'w-full mt-8 bg-black/40 border border-white/10 rounded-xl relative shadow-inner h-[85vh] md:h-[1000px] overflow-hidden transition-all';
          } else {
            container.className = 'w-full mt-8 bg-black/40 border border-white/10 rounded-xl relative shadow-inner p-6 sm:p-8 overflow-x-auto min-h-[100px] transition-all';
          }
        }
      })
      .catch(err => {
        console.error('Failed to load project content:', err);
        const container = document.getElementById('project-content-container');
        if (container) {
          container.innerHTML = '<div class="text-red-400 text-center py-10">Failed to load project content. Make sure you are viewing via a local web server (e.g. Live Server), as browsers block local file fetching.</div>';
        }
      });
  }
}
