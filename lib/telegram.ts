// Envío de notificaciones al chat de Telegram del artista.
// Se usa parse_mode HTML (y no Markdown) porque el texto libre del usuario
// puede contener *, _ o [ que rompen el parser de Markdown de Telegram y
// hacen fallar el sendMessage con un 400.

const TELEGRAM_MESSAGE_LIMIT = 4096;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(
  html: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
    return { success: false, error: "No se pudo enviar. Inténtalo de nuevo." };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html.slice(0, TELEGRAM_MESSAGE_LIMIT),
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      console.error("Telegram error:", await res.text());
      return { success: false, error: "No se pudo enviar. Inténtalo de nuevo." };
    }

    return { success: true };
  } catch (e) {
    console.error("Telegram network error:", e);
    return { success: false, error: "Error de conexión. Inténtalo de nuevo." };
  }
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FIELD_LIMITS = {
  short: 120,
  email: 200,
  message: 2000,
} as const;
