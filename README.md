<div align="center">

# 🍔 RESHT GOURMET

### Plataforma Web Gastronômica Premium para Fast Food & Alta Culinária Artesanal

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[🌐 Demo ao Vivo](#) · [📖 Documentação](DOCUMENTACAO.md) · [🗺️ Roadmap](PASSOS.md) · [🏗️ Schema](SCHEMA.md)

</div>

---

## ✨ Visão Geral

**RESHT Gourmet** é uma plataforma web gastronômica de alta performance, unindo a experiência de **fast food artesanal** com **alta culinária**, entregando um visual *Dark Charcoal Gourmet* imersivo com iluminação atmosférica avermelhada, efeitos glassmorphism e uma **animação 3D interativa em Canvas (60 FPS)** exibindo os pratos em rotação contínua.

> 💡 Projeto 100% Vanilla — sem frameworks, sem dependências de build. Apenas HTML, CSS e JavaScript puros.

---

## 🎬 Preview

<div align="center">

| Hero Section | Cardápio Interativo | Painel Administrativo |
|:---:|:---:|:---:|
| Animação 3D Canvas | Filtros em tempo real | KDS Live + Backoffice |

</div>

---

## 🚀 Funcionalidades

### 🛍️ Experiência do Cliente
- **Animação 3D interativa** em Canvas com 100 frames Full HD (1920×1080) a 60 FPS com parallax e arrastar manual
- **Cardápio interativo** com filtragem por categoria (Hambúrgueres, Pizzas, Bebidas, Sobremesas)
- **Modal de personalização** com adicionais gourmet e cálculo de valor em tempo real
- **Sistema de favoritos** sincronizado com contador dinâmico na Navbar
- **Carrinho lateral (drawer)** com barra de progresso para Frete Grátis acima de R$ 80,00
- **Checkout via WhatsApp** com suporte a Pix, Cartão e Dinheiro com troco
- **Reserva de Mesa VIP** com seleção de ambiente, data e horário direto via WhatsApp
- **Endereço vinculado ao Google Maps e Waze** para navegação direta

### 🏢 Backoffice & Operação (`admin.html`)
- **KDS em tempo real** com áudio nativo para novos pedidos
- **Emissão de Comanda Térmica** (80mm) pronta para impressão
- **CMS de Cardápio** com pausa instantânea de itens
- **Gestão de Motoboys & Zonas de Entrega** com taxas por área
- **Controle de Estoque** com alertas de nível crítico
- **Frente de Caixa** com gerador de Cupons Promocionais VIP
- **Módulo de Pagamentos** com confirmação com 1 clique e auditoria financeira
- **Analytics & Relatórios**: Ticket Médio, Prato Campeão, Tempo Médio de Preparo

### 🎨 Design System
- **Tema**: Dark Charcoal Gourmet (`#09090b` / `#141416`)
- **Acentos**: Coral Flame & Crimson Glow (`#f23d4c`, `#ff655b`, `#ff7e40`)
- **Tipografia**: *Outfit* (títulos) + *Plus Jakarta Sans* (interface)
- **Estilo**: Glassmorphism com backdrop-filter blur, bordas neon e sombras profundas
- **Partículas**: Motor dual com fagulhas/embers douradas e orbes bokeh a 60 FPS

---

## 🐳 Rodando com Docker (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/projeto-fastfood.git
cd projeto-fastfood

# Build e iniciar o container
docker compose up -d --build

# Acesse em:
# → http://localhost        (porta 80)
# → http://localhost:8080   (porta alternativa)
```

**Parar o container:**
```bash
docker compose down
```

**Ver logs em tempo real:**
```bash
docker compose logs -f
```

---

## 💻 Rodando Localmente (sem Docker)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/projeto-fastfood.git
cd projeto-fastfood

# Iniciar servidor Python (ou qualquer servidor HTTP estático)
python -m http.server 3000

# Acesse em:
# → http://localhost:3000
```

> ⚠️ **Atenção**: Abrir o `index.html` diretamente no browser (protocolo `file://`) pode causar erros no carregamento das imagens de animação. Sempre use um servidor HTTP local.

---

## 📁 Estrutura do Projeto

```
projeto-fastfood/
├── 📄 index.html                          # Landing page principal
├── 📄 admin.html                          # Painel Backoffice / KDS
├── 🎨 style.css                           # Estilos globais e design system
├── 🎨 admin.css                           # Estilos exclusivos do backoffice
├── ⚡ script.js                           # Motor interativo, canvas e carrinho
├── ⚡ admin.js                            # KDS, pedidos, caixa e gestão
├── 📁 assets/                             # Imagens dos pratos e ambientes
│   ├── burger.jpg
│   ├── pizza.jpg
│   ├── drink.jpg
│   ├── dessert.jpg
│   ├── chef.jpg
│   └── restaurant.jpg
├── 📁 Floating_food_animation_.../        # 100 frames JPG da animação 3D
├── 🐳 Dockerfile                          # Imagem Nginx Alpine
├── 🐳 docker-compose.yml                  # Orquestração do container
├── ⚙️ nginx.conf                          # Configuração do servidor Nginx
├── 📖 DOCUMENTACAO.md                     # Especificação técnica completa
├── 🗺️ PASSOS.md                           # Roadmap e progresso do projeto
├── 🏗️ SCHEMA.md                           # Modelagem relacional com Prisma ORM
└── 📝 CONTEXTO.md                         # Contexto arquitetural do projeto
```

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| **Frontend** | HTML5 Semântico, CSS3 (Grid, Flexbox, Custom Properties), Vanilla JS (ES6+) |
| **Animação 3D** | HTML5 Canvas — 100 frames JPG Full HD a 30–60 FPS com pré-carregamento assíncrono |
| **Servidor** | Nginx 1.27 Alpine (via Docker) |
| **Containerização** | Docker + Docker Compose |
| **Persistência** | localStorage (dados de usuários, sessão e carrinho) |
| **SEO** | Schema.org JSON-LD + Open Graph metatags |
| **Ícones** | Font Awesome 6.5.1 |
| **Fontes** | Google Fonts — Outfit + Plus Jakarta Sans |

---

## 📱 Responsividade

O projeto foi otimizado com **Mobile First** em todos os módulos:

- ✅ Hero Section com calibração fina do canvas 3D no mobile
- ✅ Cardápio em grade de 2 colunas centralizada
- ✅ Modais e drawers com contenção total no viewport
- ✅ KDS e tabelas do backoffice com cards mobile dedicados
- ✅ Tipografia fluida com `clamp()` em todos os textos

---

## 📍 Localização

**Alameda dos Sabores, 1420 — Jardins, São Paulo/SP**

[![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://www.google.com/maps/search/?api=1&query=Alameda+dos+Sabores+1420+Jardins+Sao+Paulo+SP)
[![Waze](https://img.shields.io/badge/Waze-33CCFF?style=for-the-badge&logo=waze&logoColor=white)](https://waze.com/ul?q=Alameda%20dos%20Sabores%2C%201420%20Jardins%20S%C3%A3o%20Paulo%20SP&navigate=yes)

---

## 👨‍💻 Autor

**Nilton Lopes** — [@lopes.midia002](mailto:lopes.midia002@gmail.com)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ e muito ☕ por **Nilton Lopes**

</div>