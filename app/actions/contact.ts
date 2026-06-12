"use server";

export type ContactState = { success: boolean; error?: string } | null;

export type ContactFields = {
  nombre: string;
  email: string;
  mensaje: string;
};

export async function submitContact(fields: ContactFields): Promise<ContactState> {
  const { nombre, email, mensaje } = fields;

  if (!nombre || !email || !mensaje) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  const lines = [
    "✉️ *NUEVO MENSAJE DE CONTACTO — DJ SWARTHY*",
    "",
    `👤 *Nombre:* ${nombre}`,
    `📧 *Email:* ${email}`,
    `💬 *Mensaje:* ${mensaje}`,
    "",
    `📩 Responder a: ${email}`,
  ];

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: lines.join("\n"),
          parse_mode: "Markdown",
        }),
      }
    );

    if (!res.ok) {
      console.error("Telegram error:", await res.text());
      return { success: false, error: "No se pudo enviar. Inténtalo de nuevo." };
    }

    return { success: true };
  } catch (e) {
    console.error("Contact network error:", e);
    return { success: false, error: "Error de conexión. Inténtalo de nuevo." };
  }
}
