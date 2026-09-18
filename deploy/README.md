# Despliegue en 143.47.52.87

El acceso al servidor es con el usuario **`ubuntu`** (`ssh ubuntu@143.47.52.87`), que ya
está en el grupo `docker`: ningún comando de este documento necesita `sudo`. No se entra
como `root`. La máquina es **aarch64 (ARM)**, así que la imagen se construye nativamente
en arm64 — otra razón para no construirla fuera del servidor.

## Prerequisitos en el servidor

1. DNS: `djswarthy.es` y `www.djswarthy.es` con A-record apuntando a `143.47.52.87`.
2. Tener nginx + certbot ya corriendo (mismo patrón que n8n). nginx es del host y los
   vhosts viven en `/etc/nginx/sites-available/` (el de esta web es `djswarthy.es`).
3. Tener libre el puerto `3001` en el loopback del host (`127.0.0.1`). Es el puerto
   que publica el contenedor y al que nginx hace `proxy_pass`:
   ```
   ss -ltnp | grep 127.0.0.1:3001
   ```
   Si ya está ocupado, cambia el mapeo en `docker-compose.yml` (`services.web.ports`)
   y ajusta el `proxy_pass` de `deploy/nginx-djswarthy.conf` y la variable `HEALTH_URL`.

## Primer despliegue

```bash
# en local
git push origin task/create-web-djswarthy   # (o la rama que corresponda)

# en el servidor
ssh ubuntu@143.47.52.87
cd /opt/   # es donde viven el resto de stacks (n8n-stack, vaul, swarthy-twitchbot)
git clone <url> web-swarthy
cd web-swarthy

# build + levantar
docker compose build
docker compose up -d
```

El contenedor escucha en el puerto interno `3000` y lo publica **solo en el loopback del
host** (`127.0.0.1:3001`). No queda expuesto al exterior: únicamente nginx, que corre en
el propio host, puede alcanzarlo.

## Conectar nginx al contenedor

Copia `deploy/nginx-djswarthy.conf` dentro de tu nginx existente (en el directorio de configs que ya estés usando). **nginx corre en el host, no en Docker**, así que el upstream apunta a `http://127.0.0.1:3001` — el puerto que publica el contenedor. Verifica que el servicio responde antes de recargar nginx:

```bash
curl -fsS http://127.0.0.1:3001/api/health
```

Debería devolver la respuesta del healthcheck. Luego `nginx -t && systemctl reload nginx`.

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
queda en `143.47.52.87`.

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
| `DEPLOY_HOST` | `143.47.52.87` |
| `DEPLOY_USER` | `ubuntu` (ya está en el grupo `docker`, no necesita sudo) |
| `DEPLOY_PATH` | `/opt/web-swarthy` |
| `DEPLOY_SSH_KEY` | clave **privada** ed25519 sin passphrase, entera con cabecera y pie |
| `DEPLOY_SSH_KNOWN_HOSTS` | salida de `ssh-keyscan 143.47.52.87` |
| `DEPLOY_PORT` | opcional, solo si SSH no escucha en el 22 |

Y opcionalmente, en la pestana *Variables*, `HEALTH_URL` si cambias el puerto
publicado en `docker-compose.yml`.

### Generar la clave de despliegue

En tu maquina (no reutilices tu clave personal):

```bash
ssh-keygen -t ed25519 -C "github-actions-web-swarthy" -f ~/.ssh/web_swarthy_deploy -N ""

# autorizarla en el servidor
ssh-copy-id -i ~/.ssh/web_swarthy_deploy.pub ubuntu@143.47.52.87

# el contenido de estos dos comandos es lo que pegas en los secrets
cat ~/.ssh/web_swarthy_deploy        # -> DEPLOY_SSH_KEY
ssh-keyscan 143.47.52.87             # -> DEPLOY_SSH_KNOWN_HOSTS
```

> **Si cambias de servidor, regenera `DEPLOY_SSH_KNOWN_HOSTS`.** Es el error más fácil de
> cometer: al migrar de máquina se actualizan `DEPLOY_HOST`/`DEPLOY_USER`/`DEPLOY_PATH`,
> se olvida el `known_hosts`, y el despliegue muere con un escueto
> `Host key verification failed` (exit 255) sin llegar a ejecutar nada. El paso
> *Comprobar acceso al servidor* del workflow detecta ahora ese caso y lo dice.

Para actualizarlo desde la línea de comandos:

```bash
ssh-keyscan 143.47.52.87 | gh secret set DEPLOY_SSH_KNOWN_HOSTS
```

### Requisitos en el servidor antes del primer push

```bash
ssh ubuntu@143.47.52.87
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
ssh ubuntu@143.47.52.87
cd /opt/web-swarthy
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
ss -ltnp | grep 127.0.0.1:3001             # comprobar que el puerto está publicado
curl -fsS http://127.0.0.1:3001/api/health # probar el upstream sin pasar por nginx
```

Si nginx devuelve 502: nginx no consigue hablar con `127.0.0.1:3001`. Por orden, comprueba
que el contenedor está arriba (`docker compose ps`), que el puerto aparece publicado en el
loopback (`ss -ltnp`), y que el `curl` directo responde. Si el `curl` va pero nginx no, el
problema está en el `proxy_pass` del vhost, no en el contenedor.
