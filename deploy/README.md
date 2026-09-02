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

## Despliegue automatico (GitHub Actions)

Cada push a `main` dispara `.github/workflows/deploy.yml`: primero corre el CI
(lint + tipos + build) y, solo si pasa, entra por SSH a este servidor y hace el
build de la imagen **aqui mismo**. No hay registry: la imagen se construye y se
queda en `212.227.41.45`.

Secuencia exacta en el servidor:

1. `git fetch --prune origin` y `git reset --hard <sha-del-push>`
2. `docker compose build`
3. `docker compose up -d --remove-orphans`
4. Sondea `http://127.0.0.1:3001/api/health` cada 3s hasta 90s
5. Si no responde: vuelca los ultimos 80 logs, hace `git reset --hard` al commit
   anterior, reconstruye, y el workflow falla en rojo

Es decir, una web rota nunca se queda publicada.

### Secrets a crear en GitHub

En `Settings -> Secrets and variables -> Actions -> New repository secret`:

| Secret | Valor |
| --- | --- |
| `DEPLOY_HOST` | `212.227.41.45` |
| `DEPLOY_USER` | `root` (mejor un usuario `deploy` en el grupo `docker`) |
| `DEPLOY_PATH` | ruta del clone en el servidor, p.ej. `/opt/web-swarthy` |
| `DEPLOY_SSH_KEY` | clave **privada** ed25519 sin passphrase, entera con cabecera y pie |
| `DEPLOY_SSH_KNOWN_HOSTS` | salida de `ssh-keyscan -H 212.227.41.45` |
| `DEPLOY_PORT` | opcional, solo si SSH no escucha en el 22 |

Y opcionalmente, en la pestana *Variables*, `HEALTH_URL` si cambias el puerto
publicado en `docker-compose.yml`.

### Generar la clave de despliegue

En tu maquina (no reutilices tu clave personal):

```bash
ssh-keygen -t ed25519 -C "github-actions-web-swarthy" -f ~/.ssh/web_swarthy_deploy -N ""

# autorizarla en el servidor
ssh-copy-id -i ~/.ssh/web_swarthy_deploy.pub root@212.227.41.45

# el contenido de estos dos comandos es lo que pegas en los secrets
cat ~/.ssh/web_swarthy_deploy        # -> DEPLOY_SSH_KEY
ssh-keyscan -H 212.227.41.45         # -> DEPLOY_SSH_KNOWN_HOSTS
```

### Requisitos en el servidor antes del primer push

```bash
ssh root@212.227.41.45
cd /opt/web-swarthy
git remote -v                 # debe apuntar a github.com/fjhornero/web-swarthy
git checkout main
ls -la .env.local             # TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID y,
                              # opcionalmente, SPOTIFY_CLIENT_ID/SECRET
                              # (plantilla en .env.example)
which curl || apt-get install -y curl
```

`.env.local` esta en `.gitignore`, asi que `git reset --hard` no lo toca: se
queda entre despliegues.

### Lanzarlo a mano

Actions -> Deploy -> *Run workflow*. Util para redesplegar sin commit nuevo.

## Actualizaciones manuales

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
