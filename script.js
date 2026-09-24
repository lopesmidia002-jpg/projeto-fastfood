/**
 * RESHT — Motor Interativo da Landing Page & Painel Administrativo
 * Controla a sequência de 100 frames em Canvas, rotação contínua,
 * gestão de perfil de usuário e CRUD de usuários com persistência em localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Configurações & Estado da Animação
  // ==========================================================================
  const TOTAL_FRAMES = 100;
  const FOLDER_NAME = 'Floating_food_animation_composition_1080p_20260924152541_000';
  const BASE_FILE_PREFIX = 'Floating_food_animation_composition_1080p_20260924152541_';
  const TARGET_FPS = 30;

  // Elementos do DOM — Canvas & Layout
  const canvas = document.getElementById('sequenceCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const loaderOverlay = document.getElementById('loaderOverlay');
  const loaderText = document.getElementById('loaderText');
  const heroSection = document.getElementById('home');
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const themeToggle = document.getElementById('themeToggle');
  const orderNowBtn = document.getElementById('orderNowBtn');
  const reserveTableBtn = document.getElementById('reserveTableBtn');
  const mobileOrderBtn = document.getElementById('mobileOrderBtn');
  const cartBtn = document.getElementById('cartBtn');
  const favBtn = document.getElementById('favBtn');
  const searchBtn = document.getElementById('searchBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Elementos do DOM — Painel Administrativo
  const profileBtn = document.getElementById('profileBtn');
  const adminModal = document.getElementById('adminModal');
  const adminModalBackdrop = document.getElementById('adminModalBackdrop');
  const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
  const tabBtnProfile = document.getElementById('tabBtnProfile');
  const tabBtnUsers = document.getElementById('tabBtnUsers');
  const profileTab = document.getElementById('profileTab');
  const usersTab = document.getElementById('usersTab');
  const userCountBadge = document.getElementById('userCountBadge');

  // Formulário de Perfil
  const profileForm = document.getElementById('profileForm');
  const profileNameInput = document.getElementById('profileName');
  const profileEmailInput = document.getElementById('profileEmail');
  const profilePhoneInput = document.getElementById('profilePhone');
  const profileRoleInput = document.getElementById('profileRole');
  const profilePasswordInput = document.getElementById('profilePassword');
  const profileConfirmPasswordInput = document.getElementById('profileConfirmPassword');
  const displayProfileName = document.getElementById('displayProfileName');

  // Gestão de Usuários
  const openUserFormBtn = document.getElementById('openUserFormBtn');
  const closeUserFormBtn = document.getElementById('closeUserFormBtn');
  const cancelUserBtn = document.getElementById('cancelUserBtn');
  const userFormCard = document.getElementById('userFormCard');
  const userForm = document.getElementById('userForm');
  const userFormTitle = document.getElementById('userFormTitle');
  const userIdInput = document.getElementById('userIdInput');
  const userNameInput = document.getElementById('userNameInput');
  const userEmailInput = document.getElementById('userEmailInput');
  const userRoleSelect = document.getElementById('userRoleSelect');
  const userPasswordInput = document.getElementById('userPasswordInput');
  const usersTableBody = document.getElementById('usersTableBody');

  // Estado da Animação
  const images = [];
  let loadedCount = 0;
  let currentFrame = 0;
  let isPlaying = true;
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;
  let lastFrameTime = 0;
  const frameInterval = 1000 / TARGET_FPS;
  let animationFrameId = null;

  // ==========================================================================
  // 1. Motor de Renderização Canvas da Hero
  // ==========================================================================
  function padZero(num) {
    return String(num).padStart(3, '0');
  }

  function drawFrame(index) {
    if (!ctx || !images[index] || !images[index].complete) return;
    const img = images[index];

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth || 1920;
      canvas.height = img.naturalHeight || 1080;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    currentFrame = index;
  }

  function animationLoop(timestamp) {
    if (isPlaying && !isDragging && loadedCount > 0) {
      if (!lastFrameTime) lastFrameTime = timestamp;
      const elapsed = timestamp - lastFrameTime;

      if (elapsed >= frameInterval) {
        lastFrameTime = timestamp - (elapsed % frameInterval);
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        drawFrame(currentFrame);
      }
    }
    animationFrameId = requestAnimationFrame(animationLoop);
  }

  function startAnimationLoop() {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animationLoop);
    }
  }

  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameStr = padZero(i);
      img.src = `${FOLDER_NAME}/${BASE_FILE_PREFIX}${frameStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (loaderText) {
          loaderText.textContent = `Carregando Animação 3D... ${percent}%`;
        }

        if (loadedCount === 1) {
          drawFrame(0);
        }

        if (loadedCount >= 10 && loaderOverlay && !loaderOverlay.classList.contains('hidden')) {
          loaderOverlay.classList.add('hidden');
          startAnimationLoop();
        }

        if (loadedCount === TOTAL_FRAMES) {
          if (loaderOverlay) loaderOverlay.classList.add('hidden');
          startAnimationLoop();
        }
      };

      img.onerror = () => {
        console.warn(`Não foi possível carregar o frame ${i}: ${img.src}`);
        loadedCount++;
        if (loadedCount >= 10 && loaderOverlay) {
          loaderOverlay.classList.add('hidden');
          startAnimationLoop();
        }
      };

      images.push(img);
    }
  }

  // Interatividade e Parallax 3D
  if (heroSection) {
    heroSection.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('.admin-modal')) return;
      isDragging = true;
      startX = e.clientX;
      startFrame = currentFrame;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const sensitivity = 5;
      let frameOffset = Math.floor(deltaX / sensitivity);
      let newFrame = (startFrame + frameOffset) % TOTAL_FRAMES;
      if (newFrame < 0) newFrame += TOTAL_FRAMES;
      drawFrame(newFrame);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });

    heroSection.addEventListener('touchstart', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.admin-modal')) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      startFrame = currentFrame;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      const sensitivity = 6;
      let frameOffset = Math.floor(deltaX / sensitivity);
      let newFrame = (startFrame + frameOffset) % TOTAL_FRAMES;
      if (newFrame < 0) newFrame += TOTAL_FRAMES;
      drawFrame(newFrame);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    heroSection.addEventListener('mousemove', (e) => {
      if (isDragging || !canvas || adminModal?.classList.contains('open') || window.innerWidth <= 960) return;
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = y * -4;
      const tiltY = x * 5;

      canvas.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      if (canvas) {
        if (window.innerWidth <= 960) {
          canvas.style.transform = '';
        } else {
          canvas.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        }
      }
    });

    window.addEventListener('resize', () => {
      if (canvas && window.innerWidth <= 960) {
        canvas.style.transform = '';
      }
    });
  }

  // ==========================================================================
  // 2. Sistema de Notificações Toast
  // ==========================================================================
  let toastTimer = null;
  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    const icon = toast.querySelector('.toast-icon');
    if (icon) icon.className = `toast-icon ${iconClass}`;

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // 3. Painel Administrativo & Gestão de Acessos
  // ==========================================================================

  // Abre e fecha o Painel Admin
  function openAdminModal(defaultTab = 'profileTab') {
    switchAdminTab(defaultTab);
    adminModal?.classList.add('open');
    adminModalBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    adminModal?.classList.remove('open');
    adminModalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (profileBtn) profileBtn.addEventListener('click', () => openAdminModal('profileTab'));
  if (closeAdminModalBtn) closeAdminModalBtn.addEventListener('click', closeAdminModal);
  if (adminModalBackdrop) adminModalBackdrop.addEventListener('click', closeAdminModal);

  // Troca de Abas no Painel
  function switchAdminTab(targetTabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetTabId);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === targetTabId);
    });
  }

  tabBtnProfile?.addEventListener('click', () => switchAdminTab('profileTab'));
  tabBtnUsers?.addEventListener('click', () => switchAdminTab('usersTab'));

  // --- MÓDULO 1: MEU PERFIL (Persistência Local) ---
  const PROFILE_STORAGE_KEY = 'resht_user_profile';

  function loadProfileData() {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const profile = savedProfile ? JSON.parse(savedProfile) : {
      name: 'Nilton Admin',
      email: 'admin@resht.com',
      phone: '(11) 98765-4321',
      role: 'Administrador Geral'
    };

    if (profileNameInput) profileNameInput.value = profile.name;
    if (profileEmailInput) profileEmailInput.value = profile.email;
    if (profilePhoneInput) profilePhoneInput.value = profile.phone;
    if (profileRoleInput) profileRoleInput.value = profile.role;
    if (displayProfileName) displayProfileName.textContent = profile.name;
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newPass = profilePasswordInput?.value.trim();
      const confirmPass = profileConfirmPasswordInput?.value.trim();

      if (newPass && newPass !== confirmPass) {
        showToast('⚠️ As senhas digitadas não coincidem!', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const updatedProfile = {
        name: profileNameInput.value.trim(),
        email: profileEmailInput.value.trim(),
        phone: profilePhoneInput.value.trim(),
        role: profileRoleInput.value.trim()
      };

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      if (displayProfileName) displayProfileName.textContent = updatedProfile.name;

      if (profilePasswordInput) profilePasswordInput.value = '';
      if (profileConfirmPasswordInput) profileConfirmPasswordInput.value = '';

      showToast('✅ Perfil atualizado com sucesso!', 'fa-solid fa-circle-check');
    });
  }

  // --- MÓDULO 2: GESTÃO DE USUÁRIOS (CRUD com localStorage) ---
  const USERS_STORAGE_KEY = 'resht_users_list';

  const defaultUsers = [
    { id: 'usr-1', name: 'Nilton Admin', email: 'admin@resht.com', role: 'admin', date: '24/09/2026' },
    { id: 'usr-2', name: 'Carlos Silva', email: 'carlos.chef@resht.com', role: 'admin', date: '20/09/2026' },
    { id: 'usr-3', name: 'Mariana Costa', email: 'mariana.cliente@gmail.com', role: 'user', date: '15/09/2026' }
  ];

  function getUsers() {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : defaultUsers;
  }

  function saveUsers(usersList) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    renderUsersTable();
  }

  function renderUsersTable() {
    const users = getUsers();
    if (userCountBadge) userCountBadge.textContent = users.length;
    if (!usersTableBody) return;

    usersTableBody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const isAdmin = user.role === 'admin';

      tr.innerHTML = `
        <td>
          <div class="user-cell-flex">
            <div class="user-avatar-mini">${initials}</div>
            <span class="user-name-bold">${user.name}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td>
          <span class="role-badge ${isAdmin ? 'admin' : 'user'}">
            <i class="fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-user'}"></i>
            ${isAdmin ? 'Administrador' : 'Usuário Comum'}
          </span>
        </td>
        <td>${user.date || 'Recente'}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-action-table edit" data-id="${user.id}" title="Editar Usuário">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="btn-action-table delete" data-id="${user.id}" title="Excluir Usuário">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      `;

      usersTableBody.appendChild(tr);
    });

    // Eventos de Editar e Excluir
    usersTableBody.querySelectorAll('.btn-action-table.edit').forEach(btn => {
      btn.addEventListener('click', () => editUser(btn.dataset.id));
    });

    usersTableBody.querySelectorAll('.btn-action-table.delete').forEach(btn => {
      btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
  }

  function openUserForm(isEditing = false, userData = null) {
    userFormCard?.classList.remove('hidden');
    if (isEditing && userData) {
      if (userFormTitle) userFormTitle.innerHTML = '<i class="fa-solid fa-user-pen"></i> Editar Usuário';
      if (userIdInput) userIdInput.value = userData.id;
      if (userNameInput) userNameInput.value = userData.name;
      if (userEmailInput) userEmailInput.value = userData.email;
      if (userRoleSelect) userRoleSelect.value = userData.role;
      if (userPasswordInput) userPasswordInput.value = '';
    } else {
      if (userFormTitle) userFormTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Cadastrar Novo Usuário';
      if (userIdInput) userIdInput.value = '';
      userForm?.reset();
    }
  }

  function closeUserForm() {
    userFormCard?.classList.add('hidden');
    userForm?.reset();
  }

  openUserFormBtn?.addEventListener('click', () => openUserForm(false));
  closeUserFormBtn?.addEventListener('click', closeUserForm);
  cancelUserBtn?.addEventListener('click', closeUserForm);

  // Salvar / Cadastrar Usuário
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const users = getUsers();
      const userId = userIdInput?.value;
      const name = userNameInput?.value.trim();
      const email = userEmailInput?.value.trim();
      const role = userRoleSelect?.value;

      if (!name || !email) {
        showToast('⚠️ Por favor preencha nome e e-mail!', 'fa-solid fa-triangle-exclamation');
        return;
      }

      if (userId) {
        // Modo Edição
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
          users[index].name = name;
          users[index].email = email;
          users[index].role = role;
          saveUsers(users);
          showToast(`👤 Usuário "${name}" atualizado com sucesso!`, 'fa-solid fa-circle-check');
        }
      } else {
        // Modo Cadastro Novo
        const newUser = {
          id: 'usr-' + Date.now(),
          name: name,
          email: email,
          role: role,
          date: new Date().toLocaleDateString('pt-BR')
        };
        users.push(newUser);
        saveUsers(users);
        showToast(`🎉 Usuário "${name}" cadastrado como ${role === 'admin' ? 'Administrador' : 'Usuário Comum'}!`, 'fa-solid fa-user-plus');
      }

      closeUserForm();
    });
  }

  function editUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      openUserForm(true, user);
      userFormCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function deleteUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      const filtered = users.filter(u => u.id !== userId);
      saveUsers(filtered);
      showToast(`🗑️ Usuário "${user.name}" removido com sucesso!`, 'fa-solid fa-trash-can');
    }
  }

  // ==========================================================================
  // 4. Outras Interações da Interface
  // ==========================================================================
  if (orderNowBtn) {
    orderNowBtn.addEventListener('click', () => {
      showToast('🍔 Abrindo cardápio de especiais do Chef e pedidos!', 'fa-solid fa-utensils');
    });
  }

  if (reserveTableBtn) {
    reserveTableBtn.addEventListener('click', () => {
      showToast('📅 Solicitação de reserva de mesa enviada! Confirmaremos em instantes.', 'fa-solid fa-calendar-check');
    });
  }

  if (mobileOrderBtn) {
    mobileOrderBtn.addEventListener('click', () => {
      closeDrawer();
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      showToast('🍔 Abrindo cardápio de especiais do Chef!', 'fa-solid fa-utensils');
    });
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      openCartDrawer();
    });
  }

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const favBadge = document.getElementById('favBadge');
      if (favBadge) {
        let count = parseInt(favBadge.textContent, 10) || 0;
        count++;
        favBadge.textContent = count;
        showToast(`❤️ Prato salvo na sua lista de favoritos!`, 'fa-solid fa-heart');
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      showToast('🔍 Digite para pesquisar em nosso cardápio artesanal...', 'fa-solid fa-magnifying-glass');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        showToast('☀️ Alternado para o Tema Claro', 'fa-solid fa-sun');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        showToast('🌙 Alternado para o Tema Escuro Gourmet', 'fa-solid fa-moon');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Menu Mobile Drawer
  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 5. Cardápio Interativo & Modal de Personalização
  // ==========================================================================
  const categoryButtons = document.querySelectorAll('.category-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  // Filtragem por Categorias
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;

      dishCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInPane 0.4s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Favoritar Pratos
  document.querySelectorAll('.dish-fav-btn').forEach(fav => {
    fav.addEventListener('click', (e) => {
      e.stopPropagation();
      fav.classList.toggle('active');
      const isFav = fav.classList.contains('active');
      const favBadge = document.getElementById('favBadge');
      if (favBadge) {
        let count = parseInt(favBadge.textContent, 10) || 0;
        count = isFav ? count + 1 : Math.max(0, count - 1);
        favBadge.textContent = count;
      }
      showToast(isFav ? '❤️ Prato salvo na sua lista de favoritos!' : '💔 Removido dos favoritos', 'fa-solid fa-heart');
    });
  });

  // Modal de Personalização do Prato
  const dishModal = document.getElementById('dishModal');
  const dishModalBackdrop = document.getElementById('dishModalBackdrop');
  const closeDishModalBtn = document.getElementById('closeDishModalBtn');
  const dishModalImg = document.getElementById('dishModalImg');
  const dishModalTitle = document.getElementById('dishModalTitle');
  const dishModalDesc = document.getElementById('dishModalDesc');
  const dishModalBasePrice = document.getElementById('dishModalBasePrice');
  const confirmBtnText = document.getElementById('confirmBtnText');
  const confirmAddDishBtn = document.getElementById('confirmAddDishBtn');
  const dishQtyEl = document.getElementById('dishQty');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');

  let activeDish = { basePrice: 44.90, name: 'RESHT Royal Smash & Bacon', img: 'assets/burger.jpg' };
  let currentQty = 1;

  function updateModalTotal() {
    let addTotal = 0;
    document.querySelectorAll('.option-check:checked').forEach(chk => {
      addTotal += parseFloat(chk.dataset.price || 0);
    });
    const total = (activeDish.basePrice + addTotal) * currentQty;
    if (confirmBtnText) {
      confirmBtnText.textContent = `Adicionar — R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  }

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.dish-card');
      const name = btn.dataset.name || card.querySelector('.dish-title')?.textContent;
      const price = parseFloat(btn.dataset.price || 44.90);
      const img = btn.dataset.img || card.querySelector('.dish-img')?.src;
      const desc = card.querySelector('.dish-desc')?.textContent;

      activeDish = { basePrice: price, name, img };
      currentQty = 1;
      if (dishQtyEl) dishQtyEl.textContent = '1';
      if (dishModalTitle) dishModalTitle.textContent = name;
      if (dishModalDesc) dishModalDesc.textContent = desc;
      if (dishModalImg) dishModalImg.src = img;
      if (dishModalBasePrice) dishModalBasePrice.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;

      document.querySelectorAll('.option-check').forEach(chk => chk.checked = false);
      const noteInput = document.getElementById('dishNotes');
      if (noteInput) noteInput.value = '';

      updateModalTotal();

      dishModal?.classList.add('open');
      dishModalBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeDishModal() {
    dishModal?.classList.remove('open');
    dishModalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeDishModalBtn?.addEventListener('click', closeDishModal);
  dishModalBackdrop?.addEventListener('click', closeDishModal);

  qtyMinusBtn?.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      if (dishQtyEl) dishQtyEl.textContent = currentQty;
      updateModalTotal();
    }
  });

  qtyPlusBtn?.addEventListener('click', () => {
    currentQty++;
    if (dishQtyEl) dishQtyEl.textContent = currentQty;
    updateModalTotal();
  });

  document.querySelectorAll('.option-check').forEach(chk => {
    chk.addEventListener('change', updateModalTotal);
  });

  confirmAddDishBtn?.addEventListener('click', () => {
    const selectedOptions = [];
    let optionsTotal = 0;
    document.querySelectorAll('.option-check:checked').forEach(chk => {
      const price = parseFloat(chk.dataset.price || 0);
      const name = chk.dataset.name || chk.parentElement.textContent.trim();
      selectedOptions.push({ name, price });
      optionsTotal += price;
    });

    const notes = document.getElementById('dishNotes')?.value.trim() || '';
    const unitPrice = activeDish.basePrice + optionsTotal;

    const newItem = {
      id: 'cart-item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: activeDish.name,
      img: activeDish.img,
      basePrice: activeDish.basePrice,
      selectedOptions,
      notes,
      unitPrice,
      qty: currentQty
    };

    addItemToCart(newItem);
    closeDishModal();
    showToast(`🛒 ${currentQty}x "${activeDish.name}" adicionado ao carrinho!`, 'fa-solid fa-bag-shopping');
  });

  // ==========================================================================
  // 6. Carrinho de Compras Drawer & Cálculo de Frete
  // ==========================================================================
  const CART_STORAGE_KEY = 'resht_cart_items';
  const FREE_SHIPPING_THRESHOLD = 80.00;
  const STANDARD_DELIVERY_FEE = 7.90;

  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const closeCartDrawerBtn = document.getElementById('closeCartDrawerBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const freeShippingText = document.getElementById('freeShippingText');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const cartSubtotalVal = document.getElementById('cartSubtotalVal');
  const cartDeliveryVal = document.getElementById('cartDeliveryVal');
  const cartTotalVal = document.getElementById('cartTotalVal');
  const openCheckoutBtn = document.getElementById('openCheckoutBtn');
  const emptyCartExploreBtn = document.getElementById('emptyCartExploreBtn');

  function getCartItems() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    renderCart();
  }

  function addItemToCart(item) {
    const items = getCartItems();
    // Verifica se existe item idêntico (mesmo nome, opções e observações)
    const existingIndex = items.findIndex(i => 
      i.name === item.name && 
      i.notes === item.notes &&
      JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
    );

    if (existingIndex > -1) {
      items[existingIndex].qty += item.qty;
    } else {
      items.push(item);
    }

    saveCartItems(items);
  }

  function updateItemQty(itemId, delta) {
    const items = getCartItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index > -1) {
      items[index].qty += delta;
      if (items[index].qty <= 0) {
        items.splice(index, 1);
        showToast('🗑️ Item removido do carrinho.', 'fa-solid fa-trash-can');
      }
      saveCartItems(items);
    }
  }

  function removeItemFromCart(itemId) {
    const items = getCartItems().filter(i => i.id !== itemId);
    saveCartItems(items);
    showToast('🗑️ Item removido do carrinho.', 'fa-solid fa-trash-can');
  }

  function renderCart() {
    const items = getCartItems();
    const totalCount = items.reduce((acc, i) => acc + i.qty, 0);
    const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);

    // Atualiza badge da navbar
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (cartDrawerCount) {
      cartDrawerCount.textContent = `${totalCount} ${totalCount === 1 ? 'item adicionado' : 'itens adicionados'}`;
    }

    // Frete Grátis
    let deliveryFee = 0;
    if (items.length === 0) {
      deliveryFee = 0;
      if (shippingProgressFill) shippingProgressFill.style.width = '0%';
      if (freeShippingText) {
        freeShippingText.innerHTML = '<i class="fa-solid fa-truck-fast"></i> <span>Frete Grátis em pedidos acima de <strong>R$ 80,00</strong></span>';
      }
    } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      deliveryFee = 0;
      if (shippingProgressFill) shippingProgressFill.style.width = '100%';
      if (freeShippingText) {
        freeShippingText.innerHTML = '<i class="fa-solid fa-gift text-primary"></i> <span>🎉 Parabéns! Você ganhou <strong>Frete Grátis!</strong></span>';
      }
    } else {
      deliveryFee = STANDARD_DELIVERY_FEE;
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      if (shippingProgressFill) shippingProgressFill.style.width = `${percent}%`;
      if (freeShippingText) {
        freeShippingText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> <span>Adicione mais <strong>R$ ${remaining.toFixed(2).replace('.', ',')}</strong> para <strong>Frete Grátis!</strong></span>`;
      }
    }

    const total = subtotal + deliveryFee;

    if (cartSubtotalVal) cartSubtotalVal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (cartDeliveryVal) {
      cartDeliveryVal.textContent = items.length === 0 ? 'R$ 0,00' : (deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`);
    }
    if (cartTotalVal) cartTotalVal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // Renderização dos Itens ou Estado Vazio
    if (items.length === 0) {
      if (cartEmptyState) cartEmptyState.classList.remove('hidden');
      if (cartItemsList) cartItemsList.innerHTML = '';
      if (openCheckoutBtn) {
        openCheckoutBtn.disabled = true;
        openCheckoutBtn.style.opacity = '0.5';
        openCheckoutBtn.style.cursor = 'not-allowed';
      }
    } else {
      if (cartEmptyState) cartEmptyState.classList.add('hidden');
      if (openCheckoutBtn) {
        openCheckoutBtn.disabled = false;
        openCheckoutBtn.style.opacity = '1';
        openCheckoutBtn.style.cursor = 'pointer';
      }

      if (cartItemsList) {
        cartItemsList.innerHTML = items.map(item => `
          <div class="cart-item-card glass-card">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <div class="cart-item-header">
                <h4 class="cart-item-name">${item.name}</h4>
                <button class="cart-item-remove" data-id="${item.id}" title="Remover item">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
              ${item.selectedOptions && item.selectedOptions.length > 0 ? `
                <div class="cart-item-options">
                  ${item.selectedOptions.map(o => `<span>+ ${o.name}</span>`).join('')}
                </div>
              ` : ''}
              ${item.notes ? `
                <div class="cart-item-notes">
                  <i class="fa-regular fa-comment-dots"></i> <span>${item.notes}</span>
                </div>
              ` : ''}
              <div class="cart-item-pricing">
                <div class="cart-item-price">R$ ${(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}</div>
                <div class="cart-qty-ctrl">
                  <button class="cart-qty-btn minus" data-id="${item.id}" aria-label="Diminuir"><i class="fa-solid fa-minus"></i></button>
                  <span class="cart-qty-val">${item.qty}</span>
                  <button class="cart-qty-btn plus" data-id="${item.id}" aria-label="Aumentar"><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        // Listeners dos botões de controle de quantidade
        cartItemsList.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
          btn.addEventListener('click', () => updateItemQty(btn.dataset.id, -1));
        });

        cartItemsList.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
          btn.addEventListener('click', () => updateItemQty(btn.dataset.id, 1));
        });

        cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', () => removeItemFromCart(btn.dataset.id));
        });
      }
    }
  }

  function openCartDrawer() {
    renderCart();
    cartDrawer?.classList.add('open');
    cartDrawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawer?.classList.remove('open');
    cartDrawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeCartDrawerBtn) closeCartDrawerBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', closeCartDrawer);

  if (emptyCartExploreBtn) {
    emptyCartExploreBtn.addEventListener('click', () => {
      closeCartDrawer();
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 7. Modal de Checkout Rápido & Pedido via WhatsApp
  // ==========================================================================
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutModalBackdrop = document.getElementById('checkoutModalBackdrop');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutItemsPreview = document.getElementById('checkoutItemsPreview');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutDelivery = document.getElementById('checkoutDelivery');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const pixDetailsBox = document.getElementById('pixDetailsBox');
  const cashChangeBox = document.getElementById('cashChangeBox');
  const copyPixBtn = document.getElementById('copyPixBtn');
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const orderSuccessBackdrop = document.getElementById('orderSuccessBackdrop');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const successOrderId = document.getElementById('successOrderId');

  function openCheckoutModal() {
    const items = getCartItems();
    if (items.length === 0) {
      showToast('⚠️ Seu carrinho está vazio! Adicione itens do cardápio.', 'fa-solid fa-triangle-exclamation');
      return;
    }

    closeCartDrawer();

    const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);
    const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    if (checkoutSubtotal) checkoutSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (checkoutDelivery) checkoutDelivery.textContent = deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
    if (checkoutTotal) checkoutTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (checkoutItemsPreview) {
      checkoutItemsPreview.innerHTML = items.map(item => `
        <div class="checkout-preview-item">
          <div class="preview-item-info">
            <span class="preview-qty">${item.qty}x</span>
            <div>
              <div class="preview-name">${item.name}</div>
              ${item.selectedOptions && item.selectedOptions.length > 0 ? `
                <small class="preview-addons">${item.selectedOptions.map(o => o.name).join(', ')}</small>
              ` : ''}
              ${item.notes ? `<small class="preview-notes">Obs: ${item.notes}</small>` : ''}
            </div>
          </div>
          <div class="preview-price">R$ ${(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}</div>
        </div>
      `).join('');
    }

    checkoutModal?.classList.add('open');
    checkoutModalBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    checkoutModal?.classList.remove('open');
    checkoutModalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', openCheckoutModal);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutModalBackdrop) checkoutModalBackdrop.addEventListener('click', closeCheckoutModal);

  // Formas de Pagamento no Checkout
  document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'pix') {
        pixDetailsBox?.classList.remove('hidden');
        cashChangeBox?.classList.add('hidden');
      } else if (val === 'cash') {
        pixDetailsBox?.classList.add('hidden');
        cashChangeBox?.classList.remove('hidden');
      } else {
        pixDetailsBox?.classList.add('hidden');
        cashChangeBox?.classList.add('hidden');
      }
    });
  });

  // Copiar Chave Pix
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      const pixKey = document.getElementById('pixKey')?.textContent || '48.912.834/0001-90';
      navigator.clipboard.writeText(pixKey).then(() => {
        showToast('📋 Chave Pix copiada com sucesso!', 'fa-solid fa-copy');
      }).catch(() => {
        showToast('📋 Chave Pix: ' + pixKey, 'fa-solid fa-qrcode');
      });
    });
  }

  // Submissão do Pedido e WhatsApp
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const items = getCartItems();
      if (items.length === 0) {
        showToast('⚠️ Seu carrinho está vazio!', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const name = document.getElementById('custName')?.value.trim();
      const phone = document.getElementById('custPhone')?.value.trim();
      const street = document.getElementById('custStreet')?.value.trim();
      const neighborhood = document.getElementById('custNeighborhood')?.value.trim();
      const complement = document.getElementById('custComplement')?.value.trim();
      const payMethodRadio = document.querySelector('input[name="payMethod"]:checked')?.value || 'pix';
      const changeText = document.getElementById('changeInput')?.value.trim();

      let payMethodLabel = 'Pix Instantâneo';
      if (payMethodRadio === 'card') payMethodLabel = 'Cartão (Débito/Crédito na Entrega)';
      if (payMethodRadio === 'cash') {
        payMethodLabel = `Dinheiro ${changeText ? `(${changeText})` : '(Sem troco)'}`;
      }

      const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);
      const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
      const total = subtotal + deliveryFee;

      const orderCode = `#RST-${Math.floor(1000 + Math.random() * 9000)}`;

      // Formatação da Mensagem WhatsApp
      let msg = `*🍔 NOVO PEDIDO RESHT - ${orderCode}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `👤 *Cliente:* ${name}\n`;
      msg += `📱 *WhatsApp:* ${phone}\n`;
      msg += `📍 *Endereço:* ${street}, ${neighborhood}${complement ? ` - ${complement}` : ''}\n`;
      msg += `💳 *Pagamento:* ${payMethodLabel}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📋 *ITENS DO PEDIDO:*\n`;

      items.forEach(item => {
        msg += `▪️ *${item.qty}x ${item.name}* — R$ ${(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}\n`;
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          msg += `   └ *Adicionais:* ${item.selectedOptions.map(o => o.name).join(', ')}\n`;
        }
        if (item.notes) {
          msg += `   └ *Obs:* ${item.notes}\n`;
        }
      });

      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `💰 *Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
      msg += `🛵 *Taxa de Entrega:* ${deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}\n`;
      msg += `🔥 *TOTAL A PAGAR:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `✨ *Pedido gerado pelo site RESHT. Aguardo a confirmação!*`;

      // Número do restaurante (WhatsApp institucional)
      const waNumber = '5511987654321';
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;

      // Abre o WhatsApp
      window.open(waUrl, '_blank');

      // Limpa formulário e carrinho
      checkoutForm.reset();
      saveCartItems([]);

      // Fecha modal de checkout e abre modal de sucesso
      closeCheckoutModal();
      if (successOrderId) successOrderId.textContent = orderCode;
      orderSuccessModal?.classList.add('open');
      orderSuccessBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';

      showToast(`🎉 Pedido ${orderCode} enviado para a cozinha!`, 'fa-solid fa-circle-check');
    });
  }

  function closeSuccessModal() {
    orderSuccessModal?.classList.remove('open');
    orderSuccessBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  if (orderSuccessBackdrop) orderSuccessBackdrop.addEventListener('click', closeSuccessModal);

  // ==========================================================================
  // 8. Formulário de Reserva de Mesas (#reservationForm)
  // ==========================================================================
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName')?.value.trim();
      const phone = document.getElementById('resPhone')?.value.trim();
      const date = document.getElementById('resDate')?.value;
      const time = document.getElementById('resTime')?.value;
      const guests = document.getElementById('resGuests')?.value;
      const ambience = document.getElementById('resAmbience')?.value;
      const occasion = document.getElementById('resOccasion')?.value;
      const notes = document.getElementById('resNotes')?.value.trim();

      // Formata data brasileira
      let formattedDate = date;
      if (date && date.includes('-')) {
        const [y, m, d] = date.split('-');
        formattedDate = `${d}/${m}/${y}`;
      }

      let msg = `*🍷 SOLICITAÇÃO DE RESERVA VIP - RESHT*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `👤 *Nome:* ${name}\n`;
      msg += `📱 *WhatsApp:* ${phone}\n`;
      msg += `📅 *Data:* ${formattedDate} às ${time}\n`;
      msg += `👥 *Convidados:* ${guests} ${guests === '1' ? 'Pessoa' : 'Pessoas'}\n`;
      msg += `🛋️ *Ambiente:* ${ambience}\n`;
      msg += `🎁 *Ocasião:* ${occasion}\n`;
      if (notes) {
        msg += `📝 *Observações:* ${notes}\n`;
      }
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `✨ *Por favor, confirmem a disponibilidade da nossa mesa!*`;

      const waNumber = '5511987654321';
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;

      window.open(waUrl, '_blank');
      reservationForm.reset();

      showToast(`🎉 Solicitação de reserva para ${formattedDate} enviada! Confirmaremos em breve.`, 'fa-solid fa-calendar-check');
    });
  }

  // ==========================================================================
  // 9. Newsletter VIP & Botão Voltar ao Topo
  // ==========================================================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail?.value.trim();
      if (email) {
        newsletterForm.reset();
        showToast('✨ Bem-vindo ao Clube VIP RESHT! Convites exclusivos enviados.', 'fa-solid fa-gift');
      }
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 10. Efeito Partículas Flutuantes / Poeira de Luz & Bokeh Lights
  // ==========================================================================
  function initAmbientParticles(canvasId = 'ambientParticlesCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 28 : 65;

    const colors = [
      { r: 242, g: 61, b: 76 },   // Flame Red
      { r: 255, g: 126, b: 64 },  // Coral Glow
      { r: 255, g: 180, b: 50 },  // Amber Gold
      { r: 255, g: 235, b: 190 }, // Warm Starlight / Embers
      { r: 255, g: 101, b: 91 }   // Crimson
    ];

    class Particle {
      constructor(initial = false) {
        this.reset(initial);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 40;
        this.isBokeh = Math.random() > 0.72; // ~28% bokeh discs, 72% glowing dust/embers

        if (this.isBokeh) {
          this.baseRadius = Math.random() * 14 + 6; // 6px - 20px
          this.speedY = Math.random() * 0.35 + 0.15;
          this.maxAlpha = Math.random() * 0.2 + 0.08;
        } else {
          this.baseRadius = Math.random() * 2.2 + 1.0; // 1px - 3.2px
          this.speedY = Math.random() * 0.65 + 0.25;
          this.maxAlpha = Math.random() * 0.55 + 0.25;
        }

        this.radius = this.baseRadius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = initial ? Math.random() * this.maxAlpha : 0;
        this.fadeIn = true;
        this.fadeSpeed = Math.random() * 0.008 + 0.003;
        this.swaySpeed = Math.random() * 0.02 + 0.008;
        this.swayAmount = Math.random() * 1.5 + 0.5;
        this.swayOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.swayOffset += this.swaySpeed;
        this.x += Math.sin(this.swayOffset) * this.swayAmount * 0.35;

        // Suave fade in e oscilação orgânica
        if (this.fadeIn) {
          this.alpha += this.fadeSpeed;
          if (this.alpha >= this.maxAlpha) {
            this.alpha = this.maxAlpha;
            this.fadeIn = false;
          }
        } else {
          this.alpha += Math.sin(this.swayOffset * 1.5) * 0.003;
          if (this.alpha < 0.05) this.alpha = 0.05;
        }

        // Reinicia no fundo ao sair da tela
        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

        if (this.isBokeh) {
          // Disco de luz difusa Bokeh
          const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
          );
          grad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`);
          grad.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.25)`);
          grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ponto de luz cintilante com halo
          const haloRadius = this.radius * 3.5;
          const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, haloRadius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
          grad.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.75)`);
          grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle(true));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animate);
    }

    animate();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });
  }

  // Inicialização de Dados e Recursos
  loadProfileData();
  renderUsersTable();
  renderCart();
  preloadImages();
  initAmbientParticles();
});



