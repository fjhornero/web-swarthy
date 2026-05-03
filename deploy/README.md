# Despliegue en 212.227.41.45

## Prerequisitos en el servidor

1. DNS: `djswarthy.es` y `www.djswarthy.es` con A-record apuntando a `212.227.41.45`.
2. Tener nginx + certbot ya corriendo (mismo patrón que n8n).
3. Conocer el nombre de la red Docker que usa nginx para hablar con upstreams:
   ```
   docker network ls
   ```
   Si la red no es `nginx_default`, edita `docker-compose.yml` (campo `networks.proxy.name`).

## Primer despliegue

```bash
# en local
git push origin task/create-web-djswarthy   # (o la rama que corresponda)

# en el servidor
ssh root@212.227.41.45
cd /opt/   # o donde tengas los compose; ej: /srv/sites/
git clone <url> web-swarthy
cd web-swarthy

# build + levantar
docker compose build
docker compose up -d
```

El contenedor expone solo el puerto interno `3000` en la red Docker. No publica nada al host.

## Conectar nginx al contenedor

Copia `deploy/nginx-djswarthy.conf` dentro de tu nginx existente (en el directorio de configs que ya estés usando). El upstream apunta a `http://web-swarthy:3000` — eso solo funciona si **el contenedor de nginx está en la misma red Docker** que `web-swarthy`. Verifica:

```bash
docker network inspect <nombre-red> | grep -A2 Containers
```

Deberías ver tanto `nginx` como `web-swarthy` listados.

## Emitir certificado con certbot

Antes de habilitar el bloque HTTPS, asegúrate de que el bloque HTTP responde y permite el challenge en `/.well-known/acme-challenge/`. Luego, desde el contenedor o host de certbot:

```bash
certbot certonly --webroot -w /var/www/certbot \
  -d djswarthy.es -d www.djswarthy.es \
  -m francisco.hornero@masmovil.com --agree-tos --no-eff-email
```

(Si tu setup de certbot ya tiene un comando estándar para n8n, úsalo igual sustituyendo el dominio.)

Tras emitir, recarga nginx:

```bash
docker exec <nombre-contenedor-nginx> nginx -s reload
# o, si nginx está en el host:
sudo nginx -s reload
```

## Actualizaciones

```bash
ssh root@212.227.41.45
cd /opt/web-swarthy   # o donde lo hayas clonado
git pull
docker compose build
docker compose up -d
```

El paso `up -d` solo recrea el contenedor si la imagen cambió. Si quieres forzar:

```bash
docker compose up -d --force-recreate
```

## Logs y troubleshooting

```bash
docker compose logs -f web                 # logs en vivo
docker compose ps                          # estado del servicio
docker compose exec web sh                 # entrar al contenedor
docker network inspect nginx_default       # ver qué containers comparten la red
```

Si nginx devuelve 502: el contenedor `web-swarthy` no es alcanzable desde la red de nginx. Comprueba que ambos están en la misma red Docker.
