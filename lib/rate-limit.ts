// Rate limiting en memoria para las server actions de booking/contacto.
// El contenedor corre como instancia única detrás de nginx (ver docker-compose.yml),
// por lo que un Map en memoria del proceso es suficiente — no hace falta Redis/KV.
// nginx (deploy/nginx-djswarthy.conf) es la única vía de entrada al contenedor y
// siempre fija X-Real-IP/X-Forwarded-For, así que esas cabeceras son de fiar aquí.

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Cota de seguridad para que un flood con IPs distintas no haga crecer el Map
// sin límite entre reinicios del contenedor.
const MAX_BUCKETS = 5000;

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
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

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "unknown";
}
