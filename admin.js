/**
 * RESHT FOOD SERVICE SUITE — BACKOFFICE & KDS ENGINE
 * Controla o KDS em tempo real, WebSockets simulados, áudio de alertas,
 * gerenciamento de cardápio, estoque, logística e faturamento.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Áudio de Alerta (Web Audio API Synthesizer)
  // ==========================================================================
  let soundEnabled = true;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playOrderBellSound() {
    if (!soundEnabled) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Sine Wave Chime (Two-tone high performance bell)
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch (e) {
      console.warn('Audio feedback error:', e);
    }
  }

  // ==========================================================================
  // 2. Estado Global de Pedidos (Live KDS & Payments Database)
  // ==========================================================================
  const KDS_STORAGE_KEY = 'resht_kds_orders';
  let currentKdsPaymentFilter = 'all'; // 'all' | 'paid' | 'pending'

  const defaultKdsOrders = [
    {
      id: 'RST-9102',
      customer: { name: 'Lucas Gabriel', phone: '(11) 97123-4567', address: 'Rua Oscar Freire, 820 - Ap 51' },
      items: [
        { name: 'RESHT Royal Smash & Bacon', qty: 2, price: 44.90, addons: ['Cheddar Inglês Extra', 'Bacon Duplo'], obs: 'Carne ao ponto' },
        { name: 'Cocktail Berry Flame Splash', qty: 1, price: 28.50, addons: [] }
      ],
      subtotal: 118.30,
      deliveryFee: 0.00,
      total: 118.30,
      payMethod: 'PIX (Online Instantâneo)',
      paymentStatus: 'PAID', // 'PAID' | 'PENDING'
      paidAt: Date.now() - (4 * 60 * 1000),
      confirmedBy: 'Gateway Pix Auto',
      status: 'received', // received | preparing | ready | delivering | delivered
      createdAt: Date.now() - (4 * 60 * 1000), // 4 min atrás
      driver: null
    },
    {
      id: 'RST-9098',
      customer: { name: 'Mariana Duarte', phone: '(11) 98844-2211', address: 'Al. Lorena, 1200 - Casa' },
      items: [
        { name: 'Pizza Trufada Napolitana', qty: 1, price: 68.00, addons: ['Borda Recheada Catupiry'], obs: 'Massa bem tostadinha' },
        { name: 'Gateau de Chocolate & Gelato', qty: 2, price: 32.00, addons: [] }
      ],
      subtotal: 132.00,
      deliveryFee: 7.90,
      total: 139.90,
      payMethod: 'Cartão Crédito (Entrega)',
      paymentStatus: 'PENDING',
      paidAt: null,
      confirmedBy: null,
      status: 'preparing',
      createdAt: Date.now() - (16 * 60 * 1000), // 16 min atrás
      driver: 'Carlos Motoboy'
    },
    {
      id: 'RST-9087',
      customer: { name: 'Rodrigo Siqueira', phone: '(11) 99122-3344', address: 'Av. Brigadeiro Luis Antonio, 2400' },
      items: [
        { name: 'Burger Trufado Supreme', qty: 2, price: 49.90, addons: ['Molho Especial Trufado'], obs: 'Sem cebola' }
      ],
      subtotal: 99.80,
      deliveryFee: 5.90,
      total: 105.70,
      payMethod: 'Dinheiro (Troco p/ R$ 150)',
      paymentStatus: 'PENDING',
      paidAt: null,
      confirmedBy: null,
      status: 'ready',
      createdAt: Date.now() - (22 * 60 * 1000), // 22 min atrás
      driver: 'Marcos Entrega Rápida'
    },
    {
      id: 'RST-9071',
      customer: { name: 'Juliana Paes', phone: '(11) 97788-9900', address: 'Rua Bela Cintra, 1900' },
      items: [
        { name: 'Pizza Quatro Queijos Rústica', qty: 1, price: 64.00, addons: [] },
        { name: 'Cocktail Berry Flame Splash', qty: 2, price: 28.50, addons: [] }
      ],
      subtotal: 121.00,
      deliveryFee: 0.00,
      total: 121.00,
      payMethod: 'PIX (Online Instantâneo)',
      paymentStatus: 'PAID',
      paidAt: Date.now() - (29 * 60 * 1000),
      confirmedBy: 'Admin Nilton',
      status: 'delivering',
      createdAt: Date.now() - (29 * 60 * 1000), // 29 min atrás
      driver: 'Carlos Motoboy'
    }
  ];

  function getOrders() {
    try {
      const saved = localStorage.getItem(KDS_STORAGE_KEY);
      if (!saved) return defaultKdsOrders;
      const parsed = JSON.parse(saved);
      // Garantir compatibilidade com registros anteriores
      return parsed.map(o => ({
        ...o,
        paymentStatus: o.paymentStatus || (o.payMethod?.includes('PIX') ? 'PAID' : 'PENDING'),
        confirmedBy: o.confirmedBy || (o.paymentStatus === 'PAID' ? 'Admin Nilton' : null)
      }));
    } catch {
      return defaultKdsOrders;
    }
  }

  function saveOrders(ordersList) {
    localStorage.setItem(KDS_STORAGE_KEY, JSON.stringify(ordersList));
    renderKdsBoard();
    renderPaymentsTable();
    updateMetrics();
  }

  // ==========================================================================
  // 3. Renderização do KDS Kanban & Timers com Controle de Pagamentos
  // ==========================================================================
  const cardsReceived = document.getElementById('cards-received');
  const cardsPreparing = document.getElementById('cards-preparing');
  const cardsReady = document.getElementById('cards-ready');
  const cardsDelivering = document.getElementById('cards-delivering');
  const cardsDelivered = document.getElementById('cards-delivered');

  function getElapsedMinutes(timestamp) {
    const elapsedMs = Date.now() - timestamp;
    return Math.floor(elapsedMs / (1000 * 60));
  }

  function getTimerClass(mins) {
    if (mins < 15) return 'green';
    if (mins < 25) return 'yellow';
    return 'red';
  }

  function getNextStatus(current) {
    switch (current) {
      case 'received': return { next: 'preparing', label: 'Iniciar Preparo', icon: 'fa-solid fa-fire' };
      case 'preparing': return { next: 'ready', label: 'Pronto p/ Expedição', icon: 'fa-solid fa-check' };
      case 'ready': return { next: 'delivering', label: 'Despachar Motoboy', icon: 'fa-solid fa-motorcycle' };
      case 'delivering': return { next: 'delivered', label: 'Confirmar Entrega', icon: 'fa-solid fa-flag-checkered' };
      default: return null;
    }
  }

  // Configuração dos Filtros de Pagamento do KDS
  const kdsFilterTabs = document.getElementById('kdsFilterTabs');
  if (kdsFilterTabs) {
    kdsFilterTabs.querySelectorAll('.kds-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        kdsFilterTabs.querySelectorAll('.kds-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentKdsPaymentFilter = btn.dataset.filter || 'all';
        renderKdsBoard();
      });
    });
  }

  function renderKdsBoard() {
    const allOrders = getOrders();

    // Contadores globais para abas de filtro e resumo rápido
    const totalAll = allOrders.length;
    const totalPaid = allOrders.filter(o => o.paymentStatus === 'PAID').length;
    const totalPending = allOrders.filter(o => o.paymentStatus !== 'PAID').length;
    
    const sumPaid = allOrders.filter(o => o.paymentStatus === 'PAID').reduce((acc, o) => acc + o.total, 0);
    const sumPending = allOrders.filter(o => o.paymentStatus !== 'PAID').reduce((acc, o) => acc + o.total, 0);

    const filterCountAll = document.getElementById('filterCountAll');
    const filterCountPaid = document.getElementById('filterCountPaid');
    const filterCountPending = document.getElementById('filterCountPending');
    const quickPaidSum = document.getElementById('quickPaidSum');
    const quickPendingSum = document.getElementById('quickPendingSum');

    if (filterCountAll) filterCountAll.textContent = totalAll;
    if (filterCountPaid) filterCountPaid.textContent = totalPaid;
    if (filterCountPending) filterCountPending.textContent = totalPending;
    if (quickPaidSum) quickPaidSum.textContent = `R$ ${sumPaid.toFixed(2).replace('.', ',')}`;
    if (quickPendingSum) quickPendingSum.textContent = `R$ ${sumPending.toFixed(2).replace('.', ',')}`;

    // Aplica filtro de pagamento selecionado
    const visibleOrders = allOrders.filter(order => {
      if (currentKdsPaymentFilter === 'paid') return order.paymentStatus === 'PAID';
      if (currentKdsPaymentFilter === 'pending') return order.paymentStatus !== 'PAID';
      return true;
    });

    const cols = {
      received: cardsReceived,
      preparing: cardsPreparing,
      ready: cardsReady,
      delivering: cardsDelivering,
      delivered: cardsDelivered
    };

    // Limpa containers
    Object.values(cols).forEach(c => { if (c) c.innerHTML = ''; });

    const counts = { received: 0, preparing: 0, ready: 0, delivering: 0, delivered: 0 };

    visibleOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      const targetCol = cols[order.status];
      if (!targetCol) return;

      const mins = getElapsedMinutes(order.createdAt);
      const timerClass = getTimerClass(mins);
      const nextAction = getNextStatus(order.status);
      const isPaid = order.paymentStatus === 'PAID';

      const card = document.createElement('div');
      card.className = 'kds-order-card';
      card.innerHTML = `
        <div class="card-top-row">
          <span class="order-code-badge">#${order.id}</span>
          <span class="order-timer-tag ${timerClass}">
            <i class="fa-regular fa-clock"></i> ${mins}m
          </span>
        </div>

        <div class="order-customer-info">
          <strong>${order.customer.name}</strong>
          <span>${order.customer.address}</span>
        </div>

        <!-- Linha de Status e Confirmação de Pagamento -->
        <div class="card-payment-row">
          <div class="card-payment-status">
            <i class="${isPaid ? 'fa-solid fa-circle-check text-emerald' : 'fa-solid fa-hourglass-half text-amber'}"></i>
            <span>${order.payMethod}</span>
            <strong class="pay-tag ${isPaid ? 'paid' : 'pending'}">${isPaid ? 'PAGO' : 'PENDENTE'}</strong>
          </div>
          ${!isPaid ? `
            <button class="btn-confirm-pay" data-id="${order.id}" title="Confirmar recebimento do pagamento agora">
              <i class="fa-solid fa-hand-holding-dollar"></i> Confirmar
            </button>
          ` : `
            <span class="paid-check-badge" title="Confirmado por ${order.confirmedBy || 'Sistema'}">
              <i class="fa-solid fa-check-double"></i> Pago
            </span>
          `}
        </div>

        <div class="order-items-summary">
          ${order.items.map(item => `
            <div class="kds-item-line">
              <div class="kds-item-main">
                <span><span class="item-qty-tag">${item.qty}x</span> ${item.name}</span>
              </div>
              ${item.addons && item.addons.length > 0 ? `
                <div class="kds-addons-list">+ ${item.addons.join(', ')}</div>
              ` : ''}
              ${item.obs ? `<div class="kds-order-obs"><i class="fa-solid fa-triangle-exclamation"></i> ${item.obs}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="card-actions-row">
          <button class="btn-card-action print" data-id="${order.id}" title="Imprimir Comanda 80mm">
            <i class="fa-solid fa-print"></i>
          </button>
          ${nextAction ? `
            <button class="btn-card-action advance" data-id="${order.id}" data-next="${nextAction.next}">
              <i class="${nextAction.icon}"></i> ${nextAction.label}
            </button>
          ` : `
            <span class="text-xs text-muted" style="text-align:center;width:100%;">Finalizado com Sucesso</span>
          `}
        </div>
      `;

      targetCol.appendChild(card);
    });

    // Atualiza contadores nas colunas
    Object.keys(counts).forEach(k => {
      const el = document.getElementById(`count-${k}`);
      if (el) el.textContent = counts[k];
    });

    // Eventos de Confirmação de Pagamento
    document.querySelectorAll('.btn-confirm-pay').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmPayment(btn.dataset.id);
      });
    });

    // Eventos de Avançar Status
    document.querySelectorAll('.btn-card-action.advance').forEach(btn => {
      btn.addEventListener('click', () => {
        advanceOrderStatus(btn.dataset.id, btn.dataset.next);
      });
    });

    // Eventos de Impressão Térmica
    document.querySelectorAll('.btn-card-action.print').forEach(btn => {
      btn.addEventListener('click', () => {
        openThermalReceipt(btn.dataset.id);
      });
    });
  }

  // Ação de Confirmação de Pagamento pelo Administrador
  function confirmPayment(orderId) {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index].paymentStatus = 'PAID';
      orders[index].paidAt = Date.now();
      orders[index].confirmedBy = 'Admin Nilton';
      saveOrders(orders);
      playOrderBellSound();
      showAdminToast(`💳 PAGAMENTO CONFIRMADO! Pedido #${orderId} de R$ ${orders[index].total.toFixed(2).replace('.', ',')} registrado como PAGO.`, 'fa-solid fa-circle-check');
    }
  }

  // Ação de Desfazer / Alterar Status de Pagamento
  function togglePaymentStatus(orderId) {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      const current = orders[index].paymentStatus;
      if (current === 'PAID') {
        orders[index].paymentStatus = 'PENDING';
        orders[index].paidAt = null;
        orders[index].confirmedBy = null;
        showAdminToast(`⚠️ Pagamento do Pedido #${orderId} revertido para PENDENTE.`, 'fa-solid fa-clock-rotate-left');
      } else {
        orders[index].paymentStatus = 'PAID';
        orders[index].paidAt = Date.now();
        orders[index].confirmedBy = 'Admin Nilton';
        playOrderBellSound();
        showAdminToast(`💳 Pagamento do Pedido #${orderId} confirmado com sucesso!`, 'fa-solid fa-circle-check');
      }
      saveOrders(orders);
    }
  }

  function advanceOrderStatus(orderId, nextStatus) {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index].status = nextStatus;
      saveOrders(orders);
      showAdminToast(`Status do pedido #${orderId} atualizado para "${nextStatus.toUpperCase()}"!`, 'fa-solid fa-circle-check');
    }
  }

  function updateMetrics() {
    const orders = getOrders();
    const active = orders.filter(o => o.status !== 'delivered');
    const delivering = orders.filter(o => o.status === 'delivering');
    const pendingPayments = orders.filter(o => o.paymentStatus !== 'PAID');

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    const badgeEl = document.getElementById('kdsBadgeCount');
    if (badgeEl) badgeEl.textContent = active.length;

    const metricActive = document.getElementById('metricTotalActive');
    if (metricActive) metricActive.textContent = active.length;

    const metricDelivering = document.getElementById('metricInDelivery');
    if (metricDelivering) metricDelivering.textContent = delivering.length;

    const metricDay = document.getElementById('metricDayTotal');
    if (metricDay) metricDay.textContent = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;

    const financialPendingBadge = document.getElementById('financialPendingBadge');
    if (financialPendingBadge) {
      financialPendingBadge.textContent = `${pendingPayments.length} A Cobrar`;
      financialPendingBadge.className = `nav-badge ${pendingPayments.length > 0 ? 'warning' : 'green'}`;
    }
  }

  // ==========================================================================
  // 4. Painel de Auditoria & Tabela de Pagamentos (Frente de Caixa)
  // ==========================================================================
  const paymentsTableBody = document.getElementById('paymentsTableBody');
  const paymentsMobileCards = document.getElementById('paymentsMobileCards');
  const paymentsSearchInput = document.getElementById('paymentsSearchInput');
  const paymentsStatusFilter = document.getElementById('paymentsStatusFilter');

  function renderPaymentsTable() {
    if (!paymentsTableBody && !paymentsMobileCards) return;

    const orders = getOrders();
    const searchTerm = paymentsSearchInput ? paymentsSearchInput.value.toLowerCase().trim() : '';
    const statusFilter = paymentsStatusFilter ? paymentsStatusFilter.value : 'all';

    // Métricas Globais de Caixa
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
    const pendingOrders = orders.filter(o => o.paymentStatus !== 'PAID');

    const sumPaid = paidOrders.reduce((acc, o) => acc + o.total, 0);
    const sumPending = pendingOrders.reduce((acc, o) => acc + o.total, 0);
    const rate = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

    const sumTotalPaidEl = document.getElementById('sumTotalPaid');
    const countPaidOrdersEl = document.getElementById('countPaidOrders');
    const sumTotalPendingEl = document.getElementById('sumTotalPending');
    const countPendingOrdersEl = document.getElementById('countPendingOrders');
    const sumSettlementRateEl = document.getElementById('sumSettlementRate');
    const sumTotalOrdersCountEl = document.getElementById('sumTotalOrdersCount');

    if (sumTotalPaidEl) sumTotalPaidEl.textContent = `R$ ${sumPaid.toFixed(2).replace('.', ',')}`;
    if (countPaidOrdersEl) countPaidOrdersEl.textContent = `${paidOrders.length} pedido(s) liquidado(s)`;
    if (sumTotalPendingEl) sumTotalPendingEl.textContent = `R$ ${sumPending.toFixed(2).replace('.', ',')}`;
    if (countPendingOrdersEl) countPendingOrdersEl.textContent = `${pendingOrders.length} pedido(s) a cobrar`;
    if (sumSettlementRateEl) sumSettlementRateEl.textContent = `${rate}%`;
    if (sumTotalOrdersCountEl) sumTotalOrdersCountEl.textContent = `${orders.length} pedido(s) no turno`;

    // Atualiza Distribuição por Métodos de Pagamento
    const pixSum = orders.filter(o => o.payMethod.includes('PIX')).reduce((acc, o) => acc + o.total, 0);
    const cardSum = orders.filter(o => o.payMethod.includes('Cartão')).reduce((acc, o) => acc + o.total, 0);
    const cashSum = orders.filter(o => o.payMethod.includes('Dinheiro')).reduce((acc, o) => acc + o.total, 0);

    const statPixVal = document.getElementById('statPixVal');
    const statCardVal = document.getElementById('statCardVal');
    const statCashVal = document.getElementById('statCashVal');

    if (statPixVal) statPixVal.textContent = `R$ ${pixSum.toFixed(2).replace('.', ',')}`;
    if (statCardVal) statCardVal.textContent = `R$ ${cardSum.toFixed(2).replace('.', ',')}`;
    if (statCashVal) statCashVal.textContent = `R$ ${cashSum.toFixed(2).replace('.', ',')}`;

    // Filtra lista de pedidos para a tabela
    const filtered = orders.filter(order => {
      const matchSearch = order.id.toLowerCase().includes(searchTerm) ||
                          order.customer.name.toLowerCase().includes(searchTerm) ||
                          order.customer.phone.toLowerCase().includes(searchTerm) ||
                          order.payMethod.toLowerCase().includes(searchTerm);
      
      const matchStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      if (paymentsTableBody) {
        paymentsTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
              <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
              Nenhum pedido encontrado com os filtros selecionados.
            </td>
          </tr>
        `;
      }
      if (paymentsMobileCards) {
        paymentsMobileCards.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
            Nenhum pedido encontrado com os filtros selecionados.
          </div>
        `;
      }
      return;
    }

    if (paymentsTableBody) {
      paymentsTableBody.innerHTML = filtered.map(order => {
        const isPaid = order.paymentStatus === 'PAID';
        const timeStr = new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return `
          <tr>
            <td><strong class="order-code-badge">#${order.id}</strong></td>
            <td><span class="text-xs text-secondary">${timeStr}</span></td>
            <td>
              <strong>${order.customer.name}</strong>
              <div class="text-xs text-muted">${order.customer.phone}</div>
            </td>
            <td><strong class="text-emerald font-bold">R$ ${order.total.toFixed(2).replace('.', ',')}</strong></td>
            <td>
              <div style="display:flex;align-items:center;gap:0.4rem;">
                <i class="${order.payMethod.includes('PIX') ? 'fa-brands fa-pix text-emerald' : order.payMethod.includes('Cartão') ? 'fa-solid fa-credit-card text-primary' : 'fa-solid fa-money-bill-wave text-amber'}"></i>
                <span>${order.payMethod}</span>
              </div>
            </td>
            <td>
              <span class="badge-pay ${isPaid ? 'paid' : 'pending'}">
                <i class="${isPaid ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock'}"></i>
                ${isPaid ? 'PAGO' : 'PENDENTE'}
              </span>
            </td>
            <td>
              <div class="text-xs">
                <strong>${isPaid ? (order.confirmedBy || 'Admin Nilton') : 'Aguardando'}</strong>
                <div class="text-muted">${isPaid && order.paidAt ? new Date(order.paidAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não confirmado'}</div>
              </div>
            </td>
            <td class="text-right">
              <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.45rem;">
                ${!isPaid ? `
                  <button class="btn-action-pay" data-id="${order.id}" title="Confirmar pagamento agora">
                    <i class="fa-solid fa-check"></i> Confirmar
                  </button>
                ` : `
                  <button class="btn-action-view" data-id="${order.id}" data-action="toggle" title="Reverter para Pendente">
                    <i class="fa-solid fa-rotate-left"></i> Reverter
                  </button>
                `}
                <button class="btn-action-view" data-id="${order.id}" data-action="print" title="Ver Comanda">
                  <i class="fa-solid fa-print"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Renderiza Cards Mobile
    if (paymentsMobileCards) {
      paymentsMobileCards.innerHTML = filtered.map(order => {
        const isPaid = order.paymentStatus === 'PAID';
        const timeStr = new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return `
          <div class="payment-card-mobile">
            <div class="pay-card-header">
              <div class="pay-card-header-left">
                <strong class="order-code-badge">#${order.id}</strong>
                <span class="pay-card-time"><i class="fa-solid fa-clock"></i> ${timeStr}</span>
              </div>
              <span class="badge-pay ${isPaid ? 'paid' : 'pending'}">
                <i class="${isPaid ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock'}"></i>
                ${isPaid ? 'PAGO' : 'PENDENTE'}
              </span>
            </div>

            <div class="pay-card-customer-box">
              <div class="pay-card-cust-info">
                <span class="pay-card-cust-name"><i class="fa-solid fa-user" style="color:var(--primary);margin-right:4px;"></i> ${order.customer.name}</span>
                <a href="tel:${order.customer.phone.replace(/[^0-9]/g, '')}" class="pay-card-cust-phone">
                  <i class="fa-solid fa-phone text-muted"></i> ${order.customer.phone}
                </a>
              </div>
              <div class="pay-card-val-box">
                <div class="pay-card-val-label">Total</div>
                <div class="pay-card-val">R$ ${order.total.toFixed(2).replace('.', ',')}</div>
              </div>
            </div>

            <div class="pay-card-meta-grid">
              <div class="pay-card-meta-item">
                <span class="pay-card-meta-label">Pagamento</span>
                <div class="pay-card-meta-val">
                  <i class="${order.payMethod.includes('PIX') ? 'fa-brands fa-pix text-emerald' : order.payMethod.includes('Cartão') ? 'fa-solid fa-credit-card text-primary' : 'fa-solid fa-money-bill-wave text-amber'}"></i>
                  <span>${order.payMethod}</span>
                </div>
              </div>
              <div class="pay-card-meta-item">
                <span class="pay-card-meta-label">Operador / Auditoria</span>
                <div class="pay-card-meta-val">
                  <i class="fa-solid fa-user-check text-muted"></i>
                  <span>${isPaid ? (order.confirmedBy || 'Admin Nilton') : 'Aguardando'}</span>
                </div>
              </div>
            </div>

            <div class="pay-card-actions">
              ${!isPaid ? `
                <button class="btn-action-pay" data-id="${order.id}">
                  <i class="fa-solid fa-check"></i> Confirmar Pagamento
                </button>
              ` : `
                <button class="btn-action-view" data-id="${order.id}" data-action="toggle" style="flex:1;justify-content:center;">
                  <i class="fa-solid fa-rotate-left"></i> Reverter Status
                </button>
              `}
              <button class="btn-action-view" data-id="${order.id}" data-action="print" title="Ver Comanda">
                <i class="fa-solid fa-print"></i> Comanda
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Eventos na Tabela e Cards de Pagamentos
    const bindPaymentEvents = (container) => {
      if (!container) return;
      container.querySelectorAll('.btn-action-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          confirmPayment(btn.dataset.id);
        });
      });

      container.querySelectorAll('.btn-action-view').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          if (action === 'toggle') {
            togglePaymentStatus(id);
          } else if (action === 'print') {
            openThermalReceipt(id);
          }
        });
      });
    };

    bindPaymentEvents(paymentsTableBody);
    bindPaymentEvents(paymentsMobileCards);
  }

  paymentsSearchInput?.addEventListener('input', renderPaymentsTable);
  paymentsStatusFilter?.addEventListener('change', renderPaymentsTable);

  // Timer interval para atualizar tempos dos pedidos a cada 10s
  setInterval(() => {
    renderKdsBoard();
  }, 10000);

  // ==========================================================================
  // 5. Simulador de Novos Pedidos (Live WebSocket Emulation)
  // ==========================================================================
  const simulateNewOrderBtn = document.getElementById('simulateNewOrderBtn');

  const sampleDishes = [
    { name: 'RESHT Royal Smash & Bacon', price: 44.90, addons: ['Cheddar Extra (+ R$ 6,00)', 'Bacon Crocante (+ R$ 5,00)'], obs: 'Carne bem passada' },
    { name: 'Pizza Trufada Napolitana', price: 68.00, addons: ['Azeite Trufado Extra'], obs: 'Caprichar no orégano' },
    { name: 'Burger Trufado Supreme', price: 49.90, addons: ['Gruyère Extra (+ R$ 8,00)'], obs: 'Sem cebola' },
    { name: 'Cocktail Berry Flame Splash', price: 28.50, addons: [], obs: 'Bastante gelo' },
    { name: 'Gateau de Chocolate & Gelato', price: 32.00, addons: [], obs: '' }
  ];

  const sampleCustomers = [
    { name: 'Fernanda Lima', phone: '(11) 98111-2233', address: 'Rua Haddock Lobo, 1300' },
    { name: 'Guilherme Castro', phone: '(11) 99333-4455', address: 'Al. Jaú, 740 - Ap 12' },
    { name: 'Beatriz Vasconcelos', phone: '(11) 97555-6677', address: 'Av. Europa, 450' }
  ];

  function simulateIncomingOrder() {
    const randomCustomer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    const dish1 = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];
    const dish2 = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];

    const items = [
      { name: dish1.name, qty: 1, price: dish1.price, addons: dish1.addons, obs: dish1.obs },
      { name: dish2.name, qty: 1, price: dish2.price, addons: dish2.addons, obs: dish2.obs }
    ];

    const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const deliveryFee = subtotal >= 80 ? 0 : 7.90;
    const total = subtotal + deliveryFee;

    const isPix = Math.random() > 0.5;
    const payMethod = isPix ? 'PIX (Online Instantâneo)' : 'Cartão Crédito (Entrega)';
    const paymentStatus = isPix ? 'PAID' : 'PENDING';

    const newOrder = {
      id: 'RST-' + Math.floor(1000 + Math.random() * 9000),
      customer: randomCustomer,
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      payMethod: payMethod,
      paymentStatus: paymentStatus,
      paidAt: paymentStatus === 'PAID' ? Date.now() : null,
      confirmedBy: paymentStatus === 'PAID' ? 'Gateway Pix Auto' : null,
      status: 'received',
      createdAt: Date.now(),
      driver: null
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    playOrderBellSound();
    showAdminToast(`🔔 NOVO PEDIDO #${newOrder.id} (${paymentStatus === 'PAID' ? '🟢 PAGO' : '🟡 A PAGAR'}) — ${newOrder.customer.name}`, 'fa-solid fa-bell');
  }

  if (simulateNewOrderBtn) {
    simulateNewOrderBtn.addEventListener('click', simulateIncomingOrder);
  }

  // ==========================================================================
  // 6. Impressão Térmica (80mm) & Modal
  // ==========================================================================
  const thermalModal = document.getElementById('thermalModal');
  const thermalModalBackdrop = document.getElementById('thermalModalBackdrop');
  const closeThermalModalBtn = document.getElementById('closeThermalModalBtn');
  const doneThermalBtn = document.getElementById('doneThermalBtn');
  const printThermalBtn = document.getElementById('printThermalBtn');

  function openThermalReceipt(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const receiptOrderId = document.getElementById('receiptOrderId');
    const receiptDate = document.getElementById('receiptDate');
    const receiptCustName = document.getElementById('receiptCustName');
    const receiptCustPhone = document.getElementById('receiptCustPhone');
    const receiptCustAddress = document.getElementById('receiptCustAddress');
    const receiptItemsList = document.getElementById('receiptItemsList');
    const receiptSubtotal = document.getElementById('receiptSubtotal');
    const receiptDelivery = document.getElementById('receiptDelivery');
    const receiptTotal = document.getElementById('receiptTotal');
    const receiptPayment = document.getElementById('receiptPayment');

    if (receiptOrderId) receiptOrderId.textContent = `PEDIDO #${order.id}`;
    if (receiptDate) receiptDate.textContent = new Date(order.createdAt).toLocaleString('pt-BR');
    if (receiptCustName) receiptCustName.textContent = order.customer.name;
    if (receiptCustPhone) receiptCustPhone.textContent = order.customer.phone;
    if (receiptCustAddress) receiptCustAddress.textContent = order.customer.address;

    if (receiptItemsList) {
      receiptItemsList.innerHTML = order.items.map(it => `
        <div class="receipt-item-row">
          <span class="receipt-item-name">${it.qty}x ${it.name}</span>
          <span>R$ ${(it.price * it.qty).toFixed(2).replace('.', ',')}</span>
        </div>
        ${it.addons?.length ? `<div class="receipt-item-addons">+ ${it.addons.join(', ')}</div>` : ''}
        ${it.obs ? `<div class="receipt-item-addons" style="font-weight:bold;">[OBS: ${it.obs}]</div>` : ''}
      `).join('');
    }

    if (receiptSubtotal) receiptSubtotal.textContent = `R$ ${order.subtotal.toFixed(2).replace('.', ',')}`;
    if (receiptDelivery) receiptDelivery.textContent = order.deliveryFee === 0 ? 'GRÁTIS' : `R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}`;
    if (receiptTotal) receiptTotal.textContent = `R$ ${order.total.toFixed(2).replace('.', ',')}`;
    
    const payStatusLabel = order.paymentStatus === 'PAID' ? 'CONFIRMADO / PAGO' : 'PENDENTE (A COBRAR NA ENTREGA)';
    if (receiptPayment) receiptPayment.textContent = `${order.payMethod.toUpperCase()} — [${payStatusLabel}]`;

    thermalModal?.classList.add('open');
    thermalModalBackdrop?.classList.add('active');
  }

  function closeThermalReceipt() {
    thermalModal?.classList.remove('open');
    thermalModalBackdrop?.classList.remove('active');
  }

  closeThermalModalBtn?.addEventListener('click', closeThermalReceipt);
  doneThermalBtn?.addEventListener('click', closeThermalReceipt);
  thermalModalBackdrop?.addEventListener('click', closeThermalReceipt);

  if (printThermalBtn) {
    printThermalBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 6. Gerenciador de Cardápio (Menu CMS)
  // ==========================================================================
  const defaultProducts = [
    { id: 'p-1', name: 'RESHT Royal Smash & Bacon', category: 'burgers', price: 44.90, img: 'assets/burger.jpg', active: true },
    { id: 'p-2', name: 'Burger Trufado Supreme', category: 'burgers', price: 49.90, img: 'assets/burger.jpg', active: true },
    { id: 'p-3', name: 'Pizza Trufada Napolitana', category: 'pizzas', price: 68.00, img: 'assets/pizza.jpg', active: true },
    { id: 'p-4', name: 'Pizza Quatro Queijos Rústica', category: 'pizzas', price: 64.00, img: 'assets/pizza.jpg', active: true },
    { id: 'p-5', name: 'Cocktail Berry Flame Splash', category: 'drinks', price: 28.50, img: 'assets/drink.jpg', active: true },
    { id: 'p-6', name: 'Gateau de Chocolate & Gelato', category: 'desserts', price: 32.00, img: 'assets/dessert.jpg', active: true }
  ];

  function renderProductGrid(filterCat = 'all') {
    const grid = document.getElementById('productMgmtGrid');
    if (!grid) return;

    const filtered = filterCat === 'all' ? defaultProducts : defaultProducts.filter(p => p.category === filterCat);

    grid.innerHTML = filtered.map(prod => `
      <div class="product-mgmt-card glass-panel ${prod.active ? '' : 'paused'}">
        <img src="${prod.img}" alt="${prod.name}" class="prod-thumb">
        <div class="prod-mgmt-info">
          <h4 class="prod-mgmt-name">${prod.name}</h4>
          <span class="prod-mgmt-price">R$ ${prod.price.toFixed(2).replace('.', ',')}</span>
          <div class="toggle-switch-wrap">
            <input type="checkbox" id="toggle-${prod.id}" ${prod.active ? 'checked' : ''} data-id="${prod.id}" class="prod-active-toggle">
            <label for="toggle-${prod.id}">${prod.active ? '🟢 Disponível' : '🔴 Esgotado / Pausado'}</label>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.prod-active-toggle').forEach(t => {
      t.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const item = defaultProducts.find(p => p.id === id);
        if (item) {
          item.active = e.target.checked;
          renderProductGrid(filterCat);
          showAdminToast(`Item "${item.name}" ${item.active ? 'ativado para vendas' : 'pausado na loja'}!`, 'fa-solid fa-tag');
        }
      });
    });
  }

  document.querySelectorAll('.mgmt-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mgmt-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProductGrid(btn.dataset.cat);
    });
  });

  // ==========================================================================
  // 7. Entregadores & Logística
  // ==========================================================================
  const drivers = [
    { name: 'Carlos Motoboy', deliveriesToday: 14, status: 'Em Rota (#RST-9071)', badge: 'amber', vehicle: 'Honda CG 160 Fan' },
    { name: 'Marcos Entrega Rápida', deliveriesToday: 19, status: 'Aguardando no Balcão', badge: 'green', vehicle: 'Yamaha Fazer 250' },
    { name: 'Rafael Express', deliveriesToday: 11, status: 'Disponível', badge: 'green', vehicle: 'Honda Biz 125' }
  ];

  const deliveryZones = [
    { name: 'Jardins / Cerqueira César', radius: 'Até 3 km', time: '20 - 30 min', fee: 'R$ 5,90', status: 'Ativa', statusClass: 'green' },
    { name: 'Pinheiros / Vila Madalena', radius: 'Até 6 km', time: '25 - 35 min', fee: 'R$ 7,90', status: 'Ativa', statusClass: 'green' },
    { name: 'Itaim Bibi / Moema', radius: 'Até 9 km', time: '30 - 45 min', fee: 'R$ 11,90', status: 'Ativa', statusClass: 'green' },
    { name: 'Morumbi / Brooklin', radius: 'Até 12 km', time: '40 - 55 min', fee: 'R$ 15,90', status: 'Alta Demanda', statusClass: 'amber' }
  ];

  function renderDrivers() {
    const container = document.getElementById('driversListContainer');
    const countBadge = document.getElementById('driversCountBadge');
    if (countBadge) {
      countBadge.textContent = `${drivers.length} Ativos`;
    }
    if (!container) return;

    container.innerHTML = drivers.map(d => `
      <div class="driver-card">
        <div class="driver-left">
          <div class="driver-avatar"><i class="fa-solid fa-motorcycle"></i></div>
          <div class="driver-name-group">
            <div class="driver-name">${d.name}</div>
            <div class="driver-sub"><i class="fa-solid fa-box-open"></i> ${d.deliveriesToday} entregas hoje ${d.vehicle ? `• ${d.vehicle}` : ''}</div>
          </div>
        </div>
        <span class="badge-status-pill ${d.badge}">${d.status}</span>
      </div>
    `).join('');
  }

  function renderDeliveryZones() {
    const tbody = document.getElementById('zonesTableBody');
    const mobileCards = document.getElementById('deliveryZonesMobileCards');
    const zonesBadge = document.getElementById('zonesCountBadge');

    if (zonesBadge) {
      zonesBadge.textContent = `${deliveryZones.length} Zonas`;
    }

    if (tbody) {
      tbody.innerHTML = deliveryZones.map(z => `
        <tr>
          <td><strong>${z.name}</strong></td>
          <td>${z.radius}</td>
          <td>${z.time}</td>
          <td><span class="text-emerald font-bold">${z.fee}</span></td>
          <td><span class="badge-status-pill ${z.statusClass}">${z.status}</span></td>
        </tr>
      `).join('');
    }

    if (mobileCards) {
      mobileCards.innerHTML = deliveryZones.map(z => `
        <div class="zone-card-mobile">
          <div class="zone-card-header">
            <div class="zone-card-title-box">
              <div class="zone-card-icon"><i class="fa-solid fa-map-pin"></i></div>
              <h4 class="zone-card-name">${z.name}</h4>
            </div>
            <span class="badge-status-pill ${z.statusClass}">${z.status}</span>
          </div>
          <div class="zone-card-metrics-grid">
            <div class="zone-metric-box">
              <span class="zone-metric-label">Raio Máx.</span>
              <span class="zone-metric-val">${z.radius}</span>
            </div>
            <div class="zone-metric-box">
              <span class="zone-metric-label">Tempo Médio</span>
              <span class="zone-metric-val">${z.time}</span>
            </div>
            <div class="zone-metric-box">
              <span class="zone-metric-label">Taxa Cobrada</span>
              <span class="zone-metric-val fee">${z.fee}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Modal Novo Entregador
  const openDriverModalBtn = document.getElementById('openNewDriverModalBtn');
  const driverModalBackdrop = document.getElementById('driverModalBackdrop');
  const newDriverModal = document.getElementById('newDriverModal');
  const closeDriverModalBtn = document.getElementById('closeDriverModalBtn');
  const cancelDriverModalBtn = document.getElementById('cancelDriverModalBtn');
  const newDriverForm = document.getElementById('newDriverForm');

  function openDriverModal() {
    if (newDriverModal && driverModalBackdrop) {
      driverModalBackdrop.classList.add('active');
      newDriverModal.classList.add('active');
      document.body.classList.add('modal-open');
      const nameInput = document.getElementById('driverNameInput');
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    }
  }

  function closeDriverModal() {
    if (newDriverModal && driverModalBackdrop) {
      driverModalBackdrop.classList.remove('active');
      newDriverModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (newDriverForm) newDriverForm.reset();
    }
  }

  if (openDriverModalBtn) openDriverModalBtn.addEventListener('click', openDriverModal);
  if (closeDriverModalBtn) closeDriverModalBtn.addEventListener('click', closeDriverModal);
  if (cancelDriverModalBtn) cancelDriverModalBtn.addEventListener('click', closeDriverModal);
  if (driverModalBackdrop) driverModalBackdrop.addEventListener('click', closeDriverModal);

  if (newDriverForm) {
    newDriverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('driverNameInput').value.trim();
      const vehicle = document.getElementById('driverVehicleInput').value.trim();
      const statusVal = document.getElementById('driverStatusSelect').value.split('|');
      const statusText = statusVal[0] || 'Disponível';
      const statusClass = statusVal[1] || 'green';

      if (!name) return;

      drivers.unshift({
        name,
        deliveriesToday: 0,
        status: statusText,
        badge: statusClass,
        vehicle: vehicle || 'Motocicleta'
      });

      renderDrivers();
      closeDriverModal();
      showAdminToast(`Entregador ${name} cadastrado com sucesso!`, 'fa-solid fa-helmet-safety');
    });
  }

  // ==========================================================================
  // 8. Estoque & Insumos
  // ==========================================================================
  const inventoryItems = [
    { name: 'Blend Black Angus 200g', cat: 'Proteínas / Carnes', qty: '48 un', min: '30 un', status: 'Normal', statusClass: 'green', cost: 'R$ 14,20' },
    { name: 'Pão Brioche Gourmet', cat: 'Panificação', qty: '18 un', min: '25 un', status: 'Estoque Baixo', statusClass: 'amber', cost: 'R$ 2,80' },
    { name: 'Queijo Cheddar Inglês', cat: 'Laticínios', qty: '8 kg', min: '5 kg', status: 'Normal', statusClass: 'green', cost: 'R$ 48,00/kg' },
    { name: 'Azeite Trufado Italiano', cat: 'Especiais DOP', qty: '2 un', min: '4 un', status: 'Crítico', statusClass: 'ruby', cost: 'R$ 115,00' },
    { name: 'Embalagem Térmica Burger', cat: 'Insumos / Embalagens', qty: '350 un', min: '100 un', status: 'Normal', statusClass: 'green', cost: 'R$ 0,85' }
  ];

  function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    const mobileCards = document.getElementById('inventoryMobileCards');

    if (tbody) {
      tbody.innerHTML = inventoryItems.map(item => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td><span class="inventory-cat-badge">${item.cat}</span></td>
          <td><strong class="text-white">${item.qty}</strong></td>
          <td><span class="text-muted">${item.min}</span></td>
          <td><span class="badge-status-pill ${item.statusClass}">${item.status}</span></td>
          <td><strong class="text-emerald">${item.cost}</strong></td>
          <td class="text-right">
            <button class="btn btn-secondary btn-sm" title="Ajustar Estoque"><i class="fa-solid fa-pen"></i></button>
          </td>
        </tr>
      `).join('');
    }

    if (mobileCards) {
      mobileCards.innerHTML = inventoryItems.map(item => `
        <div class="inventory-card-mobile">
          <div class="inv-card-header">
            <div class="inv-card-title-box">
              <div class="inv-card-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
              <div class="inv-card-name-group">
                <h4 class="inv-card-name">${item.name}</h4>
                <span class="inv-card-cat">${item.cat}</span>
              </div>
            </div>
            <span class="badge-status-pill ${item.statusClass}">${item.status}</span>
          </div>

          <div class="inv-card-metrics-grid">
            <div class="inv-metric-box">
              <span class="inv-metric-label">Qtd. Atual</span>
              <span class="inv-metric-val highlight">${item.qty}</span>
            </div>
            <div class="inv-metric-box">
              <span class="inv-metric-label">Estoque Mín.</span>
              <span class="inv-metric-val">${item.min}</span>
            </div>
            <div class="inv-metric-box">
              <span class="inv-metric-label">Custo Unit.</span>
              <span class="inv-metric-val cost">${item.cost}</span>
            </div>
            <div class="inv-metric-box">
              <span class="inv-metric-label">Balanço</span>
              <button class="btn btn-secondary btn-xs inv-action-btn" title="Ajustar Estoque">
                <i class="fa-solid fa-pen"></i> Ajustar
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // ==========================================================================
  // 9. Cupons VIP & Financeiro
  // ==========================================================================
  const coupons = [
    { code: 'RESHTVIP15', discount: '15% de Desconto', rule: 'Válido em compras acima de R$ 80,00' },
    { code: 'FRETEGRATIS', discount: 'Frete Grátis Express', rule: 'Válido para raio até 6 km' },
    { code: 'TERCADOBURGER', discount: 'R$ 20,00 OFF', rule: 'Válido somente às terças-feiras' }
  ];

  function renderCoupons() {
    const container = document.getElementById('couponsListContainer');
    if (!container) return;

    container.innerHTML = coupons.map(c => `
      <div class="coupon-card">
        <div>
          <div class="coupon-code">${c.code}</div>
          <div class="coupon-rule">${c.rule}</div>
        </div>
        <span class="badge-status-pill green">${c.discount}</span>
      </div>
    `).join('');
  }

  // ==========================================================================
  // 10. Navegação entre Abas do Backoffice
  // ==========================================================================
  const navButtons = document.querySelectorAll('.nav-item-btn');
  const views = document.querySelectorAll('.admin-view');
  const viewTitle = document.getElementById('currentViewTitle');
  const viewSub = document.getElementById('currentViewSub');

  const viewHeaders = {
    kdsView: { title: 'KDS & Gestão de Pedidos em Tempo Real', sub: 'Painel de controle visual e operacional da cozinha' },
    menuView: { title: 'Gestão de Cardápio & Modificadores', sub: 'Ative ou pause itens instantaneamente e configure grupos de adicionais' },
    logisticsView: { title: 'Logística & Gestão de Motoboys', sub: 'Acompanhe entregadores ativos e zonas de entrega' },
    inventoryView: { title: 'Controle de Insumos & Baixa Automática', sub: 'Acompanhe a matéria-prima utilizada nos pratos' },
    financialView: { title: 'Frente de Caixa & Cupons Promocionais', sub: 'Abertura/fechamento de turno e divisão por pagamentos' },
    analyticsView: { title: 'Relatórios Operacionais & Desempenho', sub: 'Métricas de ticket médio e tempo de preparo' },
    settingsView: { title: 'Configurações Operacionais da Loja', sub: 'Defina horários de funcionamento e permissões da equipe' }
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      if (!targetView) return;

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      views.forEach(v => {
        v.classList.toggle('active', v.id === targetView);
      });

      if (viewHeaders[targetView]) {
        if (viewTitle) viewTitle.textContent = viewHeaders[targetView].title;
        if (viewSub) viewSub.textContent = viewHeaders[targetView].sub;
      }

      // Fecha sidebar em mobile se aberta
      closeMobileSidebar();
    });
  });

  // Mobile Sidebar & Backdrop Controller
  const adminSidebar = document.getElementById('adminSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const mobileToggle = document.getElementById('mobileSidebarToggle');

  function openMobileSidebar() {
    adminSidebar?.classList.add('open');
    sidebarBackdrop?.classList.add('active');
    document.body.classList.add('admin-sidebar-open');
  }

  function closeMobileSidebar() {
    adminSidebar?.classList.remove('open');
    sidebarBackdrop?.classList.remove('active');
    document.body.classList.remove('admin-sidebar-open');
  }

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (adminSidebar?.classList.contains('open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  sidebarCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileSidebar();
  });

  sidebarBackdrop?.addEventListener('click', () => {
    closeMobileSidebar();
  });

  // Fecha no ESC se aberto
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminSidebar?.classList.contains('open')) {
      closeMobileSidebar();
    }
  });

  // Som Toggle
  const toggleSoundBtn = document.getElementById('toggleSoundBtn');
  const soundIcon = document.getElementById('soundIcon');
  toggleSoundBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundIcon) {
      soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    showAdminToast(soundEnabled ? '🔔 Alertas sonoros ativados' : '🔕 Alertas sonoros desativados', 'fa-solid fa-bell');
  });

  // Master Store Toggle
  const storeMasterToggle = document.getElementById('storeMasterToggle');
  const storeStatusIndicator = document.getElementById('storeStatusIndicator');
  const storeStatusLabel = document.getElementById('storeStatusLabel');

  let storeOpen = true;
  storeMasterToggle?.addEventListener('click', () => {
    storeOpen = !storeOpen;
    storeStatusIndicator?.classList.toggle('closed', !storeOpen);
    if (storeStatusLabel) {
      storeStatusLabel.textContent = storeOpen ? 'Loja Aberta para Pedidos' : 'LOJA FECHADA (PAUSA)';
    }
    showAdminToast(storeOpen ? '🟢 Loja aberta para receber pedidos!' : '🔴 Loja fechada temporariamente!', 'fa-solid fa-store');
  });

  // Toast Notifier
  let adminToastTimer = null;
  function showAdminToast(msg, iconClass = 'fa-solid fa-circle-check') {
    const toast = document.getElementById('adminToast');
    const toastMessage = document.getElementById('adminToastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    const icon = toast.querySelector('.toast-icon');
    if (icon) icon.className = `toast-icon ${iconClass}`;

    toast.classList.add('show');
    clearTimeout(adminToastTimer);
    adminToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // Efeito Partículas Flutuantes / Poeira de Luz & Bokeh Lights
  // ==========================================================================
  function initAmbientParticles(canvasId = 'ambientParticlesCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 24 : 50;

    const colors = [
      { r: 242, g: 61, b: 76 },   // Flame Red
      { r: 255, g: 126, b: 64 },  // Coral Glow
      { r: 255, g: 180, b: 50 },  // Amber Gold
      { r: 255, g: 235, b: 190 }, // Warm Embers
      { r: 255, g: 101, b: 91 }   // Crimson
    ];

    class Particle {
      constructor(initial = false) {
        this.reset(initial);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 40;
        this.isBokeh = Math.random() > 0.75;

        if (this.isBokeh) {
          this.baseRadius = Math.random() * 12 + 5;
          this.speedY = Math.random() * 0.3 + 0.12;
          this.maxAlpha = Math.random() * 0.18 + 0.06;
        } else {
          this.baseRadius = Math.random() * 2.0 + 1.0;
          this.speedY = Math.random() * 0.55 + 0.2;
          this.maxAlpha = Math.random() * 0.45 + 0.2;
        }

        this.radius = this.baseRadius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = initial ? Math.random() * this.maxAlpha : 0;
        this.fadeIn = true;
        this.fadeSpeed = Math.random() * 0.007 + 0.003;
        this.swaySpeed = Math.random() * 0.018 + 0.008;
        this.swayAmount = Math.random() * 1.4 + 0.4;
        this.swayOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.swayOffset += this.swaySpeed;
        this.x += Math.sin(this.swayOffset) * this.swayAmount * 0.35;

        if (this.fadeIn) {
          this.alpha += this.fadeSpeed;
          if (this.alpha >= this.maxAlpha) {
            this.alpha = this.maxAlpha;
            this.fadeIn = false;
          }
        } else {
          this.alpha += Math.sin(this.swayOffset * 1.5) * 0.003;
          if (this.alpha < 0.04) this.alpha = 0.04;
        }

        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

        if (this.isBokeh) {
          const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
          );
          grad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`);
          grad.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.2)`);
          grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const haloRadius = this.radius * 3.2;
          const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, haloRadius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
          grad.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`);
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

  // Inicialização
  renderKdsBoard();
  renderPaymentsTable();
  updateMetrics();
  renderProductGrid('all');
  renderDrivers();
  renderDeliveryZones();
  renderInventory();
  renderCoupons();
  initAmbientParticles();
});
