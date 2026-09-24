# 📋 PASSOS DO PROJETO — RESHT GOURMET

> **Regra de Execução**: Os passos abaixo estão divididos em ordem rigorosa de prioridade. Os passos concluídos são marcados automaticamente com `[x]`. O próximo passo só deve ser iniciado quando o usuário solicitar explicitamente ("continue", "próximo passo", etc.). Ao final de cada implementação, `DOCUMENTACAO.md`, `PASSOS.md` e `CONTEXTO.md` devem ser atualizados e um texto para commit deve ser gerado.

---

## 🚀 Roteiro de Desenvolvimento por Prioridade

### Fase 1: Fundação Visual e Hero Section 3D (Concluída)
- [x] **Passo 1.1**: Criação da estrutura base semântica HTML5 e tipografia moderna (*Outfit* e *Plus Jakarta Sans*).
- [x] **Passo 1.2**: Construção da Navbar responsiva com logo, links de navegação, alternador de tema e ações de carrinho/perfil.
- [x] **Passo 1.3**: Implementação do motor de renderização em Canvas para 100 frames da animação gastronômica em Full HD (1920×1080).
- [x] **Passo 1.4**: Ajuste e expansão da animação para ocupar toda a extensão da tela (*Full Bleed 100vw × 100vh*) com vinhetas atmosféricas e eliminação de bordas/frestas.
- [x] **Passo 1.5**: Remoção de controles de sobreposição e ajuste de perspectiva com Parallax 3D contínuo ao mover o cursor.
- [x] **Passo 1.6**: Tradução integral de todos os textos, botões e mensagens do sistema para Português do Brasil (pt-BR).

---

### Fase 2: Painel Administrativo & Gestão de Acessos (Concluída)
- [x] **Passo 2.1**: Criação da infraestrutura de documentação contínua (`DOCUMENTACAO.md`, `PASSOS.md`, `CONTEXTO.md`, `AGENTS.md`).
- [x] **Passo 2.2**: Implementação do módulo de **Perfil** no Painel Admin (Edição de Nome, E-mail, Telefone, Avatar, Cargo e Alteração de Senha).
- [x] **Passo 2.3**: Implementação do módulo de **Usuários** no Painel Admin (Listagem, Cadastro de novos usuários, Edição, Exclusão e Seleção de Papel: *Usuário Comum* ou *Administrador*).
- [x] **Passo 2.4**: Persistência de dados em `localStorage` para perfil e lista de usuários, com validações e feedback via notificações Toast.

---

### Fase 3: Seção de Cardápio Interativo & Categorias (Concluída)
- [x] **Passo 3.1**: Criação da Seção "Cardápio Especial" com abas de categorias (Hambúrgueres, Pizzas, Bebidas, Sobremesas).
- [x] **Passo 3.2**: Cards de pratos com fotos em alta resolução, ingredientes, preços, badges de favoritos e botão de adicionar ao carrinho.
- [x] **Passo 3.3**: Modal de detalhes do prato com seleção de adicionais / personalização de ingredientes e cálculo dinâmico de preço.

---

### Fase 4: Carrinho de Compras & Checkout Rápido (Concluída)
- [x] **Passo 4.1**: Drawer lateral interativo do Carrinho de Compras com resumo de itens, cálculo de subtotal e taxa de entrega.
- [x] **Passo 4.2**: Sistema de incremento/decremento de quantidades e exclusão de itens do carrinho com persistência em `localStorage`.
- [x] **Passo 4.3**: Barra progressiva de Frete Grátis com meta dinâmica (acima de R$ 80,00).
- [x] **Passo 4.4**: Modal de Checkout com dados de entrega, opções de pagamento (Pix com botão de cópia de chave, Cartão na entrega e Dinheiro com campo de troco).
- [x] **Passo 4.5**: Formatação automática e envio direto do pedido para WhatsApp institucional com geração de código de pedido e Modal de Sucesso.

---

### Fase 5: Seções Institucionais & Chefs (Concluída)
- [x] **Passo 5.1**: Seção "Sobre Nós" com a história da marca RESHT, valores gastronômicos e ambiente do restaurante.
- [x] **Passo 5.2**: Seção "Nossos Chefs" com perfil dos mestres culinários, fotos de estúdio e pratos assinados.
- [x] **Passo 5.3**: Formulário de Reserva de Mesas com seletor de data, horário, número de pessoas, ambiente e envio via WhatsApp.

---

### Fase 6: Rodapé & Otimizações Finais (Concluída)
- [x] **Passo 6.1**: Rodapé moderno com links rápidos, horário de funcionamento, mapa/localização, redes sociais e inscrição no Clube VIP.
- [x] **Passo 6.2**: Otimização de acessibilidade (ARIA labels), SEO tags completas, Open Graph e Schema.org JSON-LD para Restaurante.

---

### Fase 7: Backoffice Central & KDS Live Food Service Suite (Concluída)
- [x] **Passo 7.1**: Modelagem Relacional de Dados completa em PostgreSQL e Prisma ORM (`SCHEMA.md`) para Pedidos, Modificadores, Estoque, Entregadores e Caixa.
- [x] **Passo 7.2**: Módulo KDS (Kitchen Display System) em tempo real com Kanban de 5 status, cronômetro de preparo com alertas coloridos e WebSockets/áudio.
- [x] **Passo 7.3**: Gerenciador de Cardápio (Menu CMS) com pausa rápida de itens esgotados e grupos de adicionais obrigatórios/extras.
- [x] **Passo 7.4**: Módulo de Logística de Entregas com gestão de motoboys e simulação de zonas de atendimento com taxas.
- [x] **Passo 7.5**: Módulo de Estoque e Matéria-Prima com cálculo de saldo mínimo e alertas de estoque crítico.
- [x] **Passo 7.6**: Módulo Financeiro & Caixa com divisão por formas de pagamento e gerador de Cupons Promocionais VIP.
- [x] **Passo 7.7**: Emissor de Comanda Térmica (80mm) pronta para impressão e controle de acesso com chaveamento de perfis (Super Admin, Gerente, Caixa, Cozinha).
- [x] **Passo 7.8**: Módulo de Controle de Pedidos Pagos/Pendentes e Confirmação de Pagamento com 1 clique, filtros rápidos no KDS, tabela de auditoria financeira em tempo real e taxa de liquidação.

### Fase 8: Refinamentos Mobile & Enquadramento Integral (Concluída)
- [x] **Passo 8.1**: Enquadramento, calibração do ponto focal e centralização total do vídeo/canvas 3D da Hero no modo mobile (`transform: translate(-71.5%, -50%) scale(1.52)`), eliminando o vazio lateral e exibindo o portal de neon, hambúrguer, pizza e drink perfeitamente alinhados.
- [x] **Passo 8.2**: Correção e garantia de visibilidade do menu hambúrguer e drawer de navegação responsiva em todos os breakpoints.
- [x] **Passo 8.3**: Enquadramento seguro contra quebra de texto (`overflow-wrap: break-word`) e tipografia fluida com `clamp()` em todos os modais e cartões.
- [x] **Passo 8.4**: Aprimoramento de visibilidade, contraste e acabamento gourmet de todos os botões da barra de navegação superior (Tema, Carrinho com badge destacado, Avatar de Perfil e Menu Hambúrguer).
- [x] **Passo 8.5**: Padronização e ajuste responsivo de textos, inputs e seletores (`select`) no modo mobile — eliminação de truncamentos de texto nos dropdowns com chevron customizado em SVG, folga de padding lateral, textos concisos e quebra fluida de botões de formulário sem cortes.
- [x] **Passo 8.6**: Correção e enquadramento completo do Painel Administrativo (`#adminModal`) no modo mobile — cabeçalho responsivo compacto com botão KDS e fechar perfeitamente alinhados dentro da tela, abas horizontais com rolagem suave, tabela de usuários com scroll horizontal e dimensões contidas no viewport.
- [x] **Passo 8.7**: Calibração simétrica da Hero Section no mobile — centralização exata do portal neon circular e pratos 3D (`transform: translate(-74%, -50%) scale(1.18)`), eliminação de cortes nas bordas, espaçamento vertical harmônico entre navbar, título e showcase, e isolamento do script de parallax para não sobrepor o enquadramento responsivo.
- [x] **Passo 8.8**: Ajuste e desacoplamento dos balões/pills de categorias do cardápio (`.category-btn`) no modo mobile — remoção do corte rígido da cápsula externa, botões em formato de balões individuais com fundo de vidro translúcido, rolagem horizontal fluida e textos 100% visíveis sem truncamento.
- [x] **Passo 8.9**: Estilização e centralização de etiquetas e títulos de seção (`.section-tag`, *"💎 Nossa Herança Culinária"*, *"Mesa Exclusiva"*) no modo mobile — alinhamento simétrico com `margin: 0 auto`, tipografia caixa alta elegante, acabamento pill translúcido e harmonia visual com os títulos centrais.
- [x] **Passo 8.10**: Implementação global do efeito atmosférico de **Partículas Flutuantes e Poeira de Luz (Dust Particles & Bokeh Lights)** em todas as páginas (`index.html` e `admin.html`) — motor dual com fagulhas/embers douradas cintilantes e orbes bokeh desfocadas com oscilação senoidal suave, renderização em Canvas de alto desempenho (60 FPS), taxa adaptativa para mobile e suporte a tema claro e escuro.
- [x] **Passo 8.11**: Implementação de **Desfoque de Fundo Atmosférico (Backdrop Blur)** no painel administrativo mobile (`admin.html`) ao abrir a sidebar/menu lateral — inclusão de overlay escurecido com `backdrop-filter: blur(12px)`, filtro de blur no conteúdo principal (`.admin-main-wrapper`), botão de fechar dedicado no cabeçalho da sidebar e fechamento ao clicar no backdrop ou pressionar `Escape`.
- [x] **Passo 8.12**: Correção de enquadramento e quebra de texto na página de **Logística & Entregadores** (`#logisticsView`) no modo mobile — flex-wrap responsivo nos cartões de entregadores (`.driver-card`), regras de `overflow-wrap: break-word` em nomes e status, alinhamento automático de badges de status (`.badge-status-pill`), barra de ações superior com scroll horizontal touch-friendly (`.topbar-actions`) e contenção estrita contra vazamentos laterais no layout administrativo.
- [x] **Passo 8.13**: Correção e otimização visual responsiva na página de **Insumos & Matéria-Prima** (`#inventoryView`) no modo mobile — implementação de layout dual com cards móveis dedicados (`.inventory-mobile-cards`), eliminação total de truncamentos de texto, grid métrico de 2 colunas exibindo com clareza *Insumo*, *Categoria*, *Quantidade Atual*, *Estoque Mínimo*, *Status*, *Custo Unitário* e botão de ação, além de wrapper com rolagem horizontal suave (`.inventory-table-scroll`) para desktop e tablets.
- [x] **Passo 8.14**: Correção do balão de categorias do cardápio (`.menu-categories`) no modo mobile para exibição de **todos os pratos lado a lado** — eliminação da cápsula escura unificada e do truncamento do ícone de hambúrguer, estilização de cada categoria como um balão autônomo com acabamento glassmorphism (`.category-btn`), trilho de rolagem horizontal fluido de ponta a ponta (`width: 100vw`) com touch suave e textos 100% visíveis.
- [x] **Passo 8.15**: Eliminação definitiva da linha de corte lateral no vídeo/canvas da Hero (`#sequenceCanvas`) no modo mobile — recalibração da escala e deslocamento (`transform: translate(-68%, -50%) scale(1.62)` com `object-fit: cover`) para cobertura total de 100% da largura do card sem folgas, inclusão de vinheta interna suave (`.hero-bg-stage::after` com `box-shadow: inset 0 0 20px 4px rgba(9, 9, 11, 0.75)`) e enquadramento centralizado do portal de neon circular, hambúrguer, pizza e drink.
- [x] **Passo 8.16**: Correção e otimização dos ícones de ação na barra superior do Painel Administrativo (`.admin-topbar`) no modo mobile — implementação de rótulos responsivos inteligentes (`.action-text-full` vs `.action-text-mobile`: *Live*, *Som*, *Simular*, *Cardápio*), eliminação de truncamentos de texto (*Simu...*), enquadramento equilibrado de todos os 4 botões lado a lado (`justify-content: space-between`) e trilho seguro com rolagem suave.
- [x] **Passo 8.17**: Correção e enquadramento responsivo dos botões de filtro de pedidos e pagamentos no KDS (`.kds-filter-tabs`) no modo mobile — eliminação de quebra de linhas e parênteses isolados (`Todos / os / Pedidos ( 4 )`), criação de badges estilizados para contadores (`.filter-count-badge`), rótulos duplos adaptativos (`.filter-label-full` para desktop vs `.filter-label-mobile` para mobile: *Todos*, *Pagos*, *Pendentes*) e distribuição uniforme lado a lado (`justify-content: space-between`).
- [x] **Passo 8.18**: Otimização responsiva integral da página de **Entregadores & Zonas de Entrega** (`#logisticsView`) no modo mobile — unificação do grid em coluna única (`.logistics-dashboard-grid`), criação de cards dedicados para Zonas e Taxas de Entrega (`.zone-card-mobile`) com grid de 3 métricas (*Raio*, *Tempo* e *Taxa em destaque*), aprimoramento dos cartões de motoboys (`.driver-card`) com alinhamento perfeito de status e modelo de moto, além de modal interativo para cadastro de novos entregadores (`#newDriverModal`).
- [x] **Passo 8.19**: Justificação à esquerda e alinhamento dos ícones e cartões de métricas da Hero Section (`.metric-card`, `.metric-badge`, `.metric-info`) no modo mobile — remoção da centralização forçada (`justify-content: flex-start; text-align: left`), padronização do padding e alinhamento do badge numérico com o texto descritivo.
- [x] **Passo 8.20**: Disposição dos botões de categorias do cardápio (`.menu-categories`) em **colunas de dois, um embaixo do outro** no modo mobile — transição de rolagem horizontal para grade fluida de 2 colunas (`grid-template-columns: repeat(2, 1fr)`), com *"Todos os Pratos"* ocupando largura total de destaque (`grid-column: 1 / -1`) e as 4 categorias organizadas em 2 pares perfeitamente alinhados (*Hambúrgueres* / *Pizzas Artesanais* e *Bebidas & Drinks* / *Sobremesas*).
- [x] **Passo 8.21**: Correção e enquadramento dos cartões de métricas da página de **Caixa & Auditoria de Pagamentos** (`.payments-summary-cards`, `.pay-sum-card`) no modo mobile — conversão para coluna única (`grid-template-columns: 1fr`), eliminando quebra de palavras e ícones isolados em títulos como *"Total Confirmado (Pago)"* e *"Total Pendente (A Receber)"*, com valores nítidos em destaque e inputs/filtros em largura total.
- [x] **Passo 8.22**: Integração total e fluida do vídeo/canvas 3D da Hero (`#sequenceCanvas`, `.hero-bg-stage`) adaptado às bordas completas da página — cobertura de ponta a ponta (`width: 100%; height: 100%; object-fit: cover`), eliminação de recortes rígidos no anel de neon, vinhetas atmosféricas contínuas para fusão suave com a navbar e seções subsequentes, e parallax calibrado em perspectiva sem deslocamento fora de quadro.
- [x] **Passo 8.23**: Centralização simétrica da grade de categorias do cardápio (`.menu-categories-wrapper`, `.menu-categories`) e ícones no modo mobile — calibração com `margin: 0 auto; justify-content: center; align-items: center; max-width: 420px`, alinhamento do texto e ícones perfeitamente centralizados em cada botão pill (`.category-btn`).
- [x] **Passo 8.24**: Ajuste de alinhamento e deslocamento à direita dos ícones de chevron nos links de navegação do rodapé (`.footer-links-list`, `.footer-link`, `.footer-link i`) no modo mobile — inclusão de recuo à esquerda (`padding-left: 0.85rem`), margem e espaçamento refinado (`margin-left: 0.5rem; gap: 0.75rem;`), eliminando o aspecto colado à borda e garantindo respiro e elegância no celular.
- [x] **Passo 8.25**: Deslocamento à esquerda dos elementos/ícones do vídeo 3D da Hero (`#sequenceCanvas`, `.hero-bg-stage`) no modo mobile — calibração do transform para `transform: translate(-73.5%, -50%) scale(1.60);`, posicionando o hambúrguer, drink, pizza e portal neon com equilíbrio à esquerda sem cortes e sem encostar na borda direita.
- [x] **Passo 8.26**: Reformulação responsiva do painel de **Auditoria de Pedidos e Pagamentos** (`#financialView`, `.payments-table`, `.payments-mobile-cards`) no modo mobile — eliminação de truncamentos de texto e números de telefone esmagados através de cards móveis dedicados (`.payment-card-mobile`) com cabeçalho de status, cliente, telefone clicável, valor total destacado, método, auditoria e botões de ação com toque suave, além de `min-width: 880px` e `white-space: nowrap` na tabela de desktop.
- [x] **Passo 8.27**: Correção e exibição integral dos textos na barra superior do Painel Administrativo (`.admin-topbar`, `.topbar-view-title`, `.topbar-view-sub`) no modo mobile — substituição de `white-space: nowrap` e `text-overflow: ellipsis` por quebra suave e tipografia fluida com `clamp()`, permitindo que títulos e subtítulos extensos (ex: *"Frente de Caixa & Cupons Promocionais"*) apareçam 100% legíveis sem cortes.
- [x] **Passo 8.28**: Reestruturação dos cartões de métricas e relatórios (`.analytics-cards-grid`, `.analytics-card`, `.kds-metrics-bar`) para disposição em **coluna única, um embaixo do outro** no modo mobile — eliminação de esmagamento vertical em indicadores como *"Ticket Médio por Pedido"*, *"Prato Campeão de Vendas (Royal Smash & Bacon)"* e *"Tempo Médio Total"*, com padding generoso e valores nítidos.
- [x] **Passo 8.29**: Ajuste de enquadramento e contenção de textos e botões dentro dos cards do KDS (`.kds-order-card`, `.card-payment-row`, `.card-actions-row`) no modo mobile — aplicação de `flex-wrap: wrap`, `box-sizing: border-box`, quebra segura de texto no método de pagamento (*"Dinheiro (Troco p/ R$ 150)"*), contenção do botão de confirmação e botão de avanço/impressão 100% contidos dentro do balão do pedido sem vazamento de bordas.
- [x] **Passo 8.30**: Vinculação do endereço físico do restaurante ao **Google Maps** e ao **Waze** com botões interativos dedicados (`.address-map-links`, `.map-app-btn`) no rodapé e na seção de reservas — inclusão de badges clicáveis com ícones oficiais e abertura direta no app de navegação.


