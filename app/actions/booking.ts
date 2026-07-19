"use server";

import {
  EMAIL_REGEX,
  FIELD_LIMITS,
  escapeHtml,
  sendTelegramMessage,
} from "@/lib/telegram";

export type BookingState = { success: boolean; error?: string } | null;

export type BookingFields = {
  nombre: string;
  email: string;
  tipoEvento: string;
  fecha: string;
  ciudad: string;
  formato: string;
  mensaje: string;
  // honeypot: los humanos no lo ven; si llega relleno es un bot
  web?: string;
};

export async function submitBooking(fields: BookingFields): Promise<BookingState> {
  if (fields.web) {
    // Bot detectado: respondemos éxito sin enviar nada
    return { success: true };
  }

  const nombre = fields.nombre?.trim().slice(0, FIELD_LIMITS.short);
  const email = fields.email?.trim().slice(0, FIELD_LIMITS.email);
  const tipoEvento = fields.tipoEvento?.trim().slice(0, FIELD_LIMITS.short);
  const fecha = fields.fecha?.trim().slice(0, FIELD_LIMITS.short);
  const ciudad = fields.ciudad?.trim().slice(0, FIELD_LIMITS.short);
  const formato = fields.formato?.trim().slice(0, FIELD_LIMITS.short);
  const mensaje = fields.mensaje?.trim().slice(0, FIELD_LIMITS.message);

  if (!nombre || !email || !tipoEvento || !fecha || !ciudad || !formato) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  const lines = [
    "🎵 <b>NUEVO BOOKING — DJ SWARTHY</b>",
    "",
    `👤 <b>Nombre:</b> ${escapeHtml(nombre)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    `🎪 <b>Tipo:</b> ${escapeHtml(tipoEvento)}`,
    `📅 <b>Fecha:</b> ${escapeHtml(fecha)}`,
    `📍 <b>Ciudad:</b> ${escapeHtml(ciudad)}`,
    `🎧 <b>Formato:</b> ${escapeHtml(formato)}`,
    ...(mensaje ? [`💬 <b>Mensaje:</b> ${escapeHtml(mensaje)}`] : []),
    "",
    `📩 Responder a: ${escapeHtml(email)}`,
  ];

  return sendTelegramMessage(lines.join("\n"));
}
