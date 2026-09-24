FROM nginx:1.27-alpine

LABEL maintainer="RESHT Gourmet"
LABEL description="Site gastronomico RESHT - servido via Nginx Alpine"
LABEL version="1.1.0"

# Instala curl para healthcheck
RUN apk add --no-cache curl

# Remove config default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuracao customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos do site
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY admin.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY admin.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY Floating_food_animation_composition_1080p_20260924152541_000/ /usr/share/nginx/html/Floating_food_animation_composition_1080p_20260924152541_000/

# Permissoes corretas
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]