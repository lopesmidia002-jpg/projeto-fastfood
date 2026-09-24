# 📖 DOCUMENTAÇÃO TÉCNICA — RESHT GOURMET

## 1. Visão Geral da Arquitetura

O **RESHT** foi construído utilizando tecnologias nativas da web com foco em ultra performance, sem dependências pesadas, garantindo tempo de carregamento instantâneo, compatibilidade entre navegadores e suporte completo a telas responsivas.

---

## 2. Componentes da Interface

### 2.1 Header / Navbar (`#navbar`)
- **Logo**: Ícone em degradê com efeito de pulsar contínuo e tipografia `Outfit`.
- **Navegação Principal**: Links dinâmicos com indicador visual no hover e estado ativo.
- **Barra de Ações (Alta Visibilidade)**:
  - `.action-btn` & `.mobile-menu-btn`: Botões com glassmorphism translúcido iluminado (`background: rgba(255, 255, 255, 0.1)`, `border: 1px solid rgba(255, 255, 255, 0.22)`, sombras de profundidade e contraste marcante).
  - `searchBtn`: Abertura de busca rápida com feedback em Toast.
  - `themeToggle`: Alternador suave entre Tema Escuro e Claro com ícone solar/lunar em tom âmbar e efeito *drop-shadow* de luminosidade.
  - `favBadge`: Contador dinâmico de pratos favoritos.
  - `cartBadge`: Contador interativo do carrinho de compras com badge coral com borda destacada e sombra viva.
  - `profileBtn`: Botão com avatar em degradê e anel iluminado para acesso ao Painel Admin.
  - `mobileMenuBtn`: Botão com 3 barras brancas em relevo e iluminação para acionamento imediato do menu gaveta (*Drawer*).

### 2.2 Hero Section com Vídeo de Fundo em Canvas (`#home`)
- **Estágio de Fundo & Showcase 3D (`#heroBgStage`)**:
  - **Desktop**: `#sequenceCanvas` 1920×1080 com redimensionamento fluido integrado de ponta a ponta (`width: 100%`, `height: 100%`, `object-fit: cover`), preenchendo 100% da viewport e adaptando-se às bordas completas da tela com vinhetas atmosféricas contínuas e fusão natural com a navbar e seções seguintes.
  - **Mobile**: `#sequenceCanvas` perfeitamente calibrado no ponto focal do portal 3D (`transform: translate(-73.5%, -50%) scale(1.60)` com `object-fit: cover`), com vinheta interna difusa (`.hero-bg-stage::after`), posicionando harmoniosamente o hambúrguer, drink, pizza e anel de neon com deslocamento à esquerda e eliminando qualquer proximidade excessiva da borda direita.
  - Vinhetas atmosféricas (`.hero-vignette-left`, `.hero-vignette-bottom`, `.hero-vignette-radial`) que garantem contraste e legibilidade impecáveis no desktop.
- **Conteúdo Principal**:
  - Pill com selo de ingredientes 100% orgânicos.
  - Headline H1 com destaque em degradê coral na palavra *Autêntico*.
  - Botões de Ação (*Pedir Agora* com reflexo shine e *Reservar Mesa* com borda translúcida).
  - Métricas de clientes satisfeitos, tempo de entrega e selo 100% artesanal.

### 2.3 Painel Administrativo / Modal Admin (`#adminModal`)
- **Modal Responsivo Glassmorphism**: Interface moderna para gestão completa da plataforma.
- **Aba "Meu Perfil"**:
  - Exibição de Avatar com upload / preview.
  - Edição de Nome Completo, E-mail, Telefone e Cargo.
  - Alteração de Senha com confirmação de segurança.
  - Salva dados automaticamente no `localStorage`.
- **Aba "Gestão de Usuários"**:
  - Tabela responsiva com listagem de todos os usuários.
  - Badges visuais diferenciando **Administrador** (vermelho/coral) e **Usuário Comum** (cinza/azul).
  - Formulário para cadastrar novos usuários (Nome, E-mail, Função/Papel, Senha).
  - Edição de dados e exclusão de usuários existentes com confirmação.
  - Persistência contínua no `localStorage`.

### 2.4 Seção de Cardápio Interativo & Modal de Personalização (`#menu`, `#dishModal`)
- **Filtro de Categorias Dinâmico**: Alternância instantânea entre *Todos*, *Hambúrgueres*, *Pizzas*, *Bebidas* e *Sobremesas*.
- **Cards Gastronômicos**:
  - Fotos de estúdio em alta definição com efeito de zoom suave no hover.
  - Badges de categoria (*Mais Pedido*, *Chef Choice*, *Ouro 24k*, *100% Angus*).
  - Botão de favoritar interativo com sincronização no badge da Navbar.
  - Botão de adicionar ao pedido com abertura de modal de personalização.
### 2.5 Carrinho de Compras Drawer & Checkout WhatsApp (`#cartDrawer`, `#checkoutModal`)
- **Drawer do Carrinho (`#cartDrawer`)**:
  - Acesso pelo botão de sacola na Navbar e sincronização de badge em tempo real.
  - Listagem dos pratos adicionados com foto, título, adicionais e observações.
  - Controles de quantidade (`+` e `-`) e botão de exclusão individual com confirmação via toast.
  - Barra de progresso de **Frete Grátis**: Meta dinâmica de R$ 80,00 com indicação visual de porcentagem e valor restante.
  - Estado vazio estilizado com botão direto para retornar e explorar o cardápio.
  - Resumo financeiro com Subtotal, Taxa de Entrega (R$ 7,90 ou Grátis) e Total.
- **Modal de Checkout Rápido (`#checkoutModal`)**:
  - Dados do cliente: Nome completo, WhatsApp/Telefone, Endereço completo, Bairro e Complemento.
  - Seleção de Forma de Pagamento com abas interativas (Pix, Cartão, Dinheiro com troco).
  - Envio automático com mensagem estruturada diretamente para a API do **WhatsApp** institucional.
  - Modal de Confirmação e Sucesso (`#orderSuccessModal`) com geração de código `#RST-XXXX` e status "Na Cozinha".

### 2.6 Seções Institucionais, Chefs & Reserva (`#about`, `#chefs`, `#reservation`)
- **Seção Sobre Nós (`#about`)**:
  - Vitrine fotográfica do restaurante com cards flutuantes de estatísticas (3x Melhor Burger SP, 300+ Rótulos na Adega).
  - Narrativa da marca combinando parrilla ancestral e alta gastronomia.
  - 3 Pilares técnicos: *Parrilla a Fogo Vivo*, *Ingredientes 100% Puros* e *Mixologia Sensorial*.
  - Assinatura oficial do Chef Executivo.
- **Seção Nossos Chefs (`#chefs`)**:
  - Grid com 3 cartões de mestres gastronômicos (Chef Executivo Alex Laurent, Chef Pizzaiola Giulia Rossi e Chef Pâtissier Leonardo Vance).
  - Fotos de estúdio, biografia, redes sociais e pratos assinados em destaque.
- **Seção Reserva de Mesas (`#reservation`)**:
  - Painel de reserva com informações de horários, endereço nobre e concierge VIP.
  - Formulário completo: Nome, WhatsApp, Data, Horário, Quantidade de convidados, Ambiente preferido, Ocasião especial e Observações.
  - Envio automatizado e estruturado diretamente para o WhatsApp institucional com notificação Toast.

### 2.7 Rodapé Moderno & Otimizações SEO (`#contact`, Schema JSON-LD)
- **Rodapé Responsivo (`#contact`)**:
  - 4 Colunas temáticas: Marca & Redes Sociais, Navegação Rápida com microinterações de hover, Horários de Funcionamento detalhados e Formulário de Newsletter para o Clube VIP.
  - Barra inferior com créditos e botão "Voltar ao Topo" com rolagem suave (`scroll-behavior: smooth`).
- **SEO & Performance**:
  - Metatags completas de Open Graph (Facebook/WhatsApp) e Twitter Card.
  - Marcação de dados estruturados JSON-LD Schema.org tipo `Restaurant` para motores de busca.
  - Otimizações de acessibilidade com tags ARIA e contraste adequado.

### 2.8 Backoffice Central & KDS Live Suite (`admin.html`, `admin.css`, `admin.js`)
- **Live KDS (Kitchen Display System)**:
  - Kanban com 5 colunas operacionais: *Recebido*, *Na Cozinha/Grelha*, *Pronto/Expedição*, *Saiu para Entrega* e *Finalizados*.
  - **Controle de Pagamentos no KDS**: Linha dedicada de status de pagamento em cada comanda (🟢 *PAGO* / 🟡 *PENDENTE*), botão interativo com 1 clique para confirmação de pagamento pelo operador e filtro rápido de visualização (*Todos*, *Pagos*, *Aguardando Pagamento* / *Todos*, *Pagos*, *Pendentes* no mobile com badges dedicados `.filter-count-badge`).
  - Sintetizador de alerta sonoro nativo via Web Audio API e indicador de conexão WebSocket Live.
  - Cronômetro de preparo em cada comanda com transição visual de cores (Verde: <15m, Amarelo: 15-25m, Vermelho: >25m).
  - Emissor de comanda térmica 80mm com simulação realista e indicação de status do pagamento (`[CONFIRMADO / PAGO]` ou `[PENDENTE NA ENTREGA]`).
  - Ferramenta de simulação de pedidos em tempo real com métodos e estados de pagamento automáticos.
- **Gestão de Cardápio (Menu CMS)**:
  - Toggles de pausa instantânea de venda por item esgotado.
  - Categorização dinâmica e suporte a modificadores e adicionais obrigatórios/opcionais.
- **Logística & Gestão de Entregadores**:
  - Acompanhamento de status de motoboys e tabela de zonas de entrega por quilometragem.
- **Estoque & Insumos**:
  - Relação de matéria-prima, controle de estoque mínimo e alertas de estado crítico.
- **Frente de Caixa & Auditoria de Pagamentos**:
  - **Tabela de Auditoria em Tempo Real**: Listagem detalhada de todos os pedidos com busca instantânea por cliente/código, filtro por status, confirmação/reversão de pagamento e auditoria com registro de operador e timestamp.
  - Métricas de faturamento liquidado (Total Pago), a liquidar (Total Pendente), taxa de liquidação (%) e distribuição por métodos (Pix, Cartão, Dinheiro).
  - Painel de controle de cupons promocionais VIP.
- **Controle de Acesso por Papéis (RBAC)**:
  - Seletor de perfis: *Super Admin*, *Gerente de Turno*, *Caixa/Atendente* e *Cozinha (KDS)*.

---
- **Responsividade & Enquadramento Mobile**:
  - **Calibração Simétrica da Hero Section & Eliminação de Cortes**: Enquadramento matemático do Canvas no ponto focal (`transform: translate(-73.5%, -50%) scale(1.60)` com `object-fit: cover` e vinheta interna difusa), posicionando os elementos do vídeo (portal neon circular, hambúrguer, pizza e drink) com equilíbrio mais à esquerda, sem linhas de corte e sem encostar na borda direita do card.
  - **Espaçamento e Ritmo Vertical**: Padding do hero ajustado para `5.75rem` no mobile garantindo distância harmônica da navbar fixa, com margens simétricas nos títulos, badge, botões e cards de métricas.
  - **Isolamento de Parallax em Telas Móveis**: O evento de `mousemove` e transform inline via JavaScript é desativado em telas menores (`<= 960px`), preservando o CSS responsivo calibrado.
  - **Grade de Categorias do Cardápio Centralizada em 2 Colunas no Mobile (`.menu-categories-wrapper`, `.menu-categories`)**: Disposição dos botões de categorias em colunas de dois (`grid-template-columns: repeat(2, 1fr)`), centralizada simetricamente no meio da tela (`max-width: 420px; margin: 0 auto; justify-content: center; align-items: center`), com *"Todos os Pratos"* ocupando largura total (`grid-column: 1 / -1`) e as 4 categorias culinárias organizadas em dois pares perfeitamente centrados com ícones e rótulos centralizados (`justify-content: center; text-align: center`), eliminando desalinhamentos e facilitando o toque em dispositivos móveis.
  - **Centralização de Etiquetas de Seção (`.section-tag`)**: Estilização tipo pill para tags de cabeçalho (*"💎 Nossa Herança Culinária"*, *"Mestres do Sabor"*, *"Mesa Exclusiva"*), alinhadas simetricamente ao centro no mobile (`margin: 0 auto 0.85rem auto`).
  - Tipografia fluida com `clamp()` e regras de quebra segura (`overflow-wrap: break-word`, `max-width: 100vw`) em todos os títulos, descrições, modais e rodapé para garantir enquadramento sem vazamentos laterais.
  - **Menu Hambúrguer & Drawer Mobile**: Botão hambúrguer com visibilidade prioritária no navbar (`display: flex !important`, `z-index: 110`), gaveta lateral com profundidade (`z-index: 10030`), links rápidos e backdrop translúcido.
  - **Padronização de Textos e Formulários em Mobile**: Inputs e seletores `<select>` com ícone chevron customizado via SVG, `appearance: none`, `padding-right: 2.25rem` garantindo que opções extensas nunca fiquem truncadas ou colidam com a seta suspensa, botões com quebra suave e sem textos estrangulados.
  - **Enquadramento do Painel Administrativo Mobile (`#adminModal`)**: Layout flexível com `width: 96%`, `max-height: 94vh`, cabeçalho responsivo que previne extravasamento de botões de fechamento e atalho KDS, navegação por abas horizontais e tabela de usuários com rolagem tátil dedicada (`overflow-x: auto`).
  - **Backdrop com Desfoque de Fundo na Sidebar do Backoffice (`.sidebar-backdrop`)**: No modo mobile (`<= 1080px`) da aplicação administrativa (`admin.html`), ao abrir o menu lateral, é acionado um backdrop translúcido com `backdrop-filter: blur(12px)` e escurecimento, aplicando também `filter: blur(6px)` sobre a área de conteúdo (`.admin-main-wrapper`), bloqueando a rolagem do fundo (`body.admin-sidebar-open`) e permitindo fechar o menu com 1 clique no backdrop, no botão de fechar (`#sidebarCloseBtn`), nas opções de menu ou pela tecla `Escape`.
  - **Enquadramento e Flex-Wrap na Aba de Entregadores & Barra de Ações do Backoffice (`admin.html`)**: Cartões de entregadores (`.driver-card`) com quebra fluida (`flex-wrap: wrap`), alinhamento de status, nome, entregas diárias e modelo de moto. Barra de ações superior (`.topbar-actions`) com alternância de rótulos responsivos (`.action-text-full` no desktop vs `.action-text-mobile` no celular: *Live*, *Som*, *Simular*, *Cardápio*), permitindo que todos os 4 botões e indicadores fiquem perfeitamente alinhados lado a lado sem truncamentos (`Simu...`) nem vazamentos de tela.
  - **Cards Responsivos de Zonas e Taxas de Entrega no Mobile (`#logisticsView`)**: Grid responsivo em coluna única (`.logistics-dashboard-grid`), com conversão da tabela de zonas em cards móveis modernos (`.zone-card-mobile`) contendo ícone de localização, nome do bairro/região, badge de status e grade de 3 métricas claras (*Raio Máx.*, *Tempo Médio* e *Taxa Cobrada* em verde esmeralda destacado), além de modal completo para cadastro rápido de novos entregadores (`#newDriverModal`).
  - **Enquadramento Mobile das Métricas de Caixa & Auditoria (`.payments-summary-cards`, `.pay-sum-card`)**: Grid responsivo em coluna única (`grid-template-columns: 1fr`) em telas móveis, garantindo que os cartões de *Total Confirmado (Pago)*, *Total Pendente (A Receber)* e *Taxa de Liquidação* exibam seus ícones e rótulos em uma única linha contínua sem quebras estranhas, com valores monetários e contagens perfeitamente legíveis.
  - **Cards Responsivos de Insumos & Matéria-Prima no Mobile (`#inventoryView`)**: Transformação da visualização em tabela densa para cartões móveis dedicados (`.inventory-mobile-cards`) em telas `<= 768px`, contendo ícone temático, nome completo sem esmagamento, badge de categoria, status pill colorido, grade métrica 2×2 (*Quantidade Atual*, *Estoque Mínimo*, *Custo Unitário*) e botão de ação rápido (*Ajustar Estoque*).
  - **Recuo e Deslocamento à Direita dos Ícones de Navegação do Rodapé (`.footer-links-list`, `.footer-link`, `.footer-link i`)**: Aplicação de recuo à esquerda (`padding-left: 0.85rem`), espaçamento `gap: 0.75rem` e margem dedicada nos ícones (`margin-left: 0.5rem; margin-right: 0.25rem;`) no modo mobile, eliminando a sensação de ícones colados na borda lateral esquerda e conferindo leitura harmoniosa.
  - **Cards Responsivos de Auditoria de Pagamentos no Mobile (`#financialView`, `.payments-mobile-cards`, `.payment-card-mobile`)**: Transformação da tabela de auditoria de caixa em cartões móveis autônomos em telas `<= 768px`, contendo cabeçalho com ID do pedido e horário, badge de status de pagamento (`🟢 PAGO` / `🟡 PENDENTE`), dados de cliente com link direto de telefone, valor total em destaque em verde esmeralda, grid 2×2 de metadados (*Método de Pagamento* e *Operador/Timestamp*) e botões de ação com toque amplo (*Confirmar Pagamento*, *Reverter Status* e *Ver Comanda*), eliminando 100% dos esmagamentos e truncamentos de texto.
  - **Exibição Integral dos Títulos e Subtítulos na Barra Superior Mobile (`.admin-topbar`, `.topbar-view-title`, `.topbar-view-sub`)**: Remoção de truncamentos de texto por reticências (`text-overflow: ellipsis`) e aplicação de quebra natural (`white-space: normal`, `overflow-wrap: break-word`) e tipografia fluida com `clamp()`, garantindo que nomes de telas extensos (como *"Frente de Caixa & Cupons Promocionais"*) e suas descrições apareçam 100% legíveis e completos.
  - **Cards de Métricas e Relatórios em Coluna Única no Mobile (`.analytics-cards-grid`, `.analytics-card`, `.kds-metrics-bar`)**: Reestruturação do grid de relatórios operacionais para coluna única (`grid-template-columns: 1fr`), posicionando os cards de *Ticket Médio*, *Prato Campeão de Vendas* e *Tempo Médio Total* um embaixo do outro com padding amplo e tipografia fluida, eliminando a compressão lateral em telas móveis.
  - **Enquadramento e Contenção Segura nos Cards do KDS (`.kds-order-card`, `.card-payment-row`, `.card-actions-row`)**: Aplicação de `box-sizing: border-box`, `flex-wrap: wrap` e quebra de texto fluida na linha de status de pagamento (*"Dinheiro (Troco p/ R$ 150)"*), garantindo que o botão de confirmação e as ações de despacho (*"Despachar Motoboy"*) e impressão fiquem 100% contidos no balão do pedido sem transbordamentos ou cortes nas bordas no mobile.
  - **Links Diretos de Geolocalização & Navegação (`.address-map-links`, `.map-app-btn`)**: Integração do endereço físico (*"Alameda dos Sabores, 1420 — Jardins, SP"*) com botões de acesso direto ao **Google Maps** (`maps.google.com`) e ao **Waze** (`waze.com/ul?navigate=yes`) na seção de reservas e no rodapé, permitindo abrir rotas instantâneas em qualquer dispositivo.

---

## 3. Motor JavaScript (`script.js`)

### 3.1 Gerenciador de Frames da Animação
```javascript
// Carregamento assíncrono com barra de progresso no loader
function preloadImages() { ... }

// Renderização instantânea no canvas com proporção Full HD
function drawFrame(index) { ... }

// Loop a 30-60 FPS sincronizado via requestAnimationFrame
function animationLoop(timestamp) { ... }
```

### 3.2 Interatividade e Parallax 3D
- Movimentação do mouse na seção Hero calcula as coordenadas relativas e aplica um sutil ângulo de perspectiva 3D no Canvas de fundo.
- Eventos de `mousedown`, `mousemove` e `touchstart`/`touchmove` permitem arrastar para girar os alimentos manualmente em 360°.

### 3.3 Sistema de Notificações Toast (`showToast`)
- Fornece feedback instantâneo para todas as ações do usuário (salvar perfil, adicionar item, excluir usuário, alternar tema, etc.).

### 3.4 Motor Global de Partículas Flutuantes & Luzes Bokeh (`initAmbientParticles`)
- **Canvas Overlay de Baixo Custo (`#ambientParticlesCanvas`)**: Canvas fixo em tela inteira (`pointer-events: none`, `z-index: 2` em páginas públicas e `z-index: 1` no Backoffice), sem bloquear cliques nem gerar layout thrashing.
- **Estrutura Dual de Partículas**:
  - **Poeira Gourmet & Embers (72%)**: Fagulhas cintilantes com núcleo brilhante branco/dourado e halo translúcido difuso (raio 1.0px a 3.2px, halo 3.5x), ascensão vertical e pulso senoidal de opacidade.
  - **Luzes Bokeh Desfocadas (28%)**: Círculos amplos e suaves de luz difusa com gradiente radial (raio 6px a 20px), flutuação lenta e oscilação orgânica no eixo X.
- **Paleta de Iluminação Quente**: Tons selecionados de Brasa Coral (`#f23d4c`), Âmbar Dourado (`#ffb432`), Laranja Incandescente (`#ff7e40`), Luz Estelar Quente (`#ffebe0`) e Carmesim (`#ff655b`).
- **Otimização e Escalabilidade Mobile**: Densidade adaptativa com 65 partículas no Desktop e 28 partículas em dispositivos móveis (`window.innerWidth < 768px`), garantindo 60 FPS contínuos e zero aquecimento de CPU/bateria.

### 3.5 Links Diretos de Geolocalização & Navegação (`.address-map-links`, `.map-app-btn`)
- **Integração com Google Maps e Waze**: Botões táteis estilizados com as cores oficiais de cada plataforma (`#4285f4` para Google Maps e `#33ccff` para Waze), ícones dedicados Font Awesome (`fa-google`, `fa-waze`), efeito hover com elevação e iluminação neon.
- **Universal Links**:
  - Google Maps: `https://www.google.com/maps/search/?api=1&query=Alameda+dos+Sabores+1420+Jardins+Sao+Paulo+SP`
  - Waze: `https://waze.com/ul?q=Alameda%20dos%20Sabores%2C%201420%20Jardins%20S%C3%A3o%20Paulo%20SP&navigate=yes`
- **Acessibilidade & Mobile**: Abertura em nova aba (`target="_blank" rel="noopener noreferrer"`) e compatibilidade total para disparar o aplicativo nativo em smartphones Android e iOS.

---

## 4. Design Tokens & Paleta de Cores (`style.css`)

| Token | Valor | Descrição |
|---|---|---|
| `--bg-main` | `#09090b` | Fundo dark profundo correspondente aos frames |
| `--bg-card` | `rgba(22, 22, 26, 0.75)` | Fundo de cartões com glassmorphism |
| `--primary` | `#f23d4c` | Vermelho coral de destaque da marca |
| `--primary-gradient` | `linear-gradient(135deg, #ff5349, #eb2c3d, #d81b30)` | Gradiente de botões e destaques |
| `--text-primary` | `#ffffff` | Texto principal com alta legibilidade |
| `--text-secondary` | `#a3a3b2` | Texto auxiliar e subtítulos |

---

## 5. Como Executar e Testar

1. Inicie um servidor local HTTP no diretório do projeto:
   ```bash
   python -m http.server 3000
   ```
2. Abra seu navegador em **`http://localhost:3000`**.
3. Pressione **`Ctrl + F5`** para recarregar quaisquer alterações de cache.
