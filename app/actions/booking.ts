"use server";

export type BookingState = { success: boolean; error?: string } | null;

export type BookingFields = {
  nombre: string;
  email: string;
  tipoEvento: string;
  fecha: string;
  ciudad: string;
  formato: string;
  mensaje: string;
};

export async function submitBooking(fields: BookingFields): Promise<BookingState> {
  const { nombre, email, tipoEvento, fecha, ciudad, formato, mensaje } = fields;

  if (!nombre || !email || !tipoEvento || !fecha || !ciudad || !formato) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  const lines = [
    "🎵 *NUEVO BOOKING — DJ SWARTHY*",
    "",
    `👤 *Nombre:* ${nombre}`,
    `📧 *Email:* ${email}`,
    `🎪 *Tipo:* ${tipoEvento}`,
    `📅 *Fecha:* ${fecha}`,
    `📍 *Ciudad:* ${ciudad}`,
    `🎧 *Formato:* ${formato}`,
    ...(mensaje ? [`💬 *Mensaje:* ${mensaje}`] : []),
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
    console.error("Booking network error:", e);
    return { success: false, error: "Error de conexión. Inténtalo de nuevo." };
  }
}
