# 🍔 CONTEXTO DO PROJETO — RESHT GOURMET

## 1. Visão Geral
**RESHT** é uma plataforma web gastronômica premium para fast food e alta culinária artesanal. O projeto destaca-se por um visual *Dark Charcoal Gourmet* moderno com iluminação atmosférica avermelhada, efeitos em *glassmorphism*, microinterações suaves e uma **animação 3D interativa de alta performance em Canvas (60 FPS)** exibindo os pratos principais em rotação contínua e imersiva.

---

## 2. Identidade Visual & Design System
- **Tema Base**: Dark Charcoal (`#09090b` / `#141416`).
- **Acentos Vibrantes**: Coral Flame & Crimson Glow (`#f23d4c`, `#ff655b`, `#ff7e40`).
- **Tipografia**: 
  - Títulos: *Outfit* (Sans-serif geométrica de alto impacto).
  - Textos/Interface: *Plus Jakarta Sans* (Legibilidade refinada).
- **Estilo**: Glassmorphism translúcido com desfoque de fundo (*backdrop-filter: blur*), bordas neon sutis e sombras profundas.
- **Idioma**: Português do Brasil (pt-BR).

---

## 3. Arquitetura Técnica
- **Frontend Core**: HTML5 Semântico, CSS3 Moderno (Variáveis Customizadas, Grid, Flexbox, Animações) e Vanilla JavaScript puro (ES6+).
- **Motor de Renderização Gráfica**: HTML5 Canvas para reprodução fluida de sequência de 100 frames (`.jpg`) em Full HD (1920×1080) a 30-60 FPS com pré-carregamento assíncrono.
- **Interatividade & Perspectiva**:
  - Rotação contínua automática.
  - Efeito Parallax 3D responsivo à movimentação do cursor.
  - Arraste manual / controle tátil (Touch e Mouse Drag).
- **Painel Administrativo Integrado**:
  - Módulo de **Perfil de Usuário**: Edição de dados pessoais (Nome, E-mail, Telefone, Avatar, Senha).
  - Módulo de **Gestão de Usuários**: CRUD completo (Criar, Listar, Editar, Deletar) com controle de papéis (*Admin* / *Usuário Comum*).
  - Persistência em `localStorage` para manter os dados salvos entre sessões.
- **Cardápio Interativo & Experiência Gastronômica**:
  - Catálogo de pratos com filtragem em tempo real por categoria (Hambúrgueres, Pizzas, Bebidas, Sobremesas).
  - Modal de personalização com adicionais de alta gastronomia, observações e cálculo de valores em tempo real.
  - Sistema de favoritos e sincronização com o contador dinâmico da Navbar.
- **Carrinho de Compras & Checkout WhatsApp**:
  - Drawer lateral interativo com itens selecionados, adicionais e controle de quantidades.
  - Barra de progresso para meta de Frete Grátis acima de R$ 80,00.
  - Modal de finalização de pedido com suporte a Pix (cópia de chave com um clique), Cartão e Dinheiro com troco.
  - Geração de mensagem formatada para WhatsApp do restaurante e modal de confirmação de pedido.
- **Seções Institucionais & Experiência Presencial**:
  - **Sobre Nós**: História da marca, valores, pilares de fogo vivo e ingredientes DOP, com vitrine do espaço gastronômico.
  - **Nossos Chefs**: Apresentação da equipe de mestres com pratos de assinatura e histórico.
  - **Reserva de Mesas VIP**: Formulário com seleção de ambientes, datas, horários e integração direta com WhatsApp.
- **Rodapé & SEO**:
  - Rodapé completo com links rápidos, redes sociais, horários, endereço nobre nos Jardins com links diretos de navegação GPS para **Google Maps** e **Waze** (`.address-map-links`, `.map-app-btn`), e formulário de inscrição no Clube VIP.
  - Schema.org JSON-LD para indexação de Restaurante de Alta Gastronomia e metatags Open Graph.
- **Backoffice Central & KDS Live Food Service Suite**:
  - Aplicação dedicada (`admin.html`) para gestão operacional completa: KDS em tempo real com áudio nativo, emissão de comanda térmica 80mm, CMS de cardápio com pausa instantânea, logística de motoboys, estoque de insumos e frente de caixa.
  - **Módulo de Controle e Confirmação de Pagamentos**: Acompanhamento de pedidos pagos (`PAID`) e pendentes (`PENDING`), botão de confirmação instantânea de recebimento pelo administrador com registro de operador e data/hora, filtros dedicados no KDS e painel de auditoria financeira com taxa de liquidação.
  - Modelagem Relacional de Dados de nível de produção (`SCHEMA.md`) com Prisma ORM e DDL PostgreSQL.
- **Efeito Atmosférico Global de Partículas & Luzes Bokeh**:
  - Motor de partículas de alta performance em Canvas integrado a todas as páginas (`index.html` e `admin.html`).
  - Combinação dinâmica de fagulhas/poeira de luz cintilante (72%) e orbes bokeh desfocadas (28%) com flutuação senoidal suave em tons gourmet (coral, âmbar e ouro).
  - Densidade adaptativa com 60 FPS estáveis tanto no desktop quanto em dispositivos móveis sem sobrecarga de renderização.
- **Experiência Mobile First & Enquadramento**:
  - **Integração Total do Vídeo da Hero & Deslocamento Equilibrado à Esquerda no Mobile**: Enquadramento fluido do Canvas 3D cobrindo 100% da viewport de ponta a ponta (`width: 100%; height: 100%; object-fit: cover`) no desktop, e calibração fina no mobile (`transform: translate(-73.5%, -50%) scale(1.60)`), posicionando o anel de neon, hambúrguer, pizza e drink com equilíbrio à esquerda dentro do card, sem encostar na borda direita e com vinhetas atmosféricas contínuas integradas ao fundo.
  - **Barra Superior & Botões de Ação de Alta Visibilidade**: Contraste cristalino em todos os botões (`.action-btn` e `.mobile-menu-btn`), com bordas iluminadas, sombras com profundidade, ícones vívidos (tema com glow amarelo, sacola com badge vibrante, avatar em degradê e barras do menu com iluminação) para identificação e toque sem esforço.
  - **Grade de Categorias do Cardápio Centralizada em 2 Colunas no Mobile (`.menu-categories-wrapper`, `.menu-categories`)**: Organização das categorias do cardápio em grade de duas colunas (`grid-template-columns: repeat(2, 1fr)`) perfeitamente centralizada na tela (`max-width: 420px; margin: 0 auto; justify-content: center; align-items: center;`), com *"Todos os Pratos"* centralizado em destaque (`grid-column: 1 / -1`) e as 4 opções culinárias (*Hambúrgueres*, *Pizzas Artesanais*, *Bebidas & Drinks*, *Sobremesas*) distribuídas em dois pares harmônicos com ícones e textos centralizados em cada botão (`justify-content: center; text-align: center;`), garantindo harmonia estética e toque ágil sem rolagem lateral.
  - **Centralização de Etiquetas de Seção (`.section-tag`)**: Estilização de badges (*"💎 Nossa Herança Culinária"*, *"Mestres do Sabor"*, *"Mesa Exclusiva"*) com alinhamento centralizado simétrico no mobile (`margin: 0 auto 0.85rem auto`).
  - **Padronização de Formulários e Dropdowns Mobile**: Eliminação de cortes e truncamentos nos textos de seletores (`select`) através de remoção de setas nativas conflitantes, ícone chevron SVG customizado com respiro lateral (`padding-right: 2.25rem`), rótulos concisos e layout fluído para botões de submissão sem quebra deformada.
  - **Enquadramento do Painel Administrativo Mobile (`#adminModal`)**: Centralização perfeita em tela cheia suave (`width: 96%`, `max-height: 94vh`), cabeçalho adaptativo sem overflow dos botões de ação e fechar, abas horizontais e tabela de usuários protegida com rolagem lateral sem deformar o modal.
  - **Efeito de Desfoque de Fundo no Menu Lateral do Backoffice (`admin.html`)**: Backdrop translúcido com `backdrop-filter: blur(12px)` e escurecimento, com desfoque suplementar na área de conteúdo (`filter: blur(6px)`), bloqueio de scroll do body, botão de fechar no topo e suporte a fechamento por clique fora ou tecla `Escape`.
  - **Enquadramento Mobile da Gestão de Entregadores & Zonas de Entrega (`#logisticsView`)**: Grid responsivo em coluna única (`.logistics-dashboard-grid`), novos cartões de motoboys (`.driver-card`) com alinhamento perfeito de status, nome, total de entregas e modelo de moto, além de cartões móveis dedicados para Zonas e Taxas de Entrega (`.zone-card-mobile`) com 3 métricas claras (*Raio*, *Tempo*, *Taxa em destaque*) e modal para cadastro rápido de entregadores (`#newDriverModal`).
  - **Otimização dos Filtros de Pedidos e Pagamentos no KDS Mobile (`.kds-filter-tabs`)**: Correção de quebra vertical de texto e parênteses soltos através de rótulos duplos (*Todos*, *Pagos*, *Pendentes* no mobile) e contadores encapsulados em badges pill (`.filter-count-badge`), com alinhamento perfeito de todos os botões lado a lado.
  - **Enquadramento Mobile das Métricas de Caixa & Auditoria (`.payments-summary-cards`)**: Reestruturação dos cartões de métricas para coluna única no celular, garantindo alinhamento linear dos ícones e títulos (*Total Confirmado*, *Total Pendente*, *Taxa de Liquidação*) sem quebras verticais indevidas.
  - **Justificação à Esquerda das Métricas da Hero Section (`.metric-card`)**: Alinhamento à esquerda dos badges numéricos (1, 2, 3) e títulos/legendas nos cartões estatísticos da Hero no modo mobile, garantindo ritmo visual fluido e simétrico.
  - **Apresentação Mobile de Insumos & Matéria-Prima (`#inventoryView`)**: Eliminação de esmagamento e truncamento da tabela de estoque em telas móveis através de cartões responsivos dedicados (`.inventory-mobile-cards`), com grid de informações completas (*Quantidade*, *Mínimo*, *Custo*, *Categoria*, *Status* e botão de ajuste).
  - **Recuo e Deslocamento à Direita dos Ícones de Navegação do Rodapé (`.footer-links-list`, `.footer-link`, `.footer-link i`)**: Aplicação de recuo à esquerda (`padding-left: 0.85rem`), espaçamento `gap: 0.75rem` e margem nos ícones de chevron (`margin-left: 0.5rem; margin-right: 0.25rem;`) no modo mobile, eliminando a sensação de ícones colados na borda lateral esquerda e conferindo leitura harmoniosa.
  - **Cards Responsivos de Auditoria de Pagamentos no Mobile (`#financialView`, `.payments-mobile-cards`)**: Eliminação de truncamento e esmagamento de textos na tabela financeira no celular através de cartões móveis completos com ID, horário, status pill, dados do cliente com telefone clicável, valor em destaque, método e botões de ação tátil.
  - **Exibição Integral de Textos na Barra Superior do Backoffice (`.admin-topbar`, `.topbar-view-title`, `.topbar-view-sub`)**: Eliminação de reticências e cortes nos títulos (*"Frente de Caixa & Cupons Promocionais"*, *"KDS & Gestão de Pedidos em Tempo Real"*) com tipografia fluida e quebra suave em telas móveis.
  - **Cards de Métricas e Relatórios em Coluna Única no Mobile (`.analytics-cards-grid`, `.analytics-card`)**: Disposição dos indicadores de desempenho (*Ticket Médio*, *Prato Campeão de Vendas*, *Tempo Médio Total*) um embaixo do outro no celular, garantindo legibilidade perfeita e acabamento espaçoso.
  - **Contenção e Enquadramento dos Cards do KDS (`.kds-order-card`, `.card-payment-row`, `.card-actions-row`)**: Quebra flexível e dimensionamento seguro que mantém o método de pagamento, botão de confirmação, botão de despacho e impressão 100% contidos dentro do balão do pedido no mobile.
  - Enquadramento seguro e tipografia responsiva com `clamp()` em todos os textos, cartões e modais.
  - Menu hambúrguer de alta visibilidade e drawer de navegação lateral com backdrop com desfoque de fundo.

---

## 4. Estrutura de Diretórios
```text
projeto fastfood/
├── .agents/
│   └── rules/
│       └── project_rules.md       # Regras automáticas do assistente
├── Floating_food_animation.../     # 100 frames da animação 3D (000 a 099.jpg)
├── AGENTS.md                      # Regras de fluxo e persistência de memória
├── CONTEXTO.md                    # Este arquivo de contexto do projeto
├── DOCUMENTACAO.md                # Documentação técnica e guia de desenvolvimento
├── PASSOS.md                      # Lista de passos ordenados por prioridade
├── index.html                     # Estrutura HTML da landing page e painel admin
├── style.css                      # Estilos globais, temas e componentes
└── script.js                      # Motor interativo, canvas, admin e eventos
```

---

## 5. Diretrizes de Continuidade
- Toda nova alteração, feature ou correção deve ser registrada em `CONTEXTO.md`, `DOCUMENTACAO.md` e marcada em `PASSOS.md`.
- Cada entrega deve incluir uma mensagem sugerida de commit em formato padronizado (*Conventional Commits*).
