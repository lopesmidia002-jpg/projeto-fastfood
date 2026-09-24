# =====================================================
# RESHT GOURMET — Dockerfile
# Servidor Nginx Alpine ultra-leve para site estático
# =====================================================

FROM nginx:1.27-alpine

# Metadados da imagem
LABEL maintainer="RESHT Gourmet"
LABEL description="Site gastronômico RESHT — servido via Nginx Alpine"
LABEL version="1.0.0"

# Remove a config default do Nginx e substitui pela customizada
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx
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

# Garante permissões corretas
RUN chmod -R 755 /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Health check para verificar se o servidor está respondendo
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx em foreground (obrigatório para Docker)
CMD ["nginx", "-g", "daemon off;"]
