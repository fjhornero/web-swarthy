// Envío de notificaciones al chat de Telegram del artista.
// Se usa parse_mode HTML (y no Markdown) porque el texto libre del usuario
// puede contener *, _ o [ que rompen el parser de Markdown de Telegram y
// hacen fallar el sendMessage con un 400.

const TELEGRAM_MESSAGE_LIMIT = 4096;
const TELEGRAM_TIMEOUT_MS = 10_000;

export const GENERIC_SEND_ERROR = "No se pudo enviar. Inténtalo de nuevo.";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Normaliza un campo que llega de una server action. Las actions son endpoints
 * públicos: el tipo TypeScript no se comprueba en runtime y `fields.nombre`
 * puede ser un número, un objeto o null. Cualquier cosa que no sea string se
 * convierte en "" y cae en la validación de "campo obligatorio".
 */
export function cleanField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** Igual que cleanField, pero además aplana saltos de línea: es para campos
 *  de una sola línea (nombre, ciudad…) que de otro modo podrían inyectar
 *  líneas falsas en la notificación. */
export function cleanLine(value: unknown, max: number): string {
  return cleanField(value, max).replace(/\s+/g, " ");
}

/**
 * Recorta el mensaje al límite de Telegram sin partir una entidad HTML
 * (`&amp;`) ni dejar un `<b>` abierto, porque cualquiera de las dos cosas
 * hace que Telegram rechace el mensaje con un 400 y la solicitud se pierda.
 */
export function truncateHtml(html: string, limit = TELEGRAM_MESSAGE_LIMIT): string {
  if (html.length <= limit) return html;
  const suffix = "…";
  let cut = html.slice(0, limit - suffix.length);
  // Entidad o etiqueta a medio escribir al final del corte
  cut = cut.replace(/&[^;\s]*$/, "").replace(/<[^>]*$/, "");
  // Etiqueta <b> abierta sin cerrar
  const opens = (cut.match(/<b>/g) ?? []).length;
  const closes = (cut.match(/<\/b>/g) ?? []).length;
  if (opens > closes) cut += "</b>";
  return cut + suffix;
}

function redact(text: string, secret: string): string {
  return secret ? text.split(secret).join("***") : text;
}

export async function sendTelegramMessage(
  html: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
    return { success: false, error: GENERIC_SEND_ERROR };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncateHtml(html),
        parse_mode: "HTML",
      }),
      // Sin timeout, una API colgada dejaría la server action (y el botón
      // "Enviando…" del usuario) esperando indefinidamente.
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });

    if (!res.ok) {
      // Sólo el status: el cuerpo o la URL del error podrían incluir el token.
      console.error(`Telegram error: HTTP ${res.status}`);
      return { success: false, error: GENERIC_SEND_ERROR };
    }

    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error("Telegram network error:", redact(message, token));
    return { success: false, error: "Error de conexión. Inténtalo de nuevo." };
  }
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FIELD_LIMITS = {
  short: 120,
  email: 200,
  message: 2000,
} as const;
