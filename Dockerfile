# =====================================================
# RESHT GOURMET - Dockerfile
# Servidor Nginx Alpine ultra-leve para site estatico
# =====================================================

FROM nginx:1.27-alpine

# Metadados da imagem
LABEL maintainer="RESHT Gourmet"
LABEL description="Site gastronomico RESHT - servido via Nginx Alpine"
LABEL version="1.1.0"

# Instala curl (necessario para o healthcheck - wget nao esta disponivel no Alpine por padrao)
RUN apk add --no-cache curl

# Remove a configuracao default do Nginx e substitui pela customizada
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuracao customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia todos os arquivos do site para dentro do container
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY admin.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY admin.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY Floating_food_animation_composition_1080p_20260924152541_000/ /usr/share/nginx/html/Floating_food_animation_composition_1080p_20260924152541_000/

# Garante permissoes corretas nos arquivos estaticos
RUN chmod -R 755 /usr/share/nginx/html

# Expoe a porta 80 (HTTP)
EXPOSE 80

# Health check via curl - verifica se o Nginx esta respondendo HTTP 200
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost/ > /dev/null || exit 1

# Nginx em foreground (obrigatorio para Docker - nao usar daemon)
CMD ["nginx", "-g", "daemon off;"]