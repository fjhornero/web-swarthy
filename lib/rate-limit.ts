// Rate limiting en memoria para las server actions de booking/contacto.
// El contenedor corre como instancia única detrás de nginx (ver docker-compose.yml),
// por lo que un Map en memoria del proceso es suficiente — no hace falta Redis/KV.
// nginx (deploy/nginx-djswarthy.conf) es la única vía de entrada al contenedor y
// siempre fija X-Real-IP con la IP real del cliente, así que es la única cabecera
// en la que se confía. X-Forwarded-For se ignora a propósito: su primer valor lo
// controla el cliente y serviría para saltarse el límite si el contenedor
// quedase alguna vez accesible por otra vía.

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Cota de seguridad para que un flood con IPs distintas no haga crecer el Map
// sin límite entre reinicios del contenedor.
const MAX_BUCKETS = 5000;

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): boolean {
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });

    if (buckets.size > MAX_BUCKETS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }

    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/** Sólo para tests: vacía los cubos entre casos. */
export function resetRateLimit(): void {
  buckets.clear();
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const realIp = h.get("x-real-ip")?.trim();
  return realIp || "unknown";
}
